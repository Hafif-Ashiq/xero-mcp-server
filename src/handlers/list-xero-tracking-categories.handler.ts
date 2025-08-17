import { createXeroClient } from "../clients/xero-client.js";
import { TrackingCategory } from "xero-node";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { XeroContext } from "../types/xero-context.js";

async function getTrackingCategories(
  xero: XeroContext,
  includeArchived?: boolean
): Promise<TrackingCategory[]> {

  const response = await xero.client.accountingApi.getTrackingCategories(
    xero.tenantId, // xeroTenantId
    undefined, // where
    undefined, // order
    includeArchived, // includeArchived
    getClientHeaders()
  );

  return response.body.trackingCategories ?? [];
}

export async function listXeroTrackingCategories(
  xero: XeroContext,
  includeArchived?: boolean
): Promise<XeroClientResponse<TrackingCategory[]>> {
  try {
    const trackingCategories = await getTrackingCategories(xero, includeArchived);

    return {
      result: trackingCategories,
      isError: false,
      error: null
    };
  } catch (error) {
    return {
      result: null,
      isError: true,
      error: formatError(error)
    };
  }
}