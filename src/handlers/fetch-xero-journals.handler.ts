import { Journal } from "xero-node";
import { formatError } from "../helpers/format-error.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

async function getJournals(
    xero: XeroContext,
    modifiedAfter?: string,
    modifiedBefore?: string,
    paymentsOnly?: boolean,
): Promise<Journal[]> {

    let offset = 0;
    let journals: Journal[] = [];

    while (true) {

        const response = await xero.client.accountingApi.getJournals(
            xero.tenantId,
            undefined,
            offset,
            paymentsOnly,
            getClientHeaders(),
        );

        let returnedJournals = response.body.journals ?? [];

        if (response.body.journals?.length === 0) {
            break;
        }

        if (modifiedAfter || modifiedBefore) {
            returnedJournals = returnedJournals.filter(journal => {
                if (!journal?.journalDate) return false;

                // Parse dates and normalize to start/end of day for comparison
                const journalDate = new Date(journal.journalDate);
                const journalDateOnly = new Date(journalDate.getFullYear(), journalDate.getMonth(), journalDate.getDate());

                let afterDate = null;
                if (modifiedAfter) {
                    const parsedAfter = new Date(modifiedAfter);
                    afterDate = new Date(parsedAfter.getFullYear(), parsedAfter.getMonth(), parsedAfter.getDate());
                }

                let beforeDate = null;
                if (modifiedBefore) {
                    const parsedBefore = new Date(modifiedBefore);
                    beforeDate = new Date(parsedBefore.getFullYear(), parsedBefore.getMonth(), parsedBefore.getDate());
                }

                if (afterDate && beforeDate) {
                    return journalDateOnly >= afterDate && journalDateOnly <= beforeDate;
                } else if (afterDate) {
                    return journalDateOnly >= afterDate;
                } else if (beforeDate) {
                    return journalDateOnly <= beforeDate;
                }
                return true;
            });
        }

        journals.push(...returnedJournals);

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
    modifiedBefore?: string,
    paymentsOnly?: boolean,
): Promise<XeroClientResponse<Journal[]>> {
    try {
        const journals = await getJournals(
            xero,
            modifiedAfter,
            modifiedBefore,
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
