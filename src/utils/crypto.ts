import { createHash, createHmac } from "crypto";

export const getSHA256 = (data: string) => {
  return createHash("sha256").update(data).digest("hex");
};

export const getHMAC = (algorithm: string, data: string, secret: string) => {
  return createHmac(algorithm, secret).update(data).digest("hex");
};
