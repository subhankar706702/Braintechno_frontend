import { EditorBlock } from "../models/editor-block.model";

/** Preserves the existing renderBlock branch for timer; only ownership changed. */
export function renderTimerBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const id = `timer-${parent.safeDomId(block.id)}`;
        return `<section id="${id}" data-bt-timer data-target="${parent.attr(c.target)}" data-expired="${parent.attr(c.expiredText || 'Ended')}" style="${common}"><h3 style="margin:0 0 14px">${parent.escape(c.title || 'Countdown')}</h3><div class="bt-timer-units"><div class="bt-timer-unit"><strong data-days>00</strong><small style="display:block">Days</small></div><div class="bt-timer-unit"><strong data-hours>00</strong><small style="display:block">Hours</small></div><div class="bt-timer-unit"><strong data-minutes>00</strong><small style="display:block">Minutes</small></div><div class="bt-timer-unit"><strong data-seconds>00</strong><small style="display:block">Seconds</small></div></div><p data-expired-label style="display:none;margin:12px 0 0"></p></section>`;
}
