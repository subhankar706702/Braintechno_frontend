import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { BusinessProfileAccount, BusinessProfileData, BusinessProfileService, BusinessDayHours, BusinessProfileResponse } from './business-profile.service';
import { CommonApiService } from '../../core/common.service';


interface StepItem {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
}

interface DayItem {
  key: string;
  label: string;
}

@Component({
  selector: 'bt-business-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './business-profile.page.html',
  styleUrl: './business-profile.page.scss'
})
export class BusinessProfilePage implements OnInit {
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly success = signal('');
  readonly activeStep = signal(1);

  readonly steps: StepItem[] = [
    { id: 1, title: 'Business Information', shortTitle: 'Business', description: 'Core information customers use to identify your business.', icon: 'storefront' },
    { id: 2, title: 'Business Contact', shortTitle: 'Contact', description: 'Choose the phone and WhatsApp numbers customers can contact.', icon: 'call' },
    { id: 3, title: 'Business Location', shortTitle: 'Location', description: 'Add your service area, shop address or online business location.', icon: 'location_on' },
    { id: 4, title: 'Business Hours', shortTitle: 'Hours', description: 'Let customers know when your business is available.', icon: 'schedule' },
    { id: 5, title: 'Social & Online Presence', shortTitle: 'Social', description: 'Connect your social profiles and business website.', icon: 'language' },
    { id: 6, title: 'Branding', shortTitle: 'Branding', description: 'Finish your profile with cover imagery and brand colours.', icon: 'palette' }
  ];

  readonly days: DayItem[] = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  businessCategories: any = [];
  selectedBusinessCategory = '';

  readonly indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  account: BusinessProfileAccount = {
    id: '', accountId: '', businessName: '', businessSlug: '', ownerName: '',
    ownerMobileNumber: '', email: '', businessCategory: ''
  };

  profile: BusinessProfileData = this.emptyProfile();

  constructor(
    private profileApi: BusinessProfileService,
    private router: Router,
    private commonService: CommonApiService
  ) { }

  ngOnInit(): void {
    this.loadBusinessCategories();
    this.loadProfile();
  }

  private loadBusinessCategories(): void {
    this.commonService.getbusinessCategorys().subscribe({
      next: (response) => {
        this.businessCategories =
          Array.isArray(response?.data)
            ? response.data
            : [];
      },
      error: (error) => {
        this.businessCategories = [];
      },
    });
  }

  get currentStep(): StepItem {
    return this.steps[this.activeStep() - 1];
  }

  get initials(): string {
    const words = String(this.account.businessName || 'B').trim().split(/\s+/).filter(Boolean);
    return words.slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join('') || 'B';
  }

  get publicUrl(): string {
    return this.account.businessSlug
      ? `braintechno.in/${this.account.businessSlug}`
      : 'Public URL will appear here';
  }

