
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { TrackingOption } from "xero-node";
import { XeroContext } from "../types/xero-context.js";

async function createTrackingOption(
  xero: XeroContext,
  trackingCategoryId: string,
  name: string
): Promise<TrackingOption | undefined> {

  const response = await xero.client.accountingApi.createTrackingOptions(
    xero.tenantId,
    trackingCategoryId,
    {
      name: name
    },
    undefined, // idempotencyKey
    getClientHeaders()
  );

  const createdTrackingOption = response.body.options?.[0];

  return createdTrackingOption;
}

export async function createXeroTrackingOptions(
  xero: XeroContext,
  trackingCategoryId: string,
  optionNames: string[]
): Promise<XeroClientResponse<TrackingOption[]>> {
  try {
    const createdOptions = await Promise.all(
      optionNames.map(async optionName => await createTrackingOption(xero, trackingCategoryId, optionName))
    );

    return {
      result: createdOptions
        .filter(Boolean)
        .map(option => option as TrackingOption),
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
