
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { LeaveType } from "xero-node/dist/gen/model/payroll-nz/leaveType.js";
import { XeroContext } from "../types/xero-context.js";

/**
 * Internal function to fetch leave types from Xero
 */
async function fetchLeaveTypes(xero: XeroContext): Promise<LeaveType[] | null> {

  const response = await xero.client.payrollNZApi.getLeaveTypes(
    xero.tenantId,
    undefined, // page
    undefined, // pageSize
    getClientHeaders(),
  );

  return response.body.leaveTypes ?? null;
}

/**
 * List all leave types from Xero Payroll
 */
export async function listXeroPayrollLeaveTypes(xero: XeroContext): Promise<
  XeroClientResponse<LeaveType[]>
> {
  try {
    const leaveTypes = await fetchLeaveTypes(xero);

    if (!leaveTypes) {
      return {
        result: [],
        isError: false,
        error: null,
      };
    }

    return {
      result: leaveTypes,
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
