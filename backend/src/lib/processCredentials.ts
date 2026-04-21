/*TODO: replace with real implementation.*/
export function processCredentials(
  fileBuffer: Buffer,
  text: string,
  hiddenText: string
): string {
  const filePart = fileBuffer.toString("binary");
  const combined = `${text}:${hiddenText}:${filePart}`;
  return Buffer.from(combined).toString("base64");
}