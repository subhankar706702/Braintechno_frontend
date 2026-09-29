import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for chart; only ownership changed. */
export function renderChartBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const data = parent.chartData(block);
        const max = Math.max(1, ...data.map((item:any) => item.value));
        if (c.variant === 'progress') {
          return `<section style="${common}"><h3 style="margin-top:0">${parent.escape(c.title || 'Performance')}</h3>${data.map((item:any) => `<div style="margin:12px 0"><div style="display:flex;justify-content:space-between;font-size:13px"><span>${parent.escape(item.label)}</span><strong>${item.value}</strong></div><div style="height:8px;background:#E2E8F0;border-radius:999px;overflow:hidden"><i style="display:block;height:100%;width:${Math.min(100, (item.value / max) * 100)}%;background:${parent.css(s.accent, '#FF4D6D')}"></i></div></div>`).join('')}</section>`;
        }
        if (c.variant === 'donut') {
          const first = data[0]?.value || 65;
          const pct = Math.max(0, Math.min(100, Math.round((first / max) * 100)));
          return `<section style="${common}"><h3 style="margin-top:0">${parent.escape(c.title || 'Performance')}</h3><div style="width:180px;height:180px;margin:auto;border-radius:50%;background:conic-gradient(${parent.css(s.accent, '#FF4D6D')} ${pct}%,#E2E8F0 0);display:grid;place-items:center"><div style="width:120px;height:120px;background:${parent.css(s.background, '#FFFFFF')};border-radius:50%;display:grid;place-items:center;font-size:26px;font-weight:900">${pct}%</div></div></section>`;
        }
        return `<section style="${common}"><h3 style="margin-top:0">${parent.escape(c.title || 'Performance')}</h3><div class="bt-chart-bars">${data.map((item:any) => `<div class="bt-chart-bar"><i style="height:${Math.max(8, (item.value / max) * 150)}px;background:${parent.css(s.accent, '#FF4D6D')}"></i><small>${parent.escape(item.label)}</small></div>`).join('')}</div></section>`;
}
