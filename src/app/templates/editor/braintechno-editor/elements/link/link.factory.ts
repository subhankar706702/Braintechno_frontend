import { EditorBlock } from '../../models/editor-block.model';

export function createLinkBlock(id: string, variant = 'text'): EditorBlock {
  const base: EditorBlock = {
    id,
    type: 'link',
    content: {
      variant,
      label: 'Learn more',
      url: '#',
      target: '_self',
      rel: 'noopener noreferrer',
      action: 'web',
      icon: 'arrow_forward',
      download: false,
      downloadName: '',
      title: '',
      showUrl: false,
      openExternal: false
    },
    style: {
      background: '#FFFFFF',
      color: '#2563EB',
      fontSize: 15,
      fontWeight: 700,
      align: 'left',
      padding: 12,
      marginTop: 0,
      marginBottom: 0,
      radius: 8,
      borderWidth: 0,
      borderColor: '#CBD5E1',
      shadow: 'none',
      gap: 8,
      iconSize: 16,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      hoverColor: '#1D4ED8'
    }
  };

  const map: Record<string, Record<string, any>> = {
    text: { padding: 6, background: 'transparent', color: '#2563EB', borderWidth: 0, radius: 0 },
    underline: { padding: 6, background: 'transparent', color: '#2563EB', borderWidth: 0, radius: 0, underline: true },
    arrow: { padding: 8, background: 'transparent', color: '#0F172A', borderWidth: 0, radius: 0, accent: '#FF4D6D' },
    chevron: { padding: '10px 12px', background: '#F8FAFC', color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0', radius: 10 },
    pill: { padding: '10px 16px', background: '#FFF1F4', color: '#E11D48', borderWidth: 0, radius: 999 },
    outline: { padding: '10px 16px', background: '#FFFFFF', color: '#2563EB', borderWidth: 1, borderColor: '#93C5FD', radius: 10 },
    soft: { padding: '11px 18px', background: '#EFF6FF', color: '#1D4ED8', borderWidth: 0, radius: 10 },
    card: { padding: 18, background: '#FFFFFF', color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0', radius: 14, shadow: 'soft' },
    'icon-left': { padding: '10px 14px', background: '#FFFFFF', color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0', radius: 10, iconBg: '#FFF1F4', iconColor: '#FF4D6D' },
    'icon-right': { padding: '10px 14px', background: '#FFFFFF', color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0', radius: 10, iconBg: '#EEF2FF', iconColor: '#4F46E5' },
    external: { padding: '9px 12px', background: '#F8FAFC', color: '#334155', borderWidth: 1, borderColor: '#E2E8F0', radius: 8 },
    download: { padding: '11px 16px', background: '#0F172A', color: '#FFFFFF', borderWidth: 0, radius: 10, iconColor: '#FFFFFF', iconBg: 'rgba(255,255,255,.10)' },
    contact: { padding: '11px 18px', background: '#FF4D6D', color: '#FFFFFF', borderWidth: 0, radius: 10, iconColor: '#FFFFFF', iconBg: 'rgba(255,255,255,.14)' },
    anchor: { padding: '8px 12px', background: '#F8FAFC', color: '#0F172A', borderWidth: 0, radius: 8 },
    stacked: { padding: '14px 16px', background: '#FFFFFF', color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0', radius: 12, showUrl: true }
  };

  const style = { ...base.style, ...(map[variant] || map.text) };
  const content = { ...base.content };

  if (variant === 'arrow') content['icon'] = 'arrow_forward';
  if (variant === 'chevron') content['icon'] = 'chevron_right';
  if (variant === 'icon-left' || variant === 'icon-right') content['icon'] = 'language';
  if (variant === 'external') content['icon'] = 'open_in_new';
  if (variant === 'download') {
    content['label'] = 'Download brochure';
    content['icon'] = 'download';
    content['download'] = true;
  }
  if (variant === 'contact') {
    content['label'] = 'Contact us';
    content['action'] = 'email';
    content['icon'] = 'mail';
  }
  if (variant === 'anchor') {
    content['label'] = 'Pricing';
    content['url'] = '#pricing';
    content['action'] = 'anchor';
    content['icon'] = 'keyboard_arrow_down';
  }
  if (variant === 'stacked') {
    content['label'] = 'Visit website';
    content['showUrl'] = true;
  }

  return { ...base, content, style };
}
