import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../../core/api.config';


export interface BusinessProfileAccount {
  id: string;
  accountId: string | number;
  businessName: string;
  businessSlug: string;
  ownerName: string;
  ownerMobileNumber: string;
  email: string;
  businessCategory: string;
}

export interface BusinessDayHours {
  closed: boolean;
  open: string;
  close: string;
}

export interface BusinessProfileData {
  _id?: string;
  businessLogo: string;
  tagline: string;
  aboutBusiness: string;
  businessMobileNumber: string;
  businessWhatsAppNumber: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  googleMapsUrl: string;
  businessHoursEnabled: boolean;
  businessHours: Record<string, BusinessDayHours>;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    website: string;
  };
  coverImage: string;
  brandColors: {
    primary: string;
    secondary: string;
  };
  profileCompletion: number;
  completedSteps: number[];
  currentStep: number;
}

export interface BusinessProfileResponse {
  account: BusinessProfileAccount;
  profile: BusinessProfileData;
}

@Injectable({ providedIn: 'root' })
export class BusinessProfileService {
  private readonly profileSignal = signal<BusinessProfileResponse | null>(null);
  readonly profile = this.profileSignal.asReadonly();

  constructor(private http: HttpClient) {}

  getProfile(): Observable<BusinessProfileResponse> {
    return this.http.get<BusinessProfileResponse>(
      `${API_BASE_URL}/business/profile`
    ).pipe(
      tap((response:any) => this.profileSignal.set(response))
    );
  }

  updateStep(
    step: number,
    payload: Record<string, unknown>
  ): Observable<BusinessProfileResponse> {
    return this.http.patch<BusinessProfileResponse>(
      `${API_BASE_URL}/business/profile`,
      { step, ...payload }
    ).pipe(
      tap((response:any) => this.profileSignal.set(response))
    );
  }
}
