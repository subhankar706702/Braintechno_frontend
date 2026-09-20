import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { Campaign, TemplateDraft } from '../core/models';
import { TemplateStorageService } from '../core/template-storage.service';
import { TemplateApiService } from '../core/template-api.service';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-campaigns',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './campaigns.component.html',
    styleUrl: './campaigns.component.scss'
})
export class CampaignsComponent {

    templates: TemplateDraft[] = [];

    name = '';
    slug = '';
    templateId = '';

    type: 'standard' | 'invitation' = 'standard';

    coverTitle = "You're Invited";
    openButtonLabel = 'Wedding Details';

    loading = false;
    loadingTemplates = false;

    message = '';
    isError = false;

    constructor(
        private storage: TemplateStorageService,
        private api: TemplateApiService,
        private auth: AuthService
    ) {
        this.loadTemplates();
    }

    /**
     * Logged-in user's account ID
     */
    get accountId(): string | number | null {
        return this.auth.user()?.accountId ?? null;
    }

    /**
     * Load templates from API / MongoDB
     */
    async loadTemplates(): Promise<void> {

        const accountId = this.accountId;

        if (
            accountId === null ||
            accountId === undefined ||
            accountId === ''
        ) {
            this.templates = [];
            this.loadingTemplates = false;

            this.setMessage(
                'Account ID is missing. Please login again.',
                true
            );

            return;
        }

        try {

            this.loadingTemplates = true;
            this.message = '';
            this.isError = false;

            const result = await this.storage.list(accountId);

            this.templates = Array.isArray(result)
                ? result
                : [];

        } catch (error) {

            console.error(
                'Failed to load templates:',
                error
            );

            this.templates = [];

            this.setMessage(
                'Could not load templates. Connect MongoDB and start the backend.',
                true
            );

        } finally {

            this.loadingTemplates = false;

        }
    }

    /**
     * Publish campaign
     */
    async publish(): Promise<void> {

        if (
            !this.name.trim() ||
            !this.slug.trim()
        ) {
            this.setMessage(
                'Campaign name and slug are required.',
                true
            );

            return;
        }

        if (!this.templateId) {

            this.setMessage(
                'Select a saved template.',
                true
            );

            return;
        }

        try {

            this.loading = true;
            this.message = '';
            this.isError = false;

            const template =
                await this.storage.get(
                    this.templateId
                );

            if (!template) {

                this.setMessage(
                    'Selected template could not be found.',
                    true
                );

                this.loading = false;

                return;
            }

            if (!template.html?.trim()) {

                this.setMessage(
                    'Open this template in the editor and Save it once before publishing.',
                    true
                );

                this.loading = false;

                return;
            }

            const cleanSlug = this.slug
                .trim()
                .toLowerCase()
                .replace(
                    /[^a-z0-9-]+/g,
                    '-'
                )
                .replace(
                    /^-+|-+$/g,
                    ''
                );

            if (!cleanSlug) {

                this.setMessage(
                    'Please enter a valid public slug.',
                    true
                );

                this.loading = false;

                return;
            }

            const body: Campaign = {

                name: this.name.trim(),

                slug: cleanSlug,

                templateId: template.id,

                html: template.html,

                design: template.design,

                status: 'published',

                interactive: {

                    type: this.type,

                    coverTitle:
                        this.coverTitle.trim(),

                    openButtonLabel:
                        this.openButtonLabel.trim()

                }

            };

            this.api
                .createCampaign(body)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                    })
                )
                .subscribe({

                    next: (campaign) => {

                        this.setMessage(
                            `Published: /c/${campaign.slug}`,
                            false
                        );

                    },

                    error: (error) => {

                        console.error(
                            'Campaign publish error:',
                            error
                        );

                        this.setMessage(
                            error?.error?.message ||
                            'Could not publish. Connect MongoDB and start the backend.',
                            true
                        );

                    }

                });

        } catch (error) {

            console.error(
                'Failed to publish campaign:',
                error
            );

            this.loading = false;

            this.setMessage(
                'Could not load the selected template.',
                true
            );

        }
    }

    private setMessage(
        value: string,
        error: boolean
    ): void {

        this.message = value;
        this.isError = error;

    }

}