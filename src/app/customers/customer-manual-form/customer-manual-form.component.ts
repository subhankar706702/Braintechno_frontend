import {
  CommonModule
} from '@angular/common';

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MediaPickerComponent
} from '../../shared/media-picker/media-picker.component';

import {
  MediaLibraryItem
} from '../../core/media-library.service';

import {
  CustomerApiService,
  CustomerItem,
  CustomerSource,
  CustomerType
} from '../../core/customer-api.service';

import {
  finalize,
  forkJoin,
  of
} from 'rxjs';

@Component({
  selector: 'app-customer-manual-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MediaPickerComponent
  ],
  templateUrl: './customer-manual-form.component.html',
  styleUrl: './customer-manual-form.component.scss'
})
export class CustomerManualFormComponent implements OnChanges {

  @Input({ required: true })
  accountId!: string | number;

  @Input()
  open = false;

  @Input()
  customer: CustomerItem | null = null;

  @Output()
  closed = new EventEmitter<void>();

  @Output()
  saved = new EventEmitter<CustomerItem>();

  readonly submitting = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  customerTypes: CustomerType[] = [];
  customerSources: CustomerSource[] = [];

  name = '';
  mobile = '';
  email = '';
  customerType: CustomerType = '';
  source: CustomerSource = '';
  image = '';

  mediaPickerOpen = false;

  private formOpenSequence = 0;

  constructor(
    private readonly customerApi: CustomerApiService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.open) {
      return;
    }

    if (changes['open'] || changes['customer']) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    const sequence = ++this.formOpenSequence;

    this.error.set('');
    this.success.set('');

    this.populateCustomerData();

