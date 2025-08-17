// types/xero-context.ts
import type { MCPXeroClient } from "../clients/xero-client.js";

export interface XeroContext {
    client: MCPXeroClient;
    bearerToken: string;
    tenantId: string;
}
