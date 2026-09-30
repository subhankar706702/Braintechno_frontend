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
  finalize,
  forkJoin,
  of
} from 'rxjs';
import { CustomerItem, CustomerType, CustomerSource, CustomerApiService } from '../../core/customer-api.service';
import { CustomerType as CustomerTypeEnum } from '../../shared/enums/customer-type.enum';



@Component({
  selector:
    'app-customer-manual-form',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MediaPickerComponent
  ],

  templateUrl:
    './customer-manual-form.component.html',

  styleUrl:
    './customer-manual-form.component.scss'
})
export class CustomerManualFormComponent implements OnChanges {

  @Input({
    required: true
  })
  accountId!:
    string | number;


  @Input()
  open = false;


  @Input()
  customer: CustomerItem | null = null;


  @Output()
  closed =
    new EventEmitter<void>();


  @Output()
  saved =
    new EventEmitter<CustomerItem>();


  readonly submitting =
    signal(false);


  readonly error =
    signal('');


  readonly success =
    signal('');


  readonly customerTypes: CustomerType[] = Object.values(CustomerTypeEnum);

  readonly customerTypeEnum = CustomerTypeEnum;


  readonly customerSources:
    CustomerSource[] =
    [
      'Manual',
      'Facebook',
      'WhatsApp',
      'Instagram',
      'Direct',
      'Excel',
      'AI'
    ];


  name = '';
  mobile = '';
  email = '';
  customerType:
    CustomerType =
    CustomerTypeEnum.New;

  source:
    CustomerSource =
    'Manual';

  image = '';

  mediaPickerOpen = false;


  constructor(
    private readonly customerApi:
      CustomerApiService
  ) {}


  ngOnChanges(
    changes: SimpleChanges
  ): void {
    if (this.open && (changes['open'] || changes['customer'])) {
      this.populateForm();
    }
  }


  get isEditMode(): boolean {
    return !!this.customer;
  }


  openImagePicker(): void {
    if (!this.submitting()) {
      this.mediaPickerOpen = true;
    }
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

    if (
      this.submitting()
    ) {
      return;
    }

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
      this.error.set('Enter at least a name, mobile number or email.');
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
    })
      .subscribe({
        next: result => {
          const duplicateMobile = !!mobile &&
            !!result.mobile?.items?.some(item =>
              item.id !== excludeId &&
              this.normalizeMobile(item.mobile) === this.normalizeMobile(mobile)
            );

          const duplicateEmail = !!email &&
            !!result.email?.items?.some(item =>
              item.id !== excludeId &&
              this.normalizeEmail(item.email) === this.normalizeEmail(email)
            );

          if (duplicateMobile || duplicateEmail) {
            const messages: string[] = [];

            if (duplicateMobile) {
              messages.push(`This mobile number (${mobile}) is already added in your contact list.`);
            }

            if (duplicateEmail) {
              messages.push(`This email (${email}) is already added in your contact list.`);
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
            source: this.source,
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
        next: customer => {
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
            (this.isEditMode
              ? 'Could not update customer. Please try again.'
              : 'Could not add customer. Please try again.')
          );
        }
      });
  }

  private normalizeMobile(value: string | null | undefined): string {
    return String(value || '').replace(/\D/g, '');
  }

  private normalizeEmail(value: string | null | undefined): string {
    return String(value || '').trim().toLowerCase();
  }


  private populateForm(): void {
    if (!this.customer) {
      this.resetForm();
      return;
    }

    this.name = this.customer.name || '';
    this.mobile = this.customer.mobile || '';
    this.email = this.customer.email || '';
    this.customerType = this.customer.customerType || CustomerTypeEnum.New;
    this.source = this.customer.source || 'Manual';
    this.image = this.customer.image || '';
    this.error.set('');
    this.success.set('');
  }


  private isValidEmail(
    value: string
  ): boolean {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(value);
  }


  private isValidMobile(
    value: string
  ): boolean {

    const normalized =
      value.replace(
        /[\s()+-]/g,
        ''
      );

    return /^\d{8,15}$/
      .test(
        normalized
      );
  }


  private resetForm():
    void {

    this.name = '';
    this.mobile = '';
    this.email = '';
    this.customerType =
      CustomerTypeEnum.New;

    this.source =
      'Manual';

    this.image = '';

    this.error.set('');
    this.success.set('');
  }

}
