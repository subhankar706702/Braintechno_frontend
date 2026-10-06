import {
  Injectable,
  inject,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Observable,
} from 'rxjs';

import {
  API_BASE_URL,
} from '../../core/api.config';

export type SocialPlatform =
  | 'Facebook'
  | 'Instagram'
  | 'LinkedIn'
  | 'Google Business Profile';

export interface SocialAccount {
  id: string;

  platform:
    SocialPlatform;

  accountName: string;

  pageName: string;

  status:
    | 'Connected'
    | 'Not Connected'
    | 'Expired'
    | 'Error'
    | string;

  tokenExpiresAt:
    string | null;

  externalAccountId:
    string;
}

interface OAuthStartResponse {
  authorizationUrl: string;
}

export interface FacebookPageOption {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocialAccountService {
  private readonly http =
    inject(HttpClient);

  private readonly baseUrl =
    `${API_BASE_URL}/social`;

  getAccounts():
    Observable<SocialAccount[]> {
    return this.http.get<
      SocialAccount[]
    >(
      `${this.baseUrl}/accounts`,
    );
  }

  startInstagramOAuth():
    Observable<OAuthStartResponse> {
    return this.http.post<
      OAuthStartResponse
    >(
      `${this.baseUrl}/oauth/instagram/start`,
      {},
    );
  }

  startFacebookOAuth():
    Observable<OAuthStartResponse> {
    return this.http.post<
      OAuthStartResponse
    >(
      `${this.baseUrl}/oauth/facebook/start`,
      {},
    );
  }

  getFacebookPages(
    selectionToken: string,
  ): Observable<{
    pages: FacebookPageOption[];
  }> {
    return this.http.get<{
      pages: FacebookPageOption[];
    }>(
      `${this.baseUrl}/oauth/facebook/pages`,
      {
        params: {
          selectionToken,
        },
      },
    );
  }

  selectFacebookPage(
    selectionToken: string,
    pageId: string,
  ): Observable<{
    message: string;
  }> {
    return this.http.post<{
      message: string;
    }>(
      `${this.baseUrl}/oauth/facebook/pages/select`,
      {
        selectionToken,
        pageId,
      },
    );
  }

  disconnectAccount(
    id: string,
  ): Observable<{
    message: string;
  }> {
    return this.http.delete<{
      message: string;
    }>(
      `${this.baseUrl}/accounts/${encodeURIComponent(id)}`,
    );
  }
}