import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import type { InvoicePdfContext, InvoicePdfData, InvoicePdfSettings } from '../core/invoice-document.model';
import { renderAmberLuxePdf } from '../templates/amber-luxe.template';
import { renderLegacyInvoicePdf } from './legacy-invoice-pdf.renderer';

@Injectable({ providedIn: 'root' })
export class InvoiceDesignService {
  renderPdf(
    invoice: InvoicePdfData,
    settings: InvoicePdfSettings,
    businessLogo: string,
    footerText: string,
    poweredByText: string
  ): Promise<jsPDF> {
    const context: InvoicePdfContext = { invoice, settings, businessLogo, footerText, poweredByText };
    const selectedTemplate = String(settings.template || 'classic').toLowerCase();

    if (selectedTemplate === 'amber-luxe') {
      return renderAmberLuxePdf(context);
    }

    return renderLegacyInvoicePdf(context);
  }
}
