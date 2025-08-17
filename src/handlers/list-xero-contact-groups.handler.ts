
import { ContactGroup } from "xero-node";
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

async function getContactGroups(xero: XeroContext, contactGroupId?: string): Promise<ContactGroup[]> {

  if (contactGroupId) {
    const response = await xero.client.accountingApi.getContactGroup(
      xero.tenantId,
      contactGroupId,
      getClientHeaders(),
    );
    return response.body.contactGroups ?? [];
  }

  const response = await xero.client.accountingApi.getContactGroups(
    xero.tenantId,
    undefined, // where
    undefined, // order
    getClientHeaders(),
  );
  return response.body.contactGroups ?? [];
}

/**
 * List all contact groups from Xero. If a contactGroupId is provided, it will return only that contact group.
 */
export async function listXeroContactGroups(xero: XeroContext, contactGroupId?: string): Promise<
  XeroClientResponse<ContactGroup[]>
> {
  try {
    const contactGroups = await getContactGroups(xero, contactGroupId);

    return {
      result: contactGroups,
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
