
import { BankTransaction } from "xero-node";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { XeroContext } from "../types/xero-context.js";

async function getBankTransactions(
  xero: XeroContext,
  page: number,
  bankAccountId?: string,
): Promise<BankTransaction[]> {

  const response = await xero.client.accountingApi.getBankTransactions(xero.tenantId,
    undefined, // ifModifiedSince
    bankAccountId ? `BankAccount.AccountID=guid("${bankAccountId}")` : undefined, // where
    "Date DESC", // order
    page, // page
    undefined, // unitdp
    10, // pagesize
    getClientHeaders()
  );

  return response.body.bankTransactions ?? [];
}

export async function listXeroBankTransactions(
  xero: XeroContext,
  page: number = 1,
  bankAccountId?: string
): Promise<XeroClientResponse<BankTransaction[]>> {
  try {
    const bankTransactions = await getBankTransactions(xero, page, bankAccountId);

    return {
      result: bankTransactions,
      isError: false,
      error: null
    }
  } catch (error) {
    return {
      result: null,
      isError: true,
      error: formatError(error)
    }
  }
}