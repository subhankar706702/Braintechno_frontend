import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  termsAccepted = false;

  ownerName = '';
  mobile = '';
  email = '';
  businessName = '';
  businessCategory = '';

  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  loading = false;
  error = '';

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
    private router: Router
  ) { }

  submit(): void {
    if (this.loading) {
      return;
    }

    if (!this.termsAccepted) {
      this.error = 'Please accept the Terms & Conditions and Privacy Policy.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error =
        'Password and confirm password do not match.';
      return;
    }

    if(this.mobile.length !== 10) {
      this.error = 'Mobile number must be 10 digits long.';
      return;
    }

    if(this.email.trim() === '' || !this.email.includes('@')) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth
      .register(
        this.ownerName.trim(),
        this.mobile.trim(),
        this.email.trim().toLowerCase(),
        this.password,
        this.businessName.trim(),
        this.businessCategory
      )
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/app/dashboard');
        },

        error: (err) => {
          this.error =
            err?.error?.message ||
            'Registration failed. Please try again.';
        }
      });
  }
}