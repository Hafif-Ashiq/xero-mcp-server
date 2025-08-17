import { Timesheet } from "xero-node/dist/gen/model/payroll-nz/timesheet.js";

import { formatError } from "../helpers/format-error.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { XeroContext } from "../types/xero-context.js";

async function createTimesheet(xero: XeroContext, timesheet: Timesheet): Promise<Timesheet | null> {


  // Call the createTimesheet endpoint from the PayrollNZApi
  const createdTimesheet = await xero.client.payrollNZApi.createTimesheet(
    xero.tenantId,
    timesheet,
  );

  return createdTimesheet.body.timesheet ?? null;
}

/**
 * Create a payroll timesheet in Xero
 */
export async function createXeroPayrollTimesheet(xero: XeroContext, timesheet: Timesheet): Promise<
  XeroClientResponse<Timesheet | null>
> {
  try {
    const newTimesheet = await createTimesheet(xero, timesheet);

    return {
      result: newTimesheet,
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