import { ElementPreset } from '../../models/editor-block.model';

export const TEAM_PRESETS: ElementPreset[] = [
{ key: 'three', label: '3 Members', description: 'Three team profile cards', preview: '3' },
      { key: 'four', label: '4 Members', description: 'Four compact profiles', preview: '4' },
      { key: 'minimal', label: 'Minimal Team', description: 'Simple names and roles', preview: 'Min' },
      { key: 'social', label: 'Team + Social', description: 'Profiles with social links', preview: 'Share' },
      { key: 'dark', label: 'Dark Team', description: 'Dark profile cards', preview: 'Dark' },
      { key: 'leadership', label: 'Leadership', description: 'Leadership profile layout', preview: 'Lead' },
      { key: 'two', label: '2 Members', description: 'Two wide profiles', preview: '2' },
      { key: 'grid', label: 'Team Grid', description: 'Compact people grid', preview: 'Grid' }
];
