import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import {
  AuthService,
  RegistrationAvailabilityResponse
} from '../../core/auth.service';
import { MaterialModule } from '../../shared/material/material.module';
import { SnackbarService } from '../../shared/material/notification/snackbar.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MaterialModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy {
  termsAccepted = false;

  ownerName = '';
  mobile = '';
  email = '';
  businessName = '';
  businessCategory = '';
  businessSlug = '';

  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  loading = false;
  checkingAvailability = false;
  checkingSlug = false;

  error = '';

  mobileAvailable: boolean | null = null;
  emailAvailable: boolean | null = null;
  slugAvailable: boolean | null = null;
  slugRecommendations: string[] = [];

  private slugWasManuallyEdited = false;
  private slugCheckTimer: ReturnType<typeof setTimeout> | null = null;

  businessCategorys = [
    'General',
    'Food & Beverage',
    'Grocery & Daily Needs',
    'Fashion & Clothing',
    'Beauty & Personal Care',
    'Health & Medical',
    'Education & Training',
    'Home & Living',
    'Construction & Property',
    'Automobile',
    'Electronics & Technology',
    'Retail & Shopping',
    'Jewellery & Accessories',
    'Art, Craft & Handmade',
    'Photography & Media',
    'Events & Wedding',
    'Travel & Hospitality',
    'Professional Services',
    'Marketing & Creative Services',
    'Repair & Maintenance',
    'Home Services',
    'Real Estate',
    'Automotive',
    'Fashion & Apparel',
    'Sports & Recreation',
    'Arts & Culture',
    'Non-Profit & Charity',
    'Fitness & Sports',
    'Pet & Animal Services',
    'Agriculture & Farming',
    'Manufacturing & Wholesale',
    'Logistics & Delivery',
    'Online & E-commerce',
    'Religious & Cultural Services',
    'Others'
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackbar: SnackbarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    if (this.slugCheckTimer) {
      clearTimeout(this.slugCheckTimer);
    }
  }

  get publicSlugPreview(): string {
    const slug = this.normalizeSlug(this.businessSlug);
    return slug
      ? `https://www.braintechno.in/${slug}`
      : 'https://www.braintechno.in/';
  }

  get canSubmit(): boolean {
    return !this.loading && !this.checkingAvailability && this.termsAccepted;
  }

  onBusinessNameInput(): void {
    if (!this.slugWasManuallyEdited) {
      this.businessSlug = this.normalizeSlug(this.businessName);
    }

    this.slugAvailable = null;
    this.slugRecommendations = [];
    this.queueSlugAvailabilityCheck();
  }

  onSlugInput(): void {
    this.slugWasManuallyEdited = true;
    this.businessSlug = this.normalizeSlug(this.businessSlug);
    this.slugAvailable = null;
    this.slugRecommendations = [];
    this.queueSlugAvailabilityCheck();
  }

  checkMobileAvailability(): void {
    const mobile = this.mobile.trim();

    if (!/^\d{10}$/.test(mobile)) {
      this.mobileAvailable = null;
      return;
    }

    this.checkAvailability({ mobile });
  }

  checkEmailAvailability(): void {
    const email = this.email.trim().toLowerCase();

    if (!this.isValidEmail(email)) {
      this.emailAvailable = null;
      return;
    }

    this.checkAvailability({ email });
  }

  useSuggestedSlug(slug: string): void {
    this.slugWasManuallyEdited = true;
    this.businessSlug = this.normalizeSlug(slug);
    this.slugAvailable = null;
    this.slugRecommendations = [];
    this.checkSlugAvailability();
  }

  submit(): void {
    if (this.loading) {
      return;
    }

    this.error = '';

    if (!this.termsAccepted) {
      this.snackbar.warning(
        'Please accept the Terms & Conditions and Privacy Policy.'
      );
      return;
    }

    if (!this.ownerName.trim()) {
      this.snackbar.warning('Owner name is required.');
      return;
    }

    if (!/^\d{10}$/.test(this.mobile.trim())) {
      this.snackbar.warning('Mobile number must be exactly 10 digits.');
      return;
    }

    if (!this.isValidEmail(this.email.trim().toLowerCase())) {
      this.snackbar.warning('Please enter a valid email address.');
      return;
    }

    if (!this.businessName.trim()) {
      this.snackbar.warning('Business name is required.');
      return;
    }

    const normalizedSlug = this.normalizeSlug(this.businessSlug || this.businessName);

    if (!normalizedSlug) {
      this.snackbar.warning('Business slug is required.');
      return;
    }

    if (!this.businessCategory) {
      this.snackbar.warning('Please select a business category.');
      return;
    }

    if (this.password.length < 8) {
      this.snackbar.warning('Password must be at least 8 characters.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.snackbar.warning('Password and confirm password do not match.');
      return;
    }

    this.businessSlug = normalizedSlug;
    this.checkingAvailability = true;

    this.auth
      .checkRegistrationAvailability({
        mobile: this.mobile.trim(),
        email: this.email.trim().toLowerCase(),
        businessSlug: this.businessSlug,
        businessName: this.businessName.trim()
      })
      .pipe(
        finalize(() => {
          this.checkingAvailability = false;
          this.refreshView();
        })
      )
      .subscribe({
        next: (result:any) => {
          this.applyAvailability(result);

          if (!result.mobileAvailable) {
            this.snackbar.warning(
              result.mobileMessage ||
                'This mobile number is already registered.'
            );
            return;
          }

          if (!result.emailAvailable) {
            this.snackbar.warning(
              result.emailMessage ||
                'This email address is already registered.'
            );
            return;
          }

          if (!result.slugAvailable) {
            this.snackbar.warning(
              result.slugMessage ||
                'This business slug is already in use. Choose another one.'
            );
            return;
          }

          this.createAccount();
        },
        error: (err) => {
          this.snackbar.fromApiError(
            err,
            'Could not validate registration details.'
          );
        }
      });
  }

  private createAccount(): void {
    this.loading = true;
    this.error = '';

    this.auth
      .register(
        this.ownerName.trim(),
        this.mobile.trim(),
        this.email.trim().toLowerCase(),
        this.password,
        this.businessName.trim(),
        this.businessCategory,
        this.businessSlug
      )
      .pipe(
        finalize(() => {
          this.loading = false;
          this.refreshView();
        })
      )
      .subscribe({
        next: () => {
          this.snackbar.success('Your account has been created successfully.');
          void this.router.navigateByUrl('/app/dashboard');
        },
        error: (err) => {
          const recommendations = Array.isArray(err?.error?.slugRecommendations)
            ? err.error.slugRecommendations
            : [];

          if (recommendations.length) {
            this.slugAvailable = false;
            this.slugRecommendations = recommendations;
          }

          this.snackbar.fromApiError(
            err,
            'Registration failed. Please try again.'
          );
        }
      });
  }

  private queueSlugAvailabilityCheck(): void {
    if (this.slugCheckTimer) {
      clearTimeout(this.slugCheckTimer);
    }

    const slug = this.normalizeSlug(this.businessSlug);

    if (!slug) {
      this.checkingSlug = false;
      return;
    }

    this.slugCheckTimer = setTimeout(() => {
      this.checkSlugAvailability();
    }, 450);
  }

  private checkSlugAvailability(): void {
    const businessSlug = this.normalizeSlug(this.businessSlug);

    if (!businessSlug) {
      this.slugAvailable = null;
      this.slugRecommendations = [];
      return;
    }

    this.checkingSlug = true;

    this.auth
      .checkRegistrationAvailability({
        businessSlug,
        businessName: this.businessName.trim()
      })
      .pipe(
        finalize(() => {
          this.checkingSlug = false;
          this.refreshView();
        })
      )
      .subscribe({
        next: (result) => {
          this.applyAvailability(result);
        },
        error: (err) => {
          this.slugAvailable = null;
          this.slugRecommendations = [];
          this.snackbar.fromApiError(
            err,
            'Could not check business slug availability.'
          );
        }
      });
  }

  private checkAvailability(payload: {
    mobile?: string;
    email?: string;
  }): void {
    this.auth
      .checkRegistrationAvailability(payload)
      .subscribe({
        next: (result) => {
          this.applyAvailability(result);
          this.refreshView();
        },
        error: (err) => {
          this.snackbar.fromApiError(
            err,
            'Could not check registration availability.'
          );
        }
      });
  }

  private applyAvailability(result: RegistrationAvailabilityResponse): void {
    if (result.mobileAvailable !== null) {
      this.mobileAvailable = result.mobileAvailable;
    }

    if (result.emailAvailable !== null) {
      this.emailAvailable = result.emailAvailable;
    }

    if (result.slugAvailable !== null) {
      this.slugAvailable = result.slugAvailable;
      this.slugRecommendations = result.slugAvailable
        ? []
        : result.slugRecommendations || [];
    }

    if (result.normalizedSlug) {
      this.businessSlug = result.normalizedSlug;
    }
  }

  private normalizeSlug(value: string): string {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private refreshView(): void {
    try {
      this.cdr.detectChanges();
    } catch {
      // Navigation may destroy the component immediately after success.
    }
  }
}
