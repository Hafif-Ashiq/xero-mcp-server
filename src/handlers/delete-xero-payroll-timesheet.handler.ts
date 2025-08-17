
import { formatError } from "../helpers/format-error.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { XeroContext } from "../types/xero-context.js";

async function deleteTimesheet(xero: XeroContext, timesheetID: string): Promise<boolean> {

  // Call the deleteTimesheet endpoint from the PayrollNZApi
  await xero.client.payrollNZApi.deleteTimesheet(xero.tenantId, timesheetID);

  return true;
}

/**
 * Delete an existing payroll timesheet in Xero
 */
export async function deleteXeroPayrollTimesheet(xero: XeroContext, timesheetID: string): Promise<
  XeroClientResponse<boolean>
> {
  try {
    await deleteTimesheet(xero, timesheetID);

    return {
      result: true,
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