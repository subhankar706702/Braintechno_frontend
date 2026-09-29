export function repeatTeamItemTemplate(parent: any, index: number, key: string): Record<string, any> {
return { name: `Team Member ${index + 1}`, role: 'Team', bio: '', image: '', mediaId: null, facebook: '', instagram: '', linkedin: '', x: '' };
}
