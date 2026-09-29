import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for popup; only ownership changed. */
export function renderPopupBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
return `<section style="${common}"><div style="max-width:520px;margin:auto;border:1px solid #E2E8F0;border-radius:18px;padding:26px;background:inherit"><small style="font-weight:800;color:#FF4D6D">POPUP PREVIEW</small><h2>${parent.escape(c.title)}</h2><p style="line-height:1.7;opacity:.78">${parent.escape(c.text)}</p><a class="bt-btn" href="${parent.attr(c.url||'#')}" style="background:#FF4D6D;color:#fff;padding:11px 18px;border-radius:10px;font-weight:700">${parent.escape(c.cta)}</a></div></section>`;
}
