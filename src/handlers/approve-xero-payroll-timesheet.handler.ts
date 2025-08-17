import { Timesheet } from "xero-node/dist/gen/model/payroll-nz/timesheet.js";

import { formatError } from "../helpers/format-error.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { XeroContext } from "../types/xero-context.js";

async function approveTimesheet(xero: XeroContext, timesheetID: string): Promise<Timesheet | null> {


  // Call the approveTimesheet endpoint from the PayrollNZApi
  const approvedTimesheet = await xero.client.payrollNZApi.approveTimesheet(
    xero.tenantId,
    timesheetID,
  );

  return approvedTimesheet.body.timesheet ?? null;
}

/**
 * Approve a payroll timesheet in Xero
 */
export async function approveXeroPayrollTimesheet(xero: XeroContext, timesheetID: string): Promise<
  XeroClientResponse<Timesheet | null>
> {
  try {
    const approvedTimesheet = await approveTimesheet(xero, timesheetID);

    return {
      result: approvedTimesheet,
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