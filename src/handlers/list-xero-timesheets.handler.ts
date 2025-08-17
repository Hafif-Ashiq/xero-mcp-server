import { Timesheet } from "xero-node/dist/gen/model/payroll-nz/timesheet.js";

import { formatError } from "../helpers/format-error.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { XeroContext } from "../types/xero-context.js";

async function getTimesheets(xero: XeroContext): Promise<Timesheet[]> {

  // Call the Timesheets endpoint from the PayrollNZApi
  const timesheets = await xero.client.payrollNZApi.getTimesheets(
    xero.tenantId,
    undefined, // page
    undefined, // filter
  );

  return timesheets.body.timesheets ?? [];
}

/**
 * List all payroll timesheets from Xero
 */
export async function listXeroPayrollTimesheets(xero: XeroContext): Promise<
  XeroClientResponse<Timesheet[]>
> {
  try {
    const timesheets = await getTimesheets(xero);

    return {
      result: timesheets,
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