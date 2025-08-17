
import { XeroClientResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";
import { CreditNote } from "xero-node";
import { getClientHeaders } from "../helpers/get-client-headers.js";
import { XeroContext } from "../types/xero-context.js";

interface CreditNoteLineItem {
  description: string;
  quantity: number;
  unitAmount: number;
  accountCode: string;
  taxType: string;
}
async function getCreditNote(xero: XeroContext, creditNoteId: string): Promise<CreditNote | null> {

  // First, get the current credit note to check its status
  const response = await xero.client.accountingApi.getCreditNote(
    xero.tenantId,
    creditNoteId, // creditNoteId
    undefined, // unitdp
    getClientHeaders(), // options
  );

  return response.body.creditNotes?.[0] ?? null;
}

async function updateCreditNote(
  xero: XeroContext,
  creditNoteId: string,
  lineItems?: CreditNoteLineItem[],
  reference?: string,
  contactId?: string,
  date?: string,
): Promise<CreditNote | null> {

  const creditNote: CreditNote = {
    lineItems: lineItems,
    reference: reference,
    date: date,
    contact: contactId ? { contactID: contactId } : undefined,
  };

  const response = await xero.client.accountingApi.updateCreditNote(
    xero.tenantId,
    creditNoteId, // creditNoteId
    {
      creditNotes: [creditNote],
    }, // creditNotes
    undefined, // unitdp
    undefined, // idempotencyKey
    getClientHeaders(), // options
  );

  return response.body.creditNotes?.[0] ?? null;
}

/**
 * Update an existing credit note in Xero
 */
export async function updateXeroCreditNote(
  xero: XeroContext,
  creditNoteId: string,
  lineItems?: CreditNoteLineItem[],
  reference?: string,
  contactId?: string,
  date?: string,
): Promise<XeroClientResponse<CreditNote>> {
  try {
    const existingCreditNote = await getCreditNote(xero, creditNoteId);

    const creditNoteStatus = existingCreditNote?.status;

    // Only allow updates to DRAFT credit notes
    if (creditNoteStatus !== CreditNote.StatusEnum.DRAFT) {
      return {
        result: null,
        isError: true,
        error: `Cannot update credit note because it is not a draft. Current status: ${creditNoteStatus}`,
      };
    }

    const updatedCreditNote = await updateCreditNote(
      xero,
      creditNoteId,
      lineItems,
      reference,
      contactId,
      date,
    );

    if (!updatedCreditNote) {
      throw new Error("Credit note update failed.");
    }

    return {
      result: updatedCreditNote,
      isError: false,
      error: null,
    };
  } catch (error) {
    return {
      result: null,
      isError: true,
      error: formatError(error),
    };
  }
} 