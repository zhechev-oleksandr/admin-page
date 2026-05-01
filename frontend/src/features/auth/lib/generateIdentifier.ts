export const generateIdentifier = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => chars[b % chars.length])
    .join("");
};