    this.customerApi.options().subscribe({
      next: options => {
        if (sequence !== this.formOpenSequence) {
          return;
        }

        this.customerTypes = Array.isArray(options?.customerTypes)
          ? options.customerTypes.filter(
              value =>
                typeof value === 'string' &&
                value.trim().length > 0
            )
          : [];

        this.customerSources = Array.isArray(options?.customerSources)
          ? options.customerSources.filter(
              value =>
                typeof value === 'string' &&
                value.trim().length > 0
            )
          : [];

        this.applyBackendOptions();
      },

      error: err => {
        if (sequence !== this.formOpenSequence) {
          return;
        }

        console.error('Customer options API failed:', err);

        this.customerTypes = [];
        this.customerSources = [];

        if (!this.customer) {
          this.error.set(
            err?.error?.message ||
            'Could not load customer options.'
          );
        }
      }
    });
  }

  private populateCustomerData(): void {
    if (!this.customer) {
      this.name = '';
      this.mobile = '';
      this.email = '';
      this.customerType = '';
      this.source = '';
      this.image = '';
      return;
    }

    const customer = this.customer;

    this.name = customer.name ?? '';
    this.mobile = customer.mobile ?? '';
    this.email = customer.email ?? '';
    this.customerType = customer.customerType ?? '';
    this.source = customer.source ?? '';
    this.image = customer.image ?? '';
  }

  private applyBackendOptions(): void {
    if (this.customer) {
      const existingType = this.customer.customerType;

      if (
        existingType &&
        this.customerTypes.includes(existingType)
      ) {
        this.customerType = existingType;
      } else if (
        !this.customerType &&
        this.customerTypes.length
      ) {
        this.customerType = this.customerTypes[0];
      }
    } else {
      this.customerType = this.customerTypes[0] || '';
    }

    this.source = this.getManualSource();
  }

  private getManualSource(): CustomerSource {
    const manualSource = this.customerSources.find(
      source =>
        source.trim().toLowerCase() === 'manual'
    );

    return manualSource || this.customerSources[0] || '';
  }

  get isEditMode(): boolean {
    return !!this.customer;
  }

  openImagePicker(): void {
    if (this.submitting()) {
      return;
    }

    this.mediaPickerOpen = true;
  }

  closeImagePicker(): void {
    this.mediaPickerOpen = false;
  }

  onImageSelected(items: MediaLibraryItem[]): void {
    const item = items?.[0];

    if (!item) {
      return;
    }

    this.image = item.url || '';
    this.mediaPickerOpen = false;
  }

  close(): void {
    if (this.submitting()) {
      return;
    }

    ++this.formOpenSequence;

    this.resetForm();
    this.closed.emit();
  }

  submit(): void {
    if (this.submitting()) {
      return;
    }

    this.error.set('');
    this.success.set('');

    const name = this.name.trim();
    const mobile = this.mobile.trim();
    const email = this.email.trim().toLowerCase();
    const image = this.image.trim();

    if (!name && !mobile && !email) {
      this.error.set(
        'Enter at least a name, mobile number or email.'
      );
      return;
    }

    if (email && !this.isValidEmail(email)) {
      this.error.set('Enter a valid email address.');
      return;
    }

    if (mobile && !this.isValidMobile(mobile)) {
      this.error.set('Enter a valid mobile number.');
      return;
    }

    if (!this.customerType) {
      this.error.set('Please select a customer type.');
      return;
    }

    const manualSource = this.getManualSource();

    if (!manualSource) {
      this.error.set('Customer source is not available.');
      return;
    }

    this.submitting.set(true);

    const accountId = this.accountId;
    const excludeId = this.customer?.id || '';

    forkJoin({
      mobile: mobile
        ? this.customerApi.list({
            accountId,
            page: 1,
            limit: 100,
            search: mobile,
            sort: 'newest'
          })
        : of(null),

      email: email
        ? this.customerApi.list({
            accountId,
            page: 1,
            limit: 100,
            search: email,
            sort: 'newest'
          })
        : of(null)
    }).subscribe({
      next: result => {
        const duplicateMobile =
          !!mobile &&
          !!result.mobile?.items?.some(
            item =>
              item.id !== excludeId &&
              this.normalizeMobile(item.mobile) ===
                this.normalizeMobile(mobile)
          );

        const duplicateEmail =
          !!email &&
          !!result.email?.items?.some(
            item =>
              item.id !== excludeId &&
              this.normalizeEmail(item.email) ===
                this.normalizeEmail(email)
          );

        if (duplicateMobile || duplicateEmail) {
          const messages: string[] = [];

          if (duplicateMobile) {
            messages.push(
              `This mobile number (${mobile}) is already added in your contact list.`
            );
          }

          if (duplicateEmail) {
            messages.push(
              `This email (${email}) is already added in your contact list.`
            );
          }

          this.error.set(messages.join(' '));
          this.submitting.set(false);
          return;
        }

        this.saveCustomer({
          accountId,
          name,
          mobile,
          email,
          customerType: this.customerType,
          source: manualSource,
          image
        });
      },

      error: err => {
        this.submitting.set(false);
        this.error.set(
          err?.error?.message ||
          'Could not check your contact list. Please try again.'
        );
      }
    });
  }

  private saveCustomer(payload: {
    accountId: string | number;
    name: string;
    mobile: string;
    email: string;
    customerType: CustomerType;
    source: CustomerSource;
    image: string;
  }): void {
    const request = this.customer
      ? this.customerApi.update(this.customer.id, payload)
      : this.customerApi.create(payload);

    request
      .pipe(
        finalize(() => this.submitting.set(false))
      )
      .subscribe({
        next: (customer: CustomerItem) => {
          this.success.set(
            this.isEditMode
              ? 'Customer updated successfully.'
              : 'Customer added successfully.'
          );

          this.saved.emit(customer);

          setTimeout(() => {
            this.resetForm();
            this.closed.emit();
          }, 250);
        },

        error: err => {
          this.error.set(
            err?.error?.message ||
            (
              this.isEditMode
                ? 'Could not update customer. Please try again.'
                : 'Could not add customer. Please try again.'
            )
          );
        }
      });
  }

  private normalizeMobile(
    value: string | null | undefined
  ): string {
    return String(value || '').replace(/\D/g, '');
  }

  private normalizeEmail(
    value: string | null | undefined
  ): string {
    return String(value || '')
      .trim()
      .toLowerCase();
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private isValidMobile(value: string): boolean {
    const normalized = value.replace(/[\s()+-]/g, '');
    return /^\d{8,15}$/.test(normalized);
  }

  private resetForm(): void {
    this.name = '';
    this.mobile = '';
    this.email = '';
    this.customerType = this.customerTypes[0] || '';
    this.source = this.getManualSource();
    this.image = '';

    this.error.set('');
    this.success.set('');
    this.mediaPickerOpen = false;
  }
}
