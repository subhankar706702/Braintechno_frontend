import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for footer; only ownership changed. */
export function renderFooterBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const links=String(c.links||'').split(',').map((x:string)=>x.trim()).filter(Boolean);
        return `<footer style="${common}"><div class="bt-grid bt-responsive-grid" style="grid-template-columns:2fr 1fr 1fr;gap:24px"><div><strong style="font-size:22px">${parent.escape(c.brand)}</strong><p style="opacity:.75">${parent.escape(c.text)}</p></div><div>${links.map((x:string)=>`<a href="#" style="display:block;color:inherit;text-decoration:none;margin:7px 0">${parent.escape(x)}</a>`).join('')}</div><div><div>${parent.escape(c.phone)}</div><div>${parent.escape(c.email)}</div></div></div><div style="margin-top:22px;padding-top:14px;border-top:1px solid rgba(148,163,184,.35);font-size:13px;opacity:.75">${parent.escape(c.copyright)}</div></footer>`;
}
