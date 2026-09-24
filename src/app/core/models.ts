export interface AuthUser {
  id: string;
  accountId: string | number;
  name?: string;
  ownerName?: string;
  email: string;
  businessId?: string;
  businessName?: string;
  businessCategory?: string;
  role: 'owner' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface TemplateDraft {
  id: string;
  _id?: string;
  accountId?: string | number;
  name: string;
  description: string;
  design: unknown;
  html: string;
  previewImage?: string;
  previewImageName?: string;
  updatedAt: string;
  createdAt: string;
  status: 'draft' | 'published' | 'locked';
  businessId?: string;
}

export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'published'
  | 'expired'
  | 'unpublished';

export type CampaignCategory =
  | 'business_main_page'
  | 'discount_offer'
  | 'festival_offer'
  | 'product_promotion'
  | 'service_promotion'
  | 'event_promotion'
  | 'limited_time_offer'
  | 'other';

export interface CampaignInteractive {
  type?: 'standard' | 'invitation';
  coverTitle?: string;
  coverSubtitle?: string;
  openButtonLabel?: string;
}

export interface CampaignCycle {
  cycleNumber: number;
  startedAt: string;
  endedAt?: string | null;
  status: CampaignStatus;
  publishAt?: string | null;
  endAt?: string | null;
  publishedAt?: string | null;
}

export interface Campaign {
  id?: string;
  _id?: string;
  businessId?: string;
  businessSlug?: string;
  publicSlug?: string;
  fullSlug?: string;
  name: string;
  pageSlug: string;
  category: CampaignCategory;
  templateId: string;
  templateName?: string;
  html?: string;
  design?: unknown;
  description?: string;
  status: CampaignStatus;
  publishAt?: string | null;
  endAt?: string | null;
  publishedAt?: string | null;
  cycleNumber?: number;
  cycleStartedAt?: string;
  cycles?: CampaignCycle[];
  createdAt?: string;
  updatedAt?: string;
  interactive?: CampaignInteractive;
}

export interface CampaignContext {
  businessId: string;
  businessName: string;
  businessSlug: string;
}

export interface AdminSummary {
  businesses: number;
  users: number;
  templates: number;
  pages: number;
  campaigns: number;
  interactions: number;
}
