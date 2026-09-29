import { EditorBlock } from "../models/editor-block.model";

/** Preserves the existing renderBlock branch for text; only ownership changed. */
export function renderTextBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const extra = s.borderLeft ? `border-left:4px solid ${parent.css(s.borderLeft, '#FF4D6D')};` : s.borderColor ? `border:1px solid ${parent.css(s.borderColor, '#CBD5E1')};` : '';
        const columns = Number(s.columns) > 1 ? `column-count:${Number(s.columns)};column-gap:28px;` : '';
        return `<section style="${common}${extra}"><p style="margin:0;font-size:${parent.cssPx(s.fontSize, 16)};font-weight:${s.fontWeight || 400};line-height:1.75;color:${parent.css(s.color, '#475569')};${columns}">${parent.nl2br(parent.escape(c.text))}</p></section>`;
}
