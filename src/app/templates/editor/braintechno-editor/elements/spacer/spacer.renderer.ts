import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for spacer; only ownership changed. */
export function renderSpacerBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
return `<div style="${parent.exportBackgroundStyle(s)}height:${parent.cssPx(s.height, 48)}"></div>`;
}
