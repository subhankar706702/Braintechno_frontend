export function repeatTeamItemTemplate(parent: any, index: number, key: string): Record<string, any> {
  return {
    name: `Team Member ${index + 1}`,
    role: 'Team Member',
    department: 'Department',
    experience: '',
    bio: 'Add a short professional introduction for this team member.',
    skills: '',
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
  };
}
