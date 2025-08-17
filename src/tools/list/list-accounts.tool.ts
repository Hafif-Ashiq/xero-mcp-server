// list-accounts.tool.ts
import { z } from "zod";
import { listXeroAccounts } from "../../handlers/list-xero-accounts.handler.js";
import { CreateXeroTool } from "../../helpers/create-xero-tool.js";

const ListAccountsTool = CreateXeroTool(
  "list-accounts",
  "Lists all accounts in Xero. Use this tool to get the account codes and names to be used when creating invoices in Xero",
  {}, // ⬅️ no bearerToken here
  async (_args, _extra, xero) => {     // ⬅️ use the injected client
    const response = await listXeroAccounts(xero); // ⬅️ update handler to accept client
    if (response.error) {
      return {
        content: [{ type: "text", text: `Error listing accounts: ${response.error}` }],
      };
    }

    const accounts = response.result ?? [];
    return {
      content: [
        { type: "text", text: `Found ${accounts.length} accounts:` },
        ...accounts.map((account) => ({
          type: "text" as const,
          text: [
            `Account: ${account.name ?? "Unnamed"}`,
            `Code: ${account.code ?? "No code"}`,
            `ID: ${account.accountID ?? "No ID"}`,
            `Type: ${account.type ?? "Unknown type"}`,
            `Status: ${account.status ?? "Unknown status"}`,
            account.description ? `Description: ${account.description}` : null,
            account.taxType ? `Tax Type: ${account.taxType}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        })),
      ],
    };
  }
);

export default ListAccountsTool;
