import crypto from "crypto";
import { ReactElement } from "react";
export function generateUID(): string {
  const uuid: string = crypto.randomUUID(); // e.g., "9e107d9d-372b-4f99-a567-16e0c3b8a8d3"
  const hex: string = uuid.replace(/-/g, ""); // dash delete

  const bytes: number[] = [];
  const re = /[a-fA-F0-9]{2}/g;
  let match;
  while ((match = re.exec(hex)) !== null) {
    bytes.push(parseInt(match[0], 16));
  }

  let base64: string = btoa(String.fromCharCode(...bytes));
  base64 = base64.replace(/[+/=]/g, "");

  return base64.slice(0, 20);
}
// Webhook verification (recommended for security)
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const digest = `sha256=${hmac.digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export const opts = (...args: (ReactElement | null)[]) => {
  return new Map([
    [true, args[0]],
    [false, args[1]],
  ]);
};
