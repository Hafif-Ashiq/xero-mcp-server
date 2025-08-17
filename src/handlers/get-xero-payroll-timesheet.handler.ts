import { Timesheet } from "xero-node/dist/gen/model/payroll-nz/timesheet.js";

import { formatError } from "../helpers/format-error.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { XeroContext } from "../types/xero-context.js";

async function getTimesheet(xero: XeroContext, timesheetID: string): Promise<Timesheet | null> {

  // Call the Timesheet endpoint from the PayrollNZApi
  const timesheet = await xero.client.payrollNZApi.getTimesheet(
    xero.tenantId,
    timesheetID,
  );

  return timesheet.body.timesheet ?? null;
}

/**
 * Get a single payroll timesheet from Xero
 */
export async function getXeroPayrollTimesheet(xero: XeroContext, timesheetID: string): Promise<
  XeroClientResponse<Timesheet | null>
> {
  try {
    const timesheet = await getTimesheet(xero, timesheetID);

    return {
      result: timesheet,
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