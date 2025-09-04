import { CheckoutParams } from "paymongo-fn";
import { useCallback } from "react";

export const useCheckout = () => {
  const checkout = useCallback(async (params: CheckoutParams) => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    return response;
  }, []);
  return { checkout };
};
