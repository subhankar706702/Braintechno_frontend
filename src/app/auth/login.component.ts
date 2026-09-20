import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="head"><h1>Welcome back</h1><p>Sign in to manage BRAIN TECHNO templates and campaigns.</p></div>
    <form (ngSubmit)="submit()" #form="ngForm">
      <div class="bt-field"><label>Email</label><input class="bt-input" type="email" name="email" [(ngModel)]="email" required autocomplete="email"></div>
      <div class="bt-field"><label>Password</label><input class="bt-input" type="password" name="password" [(ngModel)]="password" required minlength="8" autocomplete="current-password"></div>
      @if(error){<div class="bt-error">{{error}}</div>}
      <button class="bt-btn" type="submit" [disabled]="form.invalid || loading">{{loading ? 'Signing in…' : 'Sign in'}}</button>
    </form>
    <p class="foot">New to BRAIN TECHNO? <a routerLink="/auth/register">Create account</a></p>
  `,
  styles:[`.head h1{margin:0 0 8px}.head p,.foot{color:#667085}.head{margin-bottom:24px}form{display:grid;gap:16px}.foot{margin:22px 0 0;text-align:center}.foot a{font-weight:800;color:#111827}`]
})
export class LoginComponent {
  email=''; password=''; loading=false; error='';
  constructor(private auth: AuthService, private router: Router) {}
  submit(){
    if(this.loading) return;
    this.loading=true; this.error='';
    this.auth.login(this.email.trim().toLowerCase(), this.password).pipe(finalize(()=>this.loading=false)).subscribe({
      next:(res)=>this.router.navigateByUrl(res.user.role === 'admin' ? '/admin/dashboard' : '/app/dashboard'),
      error:(err)=>this.error=err?.error?.message || 'Login failed. Check backend and MongoDB connection.'
    });
  }
}
