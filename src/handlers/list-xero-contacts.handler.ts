
import { Contact } from "xero-node";
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

async function getContacts(xero: XeroContext, page?: number): Promise<Contact[]> {

  const contacts = await xero.client.accountingApi.getContacts(
    xero.tenantId,
    undefined, // ifModifiedSince
    undefined, // where
    undefined, // order
    undefined, // iDs
    page, // page
    undefined, // includeArchived
    true, // summaryOnly
    undefined, // pageSize
    undefined, // searchTerm
    getClientHeaders(),
  );
  return contacts.body.contacts ?? [];
}

/**
 * List all contacts from Xero
 */
export async function listXeroContacts(xero: XeroContext, page?: number): Promise<
  XeroClientResponse<Contact[]>
> {
  try {
    const contacts = await getContacts(xero, page);

    return {
      result: contacts,
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
