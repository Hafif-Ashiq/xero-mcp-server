
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
// Import the correct types - using the proper namespace
import { EmployeeLeave } from "xero-node/dist/gen/model/payroll-nz/employeeLeave.js";
import { XeroContext } from "../types/xero-context.js";

interface FetchEmployeeLeaveParams {
  employeeId?: string;
}

/**
 * Internal function to fetch employee leave from Xero
 */
async function fetchEmployeeLeave(xero: XeroContext, { employeeId }: FetchEmployeeLeaveParams): Promise<EmployeeLeave[] | null> {

  if (!employeeId) {
    throw new Error("Employee ID is required to fetch employee leave");
  }

  const response = await xero.client.payrollNZApi.getEmployeeLeaves(
    xero.tenantId,
    employeeId,
    {
      headers: getClientHeaders().headers
    }
  );

  return response.body.leave ?? null;
}

/**
 * List employee leave from Xero Payroll
 * @param employeeId The ID of the employee to retrieve leave for
 */
export async function listXeroPayrollEmployeeLeave(
  xero: XeroContext,
  employeeId: string,
): Promise<XeroClientResponse<EmployeeLeave[]>> {
  try {
    const leave = await fetchEmployeeLeave(xero, { employeeId });

    if (!leave) {
      return {
        result: [],
        isError: false,
        error: null,
      };
    }

    return {
      result: leave,
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
