// helpers/create-xero-tool.ts
import { ZodRawShape, z } from "zod";
import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolDefinition } from "../types/tool-definition.js";
import { createXeroClient } from "../clients/xero-client.js";
import type { XeroContext } from "../types/xero-context.js";

type ToolExtra = Parameters<ToolCallback<any>>[1];
type ToolExtraReq = NonNullable<ToolExtra>;

// Base schema that includes bearer token parameter
const baseSchema = {
    bearerToken: z.string().describe("Xero bearer token for authentication"),
    tenantId: z.string().describe("Xero tenant ID for authentication"),

};



/**
 * Tool handler that receives the original args (minus bearerToken) and an injected Xero context.
 */
export type XeroInjectedHandler<Args extends ZodRawShape> = ToolCallback<
    // we strip bearerToken before giving args to the user handler
    Omit<{ [K in keyof Args]: Args[K] }, "bearerToken" | "tenantId"> & { xero: XeroContext }
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CreateXeroTool = <Args extends undefined | ZodRawShape = any>(
    name: string,
    description: string,
    schema: Args,
    userHandler: XeroInjectedHandler<Args & typeof baseSchema>,
): (() => ToolDefinition<Args & typeof baseSchema>) => {
    return () => ({
        name,
        description,
        schema: { ...baseSchema, ...(schema ?? ({} as Args)) } as Args & typeof baseSchema,

        // Middleware: build client from bearerToken, authenticate, inject { xero } into handler
        handler: (async (rawArgs: Record<string, unknown>, extra: ToolExtraReq) => {
            const bearerToken = String(rawArgs.bearerToken ?? "");
            const tenantId = String(rawArgs.tenantId ?? "");
            if (!bearerToken) {
                return {
                    content: [{ type: "text" as const, text: "Missing bearerToken." }],
                };
            }
            if (!tenantId) {
                return {
                    content: [{ type: "text" as const, text: "Missing tenantId." }],
                };
            }

            const client = createXeroClient(bearerToken, tenantId);
            await client.authenticate();

            const xero: XeroContext = {
                client,
                tenantId: client.tenantId,
                bearerToken: bearerToken,
            };

            // remove bearerToken before calling the user handler
            // and pass xero context in
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { bearerToken: _omit, tenantId: _omit2, ...rest } = rawArgs;

            return userHandler(
                { ...(rest as any), xero },
                extra
            );

        }) as unknown as ToolCallback<Args & typeof baseSchema>,
    });
};
