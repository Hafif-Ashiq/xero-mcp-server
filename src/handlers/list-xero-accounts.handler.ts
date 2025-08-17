import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { Account } from "xero-node";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

async function listAccounts(xero: XeroContext): Promise<Account[]> {
  const response = await xero.client.accountingApi.getAccounts(
    xero.tenantId,
    undefined, // ifModifiedSince
    undefined, // where
    undefined, // order
    getClientHeaders(),
  );

  const accounts = response.body.accounts ?? [];
  return accounts;
}

/**
 * List all accounts from Xero
 */
export async function listXeroAccounts(xero: XeroContext): Promise<
  XeroClientResponse<Account[]>
> {
  try {
    const accounts = await listAccounts(xero);

    return {
      result: accounts,
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
