import { Injectable, signal } from '@angular/core';

export type CatalogTier = 'default' | 'new' | 'standard' | 'pro' | 'custom' | 'upcoming';
export type AccountPlan = 'default' | 'standard' | 'pro';

export interface CatalogMeta {
  tier: CatalogTier;
  category?: string;
  subcategory?: string;
}

@Injectable({ providedIn: 'root' })
export class ElementCatalogService {
  private readonly planState = signal<AccountPlan>('default');
  readonly plan = this.planState.asReadonly();

  /**
   * This service is intentionally the single source of truth for editor
   * design tags/access. Replace this local map with an API response later
   * without changing the editor UI.
   */
  private readonly catalog = new Map<string, CatalogMeta>([
    // ['navbar:simple', { tier: 'default', category: 'Navigation', subcategory: 'Navbar' }],
    // ['navbar:centered', { tier: 'new', category: 'Navigation', subcategory: 'Navbar' }],
    // ['navbar:minimal', { tier: 'default', category: 'Navigation', subcategory: 'Navbar' }],
    // ['navbar:sticky', { tier: 'standard', category: 'Navigation', subcategory: 'Navbar' }],
    // ['navbar:cta', { tier: 'standard', category: 'Navigation', subcategory: 'Navbar' }],
    // ['navbar:shop', { tier: 'pro', category: 'Navigation', subcategory: 'Navbar' }],
    // ['navbar:compact', { tier: 'custom', category: 'Navigation', subcategory: 'Navbar' }],
    // ['navbar:mega', { tier: 'upcoming', category: 'Navigation', subcategory: 'Navbar' }],

    // ['hero:centered', { tier: 'default', category: 'Hero', subcategory: 'General' }],
    // ['hero:split', { tier: 'new', category: 'Hero', subcategory: 'General' }],
    // ['hero:image', { tier: 'default', category: 'Hero', subcategory: 'Image' }],
    // ['hero:gradient', { tier: 'standard', category: 'Hero', subcategory: 'Marketing' }],
    // ['hero:offer', { tier: 'standard', category: 'Hero', subcategory: 'Commerce' }],
    // ['hero:minimal', { tier: 'custom', category: 'Hero', subcategory: 'General' }],
    // ['hero:app', { tier: 'pro', category: 'Hero', subcategory: 'Product' }],
    // ['hero:saas', { tier: 'pro', category: 'Hero', subcategory: 'Product' }],
    // ['hero:event', { tier: 'new', category: 'Hero', subcategory: 'Campaign' }],
    // ['hero:agency', { tier: 'pro', category: 'Hero', subcategory: 'Business' }],
    // ['hero:portfolio', { tier: 'custom', category: 'Hero', subcategory: 'Portfolio' }],
    // ['hero:video', { tier: 'upcoming', category: 'Hero', subcategory: 'Media' }],

    // ['services:three', { tier: 'default', category: 'Business', subcategory: 'Services' }],
    // ['services:four', { tier: 'default', category: 'Business', subcategory: 'Services' }],
    // ['services:icons', { tier: 'new', category: 'Business', subcategory: 'Services' }],
    // ['services:minimal', { tier: 'custom', category: 'Business', subcategory: 'Services' }],
    // ['services:numbers', { tier: 'standard', category: 'Business', subcategory: 'Services' }],
    // ['services:two', { tier: 'default', category: 'Business', subcategory: 'Services' }],
    // ['services:soft', { tier: 'standard', category: 'Business', subcategory: 'Services' }],
    // ['services:carousel', { tier: 'pro', category: 'Business', subcategory: 'Services' }],
    // ['services:media', { tier: 'new', category: 'Business', subcategory: 'Services' }],
    // ['services:showcase', { tier: 'pro', category: 'Business', subcategory: 'Services' }],
    // ['services:booking', { tier: 'upcoming', category: 'Business', subcategory: 'Services' }],
  ]);

  setPlan(plan: AccountPlan): void {
    this.planState.set(plan);
  }

  meta(type: string, key: string): CatalogMeta {
    return this.catalog.get(`${type}:${key}`) ?? {
      tier: 'default',
      category: 'Elements',
      subcategory: type,
    };
  }

  canUse(type: string, key: string): boolean {
    const tier = this.meta(type, key).tier;
    const plan = this.planState();

    if (tier === 'upcoming') return false;
    if (tier === 'pro') return plan === 'pro';
    if (tier === 'standard') return plan === 'standard' || plan === 'pro';
    return true;
  }

  label(type: string, key: string): string {
    const tier = this.meta(type, key).tier;
    switch (tier) {
      case 'new': return 'New';
      case 'standard': return 'Standard';
      case 'pro': return 'Pro';
      case 'custom': return 'Custom';
      case 'upcoming': return 'Upcoming';
      default: return '';
    }
  }

  isHiddenPreset(key: string): boolean {
    // User requested no forced dark presets. Existing saved designs using
    // those variants still render; they are simply not offered as presets.
    return key === 'dark';
  }
}
