import { TrackingCategory } from "xero-node";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { XeroContext } from "../types/xero-context.js";

type TrackingCategoryStatus = "ACTIVE" | "ARCHIVED";

async function getTrackingCategory(xero: XeroContext, trackingCategoryId: string): Promise<TrackingCategory | undefined> {

  const response = await xero.client.accountingApi.getTrackingCategory(
    xero.tenantId,
    trackingCategoryId,
    getClientHeaders()
  );

  return response.body.trackingCategories?.[0];
}

async function updateTrackingCategory(
  xero: XeroContext,
  trackingCategoryId: string,
  existingTrackingCategory: TrackingCategory,
  name?: string,
  status?: TrackingCategoryStatus
): Promise<TrackingCategory | undefined> {

  const trackingCategory: TrackingCategory = {
    trackingCategoryID: trackingCategoryId,
    name: name ? name : existingTrackingCategory.name,
    status: status ? TrackingCategory.StatusEnum[status] : existingTrackingCategory.status
  };

  await xero.client.accountingApi.updateTrackingCategory(
    xero.tenantId,
    trackingCategoryId,
    trackingCategory,
    undefined, // idempotencyKey
    getClientHeaders()
  );

  return trackingCategory;
}

export async function updateXeroTrackingCategory(
  xero: XeroContext,
  trackingCategoryId: string,
  name?: string,
  status?: TrackingCategoryStatus
): Promise<XeroClientResponse<TrackingCategory>> {
  try {
    const existingTrackingCategory = await getTrackingCategory(xero, trackingCategoryId);

    if (!existingTrackingCategory) {
      throw new Error("Could not find tracking category.");
    }

    const updatedTrackingCategory = await updateTrackingCategory(
      xero,
      trackingCategoryId,
      existingTrackingCategory,
      name,
      status
    );

    if (!updatedTrackingCategory) {
      throw new Error("Failed to update tracking category.");
    }

    return {
      result: updatedTrackingCategory,
      isError: false,
      error: null
    };
  } catch (error) {
    return {
      result: null,
      isError: true,
      error: formatError(error),
    };
  }
}