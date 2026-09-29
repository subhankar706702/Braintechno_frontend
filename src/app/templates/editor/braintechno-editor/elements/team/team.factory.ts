import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for team; only ownership changed. */
export function createTeamBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const count = variant === 'four' ? 4 : variant === 'two' ? 2 : 3;
        return { ...base, content: { variant, title: 'Meet the team', items: Array.from({ length: count }, (_, i) => ({ name: `Team Member ${i+1}`, role: ['Founder','Designer','Specialist','Support'][i] || 'Team', bio: '', image: '', facebook: '', instagram: '', linkedin: '', x: '' })) }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', columns: count, gap: 12, radius: 16 } };
}
