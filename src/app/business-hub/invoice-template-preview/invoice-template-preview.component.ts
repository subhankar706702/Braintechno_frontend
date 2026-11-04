import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { InvoiceTemplate } from '../models/invoice-settings.service';

type PreviewLayout =
  | 'classic'
  | 'editorial'
  | 'sidebar'
  | 'split'
  | 'luxury'
  | 'creative';

@Component({
  selector: 'bt-invoice-template-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-template-preview.component.html',
  styleUrl: './invoice-template-preview.component.scss',
})
export class InvoiceTemplatePreviewComponent {
  @Input() template: InvoiceTemplate = 'classic';
  @Input() businessName = 'Your Business Name';
  @Input() logoDataUrl = '';
  @Input() phone = '';
  @Input() email = '';
  @Input() address = 'Business address goes here';
  @Input() primaryColor = '#ff4d6d';
  @Input() gstin = '';
  @Input() footer = 'Thank you for your business.';
  @Input() invoiceNumber = 'BTECH00001';
  @Input() pageSize: 'a4' | 'a5' | 'letter' | 'legal' = 'a4';
  @Input() printColor: 'color' | 'bw' = 'color';

  readonly items = [
    { name: 'Product / Service One', description: 'Product description', qty: 1, rate: 1000, amount: 1000 },
    { name: 'Product / Service Two', description: 'Additional item', qty: 2, rate: 250, amount: 500 },
    { name: 'Product / Service Three', description: 'Service charge', qty: 1, rate: 300, amount: 300 },
  ];

  get subtotal(): number {
    return this.items.reduce((total, item) => total + item.amount, 0);
  }

  get tax(): number {
    return this.template === 'gst' ? this.subtotal * 0.18 : 0;
  }

  get grandTotal(): number {
    return this.subtotal + this.tax;
  }

  get layout(): PreviewLayout {
    const layouts: Partial<Record<InvoiceTemplate, PreviewLayout>> = {
      classic: 'classic',
      'basic-blue': 'classic',
      mono: 'classic',
      corporate: 'split',
      elegant: 'editorial',
      creative: 'creative',
      sidebar: 'sidebar',
      luxury: 'luxury',
      gradient: 'split',
      executive: 'editorial',
      signature: 'editorial',
      'modern-pro': 'split',
      'my-brand': 'creative',
      'design-studio': 'creative',
      minimal: 'editorial',
      modern: 'split',
      gst: 'classic',
      premium: 'luxury',
    };

    return layouts[this.template] || 'classic';
  }

  get templateClass(): string {
    return `template-${this.template}`;
  }

  get isGstInvoice(): boolean {
    return this.template === 'gst' || !!this.gstin;
  }

  formatAmount(value: number): string {
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}