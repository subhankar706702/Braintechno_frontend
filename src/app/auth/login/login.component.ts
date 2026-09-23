import {
  Component,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs';
import { AuthService } from '../../core/auth.service';



@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl:
    './login.component.html',

  styleUrl:
    './login.component.scss'
})
export class LoginComponent {

  identifier = '';
  password = '';

  readonly showPassword =
    signal(false);

  readonly submitting =
    signal(false);

  readonly errorMessage =
    signal('');

  constructor(
    private readonly authService:
      AuthService,

    private readonly router:
      Router
  ) { }

  togglePassword(): void {
    this.showPassword.update(
      value => !value
    );
  }

  login(): void {
    if (
      this.submitting()
    ) {
      return;
    }

    const identifier =
      this.identifier.trim();

    const password =
      this.password;

    this.errorMessage.set('');

    if (!identifier) {
      this.errorMessage.set(
        'Enter your username, mobile number or email.'
      );

      return;
    }

    if (!password) {
      this.errorMessage.set(
        'Enter your password.'
      );

      return;
    }

    this.submitting.set(true);

    this.authService
      .login(
        identifier,
        password
      )
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        })
      )
      .subscribe({
        next: () => {
          void this.router.navigateByUrl(
            '/app'
          );
        },

        error: error => {
          this.errorMessage.set(
            error?.error?.message ||
            'Unable to sign in. Please check your details.'
          );
        }
      });
  }
}