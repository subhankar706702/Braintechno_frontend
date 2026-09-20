import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TemplateStorageService } from '../core/template-storage.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  templateCount = 0;

  loading = false;

  constructor(
    private storage: TemplateStorageService,
    private auth: AuthService
  ) {}

  get accountId(): string {
    return String(
      this.auth.user()?.accountId ?? ''
    );
  }

  async ngOnInit(): Promise<void> {
    await this.loadTemplateCount();
  }

  private async loadTemplateCount(): Promise<void> {

    if (!this.accountId) {
      this.templateCount = 0;
      return;
    }

    try {

      this.loading = true;

      const templates =
        await this.storage.list(
          this.accountId
        );

      this.templateCount =
        Array.isArray(templates)
          ? templates.length
          : 0;

    } catch (error) {

      console.error(
        'Failed to load dashboard templates:',
        error
      );

      this.templateCount = 0;

    } finally {

      this.loading = false;

    }
  }
}