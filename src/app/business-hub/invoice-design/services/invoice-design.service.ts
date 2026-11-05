import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import type { InvoicePdfContext, InvoicePdfData, InvoicePdfSettings } from '../core/invoice-document.model';
import { renderAmberLuxePdf } from '../templates/amber-luxe.template';
import { renderLegacyInvoicePdf } from './legacy-invoice-pdf.renderer';
import { renderMinimalInvoicePdf } from '../templates/minimal.template';
import { renderBasicBlueInvoicePdf } from '../templates/basic-blue.template';
import { renderMonoInvoicePdf } from '../templates/mono.template';
import { renderCorporateInvoicePdf } from '../templates/corporate.template';
import { renderElegantInvoicePdf } from '../templates/elegant.template';
import { renderCreativeInvoicePdf } from '../templates/creative.template';
import { renderSidebarInvoicePdf } from '../templates/sidebar.template';
import { renderLuxuryInvoicePdf } from '../templates/luxury.template';
import { renderGradientInvoicePdf } from '../templates/gradient.template';
import { renderExecutiveInvoicePdf } from '../templates/executive.template';
import { renderSignatureInvoicePdf } from '../templates/signature.template';
import { renderModernProInvoicePdf } from '../templates/modern-pro.template';
import { renderMyBrandInvoicePdf } from '../templates/my-brand.template';
import { renderDesignStudioInvoicePdf } from '../templates/design-studio.template';
import { renderModernInvoicePdf } from '../templates/modern.template';
import { renderGstInvoicePdf } from '../templates/gst.template';
import { renderPremiumInvoicePdf } from '../templates/premium.template';
import { renderRefRedGoldInvoicePdf } from '../templates/ref-red-gold.template';
import { renderRefTealCleanInvoicePdf } from '../templates/ref-teal-clean.template';
import { renderRefGreenClassicInvoicePdf } from '../templates/ref-green-classic.template';
import { renderRefProformaInvoicePdf } from '../templates/ref-proforma.template';
import { renderRefTealWaveInvoicePdf } from '../templates/ref-teal-wave.template';
import { renderWaveCorporateInvoicePdf } from '../templates/wave-corporate.template';
import { renderGreenMinimalInvoicePdf } from '../templates/green-minimal.template';
import { renderNavyExecutiveInvoicePdf } from '../templates/navy-executive.template';
import { renderRoyalEleganceInvoicePdf } from '../templates/royal-elegance.template';
import { renderOrangeCreativeInvoicePdf } from '../templates/orange-creative.template';
import { renderEmeraldModernInvoicePdf } from '../templates/emerald-modern.template';
import { renderSlateMinimalInvoicePdf } from '../templates/slate-minimal.template';
import { renderRosePremiumInvoicePdf } from '../templates/rose-premium.template';
import { renderOceanBusinessInvoicePdf } from '../templates/ocean-business.template';

@Injectable({ providedIn: 'root' })
export class InvoiceDesignService {
  renderPdf(invoice: InvoicePdfData, settings: InvoicePdfSettings, businessLogo: string, footerText: string, poweredByText: string): Promise<jsPDF> {
    const context: InvoicePdfContext = { invoice, settings, businessLogo, footerText, poweredByText };
    const selectedTemplate = String(settings.template || 'classic').toLowerCase();
    switch (selectedTemplate) {
      case 'classic': return renderLegacyInvoicePdf(context);
      case 'amber-luxe': return renderAmberLuxePdf(context);
      case 'minimal': return renderMinimalInvoicePdf(context);
      case 'basic-blue': return renderBasicBlueInvoicePdf(context);
      case 'mono': return renderMonoInvoicePdf(context);
      case 'corporate': return renderCorporateInvoicePdf(context);
      case 'elegant': return renderElegantInvoicePdf(context);
      case 'creative': return renderCreativeInvoicePdf(context);
      case 'sidebar': return renderSidebarInvoicePdf(context);
      case 'luxury': return renderLuxuryInvoicePdf(context);
      case 'gradient': return renderGradientInvoicePdf(context);
      case 'executive': return renderExecutiveInvoicePdf(context);
      case 'signature': return renderSignatureInvoicePdf(context);
      case 'modern-pro': return renderModernProInvoicePdf(context);
      case 'my-brand': return renderMyBrandInvoicePdf(context);
      case 'design-studio': return renderDesignStudioInvoicePdf(context);
      case 'modern': return renderModernInvoicePdf(context);
      case 'gst': return renderGstInvoicePdf(context);
      case 'premium': return renderPremiumInvoicePdf(context);
      case 'ref-red-gold': return renderRefRedGoldInvoicePdf(context);
      case 'ref-teal-clean': return renderRefTealCleanInvoicePdf(context);
      case 'ref-green-classic': return renderRefGreenClassicInvoicePdf(context);
      case 'ref-proforma': return renderRefProformaInvoicePdf(context);
      case 'ref-teal-wave': return renderRefTealWaveInvoicePdf(context);
      case 'wave-corporate': return renderWaveCorporateInvoicePdf(context);
      case 'green-minimal': return renderGreenMinimalInvoicePdf(context);
      case 'navy-executive': return renderNavyExecutiveInvoicePdf(context);
      case 'royal-elegance': return renderRoyalEleganceInvoicePdf(context);
      case 'orange-creative': return renderOrangeCreativeInvoicePdf(context);
      case 'emerald-modern': return renderEmeraldModernInvoicePdf(context);
      case 'slate-minimal': return renderSlateMinimalInvoicePdf(context);
      case 'rose-premium': return renderRosePremiumInvoicePdf(context);
      case 'ocean-business': return renderOceanBusinessInvoicePdf(context);
      default: return renderLegacyInvoicePdf(context);
    }
  }
}
