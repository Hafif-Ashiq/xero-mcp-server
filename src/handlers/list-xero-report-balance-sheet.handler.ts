
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";

import { ReportWithRow } from "xero-node";
import { XeroClientResponse } from "../types/tool-response.js";
import { ListReportBalanceSheetParams } from "../types/list-report-balance-sheet-params.js";
import { XeroContext } from "../types/xero-context.js";


async function getReportBalanceSheet(xero: XeroContext, params: ListReportBalanceSheetParams): Promise<ReportWithRow | null> {
    const {
        date,
        periods,
        timeframe,
        trackingOptionID1,
        trackingOptionID2,
        standardLayout,
        paymentsOnly,
    } = params;

    const response = await xero.client.accountingApi.getReportBalanceSheet(
        xero.tenantId,
        date || undefined,
        periods || undefined,
        timeframe || undefined,
        trackingOptionID1 || undefined,
        trackingOptionID2 || undefined,
        standardLayout ?? undefined,
        paymentsOnly ?? undefined,
        getClientHeaders(),
    );
    return response.body.reports?.[0] ?? null;
}

export async function listXeroReportBalanceSheet(xero: XeroContext, params: ListReportBalanceSheetParams): Promise<XeroClientResponse<ReportWithRow>> {
    try {
        const balanceSheet = await getReportBalanceSheet(xero, params);

        if (!balanceSheet) {
            return {
                result: null,
                isError: true,
                error: "Failed to fetch balance sheet data from Xero.",
            };
        }

        return {
            result: balanceSheet,
            isError: false,
            error: null,
        };
    }
    catch (error) {
        return {
            result: null,
            isError: true,
            error: formatError(error),
        };
    }
};