
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { Invoice } from "xero-node";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

async function getInvoices(
  xero: XeroContext,
  invoiceNumbers: string[] | undefined,
  contactIds: string[] | undefined,
  page: number,
): Promise<Invoice[]> {

  const invoices = await xero.client.accountingApi.getInvoices(
    xero.tenantId,
    undefined, // ifModifiedSince
    undefined, // where
    "UpdatedDateUTC DESC", // order
    undefined, // iDs
    invoiceNumbers, // invoiceNumbers
    contactIds, // contactIDs
    undefined, // statuses
    page,
    false, // includeArchived
    false, // createdByMyApp
    undefined, // unitdp
    false, // summaryOnly
    10, // pageSize
    undefined, // searchTerm
    getClientHeaders(),
  );
  return invoices.body.invoices ?? [];
}

/**
 * List all invoices from Xero
 */
export async function listXeroInvoices(
  xero: XeroContext,
  page: number = 1,
  contactIds?: string[],
  invoiceNumbers?: string[],
): Promise<XeroClientResponse<Invoice[]>> {
  try {
    const invoices = await getInvoices(xero, invoiceNumbers, contactIds, page);

    return {
      result: invoices,
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
