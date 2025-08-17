import {
  TimesheetLine,
} from "xero-node/dist/gen/model/payroll-nz/timesheetLine.js";

import { formatError } from "../helpers/format-error.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { XeroContext } from "../types/xero-context.js";

async function addTimesheetLine(xero: XeroContext, timesheetID: string, timesheetLine: TimesheetLine): Promise<TimesheetLine | null> {

  // Call the createTimesheetLine endpoint from the PayrollNZApi
  const createdLine = await xero.client.payrollNZApi.createTimesheetLine(
    xero.tenantId,
    timesheetID,
    timesheetLine,
  );

  return createdLine.body.timesheetLine ?? null;
}

/**
 * Add a timesheet line to an existing payroll timesheet in Xero
 */
export async function updateXeroPayrollTimesheetAddLine(xero: XeroContext, timesheetID: string, timesheetLine: TimesheetLine): Promise<
  XeroClientResponse<TimesheetLine | null>
> {
  try {
    const newLine = await addTimesheetLine(xero, timesheetID, timesheetLine);

    return {
      result: newLine,
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