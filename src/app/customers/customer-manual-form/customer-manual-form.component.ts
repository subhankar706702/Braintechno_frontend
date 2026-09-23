import {
  CommonModule
} from '@angular/common';

import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  finalize
} from 'rxjs';
import { CustomerItem, CustomerType, CustomerSource, CustomerApiService } from '../../core/customer-api.service';



@Component({
  selector:
    'app-customer-manual-form',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],

  templateUrl:
    './customer-manual-form.component.html',

  styleUrl:
    './customer-manual-form.component.scss'
})
export class CustomerManualFormComponent {

  @Input({
    required: true
  })
  accountId!:
    string | number;


  @Input()
  open = false;


  @Output()
  closed =
    new EventEmitter<void>();


  @Output()
  created =
    new EventEmitter<CustomerItem>();


  readonly submitting =
    signal(false);


  readonly error =
    signal('');


  readonly success =
    signal('');


  readonly customerTypes:
    CustomerType[] =
    [
      'New',
      'Regular',
      'VIP',
      'Interested',
      'Followup',
      'Converted'
    ];


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
    'New';

  source:
    CustomerSource =
    'Manual';

  image = '';


  constructor(
    private readonly customerApi:
      CustomerApiService
  ) {}


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

    if (
      this.submitting()
    ) {
      return;
    }

    this.error.set('');
    this.success.set('');


    const name =
      this.name.trim();

    const mobile =
      this.mobile.trim();

    const email =
      this.email
        .trim()
        .toLowerCase();

    const image =
      this.image.trim();


    if (
      !name &&
      !mobile &&
      !email
    ) {
      this.error.set(
        'Enter at least a name, mobile number or email.'
      );

      return;
    }


    if (
      email &&
      !this.isValidEmail(
        email
      )
    ) {
      this.error.set(
        'Enter a valid email address.'
      );

      return;
    }


    if (
      mobile &&
      !this.isValidMobile(
        mobile
      )
    ) {
      this.error.set(
        'Enter a valid mobile number.'
      );

      return;
    }


    this.submitting.set(
      true
    );


    this.customerApi
      .create({
        accountId:
          this.accountId,

        name,
        mobile,
        email,

        customerType:
          this.customerType,

        source:
          this.source,

        image
      })
      .pipe(
        finalize(() => {
          this.submitting.set(
            false
          );
        })
      )
      .subscribe({
        next: customer => {

          this.success.set(
            'Customer added successfully.'
          );

          this.created.emit(
            customer
          );

          setTimeout(
            () => {
              this.resetForm();
              this.closed.emit();
            },
            350
          );
        },

        error: err => {

          this.error.set(
            err?.error?.message ||
            'Could not add customer. Please try again.'
          );
        }
      });
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
      'New';

    this.source =
      'Manual';

    this.image = '';

    this.error.set('');
    this.success.set('');
  }

}
