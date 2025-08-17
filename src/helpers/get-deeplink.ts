
import {
  contactDeepLink,
  creditNoteDeepLink,
  invoiceDeepLink,
  paymentDeepLink,
  manualJournalDeepLink,
  quoteDeepLink,
  billDeepLink,
} from "../consts/deeplinks.js";
import { XeroContext } from "../types/xero-context.js";

export enum DeepLinkType {
  CONTACT,
  CREDIT_NOTE,
  INVOICE,
  MANUAL_JOURNAL,
  QUOTE,
  PAYMENT,
  BILL,
}

/**
 * Gets a deep link for a specific type and item ID.
 * This will also fetch the org short code from the Xero client.
 * @param type
 * @param itemId
 * @param bearerToken - Bearer token for Xero authentication
 * @returns
 */
export const getDeepLink = async (type: DeepLinkType, itemId: string, xero: XeroContext) => {
  const orgShortCode = await xero.client.getShortCode();

  if (!orgShortCode) {
    throw new Error("Failed to retrieve organisation short code");
  }

  switch (type) {
    case DeepLinkType.CONTACT:
      return contactDeepLink(orgShortCode, itemId);
    case DeepLinkType.CREDIT_NOTE:
      return creditNoteDeepLink(orgShortCode, itemId);
    case DeepLinkType.MANUAL_JOURNAL:
      return manualJournalDeepLink(itemId);
    case DeepLinkType.INVOICE:
      return invoiceDeepLink(orgShortCode, itemId);
    case DeepLinkType.QUOTE:
      return quoteDeepLink(orgShortCode, itemId);
    case DeepLinkType.PAYMENT:
      return paymentDeepLink(orgShortCode, itemId);
    case DeepLinkType.BILL:
      return billDeepLink(orgShortCode, itemId);
  }
};
