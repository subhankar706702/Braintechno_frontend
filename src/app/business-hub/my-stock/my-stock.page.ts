
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { MediaLibraryItem } from '../../core/media-library.service';
import {
  StockItem,
  StockPayload,
  MyStockApiService
} from '../../core/my-stock-api.service';
import { MediaPickerComponent } from '../../shared/media-picker/media-picker.component';
import { ConfirmDialogService } from '../../Common/components/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-my-stock-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MediaPickerComponent
  ],
  templateUrl: './my-stock.page.html',
  styleUrl: './my-stock.page.scss'
})
export class MyStockPage implements OnInit, OnDestroy {
  readonly items = signal<StockItem[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');

  readonly search = signal('');
  readonly statusFilter = signal('all');
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);

  mediaPickerOpen = false;

  readonly totalItems = computed(
    () => this.items().length
  );

  readonly lowCount = computed(
    () => this.items().filter(
      item => item.stockStatus === 'low-stock'
    ).length
  );

  readonly outCount = computed(
    () => this.items().filter(
      item => item.stockStatus === 'out-of-stock'
    ).length
  );

  readonly stockValue = computed(
    () => this.items().reduce(
      (sum, item) =>
        sum + item.quantity * item.discountPrice,
      0
    )
  );

  readonly units = [
    'piece',
    'kg',
    'g',
    'litre',
    'ml',
    'packet',
    'box',
    'dozen',
    'metre',
    'other'
  ];

  form: StockPayload = this.emptyForm();

  private searchTimer:
    ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly api: MyStockApiService,
    private readonly confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  }

  emptyForm(): StockPayload {
    return {
      name: '',
      description: '',
      imageUrl: '',
      originalPrice: 0,
      discountPrice: 0,
      gstEnabled: false,
      gstRate: 0,
      quantity: 0,
      unit: 'piece'
    };
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    this.api
      .list(this.search(), this.statusFilter())
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: result => {
          this.items.set(result.items || []);
        },
        error: err => {
          this.error.set(
            err?.error?.message ||
            'Could not load stock. Please try again.'
          );
        }
      });
  }

  onSearch(value: string): void {
    this.search.set(value);

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(
      () => this.load(),
      250
    );
  }

  setFilter(value: string): void {
    this.statusFilter.set(value);
    this.load();
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.error.set('');
    this.showForm.set(true);
  }

  openEdit(item: StockItem): void {
    this.editingId.set(item.id);

    this.form = {
      name: item.name || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      originalPrice: item.originalPrice,
      discountPrice: item.discountPrice,
      gstEnabled: item.gstEnabled,
      gstRate: item.gstRate,
      quantity: item.quantity,
      unit: item.unit || 'piece'
    };

    this.error.set('');
    this.showForm.set(true);
  }

  closeForm(): void {
    if (!this.saving()) {
      this.showForm.set(false);
      this.error.set('');
    }
  }

  openMediaPicker(): void {
    if (!this.saving()) {
      this.mediaPickerOpen = true;
    }
  }

  closeMediaPicker(): void {
    this.mediaPickerOpen = false;
  }

  onImageSelected(items: MediaLibraryItem[]): void {
    const selected = items?.[0];

    if (!selected) {
      return;
    }

    this.form.imageUrl = selected.url || '';
    this.mediaPickerOpen = false;
  }

  clearProductImage(): void {
    this.form.imageUrl = '';
  }

  save(): void {
    const form = this.form;

    if (!form.name.trim()) {
      this.error.set('Product name is required.');
      return;
    }

    const originalPrice = Number(form.originalPrice);
    const discountPrice = Number(form.discountPrice);
    const quantity = Number(form.quantity);
    const gstRate = form.gstEnabled
      ? Number(form.gstRate)
      : 0;

    if (
      !Number.isFinite(originalPrice) ||
      !Number.isFinite(discountPrice) ||
      !Number.isFinite(quantity) ||
      !Number.isFinite(gstRate) ||
      originalPrice < 0 ||
      discountPrice < 0 ||
      quantity < 0 ||
      gstRate < 0 ||
      gstRate > 100
    ) {
      this.error.set(
        'Please check price, quantity and GST values.'
      );
      return;
    }

    if (discountPrice > originalPrice) {
      this.error.set(
        'Discount price cannot be higher than original price.'
      );
      return;
    }

    const payload: StockPayload = {
      name: form.name.trim(),
      description: (form.description || '').trim(),
      imageUrl: (form.imageUrl || '').trim(),
      originalPrice,
      discountPrice,
      gstEnabled: Boolean(form.gstEnabled),
      gstRate,
      quantity,
      unit: form.unit || 'piece'
    };

    this.saving.set(true);
    this.error.set('');

    const request = this.editingId()
      ? this.api.update(this.editingId()!, payload)
      : this.api.create(payload);

    request
      .pipe(
        finalize(() => this.saving.set(false))
      )
      .subscribe({
        next: () => {
          this.showForm.set(false);
          this.load();
        },
        error: err => {
          this.error.set(
            err?.error?.message ||
            'Could not save product. Please try again.'
          );
        }
      });
  }

  deleteProduct(item: StockItem): void {
    this.confirmDialog.confirm({
      title: 'Delete Product',
      subtitle:
        `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      type: 'danger',
      icon: 'delete',
      showCancel: true,
      successButtonName: 'Delete',
      cancelButtonName: 'Cancel',

      success: () => {
        this.api.delete(item.id).subscribe({
          next: () => {
            this.load();
          },
          error: err => {
            this.error.set(
              err?.error?.message ||
              'Failed to delete product. Please try again.'
            );
          }
        });
      }
    });
  }

  money(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value || 0);
  }

  trackById(
    _index: number,
    item: StockItem
  ): string {
    return item.id;
  }
}
