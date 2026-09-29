import { EditorBlock, MediaItem } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for media; only ownership changed. */
export function renderMediaBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const files: MediaItem[] = Array.isArray(c.files) ? c.files : [];
        return `<section style="${common}"><h3 style="margin-top:0">${parent.escape(c.title || 'Your Media')}</h3><div class="bt-media-grid">${files.map(file => file.type.startsWith('image/') ? `<a href="${parent.attr(file.dataUrl)}" download="${parent.attr(file.name)}"><img src="${parent.attr(file.dataUrl)}" alt="${parent.attr(file.name)}" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:10px"></a>` : `<a href="${parent.attr(file.dataUrl)}" download="${parent.attr(file.name)}" style="padding:14px;border:1px solid #E2E8F0;border-radius:10px;text-decoration:none;color:inherit"><span class="material-symbols-rounded">description</span><div style="margin-top:6px;word-break:break-word">${parent.escape(file.name)}</div></a>`).join('')}</div></section>`;
}
