import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for rating; only ownership changed. */
export function renderRatingBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const max = Math.max(1, Math.min(10, Number(c.max) || 5));
        return `<section style="${common}"><form class="bt-rating" data-bt-rating action="${parent.attr(c.submitUrl || '/rating/accountId')}" method="post" data-success="${parent.attr(c.successMessage || 'Thank You For your Rating')}"><h3 style="margin:0 0 6px">${parent.escape(c.title || 'Rate your experience')}</h3><p style="margin:0 0 16px;opacity:.72">${parent.escape(c.text || '')}</p><div class="bt-rating-stars">${Array.from({length:max},(_,i)=>`<label><input type="radio" name="rating" value="${i+1}" ${i===max-1?'required':''}><span>★</span></label>`).join('')}</div>${c.allowComment !== false ? `<textarea name="comment" rows="3" placeholder="${parent.attr(c.commentPlaceholder || 'Write a comment (optional)')}"></textarea>` : ''}<button type="submit" style="border:0;background:#0F172A;color:#fff;padding:11px 18px;border-radius:10px;font-weight:800">${parent.escape(c.submitLabel || 'Submit Rating')}</button><p data-rating-message style="display:none;margin:12px 0 0;font-weight:700"></p></form></section>`;
}
