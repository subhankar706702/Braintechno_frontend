import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type StatCard = {
  icon: string;
  label: string;
  value: string;
  change: string;
  tone: 'blue' | 'green' | 'violet' | 'orange';
};

type PageItem = {
  image: string;
  title: string;
  url: string;
  status: 'Active' | 'Inactive';
  validity: string;
  expiry: string;
};

type LeadItem = {
  label: string;
  value: string;
  icon: string;
  tone: 'blue' | 'green' | 'violet' | 'pink';
};

@Component({
  selector: 'bt-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  readonly statCards: StatCard[] = [
    {
      icon: 'description',
      label: 'Active Pages',
      value: '3',
      change: '+0 this month',
      tone: 'blue',
    },
    {
      icon: 'group',
      label: 'Total Customers',
      value: '180',
      change: '+24 this month',
      tone: 'green',
    },
    {
      icon: 'chat_bubble_outline',
      label: 'Enquiries',
      value: '28',
      change: '+8 this month',
      tone: 'violet',
    },
    {
      icon: 'schedule',
      label: 'Expiring Soon',
      value: '1',
      change: '-2 from last month',
      tone: 'orange',
    },
  ];

  readonly pages: PageItem[] = [
    {
      image: '',
      title: 'Main Business Page',
      url: 'braintechno.in/p/your-business',
      status: 'Active',
      validity: '180 days',
      expiry: '19 Mar 2027',
    },
    {
      image: '',
      title: 'Festival Offer Page',
      url: 'braintechno.in/p/offer-page',
      status: 'Inactive',
      validity: '0 days',
      expiry: '10 Sep 2026',
    },
  ];

  readonly leads: LeadItem[] = [
    {
      label: 'Total',
      value: '180',
      icon: 'group',
      tone: 'blue',
    },
    {
      label: 'WhatsApp',
      value: '55',
      icon: 'chat',
      tone: 'green',
    },
    {
      label: 'Facebook',
      value: '20',
      icon: 'thumb_up',
      tone: 'violet',
    },
    {
      label: 'Instagram',
      value: '32',
      icon: 'photo_camera',
      tone: 'pink',
    },
  ];
}