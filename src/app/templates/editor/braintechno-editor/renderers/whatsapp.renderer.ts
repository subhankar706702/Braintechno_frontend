import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for whatsapp; only ownership changed. */
export function renderWhatsappBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const phone = String(c.phone || '').replace(/\D/g, '');
        const href = `https://wa.me/${phone}?text=${encodeURIComponent(c.message || '')}`;
        return `<section style="${common}"><a class="bt-btn" href="${parent.attr(href)}" target="_blank" rel="noopener" style="display:${s.fullWidth ? 'flex' : 'inline-flex'};width:${s.fullWidth ? '100%' : 'auto'};justify-content:center;gap:8px;align-items:center;background:${parent.css(s.buttonBg, '#22C55E')};color:${parent.css(s.buttonText, '#FFFFFF')};padding:13px 22px;border-radius:${parent.cssPx(s.radius, 999)};font-weight:800"><span class="material-symbols-rounded">chat</span>${parent.escape(c.label || 'Chat on WhatsApp')}</a></section>`;
}
