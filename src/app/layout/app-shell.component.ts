import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  standalone:true,
  imports:[RouterOutlet,RouterLink,RouterLinkActive],
  template:`
  <div class="shell">
    <aside>
      <a class="brand" routerLink="/app/dashboard"><span class="mark">BT</span><span>BRAIN TECHNO</span></a>
      <nav>
        @if(auth.isAdmin()){<a routerLink="/admin/dashboard" routerLinkActive="active">Admin Dashboard</a>}
        <a routerLink="/app/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/app/templates" routerLinkActive="active">Templates</a>
        <a routerLink="/app/campaigns" routerLinkActive="active">Campaigns</a>
      </nav>
      <div class="profile"><div><strong>{{auth.user()?.name || 'User'}}</strong><small>{{auth.user()?.email}}</small></div><button (click)="logout()">Logout</button></div>
    </aside>
    <main><router-outlet /></main>
  </div>`,
  styles:[`
  .shell{min-height:100vh;display:grid;grid-template-columns:250px 1fr}aside{position:sticky;top:0;height:100vh;padding:22px 16px;border-right:1px solid #e5e7eb;background:#fff;display:flex;flex-direction:column}.brand{display:flex;align-items:center;gap:10px;font-weight:900;padding:0 8px 22px}.mark{width:36px;height:36px;display:grid;place-items:center;border-radius:10px;background:#111827;color:#fff}nav{display:grid;gap:5px}nav a{padding:11px 12px;border-radius:10px;color:#475467;font-weight:700}nav a.active{background:#f2f4f7;color:#101828}.profile{margin-top:auto;padding:14px 8px 0;border-top:1px solid #e5e7eb;display:grid;gap:10px}.profile small{display:block;color:#667085;margin-top:3px;overflow:hidden;text-overflow:ellipsis}.profile button{border:0;background:transparent;text-align:left;padding:0;color:#b42318;font-weight:700}main{min-width:0}@media(max-width:760px){.shell{display:block}aside{position:static;height:auto;display:grid;grid-template-columns:1fr auto;padding:12px}.brand{padding:0}.brand>span:last-child{display:none}nav{display:flex;grid-column:1/-1;order:3;margin-top:10px;overflow:auto}nav a{white-space:nowrap}.profile{margin:0;border:0;padding:0;align-self:center}.profile div{display:none}}
  `]
})
export class AppShellComponent{
  constructor(public auth:AuthService,private router:Router){}
  logout(){this.auth.logout();this.router.navigateByUrl('/auth/login');}
}
