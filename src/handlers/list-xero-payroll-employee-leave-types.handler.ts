
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { EmployeeLeaveType } from "xero-node/dist/gen/model/payroll-nz/employeeLeaveType.js";
import { XeroContext } from "../types/xero-context.js";

/**
 * Internal function to fetch employee leave types from Xero
 */
async function fetchEmployeeLeaveTypes(xero: XeroContext, employeeId: string): Promise<EmployeeLeaveType[] | null> {

  if (!employeeId) {
    throw new Error("Employee ID is required to fetch employee leave types");
  }

  const response = await xero.client.payrollNZApi.getEmployeeLeaveTypes(
    xero.tenantId,
    employeeId,
    getClientHeaders(),
  );

  return response.body.leaveTypes ?? null;
}

/**
 * List employee leave types from Xero Payroll
 * @param employeeId The ID of the employee to retrieve leave types for
 */
export async function listXeroPayrollEmployeeLeaveTypes(
  xero: XeroContext,
  employeeId: string,
): Promise<XeroClientResponse<EmployeeLeaveType[]>> {
  try {
    const leaveTypes = await fetchEmployeeLeaveTypes(xero, employeeId);

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
