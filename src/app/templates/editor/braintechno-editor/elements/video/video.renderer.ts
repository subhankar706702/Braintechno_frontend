import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for video; only ownership changed. */
export function renderVideoBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const direct = c.variant === 'direct' || /\.mp4($|\?)/i.test(String(c.url || ''));
        const player = direct
          ? `<video src="${parent.attr(c.url)}" ${c.controls !== false ? 'controls' : ''} ${c.autoplay ? 'autoplay' : ''} ${c.muted ? 'muted' : ''} playsinline style="width:100%;height:100%;object-fit:cover"></video>`
          : `<iframe src="${parent.attr(parent.youtubeEmbedUrl(String(c.url || '')))}" title="${parent.attr(c.title || 'Video')}" style="width:100%;height:100%;border:0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe>`;
        return `<section style="${common}"><div style="width:100%;aspect-ratio:${parent.attr(s.aspect || '16/9')};overflow:hidden;border-radius:${parent.cssPx(s.radius, 10)}">${player}</div></section>`;
}
