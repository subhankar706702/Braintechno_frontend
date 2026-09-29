import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for link; only ownership changed. */
export function renderLinkBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const arrow = c.variant === 'arrow' || c.variant === 'external' ? ' →' : '';
        const pill = c.variant === 'pill' ? 'padding:9px 14px;border-radius:999px;background:#EFF6FF;' : '';
        const card = c.variant === 'card' ? 'display:block;padding:16px;border:1px solid #E2E8F0;border-radius:12px;background:#FFFFFF;' : '';
        return `<section style="${common}"><a href="${parent.attr(c.url || '#')}" target="${parent.attr(c.target || '_self')}" style="color:${parent.css(s.color, '#2563EB')};font-weight:700;text-decoration:${c.variant === 'underline' ? 'underline' : 'none'};${pill}${card}">${parent.escape(c.label || 'Learn more')}${arrow}</a></section>`;
}
