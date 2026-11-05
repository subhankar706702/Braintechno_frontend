import classic from '../templates/classic.template';
import minimal from '../templates/minimal.template';
import basicblue from '../templates/basic-blue.template';
import mono from '../templates/mono.template';
import corporate from '../templates/corporate.template';
import elegant from '../templates/elegant.template';
import creative from '../templates/creative.template';
import sidebar from '../templates/sidebar.template';
import luxury from '../templates/luxury.template';
import gradient from '../templates/gradient.template';
import executive from '../templates/executive.template';
import signature from '../templates/signature.template';
import modernpro from '../templates/modern-pro.template';
import mybrand from '../templates/my-brand.template';
import designstudio from '../templates/design-studio.template';
import modern from '../templates/modern.template';
import gst from '../templates/gst.template';
import premium from '../templates/premium.template';
import refredgold from '../templates/ref-red-gold.template';
import reftealclean from '../templates/ref-teal-clean.template';
import refgreenclassic from '../templates/ref-green-classic.template';
import refproforma from '../templates/ref-proforma.template';
import reftealwave from '../templates/ref-teal-wave.template';
import wavecorporate from '../templates/wave-corporate.template';
import greenminimal from '../templates/green-minimal.template';
import navyexecutive from '../templates/navy-executive.template';
import royalelegance from '../templates/royal-elegance.template';
import orangecreative from '../templates/orange-creative.template';
import emeraldmodern from '../templates/emerald-modern.template';
import slateminimal from '../templates/slate-minimal.template';
import rosepremium from '../templates/rose-premium.template';
import oceanbusiness from '../templates/ocean-business.template';
import amberluxe from '../templates/amber-luxe.template';
import type { InvoiceTemplateDefinition, InvoiceTemplateId } from './invoice-design.types';

export const INVOICE_DESIGNS: readonly InvoiceTemplateDefinition[] = Object.freeze([
  classic,
  minimal,
  basicblue,
  mono,
  corporate,
  elegant,
  creative,
  sidebar,
  luxury,
  gradient,
  executive,
  signature,
  modernpro,
  mybrand,
  designstudio,
  modern,
  gst,
  premium,
  refredgold,
  reftealclean,
  refgreenclassic,
  refproforma,
  reftealwave,
  wavecorporate,
  greenminimal,
  navyexecutive,
  royalelegance,
  orangecreative,
  emeraldmodern,
  slateminimal,
  rosepremium,
  oceanbusiness,
  amberluxe,
]);

const DESIGN_BY_ID = new Map<string, InvoiceTemplateDefinition>(INVOICE_DESIGNS.map(item => [item.id, item]));
export function getInvoiceTemplateDesign(id: string): InvoiceTemplateDefinition {
  return DESIGN_BY_ID.get(String(id || '').toLowerCase()) || DESIGN_BY_ID.get('classic')!;
}
export function isInvoiceTemplateId(id: string): id is InvoiceTemplateId {
  return DESIGN_BY_ID.has(String(id || '').toLowerCase());
}
export const INVOICE_TEMPLATE_OPTIONS = INVOICE_DESIGNS.map((item) => ({ id: item.id, name: item.name, description: item.description }));
