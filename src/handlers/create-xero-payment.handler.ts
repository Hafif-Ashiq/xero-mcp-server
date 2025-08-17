
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { Payment } from "xero-node";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

type PaymentProps = {
  invoiceId: string;
  accountId: string;
  amount: number;
  date?: string;
  reference?: string;
};

async function createPayment(xero: XeroContext, {
  invoiceId,
  accountId,
  amount,
  date,
  reference,
}: PaymentProps): Promise<Payment | undefined> {

  const payment: Payment = {
    invoice: {
      invoiceID: invoiceId,
    },
    account: {
      accountID: accountId,
    },
    amount: amount,
    date: date || new Date().toISOString().split("T")[0], // Today's date if not specified
    reference: reference,
  };

  const response = await xero.client.accountingApi.createPayment(
    xero.tenantId,
    payment,
    undefined, // idempotencyKey
    getClientHeaders(), // options
  );

  return response.body.payments?.[0];
}

/**
 * Create a new payment in Xero
 */
export async function createXeroPayment(xero: XeroContext, {
  invoiceId,
  accountId,
  amount,
  date,
  reference,

}: PaymentProps): Promise<XeroClientResponse<Payment>> {
  try {
    const createdPayment = await createPayment(xero, {
      invoiceId,
      accountId,
      amount,
      date,
      reference,
    });

    if (!createdPayment) {
      throw new Error("Payment creation failed.");
    }

    return {
      result: createdPayment,
      isError: false,
      error: null,
    };
  } catch (error) {
    return {
      result: null,
      isError: true,
      error: formatError(error),
    };
  }
}
