import { EditorBlock } from '../../models/editor-block.model';

const TEAM_STYLES: Record<string, Record<string, any>> = {
  'classic-grid': { background: '#FFFFFF', color: '#0F172A', columns: 3, gap: 18, radius: 0, cardRadius: 16, cardBg: '#FFFFFF', cardBorder: '#E2E8F0' },
  cards: { background: '#F8FAFC', color: '#0F172A', columns: 3, gap: 18, radius: 0, cardRadius: 18, cardBg: '#FFFFFF', cardBorder: '#E2E8F0', shadow: 'soft' },
  minimal: { background: '#FFFFFF', color: '#0F172A', columns: 4, gap: 14, radius: 0, cardRadius: 0, cardBg: 'transparent', cardBorder: 'transparent' },
  list: { background: '#FFFFFF', color: '#0F172A', columns: 1, gap: 0, radius: 0, cardRadius: 0, cardBg: '#FFFFFF', cardBorder: '#E2E8F0' },
  alternating: { background: '#F8FAFC', color: '#0F172A', columns: 1, gap: 20, radius: 0, cardRadius: 18, cardBg: '#FFFFFF', cardBorder: '#E2E8F0' },
  featured: { background: '#FFFFFF', color: '#0F172A', columns: 3, gap: 16, radius: 0, cardRadius: 18, cardBg: '#FFFFFF', cardBorder: '#E2E8F0', shadow: 'soft' },
  portrait: { background: '#FFFFFF', color: '#0F172A', columns: 4, gap: 18, radius: 0, cardRadius: 22, cardBg: '#FFFFFF', cardBorder: '#E2E8F0' },
  circular: { background: '#FFFFFF', color: '#0F172A', columns: 4, gap: 18, radius: 0, cardRadius: 999, cardBg: '#FFFFFF', cardBorder: '#E2E8F0' },
  'social-bar': { background: '#F8FAFC', color: '#0F172A', columns: 3, gap: 18, radius: 0, cardRadius: 18, cardBg: '#FFFFFF', cardBorder: '#E2E8F0' },
  overlay: { background: '#0F172A', color: '#FFFFFF', columns: 3, gap: 16, radius: 0, cardRadius: 18, cardBg: '#111827', cardBorder: 'rgba(255,255,255,.12)', dark: true },
  split: { background: '#FFFFFF', color: '#0F172A', columns: 2, gap: 24, radius: 0, cardRadius: 18, cardBg: '#F8FAFC', cardBorder: '#E2E8F0' },
  slider: { background: '#FFFFFF', color: '#0F172A', columns: 1, gap: 16, radius: 0, cardRadius: 18, cardBg: '#FFFFFF', cardBorder: '#E2E8F0' },
  departments: { background: '#FFFFFF', color: '#0F172A', columns: 3, gap: 18, radius: 0, cardRadius: 16, cardBg: '#F8FAFC', cardBorder: '#E2E8F0' },
  journey: { background: '#F8FAFC', color: '#0F172A', columns: 1, gap: 18, radius: 0, cardRadius: 16, cardBg: '#FFFFFF', cardBorder: '#E2E8F0' },
  executive: { background: '#111827', color: '#FFFFFF', columns: 3, gap: 18, radius: 0, cardRadius: 20, cardBg: '#182235', cardBorder: 'rgba(255,255,255,.12)', dark: true }
};

export function createTeamBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
  const count = variant === 'list' || variant === 'split' || variant === 'journey' ? 4 : variant === 'slider' ? 6 : 3;
  const roles = ['Founder', 'Creative Director', 'Marketing Specialist', 'Operations Lead', 'Designer', 'Customer Success'];
  const departments = ['Leadership', 'Creative', 'Marketing', 'Operations', 'Design', 'Support'];
  const items = Array.from({ length: count }, (_, i) => ({
    name: `Team Member ${i + 1}`,
    role: roles[i % roles.length],
    department: departments[i % departments.length],
    experience: i === 0 ? '8+ years' : '4+ years',
    bio: 'Add a short professional introduction for this team member.',
    skills: i % 2 === 0 ? 'Strategy, Leadership' : 'Design, Communication',
    image: '',
    mediaId: null,
    facebook: '',
    instagram: '',
    linkedin: '',
    x: '',
    email: '',
    phone: '',
    website: '',
    buttonLabel: '',
    buttonUrl: '#'
  }));

  return {
    ...base,
    content: {
      variant,
      title: 'Meet the team',
      subtitle: 'The people behind the work and the experience.',
      showTitle: true,
      showSubtitle: true,
      showRole: true,
      showBio: true,
      showDepartment: true,
      showExperience: false,
      showSkills: false,
      showSocial: false,
      showContact: false,
      showButton: false,
      socialStyle: 'inline',
      items
    },
    style: {
      ...base.style,
      ...TEAM_STYLES[variant] || TEAM_STYLES['classic-grid'],
      accent: '#FF4D6D',
      mutedColor: '#64748B',
      imageBg: '#E5E7EB',
      buttonBg: '#FF4D6D',
      buttonColor: '#FFFFFF',
      titleColor: TEAM_STYLES[variant]?.dark ? '#FFFFFF' : '#0F172A',
      radius: TEAM_STYLES[variant]?.radius ?? 0,
      marginTop: 0,
      marginBottom: 0
    }
  };
}
