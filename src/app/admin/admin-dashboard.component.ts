import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TemplateApiService } from '../core/template-api.service';
import { AdminSummary, Campaign, TemplateDraft } from '../core/models';
import { IndiaDatePipe } from '../shared/india-date.pipe';
interface BusinessRow { id?: string; name?: string; slug?: string; status?: string; updatedAt?: string; }
interface UserRow { id?: string; name?: string; email?: string; role?: string; updatedAt?: string; }

@Component({
  standalone: true,
  imports: [IndiaDatePipe],
  template: `
  <div class="bt-page admin-page">
    <div class="bt-page-head"><div><h1>Admin Dashboard</h1><p class="bt-muted">Platform-level overview across BRAIN TECHNO.</p></div><button class="bt-btn secondary" type="button" (click)="load()" [disabled]="loading">Refresh</button></div>
    @if(error){<div class="error-box">{{error}}</div>}
    <section class="stats">
      @for(card of statCards(); track card.label){<article class="bt-card stat"><span>{{card.label}}</span><strong>{{card.value}}</strong></article>}
    </section>
    <section class="grid-two">
      <article class="bt-card panel"><h2>Recent businesses</h2>@for(row of businesses.slice(0,8); track row.id){<div class="row"><div><strong>{{row.name}}</strong><small>/{{row.slug}}</small></div><span>{{row.updatedAt | indiaDate}}</span></div>}@if(!businesses.length){<p class="bt-muted">No businesses.</p>}</article>
      <article class="bt-card panel"><h2>Recent users</h2>@for(row of users.slice(0,8); track row.id){<div class="row"><div><strong>{{row.name}}</strong><small>{{row.email}} · {{row.role}}</small></div><span>{{row.updatedAt | indiaDate}}</span></div>}@if(!users.length){<p class="bt-muted">No users.</p>}</article>
      <article class="bt-card panel"><h2>Recent templates</h2>@for(row of templates.slice(0,8); track row.id){<div class="row"><div><strong>{{row.name}}</strong><small>{{row.status}}</small></div><span>{{row.updatedAt | indiaDate}}</span></div>}@if(!templates.length){<p class="bt-muted">No templates.</p>}</article>
      <article class="bt-card panel"><h2>Recent campaigns</h2>@for(row of campaigns.slice(0,8); track row.id || row._id){<div class="row"><div><strong>{{row.name}}</strong><small>/c/{{row.slug}} · {{row.status}}</small></div><span>{{row.updatedAt | indiaDate}}</span></div>}@if(!campaigns.length){<p class="bt-muted">No campaigns.</p>}</article>
    </section>
  </div>`,
  styles: [`
    .admin-page{max-width:1600px}.stats{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px}.stat{padding:18px}.stat span{display:block;color:#667085;font-size:13px}.stat strong{display:block;margin-top:8px;font-size:28px}.grid-two{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:18px}.panel{padding:20px}.panel h2{margin:0 0 14px;font-size:17px}.row{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-top:1px solid #eaecf0}.row:first-of-type{border-top:0}.row small{display:block;color:#667085;margin-top:3px}.row>span{color:#667085;font-size:12px;text-align:right;white-space:nowrap}.error-box{padding:12px 14px;border:1px solid #fecdca;background:#fef3f2;color:#b42318;border-radius:12px;margin-bottom:14px}@media(max-width:1100px){.stats{grid-template-columns:repeat(3,1fr)}}@media(max-width:760px){.stats,.grid-two{grid-template-columns:1fr 1fr}}@media(max-width:520px){.stats,.grid-two{grid-template-columns:1fr}.row{display:block}.row>span{display:block;text-align:left;margin-top:5px}}
  `]
})
export class AdminDashboardComponent implements OnInit {
  summary: AdminSummary = { businesses: 0, users: 0, templates: 0, pages: 0, campaigns: 0, interactions: 0 };
  businesses: BusinessRow[] = [];
  users: UserRow[] = [];
  templates: TemplateDraft[] = [];
  campaigns: Campaign[] = [];
  loading = false;
  error = '';
  constructor(private api: TemplateApiService) {}
  ngOnInit(): void { this.load(); }
  statCards(): { label: string; value: number }[] { return [
    {label:'Businesses',value:this.summary.businesses},
    {label:'Users',value:this.summary.users},{label:'Templates',value:this.summary.templates},{label:'Pages',value:this.summary.pages},{label:'Campaigns',value:this.summary.campaigns},{label:'Interactions',value:this.summary.interactions}
  ]; }
  load(): void {
    if (this.loading) return;
    this.loading = true; this.error = '';
    forkJoin({
      summary: this.api.adminSummary(),
      businesses: this.api.adminList<BusinessRow>('businesses'),
      users: this.api.adminList<UserRow>('users'),
      templates: this.api.adminList<TemplateDraft>('templates'),
      campaigns: this.api.adminList<Campaign>('campaigns')
    }).subscribe({
      next: (data) => { this.summary=data.summary; this.businesses=data.businesses; this.users=data.users; this.templates=data.templates; this.campaigns=data.campaigns; this.loading=false; },
      error: (err) => { this.error=err?.error?.message || 'Could not load admin dashboard.'; this.loading=false; }
    });
  }
}
