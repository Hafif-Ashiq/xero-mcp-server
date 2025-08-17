import {
  TimesheetLine,
} from "xero-node/dist/gen/model/payroll-nz/timesheetLine.js";

import { formatError } from "../helpers/format-error.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { XeroContext } from "../types/xero-context.js";

async function updateTimesheetLine(
  xero: XeroContext,
  timesheetID: string,
  timesheetLineID: string,
  timesheetLine: TimesheetLine
): Promise<TimesheetLine | null> {

  // Call the updateTimesheetLine endpoint from the PayrollNZApi
  const updatedLine = await xero.client.payrollNZApi.updateTimesheetLine(
    xero.tenantId,
    timesheetID,
    timesheetLineID,
    timesheetLine,
  );

  return updatedLine.body.timesheetLine ?? null;
}

/**
 * Update an existing timesheet line in a payroll timesheet in Xero
 */
export async function updateXeroPayrollTimesheetUpdateLine(
  xero: XeroContext,
  timesheetID: string,
  timesheetLineID: string,
  timesheetLine: TimesheetLine
): Promise<XeroClientResponse<TimesheetLine | null>> {
  try {
    const updatedLine = await updateTimesheetLine(xero, timesheetID, timesheetLineID, timesheetLine);

    return {
      result: updatedLine,
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