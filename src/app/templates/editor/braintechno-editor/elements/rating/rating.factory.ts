import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for rating; only ownership changed. */
export function createRatingBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return { ...base, content: { variant, title: 'Rate your experience', text: 'Your feedback helps us improve.', max: 5, submitUrl: '/rating/accountId', submitLabel: 'Submit Rating', successMessage: 'Thank You For your Rating', allowComment: true, commentPlaceholder: 'Write a comment (optional)' }, style: { ...base.style, background: '#FFFFFF', color: '#0F172A', accent: '#F59E0B', align: 'center', radius: 16, padding: 24 } };
}
