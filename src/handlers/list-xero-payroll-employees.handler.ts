
import { Employee } from "xero-node";
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

async function getPayrollEmployees(xero: XeroContext): Promise<Employee[]> {

  // Call the Employees endpoint from the PayrollNZApi
  const employees = await xero.client.payrollNZApi.getEmployees(
    xero.tenantId,
    undefined, // page
    undefined, // pageSize
    getClientHeaders(),
  );

  return employees.body.employees ?? [];
}

/**
 * List all payroll employees from Xero
 */
export async function listXeroPayrollEmployees(xero: XeroContext): Promise<
  XeroClientResponse<Employee[]>
> {
  try {
    const employees = await getPayrollEmployees(xero);

    return {
      result: employees,
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
