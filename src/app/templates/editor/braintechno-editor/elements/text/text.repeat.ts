export function repeatTextItemTemplate(parent: any, index: number, key: string): Record<string, any> {
  return {
    id: `${String(parent?.type || 'text')}-item-${Date.now()}-${index}`,
    text: `Checklist item ${index + 1}`,
    icon: 'check_circle'
  };
}
