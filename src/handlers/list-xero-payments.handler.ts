
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { Payment } from "xero-node";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

async function getPayments(
  xero: XeroContext,
  page: number = 1,
  {
    invoiceNumber,
    invoiceId,
    paymentId,
    reference,
  }: {
    invoiceNumber?: string;
    invoiceId?: string;
    paymentId?: string;
    reference?: string;
  },
): Promise<Payment[]> {

  // Build where clause for filtering
  const whereConditions: string[] = [];

  if (invoiceId) {
    whereConditions.push(`Invoice.InvoiceID==guid("${invoiceId}")`);
  }
  if (invoiceNumber) {
    whereConditions.push(`Invoice.InvoiceNumber=="${invoiceNumber}"`);
  }
  if (paymentId) {
    whereConditions.push(`PaymentID==guid("${paymentId}")`);
  }
  if (reference) {
    whereConditions.push(`Reference=="${reference}"`);
  }

  // Combine conditions
  const where =
    whereConditions.length > 0 ? whereConditions.join(" AND ") : undefined;

  const response = await xero.client.accountingApi.getPayments(
    xero.tenantId,
    undefined, // ifModifiedSince
    where,
    "UpdatedDateUTC DESC", // order
    page, // page
    10, // pageSize
    getClientHeaders(), // options
  );

  return response.body.payments ?? [];
}

/**
 * List payments from Xero
 */
export async function listXeroPayments(
  xero: XeroContext,
  page: number = 1,
  {
    invoiceNumber,
    invoiceId,
    paymentId,
    reference,
  }: {
    invoiceNumber?: string;
    invoiceId?: string;
    paymentId?: string;
    reference?: string;
  },
): Promise<XeroClientResponse<Payment[]>> {
  try {
    const payments = await getPayments(xero, page, {
      invoiceNumber,
      invoiceId,
      paymentId,
      reference,
    });

    return {
      result: payments,
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
