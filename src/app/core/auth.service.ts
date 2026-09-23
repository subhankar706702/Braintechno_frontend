import {
  Injectable,
  computed,
  signal
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  tap
} from 'rxjs';

import {
  API_BASE_URL
} from './api.config';

import {
  AuthResponse,
  AuthUser
} from './models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey =
    'brain_techno_token';

  private readonly userKey =
    'brain_techno_user';

  private readonly userSignal =
    signal<AuthUser | null>(
      this.readUser()
    );

  readonly user =
    this.userSignal.asReadonly();

  readonly isLoggedIn =
    computed(
      () =>
        !!this.token &&
        !!this.userSignal()
    );

  readonly isAdmin =
    computed(
      () =>
        this.userSignal()?.role ===
        'admin'
    );

  constructor(
    private http: HttpClient
  ) {}

  get token(): string | null {
    return localStorage.getItem(
      this.tokenKey
    );
  }

  login(
    email: string,
    password: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${API_BASE_URL}/auth/login`,
        {
          email,
          password
        }
      )
      .pipe(
        tap((res) => {
          this.setSession(res);
        })
      );
  }

  register(
    ownerName: string,
    mobile: string,
    email: string,
    password: string,
    businessName: string,
    businessCategory: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${API_BASE_URL}/auth/register`,
        {
          ownerName,
          mobile,
          email,
          password,
          businessName,
          businessCategory
        }
      )
      .pipe(
        tap((res) => {
          this.setSession(res);
        })
      );
  }

  refreshMe(): Observable<AuthUser> {
    return this.http
      .get<AuthUser>(
        `${API_BASE_URL}/auth/me`
      )
      .pipe(
        tap((user) => {
          localStorage.setItem(
            this.userKey,
            JSON.stringify(user)
          );

          this.userSignal.set(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(
      this.tokenKey
    );

    localStorage.removeItem(
      this.userKey
    );

    this.userSignal.set(null);
  }

  private setSession(
    res: AuthResponse
  ): void {
    localStorage.setItem(
      this.tokenKey,
      res.token
    );

    localStorage.setItem(
      this.userKey,
      JSON.stringify(res.user)
    );

    this.userSignal.set(
      res.user
    );
  }

  private readUser():
    AuthUser | null {
    try {
      const raw =
        localStorage.getItem(
          this.userKey
        );

      if (!raw) {
        return null;
      }

      const user =
        JSON.parse(raw) as AuthUser;

      return {
        ...user,

        role:
          user.role === 'admin'
            ? 'admin'
            : 'owner'
      };
    } catch {
      return null;
    }
  }
}