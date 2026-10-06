import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'google_business';

export type BackendSocialPlatform =
  | 'Facebook'
  | 'Instagram'
  | 'LinkedIn'
  | 'Google Business Profile';

export type SocialAccountStatus =
  | 'Connected'
  | 'Not Connected'
  | 'Expired'
  | 'Error';

export interface SocialAccount {
  id: string;
  platform: BackendSocialPlatform;
  accountName: string;
  pageName: string;
  status: SocialAccountStatus | string;
  tokenExpiresAt: string | null;
}

export interface ConnectSocialAccountPayload {
  platform: BackendSocialPlatform;
  accountName: string;
  pageName?: string;
  externalAccountId: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocialAccountService {
  private readonly http = inject(HttpClient);

  /*
   * platform.routes.corrected.ts exposes:
   *
   * GET    /social/accounts
   * POST   /social/accounts/connect
   * PATCH  /social/accounts/:id
   * DELETE /social/accounts/:id
   *
   * The existing backend platform router is mounted under /api/platform.
   */
  private readonly baseUrl = '/api/platform/social/accounts';

  getAccounts(): Observable<SocialAccount[]> {
    return this.http.get<SocialAccount[]>(this.baseUrl);
  }

  connectAccount(
    payload: ConnectSocialAccountPayload
  ): Observable<SocialAccount> {
    return this.http.post<SocialAccount>(
      `${this.baseUrl}/connect`,
      payload
    );
  }

  updateAccount(
    id: string,
    payload: {
      accountName?: string;
      pageName?: string;
    }
  ): Observable<SocialAccount> {
    return this.http.patch<SocialAccount>(
      `${this.baseUrl}/${encodeURIComponent(id)}`,
      payload
    );
  }

  disconnectAccount(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${encodeURIComponent(id)}`
    );
  }
}