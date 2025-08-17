// helpers/create-xero-tool.ts

import { z, ZodRawShape, ZodObject } from "zod";
import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolDefinition } from "../types/tool-definition.js";
import type { MCPXeroClient } from "../clients/xero-client.js";
import { createXeroClient } from "../clients/xero-client.js";
import type { XeroContext } from "../types/xero-context.js";

/**
 * Keys we expect to receive via tool arguments for auth.
 * Adjust here if you ever rename them.
 */
type AuthKeys = "bearerToken" | "tenantId";

/**
 * Remove auth keys from the handler-visible args.
 */
type CleanArgs<Args extends ZodRawShape> =
  Omit<z.infer<ZodObject<Args>>, AuthKeys>;

/**
 * Handler: receives sanitized args (no bearerToken/tenantId) and a xeroContext.
 */
export type XeroHandler<Args extends ZodRawShape> =
  (args: CleanArgs<Args>,
    extra: Parameters<ToolCallback<any>>[1],
    xeroContext: XeroContext) => ReturnType<ToolCallback<any>>;

// Base schema that includes bearer token parameter
const baseSchema = {
  bearerToken: z.string().describe("Xero bearer token for authentication"),
  tenantId: z.string().describe("Xero tenant ID for authentication"),
};

export function CreateXeroTool<
  Args extends ZodRawShape = ZodRawShape
>(
  name: string,
  description: string,
  schema: Args,               // user's business schema (no bearerToken/tenantId)
  handler: XeroHandler<Args>, // your business handler (no token/tenant in its args)
): (() => ToolDefinition<Args & typeof baseSchema>) {

  // Merge the base schema with the user's schema
  const fullSchema = { ...baseSchema, ...schema };
  const paramsObject = z.object(fullSchema) as ZodObject<Args & typeof baseSchema>;

  return () => ({
    name,
    description,
    schema: fullSchema, // expose full schema so callers can pass bearerToken & tenantId
    handler: (async (rawArgs, extra) => {
      // --- Extract auth from the incoming args ---
      const {
        bearerToken,
        tenantId,
        ...rest
      } = rawArgs as z.infer<typeof paramsObject>;

      if (!bearerToken || !tenantId) {
        return {
          content: [{
            type: "text",
            text: "Missing required authentication arguments: bearerToken and/or tenantId. "
          }],
          isError: true,
        };
      }

      // --- Build xeroContext for the business handler ---
      const client: MCPXeroClient = createXeroClient(bearerToken, tenantId);
      await client.authenticate();
      const xeroContext: XeroContext = { client, bearerToken, tenantId };

      // --- Call the business handler with sanitized args + context ---
      return handler(rest as CleanArgs<Args>, extra, xeroContext);
    }) as ToolCallback<Args & typeof baseSchema>,
  });
}
