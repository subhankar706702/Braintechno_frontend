import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TemplateApiService } from '../../core/template-api.service';
import { AdminSummary, Campaign, TemplateDraft } from '../../core/models';
import { IndiaDatePipe } from '../../shared/india-date.pipe';
interface BusinessRow { id?: string; name?: string; slug?: string; status?: string; updatedAt?: string; }
interface UserRow { id?: string; name?: string; email?: string; role?: string; updatedAt?: string; }

@Component({
  standalone: true,
  imports: [IndiaDatePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
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
