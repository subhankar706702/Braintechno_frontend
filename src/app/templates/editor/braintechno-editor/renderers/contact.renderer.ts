import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for contact; only ownership changed. */
export function renderContactBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
return `<section style="${common}"><div><h3 style="margin:0 0 12px">Contact</h3><p style="margin:6px 0"><span class="material-symbols-rounded" style="font-size:18px;vertical-align:middle">call</span> <a href="tel:${parent.attr(String(c.phone || '').replace(/\s+/g, ''))}" style="color:inherit;text-decoration:none">${parent.escape(c.phone)}</a></p><p style="margin:6px 0"><span class="material-symbols-rounded" style="font-size:18px;vertical-align:middle">mail</span> <a href="mailto:${parent.attr(c.email)}" style="color:inherit;text-decoration:none">${parent.escape(c.email)}</a></p><p style="margin:6px 0"><span class="material-symbols-rounded" style="font-size:18px;vertical-align:middle">location_on</span> ${parent.escape(c.address)}</p><p style="margin:6px 0"><span class="material-symbols-rounded" style="font-size:18px;vertical-align:middle">schedule</span> ${parent.escape(c.hours)}</p></div></section>`;
}
