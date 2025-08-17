import { z } from "zod";
import { CreateXeroTool } from "../../helpers/create-xero-tool.js";
import { formatTrackingOption } from "../../helpers/format-tracking-option.js";
import { updateXeroTrackingOption } from "../../handlers/update-xero-tracking-options.handler.js";

const trackingOptionSchema = z.object({
  trackingOptionId: z.string(),
  name: z.string().optional().describe("The name of the tracking option."),
  status: z.enum(["ACTIVE", "ARCHIVED"]).optional().describe("The status of the tracking option.")
});

const UpdateTrackingOptionsTool = CreateXeroTool(
  "update-tracking-options",
  `Updates tracking options for a tracking category in Xero.`,
  {
    trackingCategoryId: z.string().describe("The ID of the tracking category to update."),
    options: z.array(trackingOptionSchema).max(10)
  },
  async ({ trackingCategoryId, options }, _extra, xero) => {
    const response = await updateXeroTrackingOption(xero, trackingCategoryId, options);

    if (response.isError) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error while creating tracking options: ${response.error}`
          }
        ]
      };
    }

    const trackingOptions = response.result;

    return {
      content: [
        {
          type: "text" as const,
          text: `${trackingOptions.length || 0} out of ${options.length} tracking options updated:\n${trackingOptions.map(formatTrackingOption)}`
        },
      ]
    };
  }
);

export default UpdateTrackingOptionsTool;