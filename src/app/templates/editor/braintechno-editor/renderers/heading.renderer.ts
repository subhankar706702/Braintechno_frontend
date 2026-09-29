import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for heading; only ownership changed. */
export function renderHeadingBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const eyebrow = c.variant === 'eyebrow' ? `<small style="display:block;margin-bottom:8px;color:#FF4D6D;font-weight:800;letter-spacing:.12em">${parent.escape(c.eyebrow || 'INTRODUCING')}</small>` : '';
        const line = s.accentLine ? '<span style="display:block;width:54px;height:4px;background:#FF4D6D;border-radius:99px;margin-top:10px"></span>' : '';
        return `<section style="${common}">${eyebrow}<${c.level || 'h2'} style="margin:0;font-size:${parent.cssPx(s.fontSize, 30)};font-weight:${s.fontWeight || 700};color:${parent.css(s.color, '#0F172A')}">${parent.escape(c.text)}</${c.level || 'h2'}>${line}</section>`;
}
