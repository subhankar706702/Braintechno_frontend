import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for chart; only ownership changed. */
export function createChartBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return { ...base, content: { variant, title: 'Performance', chartType: variant === 'pie' ? 'pie' : variant === 'line' ? 'line' : 'bar', data: 'Jan:35, Feb:52, Mar:48, Apr:76, May:68', items: [{ label: 'Jan', value: 35 }, { label: 'Feb', value: 52 }, { label: 'Mar', value: 48 }, { label: 'Apr', value: 76 }, { label: 'May', value: 68 }], showLegend: true, showValues: true }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', accent: '#FF4D6D', radius: 16, padding: 22 } };
}
