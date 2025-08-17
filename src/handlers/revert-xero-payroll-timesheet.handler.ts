import { Timesheet } from "xero-node/dist/gen/model/payroll-nz/timesheet.js";

import { formatError } from "../helpers/format-error.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { XeroContext } from "../types/xero-context.js";

async function revertTimesheet(xero: XeroContext, timesheetID: string): Promise<Timesheet | null> {

  // Call the revertTimesheet endpoint from the PayrollNZApi
  const revertedTimesheet = await xero.client.payrollNZApi.revertTimesheet(
    xero.tenantId,
    timesheetID,
  );

  return revertedTimesheet.body.timesheet ?? null;
}

/**
 * Revert a payroll timesheet to draft in Xero
 */
export async function revertXeroPayrollTimesheet(xero: XeroContext, timesheetID: string): Promise<
  XeroClientResponse<Timesheet | null>
> {
  try {
    const revertedTimesheet = await revertTimesheet(xero, timesheetID);

    return {
      result: revertedTimesheet,
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