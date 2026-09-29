import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for html; only ownership changed. */
export function createHtmlBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const starters: Record<string, string> = {
          blank: '<div>Custom HTML</div>',
          notice: '<div style="padding:16px;border:1px solid #dbeafe;background:#eff6ff;border-radius:12px"><strong>Notice</strong><p style="margin:6px 0 0">Write your custom message here.</p></div>',
          table: '<table style="width:100%;border-collapse:collapse"><tr><th style="text-align:left;border-bottom:1px solid #ddd;padding:8px">Item</th><th style="text-align:left;border-bottom:1px solid #ddd;padding:8px">Value</th></tr><tr><td style="padding:8px">Example</td><td style="padding:8px">100</td></tr></table>',
          badge: '<div style="display:flex;gap:8px;flex-wrap:wrap"><span>Fast</span><span>Secure</span><span>Reliable</span></div>',
          embed: '<div style="padding:24px;text-align:center;background:#f8fafc">Paste your supported embed HTML here</div>',
          'custom-card': '<article style="padding:24px;border:1px solid #e2e8f0;border-radius:16px"><h3>Custom Card</h3><p>Edit this HTML.</p></article>',
          list: '<ul><li>First item</li><li>Second item</li><li>Third item</li></ul>',
          code: '<pre style="padding:16px;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:auto">console.log(\'BRAIN TECHNO\');</pre>'
        };
        return { ...base, content: { variant, html: starters[variant] || starters['blank'] }, style: { ...base.style, padding: 18 } };
}
