export interface SignerInfo {
  fullName: string;
  drfoCode: string;
}

// Ukrainian certificate subject OIDs
const OID_COMMON_NAME = "2.5.4.3";
const OID_SERIAL_NUMBER = "2.5.4.5";
const OID_GIVEN_NAME = "2.5.4.42";
const OID_SURNAME = "2.5.4.4";

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

  const firstLen = buf[offset++];
  let length: number;

  if (firstLen < 0x80) {
    length = firstLen;
  } else {
    const lenBytes = firstLen & 0x7f;
    length = 0;
    for (let i = 0; i < lenBytes; i++) length = (length << 8) | buf[offset++];
  }

  return {
    tagClass,
    constructed,
    tagNumber,
    value: buf.slice(offset, offset + length),
    end: offset + length,
  };
};

const childrenOf = (buf: Buffer): Asn1Node[] => {
  const nodes: Asn1Node[] = [];
  let pos = 0;
  while (pos < buf.length) {
    const node = readNode(buf, pos);
    nodes.push(node);
    pos = node.end;
  }
  return nodes;
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
  const [, explicitWrapper] = childrenOf(readNode(buf, 0).value);
  const [, ...signedDataFields] = childrenOf(readNode(explicitWrapper.value, 0).value);

  const certsNode = signedDataFields.find(
    (f) => f.tagClass === 2 && f.constructed && f.tagNumber === 0
  );
  if (!certsNode) throw new Error("No certificates in SignedData");

  const cert = childrenOf(certsNode.value)[0];
  if (!cert) throw new Error("Certificate list is empty");

  const tbsFields = childrenOf(childrenOf(cert.value)[0].value);

  const versionOffset = tbsFields[0].tagClass === 2 && tbsFields[0].tagNumber === 0 ? 1 : 0;

  const subjectNode = tbsFields[versionOffset + 4];
  if (!subjectNode) throw new Error("Could not locate subject in TBSCertificate");

  return subjectNode.value;
};

const parseNameAttributes = (nameBuf: Buffer): Record<string, string> =>
  childrenOf(nameBuf)
    .flatMap((rdnSet) => childrenOf(rdnSet.value))
    .reduce<Record<string, string>>((attrs, atv) => {
      const [oidNode, valueNode] = childrenOf(atv.value);
      if (oidNode && valueNode) {
        attrs[decodeOid(oidNode.value)] = decodeString(valueNode.value, valueNode.tagNumber);
      }
      return attrs;
    }, {});

export const extractSignerInfo = (base64Signature: string): SignerInfo => {
  const attrs = parseNameAttributes(
    findSubjectInSignedData(Buffer.from(base64Signature, "base64"))
  );

  const fullName =
    attrs[OID_COMMON_NAME] ??
    [attrs[OID_SURNAME], attrs[OID_GIVEN_NAME]].filter(Boolean).join(" ") ??
    "";

  const drfoCode = (attrs[OID_SERIAL_NUMBER] ?? "").replace(/\D/g, "").slice(0, 10);

  if (!fullName) throw new Error("Could not extract name from certificate");
  if (!drfoCode) throw new Error("Could not extract DRFO from certificate");

  return { fullName, drfoCode };
};
