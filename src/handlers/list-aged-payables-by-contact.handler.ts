
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { ReportWithRow } from "xero-node";
import { XeroContext } from "../types/xero-context.js";

async function listAgedPayablesByContact(
  xero: XeroContext,
  contactId: string,
  reportDate?: string,
  invoicesFromDate?: string,
  invoicesToDate?: string
): Promise<ReportWithRow | undefined> {

  const response = await xero.client.accountingApi.getReportAgedPayablesByContact(
    xero.tenantId, // xeroTenantId
    contactId, // contactId
    reportDate, // date
    invoicesFromDate, // fromDate
    invoicesToDate, // toDate
    getClientHeaders()
  );

  return response.body.reports?.[0];
}

export async function listXeroAgedPayablesByContact(
  xero: XeroContext,
  contactId: string,
  reportDate?: string,
  invoicesFromDate?: string,
  invoicesToDate?: string
): Promise<XeroClientResponse<ReportWithRow>> {
  try {
    const agedPayables = await listAgedPayablesByContact(xero, contactId, reportDate, invoicesFromDate, invoicesToDate);

    if (!agedPayables) {
      return {
        result: null,
        isError: true,
        error: "Failed to get aged payables by contact from Xero."
      };
    }

    return {
      result: agedPayables,
      isError: false,
      error: null
    };
  } catch (error) {
    return {
      result: null,
      isError: true,
      error: formatError(error),
    };
  }
}