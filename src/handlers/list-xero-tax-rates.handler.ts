
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { TaxRate } from "xero-node";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

async function getTaxRates(xero: XeroContext): Promise<TaxRate[]> {

  const taxRates = await xero.client.accountingApi.getTaxRates(
    xero.tenantId,
    undefined, // where
    undefined, // order
    getClientHeaders(),
  );
  return taxRates.body.taxRates ?? [];
}

/**
 * List all tax rates from Xero
 */
export async function listXeroTaxRates(xero: XeroContext): Promise<
  XeroClientResponse<TaxRate[]>
> {
  try {
    const taxRates = await getTaxRates(xero);

    return {
      result: taxRates,
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
