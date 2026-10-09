import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <div class="admin-shell">
    <aside>
      <a class="brand" routerLink="/admin/dashboard"><span class="mark">BT</span><span>BRAIN TECHNO ADMIN</span></a>
      <nav>
        <a routerLink="/admin/dashboard" routerLinkActive="active">Admin Dashboard</a>
        <a routerLink="/admin/subscription-payments" routerLinkActive="active">Subscription & Payments</a>
        <a routerLink="/app/templates" routerLinkActive="active">Templates</a>
        <a routerLink="/app/campaigns" routerLinkActive="active">Campaigns</a>
      </nav>
      <div class="profile"><strong>{{auth.user()?.name}}</strong><small>{{auth.user()?.email}}</small><button type="button" (click)="logout()">Logout</button></div>
    </aside>
    <main><router-outlet /></main>
  </div>`,
  styles: [`
    .admin-shell{min-height:100vh;display:grid;grid-template-columns:270px 1fr}aside{height:100vh;position:sticky;top:0;background:#101828;color:#fff;padding:22px 16px;display:flex;flex-direction:column}.brand{display:flex;align-items:center;gap:10px;font-weight:900;padding:0 8px 22px}.mark{width:38px;height:38px;display:grid;place-items:center;border-radius:10px;background:#fff;color:#101828}nav{display:grid;gap:6px}nav a{padding:12px;border-radius:10px;color:#d0d5dd;font-weight:700}nav a.active,nav a:hover{background:#1d2939;color:#fff}.profile{margin-top:auto;border-top:1px solid #344054;padding:16px 8px 0;display:grid;gap:5px}.profile small{color:#98a2b3;overflow:hidden;text-overflow:ellipsis}.profile button{margin-top:8px;background:transparent;border:0;color:#fda29b;padding:0;text-align:left;font-weight:700}main{min-width:0}@media(max-width:760px){.admin-shell{display:block}aside{height:auto;position:static}.brand{padding-bottom:12px}nav{display:flex;overflow:auto}.profile{display:none}}
  `]
})
export class AdminShellComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout(): void { this.auth.logout(); void this.router.navigateByUrl('/auth/login'); }
}