  loadProfile(): void {
    this.loading.set(true);
    this.error.set('');

    this.profileApi.getProfile().subscribe({
      next: (response) => {
        this.applyResponse(response);
        this.activeStep.set(this.normalizedStep(response.profile.currentStep));
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error?.error?.message || 'Unable to load your business profile.');
        this.loading.set(false);
      }
    });
  }

  goToStep(step: number): void {
    if (step < 1 || step > 6 || this.saving()) return;
    this.activeStep.set(step);
    this.clearMessages();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previous(): void {
    if (this.activeStep() > 1) this.goToStep(this.activeStep() - 1);
  }

  saveAndContinue(): void {
    if (this.saving()) return;
    const validationMessage = this.validateCurrentStep();
    if (validationMessage) {
      this.error.set(validationMessage);
      return;
    }

    const step = this.activeStep();
    this.saving.set(true);
    this.clearMessages();

    this.profileApi.updateStep(step, this.payloadForStep(step)).subscribe({
      next: (response) => {
        this.applyResponse(response);
        this.saving.set(false);
        this.success.set(step === 6 ? 'Business profile saved successfully.' : 'Saved. Your profile is up to date.');

        if (step < 6) {
          this.activeStep.set(step + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: (error) => {
        this.saving.set(false);
        this.error.set(error?.error?.message || 'Unable to save this step. Please try again.');
      }
    });
  }

  finish(): void {
    this.saveAndContinue();
  }

  backToDashboard(): void {
    void this.router.navigateByUrl('/app/dashboard');
  }

  copyBusinessMobileToWhatsApp(): void {
    this.profile.businessWhatsAppNumber = this.profile.businessMobileNumber;
  }

  dayHours(key: string): BusinessDayHours {
    return this.profile.businessHours[key];
  }

  onLogoSelected(event: Event): void {
    this.readImage(event, (value) => this.profile.businessLogo = value);
  }

  onCoverSelected(event: Event): void {
    this.readImage(event, (value) => this.profile.coverImage = value);
  }

  removeLogo(): void {
    this.profile.businessLogo = '';
  }

  removeCover(): void {
    this.profile.coverImage = '';
  }

  private readImage(event: Event, assign: (value: string) => void): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.error.set('Please choose an image file.');
      input.value = '';
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      this.error.set('Please choose an image smaller than 3 MB.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      assign(String(reader.result || ''));
      this.error.set('');
      input.value = '';
    };
    reader.onerror = () => this.error.set('Unable to read the selected image.');
    reader.readAsDataURL(file);
  }

  private validateCurrentStep(): string {
    if (this.activeStep() === 1 && !this.account.businessCategory.trim()) {
      return 'Please select a business category.';
    }

    if (this.activeStep() === 2) {
      const mobile = this.profile.businessMobileNumber.trim();
      const whatsapp = this.profile.businessWhatsAppNumber.trim();
      if (mobile && !/^\d{10}$/.test(mobile)) return 'Business mobile number must be 10 digits.';
      if (whatsapp && !/^\d{10}$/.test(whatsapp)) return 'WhatsApp number must be 10 digits.';
    }

    if (this.activeStep() === 3) {
      const pin = this.profile.pinCode.trim();
      if (pin && !/^\d{6}$/.test(pin)) return 'PIN code must be 6 digits.';
    }

    return '';
  }

  private payloadForStep(step: number): Record<string, unknown> {
    switch (step) {
      case 1:
        return {
          businessCategory: this.account.businessCategory,
          businessLogo: this.profile.businessLogo,
          tagline: this.profile.tagline,
          aboutBusiness: this.profile.aboutBusiness
        };
      case 2:
        return {
          businessMobileNumber: this.profile.businessMobileNumber,
          businessWhatsAppNumber: this.profile.businessWhatsAppNumber
        };
      case 3:
        return {
          address: this.profile.address,
          area: this.profile.area,
          city: this.profile.city,
          state: this.profile.state,
          pinCode: this.profile.pinCode,
          googleMapsUrl: this.profile.googleMapsUrl
        };
      case 4:
        return {
          businessHoursEnabled: this.profile.businessHoursEnabled,
          businessHours: this.profile.businessHours
        };
      case 5:
        return { socialLinks: this.profile.socialLinks };
      case 6:
        return {
          coverImage: this.profile.coverImage,
          brandColors: this.profile.brandColors
        };
      default:
        return {};
    }
  }

  private applyResponse(response: BusinessProfileResponse): void {
    this.account = { ...response.account };
    const defaults = this.emptyProfile();
    this.profile = {
      ...defaults,
      ...response.profile,
      businessHours: { ...defaults.businessHours, ...(response.profile.businessHours || {}) },
      socialLinks: { ...defaults.socialLinks, ...(response.profile.socialLinks || {}) },
      brandColors: { ...defaults.brandColors, ...(response.profile.brandColors || {}) },
      completedSteps: [...(response.profile.completedSteps || [])]
    };
  }

  private normalizedStep(value: number): number {
    return Math.min(6, Math.max(1, Number(value) || 1));
  }

  private clearMessages(): void {
    this.error.set('');
    this.success.set('');
  }

  private emptyProfile(): BusinessProfileData {
    const day = (): BusinessDayHours => ({ closed: false, open: '09:00', close: '18:00' });
    return {
      businessLogo: '', tagline: '', aboutBusiness: '', businessMobileNumber: '',
      businessWhatsAppNumber: '', address: '', area: '', city: '', state: '', pinCode: '',
      googleMapsUrl: '', businessHoursEnabled: false,
      businessHours: {
        monday: day(), tuesday: day(), wednesday: day(), thursday: day(),
        friday: day(), saturday: day(), sunday: day()
      },
      socialLinks: { facebook: '', instagram: '', youtube: '', website: '' },
      coverImage: '',
      brandColors: { primary: '#ff4d6d', secondary: '#38bdf8' },
      profileCompletion: 0, completedSteps: [], currentStep: 1
    };
  }
}
