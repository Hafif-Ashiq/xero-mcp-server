import { z } from "zod";
import { CreateXeroTool } from "../../helpers/create-xero-tool.js";
import { updateXeroTrackingCategory } from "../../handlers/update-xero-tracking-category.handler.js";

const UpdateTrackingCategoryTool = CreateXeroTool(
  "update-tracking-category",
  `Updates an existing tracking category in Xero.`,
  {
    trackingCategoryId: z.string().describe("The ID of the tracking category to update."),
    name: z.string().optional().describe("The name of the tracking category."),
    status: z.enum(["ACTIVE", "ARCHIVED"]).optional().describe("The status of the tracking category.")
  },
  async ({ trackingCategoryId, name, status }, _extra, xero) => {
    const response = await updateXeroTrackingCategory(xero, trackingCategoryId, name, status);

    if (response.isError) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error while updating tracking category: ${response.error}`
          }
        ]
      };
    }

    const trackingCategory = response.result;

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated the tracking category "${trackingCategory.name}" (${trackingCategory.trackingCategoryID}).`
        },
      ]
    };
  }
);

export default UpdateTrackingCategoryTool;