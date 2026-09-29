import { getFloatingActionDefaults } from './floating.factory';

export function repeatFloatingItemTemplate(_parent: any, index: number, _key: string): Record<string, any> {
  return {
    ...getFloatingActionDefaults('custom'),
    label: `Action ${index + 1}`,
    icon: 'touch_app',
    image: ''
  };
}
