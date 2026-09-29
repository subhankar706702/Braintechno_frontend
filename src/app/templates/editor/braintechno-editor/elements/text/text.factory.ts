import { EditorBlock } from '../../models/editor-block.model';

export function createTextBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
  const legacySafeVariant = variant || 'paragraph';
  const styleMap: Record<string, Record<string, any>> = {
    paragraph: { fontSize: 16, fontWeight: 400, color: '#475569', align: 'left', lineHeight: 1.75 },
    lead: { fontSize: 20, fontWeight: 400, color: '#334155', align: 'left', lineHeight: 1.75 },
    muted: { fontSize: 15, fontWeight: 400, color: '#64748B', align: 'left', lineHeight: 1.7 },
    quote: { fontSize: 20, fontWeight: 500, color: '#0F172A', align: 'left', lineHeight: 1.7, borderLeft: '#FF4D6D', padding: 24 },
    note: { fontSize: 15, fontWeight: 500, color: '#334155', align: 'left', lineHeight: 1.65, background: '#F1F5F9', borderColor: '#E2E8F0', borderWidth: 1, radius: 12, textIcon: 'info' },
    center: { fontSize: 16, fontWeight: 400, color: '#475569', align: 'center', lineHeight: 1.75 },
    callout: { fontSize: 17, fontWeight: 600, color: '#0F172A', align: 'left', lineHeight: 1.65, borderColor: '#CBD5E1', borderWidth: 1, radius: 14, padding: 22, textIcon: 'campaign' },
    success: { fontSize: 15, fontWeight: 600, color: '#166534', align: 'left', lineHeight: 1.6, background: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1, radius: 12, padding: 16, textIcon: 'check_circle' },
    warning: { fontSize: 15, fontWeight: 600, color: '#92400E', align: 'left', lineHeight: 1.6, background: '#FFFBEB', borderColor: '#FDE68A', borderWidth: 1, radius: 12, padding: 16, textIcon: 'warning' },
    'two-column': { fontSize: 16, fontWeight: 400, color: '#475569', align: 'left', lineHeight: 1.8, columns: 2, columnGap: 28 },
    highlight: { fontSize: 18, fontWeight: 500, color: '#0F172A', align: 'left', lineHeight: 1.75, highlightBg: '#FFF1F4', highlightColor: '#E11D48' },
    checklist: { fontSize: 16, fontWeight: 400, color: '#334155', align: 'left', lineHeight: 1.65, checklistColor: '#FF4D6D', checklistGap: 10 },
    'quote-card': { fontSize: 19, fontWeight: 500, color: '#0F172A', align: 'left', lineHeight: 1.7, background: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1, radius: 16, padding: 24, quoteMarkColor: '#FF4D6D' },
    numeric: { fontSize: 16, fontWeight: 500, color: '#475569', align: 'left', lineHeight: 1.6, background: '#F8FAFC', borderColor: '#E2E8F0', borderWidth: 1, radius: 16, padding: 24, numberColor: '#0F172A', numberSize: 46, numberWeight: 900 },
    expandable: { fontSize: 16, fontWeight: 400, color: '#475569', align: 'left', lineHeight: 1.75, background: '#FFFFFF', borderColor: '#E2E8F0', borderWidth: 1, radius: 14, padding: 18 }
  };

  const baseContent: Record<string, any> = {
    variant: legacySafeVariant,
    text: 'Write your business message here.',
    eyebrow: '',
    highlight: '',
    icon: styleMap[legacySafeVariant]?.textIcon || 'info',
    author: '',
    source: '',
    avatar: '',
    avatarMediaId: null,
    value: '100+',
    suffix: '',
    label: 'Key result',
    moreText: '',
    defaultOpen: false,
    items: [
      { id: `text-item-${Date.now()}-0`, text: 'Add checklist item 1', icon: 'check_circle' },
      { id: `text-item-${Date.now()}-1`, text: 'Add checklist item 2', icon: 'check_circle' },
      { id: `text-item-${Date.now()}-2`, text: 'Add checklist item 3', icon: 'check_circle' }
    ]
  };

  const variantStyle = styleMap[legacySafeVariant] || styleMap.paragraph;

  return {
    ...base,
    content: {
      ...baseContent,
      ...(base.content || {}),
      variant: legacySafeVariant
    },
    style: {
      ...base.style,
      ...variantStyle,
      marginTop: 0,
      marginBottom: 0
    }
  };
}
