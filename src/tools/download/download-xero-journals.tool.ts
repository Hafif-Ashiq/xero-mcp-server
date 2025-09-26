import { Journal, JournalLine } from "xero-node";
import fs from "fs";
import { CreateXeroTool } from "../../helpers/create-xero-tool.js";
import { z } from "zod";
import { fetchXeroJournals } from "../../handlers/fetch-xero-journals.handler.js";

const DownloadXeroJournalsTool = CreateXeroTool(
    "download-journals",
    `Fetch all journals from Xero.
Can optionally pass in a date to filter journals modified after that date.
Can optionally pass in a boolean to filter journals to only payments.
The response presents a complete overview of all journals currently registered in your Xero account, with their details. 
`,
    {
        modifiedAfter: z
            .string()
            .optional()
            .describe(
                "Optional date YYYY-MM-DD to filter journals modified after this date",
            ),
        modifiedBefore: z
            .string()
            .optional()
            .describe(
                "Optional date YYYY-MM-DD to filter journals modified before this date",
            ),
        paymentsOnly: z.boolean().optional().describe("Optional boolean to filter journals to only payments"),
    },
    async ({ modifiedAfter, modifiedBefore, paymentsOnly }, _extra, xero) => {
        const response = await fetchXeroJournals(xero, modifiedAfter, modifiedBefore, paymentsOnly);

        if (response.isError) {
            return {
                content: [
                    {
                        type: "text" as const,
                        text: `Error fetching journals: ${response.error}`,
                    },
                ],
            };
        }

        const journals = response.result;

        // Convert journals to CSV format
        const csvHeaders = [
            "journalID",
            "journalDate",
            "journalNumber",
            "createdDateUTC",
            "reference",
            "sourceID",
            "sourceType",
            "journalLines.description",
            "journalLines.accountCode",
            "journalLines.taxType",
            "journalLines.netAmount",
            "journalLines.taxAmount"
        ];


        const csvRows: {
            journalID?: string,
            journalDate?: string,
            journalNumber?: number,
            createdDateUTC?: string,
            reference?: string,
            sourceID?: string,
            sourceType?: string,
            description?: string,
            accountCode?: string,
            taxType?: string,
            netAmount?: string,
            taxAmount?: string
        }[] = []

        journals?.map((journal: Journal) => {

            journal?.journalLines?.map((line: JournalLine) => {
                csvRows.push({
                    journalID: journal.journalID,
                    journalDate: journal.journalDate,
                    journalNumber: journal.journalNumber,
                    createdDateUTC: journal.createdDateUTC?.toISOString(),
                    reference: journal.reference,
                    sourceID: journal.sourceID,
                    sourceType: journal.sourceType?.toString(),
                    description: line.description,
                    accountCode: line.accountCode,
                    taxType: line.taxType,
                    netAmount: line.netAmount?.toString(),
                    taxAmount: line.taxAmount?.toString()
                })
            })

        })



        const csvContent = [
            csvHeaders.join(","),
            ...csvRows.map(row => Object.values(row).map(field =>
                field ? `"${field.toString().replace(/"/g, '""')}"` : '""'
            ).join(","))
        ].join("\n");

        // Save CSV file

        const filename = `xero-journals-${new Date().toISOString().split('T')[0]}.csv`;
        fs.writeFileSync(filename, csvContent);

        return {
            fileName: filename,
            content: [
                {
                    type: "text" as const,
                    text: `Found ${journals?.length || 0} journals`,
                },
                {
                    type: "text" as const,
                    text: `Total journals: ${journals?.length || 0}.`,
                },
                {
                    type: "text" as const,
                    text: `Details: ${journals?.slice(0, 3).map(j => `\n- Journal ${j.journalNumber}: ${j.reference || 'No reference'} (${j.journalDate})`).join('')}`,
                    markdown: true
                }
            ],
        };
    },
);

export default DownloadXeroJournalsTool;
