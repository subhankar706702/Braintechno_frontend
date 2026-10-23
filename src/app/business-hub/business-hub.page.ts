import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

type HubSection = 'my-business' | 'invoice' | 'stock' | 'payment-reminder' | 'growth-checklist' | 'settings';

interface HubCard {
  label: string;
  value: string;
  note: string;
  icon: string;
  tone: string;
}

@Component({
  selector: 'bt-business-hub-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './business-hub.page.html',
  styleUrl: './business-hub.page.scss',
})
export class BusinessHubPage implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  section: HubSection = 'my-business';
  title = 'My Business';
  description = 'Your business at a glance. Track activity and find your next growth opportunity.';

  readonly overviewCards: HubCard[] = [
    { label: "Today's Sales", value: '—', note: 'Sales recorded today', icon: 'trending_up', tone: 'blue' },
    { label: "Today's Expenses", value: '—', note: 'Expenses recorded today', icon: 'account_balance_wallet', tone: 'orange' },
    { label: 'Outstanding Due', value: '—', note: 'From Payment Reminder', icon: 'payments', tone: 'violet' },
    { label: 'Low Stock Items', value: '—', note: 'From My Stock', icon: 'inventory_2', tone: 'green' },
  ];

  readonly quickLinks = [
    { title: 'Record sales or expense', description: 'Keep daily business entries organised.', icon: 'add_chart', route: '/app/business-hub/my-business/sales-expenses' },
    { title: 'Create an invoice', description: 'Prepare an invoice for a customer.', icon: 'receipt_long', route: '/app/business-hub/invoice' },
    { title: 'Update stock', description: 'Add products or update quantities.', icon: 'inventory_2', route: '/app/business-hub/stock' },
    { title: 'Check customer dues', description: 'Review outstanding and paid records.', icon: 'event_available', route: '/app/business-hub/payment-reminder' },
  ];

  readonly checklistItems = [
    'Complete your Business Profile',
    'Add products or services to your catalogue',
    'Create your first invoice',
    'Share your business online',
  ];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
      takeUntil(this.destroy$),
    ).subscribe(() => this.syncSection());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private syncSection(): void {
    const url = this.router.url.split('?')[0].replace(/\/$/, '');
    const routes: Record<string, HubSection> = {
      '/app/business-hub': 'my-business',
      '/app/business-hub/my-business': 'my-business',
      '/app/business-hub/my-business/sales-expenses': 'my-business',
      '/app/business-hub/invoice': 'invoice',
      '/app/business-hub/stock': 'stock',
      '/app/business-hub/payment-reminder': 'payment-reminder',
      '/app/business-hub/growth-checklist': 'growth-checklist',
      '/app/business-hub/settings': 'settings',
    };
    this.section = routes[url] || 'my-business';
    const content: Record<HubSection, { title: string; description: string }> = {
      'my-business': { title: url.endsWith('/sales-expenses') ? 'Daily Sales & Expense Tracker' : 'My Business', description: url.endsWith('/sales-expenses') ? 'A simple place to record and review your daily business activity.' : 'Your business at a glance. Track activity and find your next growth opportunity.' },
      invoice: { title: 'Invoice Generator', description: 'Create clear, professional invoices for your customers.' },
      stock: { title: 'My Stock', description: 'Manage products, prices, quantities and stock status.' },
      'payment-reminder': { title: 'Payment Reminder', description: 'Keep track of outstanding dues, installments and completed payments.' },
      'growth-checklist': { title: 'Business Growth Checklist', description: 'Small steps to strengthen your business and online presence.' },
      settings: { title: 'Hub Settings', description: 'Set up invoice preferences, tax, payment details and stock thresholds.' },
    };
    this.title = content[this.section].title;
    this.description = content[this.section].description;
  }

  open(route: string): void {
    void this.router.navigateByUrl(route);
  }

  isSalesExpensesView(): boolean {
    return this.router.url.split('?')[0].replace(/\/$/, '').endsWith('/sales-expenses');
  }
}
