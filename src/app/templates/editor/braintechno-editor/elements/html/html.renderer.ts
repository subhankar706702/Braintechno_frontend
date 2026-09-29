import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for html; only ownership changed. */
export function renderHtmlBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
return `<section style="${common}">${String(c.html || '')}</section>`;
}
