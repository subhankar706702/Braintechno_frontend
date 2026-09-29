import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for divider; only ownership changed. */
export function renderDividerBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const width = s.short ? '72px' : '100%';
        return `<section style="${common}"><hr style="width:${width};border:0;border-top:${Number(s.borderWidth) || 1}px ${parent.css(s.borderStyle, 'solid')} ${parent.css(s.borderColor, '#E2E8F0')};margin:${s.short ? '0 auto' : '0'}"></section>`;
}
