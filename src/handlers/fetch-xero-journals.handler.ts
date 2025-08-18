import { Journal } from "xero-node";
import { formatError } from "../helpers/format-error.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

async function getJournals(
    xero: XeroContext,
    modifiedAfter?: string,
    paymentsOnly?: boolean,
): Promise<Journal[]> {

    let offset = 0;
    let journals: Journal[] = [];

    while (true) {

        const response = await xero.client.accountingApi.getJournals(
            xero.tenantId,
            modifiedAfter ? new Date(modifiedAfter) : undefined,
            offset,
            paymentsOnly,
            getClientHeaders(),
        );

        journals.push(...response.body.journals ?? []);

        if (response.body.journals?.length === 0) {
            break;
        }

        offset += (response.body.journals?.length ?? 0) + 1;
    }

    return journals;
}

/**
 * List all manual journals from Xero.
 */
export async function fetchXeroJournals(
    xero: XeroContext,
    modifiedAfter?: string,
    paymentsOnly?: boolean,
): Promise<XeroClientResponse<Journal[]>> {
    try {
        const journals = await getJournals(
            xero,
            modifiedAfter,
            paymentsOnly,
        );

        return {
            result: journals,
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
