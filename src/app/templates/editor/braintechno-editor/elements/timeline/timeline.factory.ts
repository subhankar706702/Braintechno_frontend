import { EditorBlock } from '../../models/editor-block.model';

const timelineItems = [
  {
    date: '01 Jan 2026',
    title: 'Discover',
    text: 'Tell us what you need and define the first milestone.',
    icon: 'search',
    badge: 'Step 01',
    image: '',
    buttonLabel: '',
    buttonUrl: '#',
    status: 'completed'
  },
  {
    date: '05 Jan 2026',
    title: 'Plan',
    text: 'Prepare the right approach, timeline and resources.',
    icon: 'event_note',
    badge: 'Step 02',
    image: '',
    buttonLabel: '',
    buttonUrl: '#',
    status: 'current'
  },
  {
    date: '12 Jan 2026',
    title: 'Deliver',
    text: 'Launch the work and move to the next milestone.',
    icon: 'rocket_launch',
    badge: 'Step 03',
    image: '',
    buttonLabel: '',
    buttonUrl: '#',
    status: 'upcoming'
  }
];

export function createTimelineBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
  const dark = variant === 'dark' || variant === 'milestone-dark';
  return {
    ...base,
    content: {
      variant,
      title: 'How it works',
      subtitle: 'Show your journey, milestones or process in a clear visual timeline.',
      showTitle: true,
      showSubtitle: true,
      showDates: true,
      showIcons: true,
      showImages: ['image', 'featured'].includes(variant),
      showBadges: ['date-badge', 'milestone', 'featured'].includes(variant),
      showButtons: ['image', 'featured'].includes(variant),
      showStatus: ['process', 'milestone', 'featured', 'scrollable'].includes(variant),
      items: timelineItems.map(item => ({ ...item }))
    },
    style: {
      ...base.style,
      background: dark ? '#0F172A' : '#FFFFFF',
      color: dark ? '#FFFFFF' : '#0F172A',
      mutedColor: dark ? '#CBD5E1' : '#64748B',
      accent: '#FF4D6D',
      lineColor: dark ? '#334155' : '#E2E8F0',
      cardBackground: dark ? '#111827' : '#FFFFFF',
      cardBorder: dark ? '#263244' : '#E2E8F0',
      iconBackground: dark ? '#1E293B' : '#FFF1F4',
      radius: 16,
      itemRadius: 14,
      gap: 28,
      paddingX: 0,
      paddingY: 0,
      backgroundType: 'color',
      backgroundImage: '',
      overlay: 'transparent',
      marginTop: 0,
      marginBottom: 0
    }
  };
}
