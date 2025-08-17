import { TrackingOption } from "xero-node";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroClientResponse } from "../types/tool-response.js";
import { XeroContext } from "../types/xero-context.js";

type TrackingOptionStatus = "ACTIVE" | "ARCHIVED";

interface TrackingOptionItem {
  trackingOptionId: string,
  name?: string,
  status?: TrackingOptionStatus
}

async function getTrackingOptions(xero: XeroContext, trackingCategoryId: string): Promise<TrackingOption[] | undefined> {

  const response = await xero.client.accountingApi.getTrackingCategory(
    xero.tenantId,
    trackingCategoryId,
    getClientHeaders()
  );

  return response.body.trackingCategories?.[0].options;
}

async function updateTrackingOption(
  xero: XeroContext,
  trackingCategoryId: string,
  trackingOptionId: string,
  existingTrackingOption: TrackingOption,
  name?: string,
  status?: TrackingOptionStatus
): Promise<TrackingOption | undefined> {

  const trackingOption: TrackingOption = {
    trackingOptionID: trackingOptionId,
    name: name ? name : existingTrackingOption.name,
    status: status ? TrackingOption.StatusEnum[status] : existingTrackingOption.status
  };

  await xero.client.accountingApi.updateTrackingOptions(
    xero.tenantId,
    trackingCategoryId,
    trackingOptionId,
    trackingOption,
    undefined, // idempotencyKey
    getClientHeaders()
  );

  return trackingOption;
}

export async function updateXeroTrackingOption(
  xero: XeroContext,
  trackingCategoryId: string,
  options: TrackingOptionItem[]
): Promise<XeroClientResponse<TrackingOption[]>> {
  try {

    const existingTrackingOptions = await getTrackingOptions(xero, trackingCategoryId);

    if (!existingTrackingOptions) {
      throw new Error("Could not find tracking options.");
    }

    const updatedTrackingOptions = await Promise.all(options?.map(async (option) => {
      const existingTrackingOption = existingTrackingOptions
        .find(existingOption => existingOption.trackingOptionID === option.trackingOptionId);

      return existingTrackingOption
        ? await updateTrackingOption(xero, trackingCategoryId, option.trackingOptionId, existingTrackingOption, option.name, option.status)
        : undefined;
    }));

    if (!updatedTrackingOptions) {
      throw new Error("Failed to update tracking options.");
    }

    return {
      result: updatedTrackingOptions
        .filter(Boolean)
        .map(option => option as TrackingOption),
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