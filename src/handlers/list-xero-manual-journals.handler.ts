import { ManualJournal } from "xero-node";
import { formatError } from "../helpers/format-error.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

async function getManualJournals(
  xero: XeroContext,
  page: number,
  manualJournalId?: string,
  modifiedAfter?: string,
): Promise<ManualJournal[]> {

  if (manualJournalId) {
    const response = await xero.client.accountingApi.getManualJournal(
      xero.tenantId,
      manualJournalId,
      getClientHeaders(),
    );

    return response.body.manualJournals ?? [];
  }

  const response = await xero.client.accountingApi.getManualJournals(
    xero.tenantId,
    modifiedAfter ? new Date(modifiedAfter) : undefined,
    undefined,
    "UpdatedDateUTC DESC",
    page,
    10, // pageSize
    getClientHeaders(),
  );

  return response.body.manualJournals ?? [];
}

/**
 * List all manual journals from Xero.
 */
export async function listXeroManualJournals(
  xero: XeroContext,
  page: number = 1,
  manualJournalId?: string,
  modifiedAfter?: string,
): Promise<XeroClientResponse<ManualJournal[]>> {
  try {
    const manualJournals = await getManualJournals(
      xero,
      page,
      manualJournalId,
      modifiedAfter,
    );

    return {
      result: manualJournals,
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
