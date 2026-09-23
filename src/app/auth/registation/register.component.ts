import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';


@Component({
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  ownerName = '';
  mobile = '';
  email = '';
  businessName = '';
  businessCategory = 'General';

  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    if (this.loading) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error =
        'Password and confirm password do not match.';

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