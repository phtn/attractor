import "server-only";
import {
  Paymongo,
  createFetchClient,
  type CheckoutParams,
  type CheckoutResource,
} from "paymongo-fn";

const sk = process.env.PAYMONGO_SK;
if (!sk) {
  throw new Error(
    "PAYMONGO_SK environment variable is not set. Configure your PayMongo secret key on the server.",
  );
}

const authorization = `Basic ${Buffer.from(`${sk}:`, "utf8").toString("base64")}`;

export const paymongo = Paymongo(sk);

export const client = createFetchClient(undefined, {
  authorization,
});

export async function createCheckoutSession(
  body: CheckoutParams,
): Promise<CheckoutResource> {
  const { data } = await client.post<CheckoutResource>("/checkout_sessions", {
    body,
  });
  return data;
}
