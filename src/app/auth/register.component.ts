import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="head"><h1>Create your account</h1><p>Start with one business workspace. More roles can be added later.</p></div>
    <form (ngSubmit)="submit()" #form="ngForm">
      <div class="bt-field"><label>Your name</label><input class="bt-input" name="name" [(ngModel)]="name" required></div>
      <div class="bt-field"><label>Business name</label><input class="bt-input" name="businessName" [(ngModel)]="businessName" required></div>
      <div class="bt-field"><label>Email</label><input class="bt-input" type="email" name="email" [(ngModel)]="email" required></div>
      <div class="bt-field"><label>Password</label><input class="bt-input" type="password" name="password" [(ngModel)]="password" required minlength="8"></div>
      @if(error){<div class="bt-error">{{error}}</div>}
      <button class="bt-btn" type="submit" [disabled]="form.invalid || loading">{{loading ? 'Creating…' : 'Create account'}}</button>
    </form>
    <p class="foot">Already registered? <a routerLink="/auth/login">Sign in</a></p>
  `,
  styles:[`.head h1{margin:0 0 8px}.head p,.foot{color:#667085}.head{margin-bottom:24px}form{display:grid;gap:16px}.foot{margin:22px 0 0;text-align:center}.foot a{font-weight:800}`]
})
export class RegisterComponent {
  name=''; businessName=''; email=''; password=''; loading=false; error='';
  constructor(private auth: AuthService, private router: Router) {}
  submit(){
    if(this.loading)return; this.loading=true;this.error='';
    this.auth.register(this.name.trim(),this.email.trim().toLowerCase(),this.password,this.businessName.trim()).pipe(finalize(()=>this.loading=false)).subscribe({
      next:()=>this.router.navigateByUrl('/app/dashboard'),
      error:(err)=>this.error=err?.error?.message || 'Registration failed. Check backend and MongoDB connection.'
    });
  }
}
