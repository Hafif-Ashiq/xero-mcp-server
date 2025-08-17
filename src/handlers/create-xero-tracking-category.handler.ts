
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { TrackingCategory } from "xero-node";
import { XeroContext } from "../types/xero-context.js";

async function createTrackingCategory(
  xero: XeroContext,
  name: string
): Promise<TrackingCategory | undefined> {

  const trackingCategory: TrackingCategory = {
    name: name
  };

  const response = await xero.client.accountingApi.createTrackingCategory(
    xero.tenantId, // xeroTenantId
    trackingCategory,
    undefined, // idempotencyKey
    getClientHeaders() // options
  );

  const createdTrackingCategory = response.body.trackingCategories?.[0];

  return createdTrackingCategory;
}

export async function createXeroTrackingCategory(
  xero: XeroContext,
  name: string
): Promise<XeroClientResponse<TrackingCategory>> {
  try {
    const createdTrackingCategory = await createTrackingCategory(xero, name);

    if (!createdTrackingCategory) {
      throw new Error("Tracking Category creation failed.");
    }

    return {
      result: createdTrackingCategory,
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