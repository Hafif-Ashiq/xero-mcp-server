
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { Quote } from "xero-node";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

async function getQuotes(
  xero: XeroContext,
  contactId: string | undefined,
  page: number,
  quoteNumber: string | undefined,
): Promise<Quote[]> {

  const quotes = await xero.client.accountingApi.getQuotes(
    xero.tenantId,
    undefined, // ifModifiedSince
    undefined, // dateFrom
    undefined, // dateTo
    undefined, // expiryDateFrom
    undefined, // expiryDateTo
    contactId, // contactID
    undefined, // status
    page,
    undefined, // order
    quoteNumber, // quoteNumber
    getClientHeaders(),
  );
  return quotes.body.quotes ?? [];
}

/**
 * List all quotes from Xero
 */
export async function listXeroQuotes(
  xero: XeroContext,
  page: number = 1,
  contactId?: string,
  quoteNumber?: string,
): Promise<XeroClientResponse<Quote[]>> {
  try {
    const quotes = await getQuotes(xero, contactId, page, quoteNumber);

    return {
      result: quotes,
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
