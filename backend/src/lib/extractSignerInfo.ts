export interface SignerInfo {
  fullName: string;
  drfoCode: string;
}

// Ukrainian certificate subject OIDs
const OID_COMMON_NAME = "2.5.4.3";
const OID_SERIAL_NUMBER = "2.5.4.5";
const OID_GIVEN_NAME = "2.5.4.42";
const OID_SURNAME = "2.5.4.4";

export const extractSignerInfo = (base64Signature: string): SignerInfo => {
  const buf = Buffer.from(base64Signature, "base64");
  const subject = findSubjectInSignedData(buf);
  const attrs = parseNameAttributes(subject);

  const fullName =
    attrs[OID_COMMON_NAME] ??
    [attrs[OID_SURNAME], attrs[OID_GIVEN_NAME]].filter(Boolean).join(" ") ??
    "";
  const drfoCode = (attrs[OID_SERIAL_NUMBER] ?? "").replace(/\D/g, "").slice(0, 10);

  if (!fullName) throw new Error("Could not extract name from certificate");
  if (!drfoCode) throw new Error("Could not extract РНОКПП from certificate");

  return { fullName, drfoCode };
};

interface Asn1Node {
  tagClass: number;
  constructed: boolean;
  tagNumber: number;
  value: Buffer;
  end: number;
}

const readNode = (buf: Buffer, offset: number): Asn1Node => {
  const tagByte = buf[offset++];
  const tagClass = (tagByte & 0xc0) >> 6;
  const constructed = !!(tagByte & 0x20);
  const tagNumber = tagByte & 0x1f;

  let length: number;
  const firstLen = buf[offset++];
  if (firstLen < 0x80) {
    length = firstLen;
  } else {
    const lenBytes = firstLen & 0x7f;
    length = 0;
    for (let i = 0; i < lenBytes; i++) {
      length = (length << 8) | buf[offset++];
    }
  }

  const value = buf.slice(offset, offset + length);
  return { tagClass, constructed, tagNumber, value, end: offset + length };
};

const childrenOf = (buf: Buffer): Asn1Node[] => {
  const result: Asn1Node[] = [];
  let pos = 0;
  while (pos < buf.length) {
    const node = readNode(buf, pos);
    result.push(node);
    pos = node.end;
  }
  return result;
};

const decodeOid = (buf: Buffer): string => {
  let offset = 0;
  const first = buf[offset++];
  let oid = `${Math.floor(first / 40)}.${first % 40}`;

  while (offset < buf.length) {
    let value = 0;
    let byte: number;
    do {
      byte = buf[offset++];
      value = (value << 7) | (byte & 0x7f);
    } while (byte & 0x80);
    oid += `.${value}`;
  }
  return oid;
};

const decodeString = (buf: Buffer, tagNumber: number): string => {
  if (tagNumber === 30) {
    const copy = Buffer.from(buf);
    copy.swap16();
    return copy.toString("utf16le");
  }
  return buf.toString("utf8");
};

const findSubjectInSignedData = (buf: Buffer): Buffer => {
  const contentInfoNode = readNode(buf, 0); // outer SEQUENCE
  const contentInfoFields = childrenOf(contentInfoNode.value); // [OID, [0] EXPLICIT]
  const signedDataNode = readNode(contentInfoFields[1].value, 0);
  const signedDataFields = childrenOf(signedDataNode.value);

  let certsNode: Asn1Node | null = null;
  for (const field of signedDataFields) {
    if (field.tagClass === 2 && field.constructed && field.tagNumber === 0) {
      certsNode = field;
      break;
    }
  }
  if (!certsNode) throw new Error("No certificates in SignedData");

  const cert = childrenOf(certsNode.value)[0];
  if (!cert) throw new Error("Certificate list is empty");

  const tbsCertNode = childrenOf(cert.value)[0];
  if (!tbsCertNode) throw new Error("Could not read TBSCertificate");

  const tbsFields = childrenOf(tbsCertNode.value);

  const offset = tbsFields[0].tagClass === 2 && tbsFields[0].tagNumber === 0 ? 1 : 0;
  const subjectNode = tbsFields[offset + 4];
  if (!subjectNode) throw new Error("Could not locate subject in TBSCertificate");

  return subjectNode.value;
};

const parseNameAttributes = (nameBuf: Buffer): Record<string, string> => {
  const attrs: Record<string, string> = {};

  for (const rdnSet of childrenOf(nameBuf)) {
    for (const atv of childrenOf(rdnSet.value)) {
      const pair = childrenOf(atv.value);
      if (pair.length < 2) continue;

      const oid = decodeOid(pair[0].value);
      const value = decodeString(pair[1].value, pair[1].tagNumber);
      attrs[oid] = value;
    }
  }

  return attrs;
};
