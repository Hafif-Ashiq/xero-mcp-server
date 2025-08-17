
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { Item } from "xero-node";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

async function getItems(
  xero: XeroContext,
  page: number,
): Promise<Item[]> {

  const items = await xero.client.accountingApi.getItems(
    xero.tenantId,
    undefined, // ifModifiedSince
    undefined, // where
    undefined, // order
    page, // page
    getClientHeaders(),
  );
  return items.body.items ?? [];
}

/**
 * List all items from Xero
 */
export async function listXeroItems(
  xero: XeroContext,
  page: number = 1,
): Promise<XeroClientResponse<Item[]>> {
  try {
    const items = await getItems(xero, page);

    return {
      result: items,
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