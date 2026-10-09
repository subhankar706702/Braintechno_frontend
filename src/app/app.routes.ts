import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';
import { authGuard } from './core/auth.guard';
import { SETTING_ROUTES } from './settings/settings.route';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth-shell.component').then(
        (m) => m.AuthShellComponent,
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component').then(
            (m) => m.LoginComponent,
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/registation/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },

  {
    path: 'template/:id/view',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./templates/template-view.component').then(
        (m) => m.TemplateViewComponent,
      ),
  },
  {
    path: 'template/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './templates/editor/template-editor/template-editor.component'
      ).then((m) => m.TemplateEditorComponent),
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    loadComponent: () =>
      import('./admin/admin-shell/admin-shell.component').then(
        (m) => m.AdminShellComponent,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'subscription-payments',
        loadComponent: () =>
          import(
            './admin/admin-subscription-payment/admin-subscription-payment.component'
          ).then((m) => m.AdminSubscriptionPaymentComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },

  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './layout/dashboard-shell/dashboard-shell.component'
      ).then((m) => m.DashboardShellComponent),

    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.page').then(
            (m) => m.DashboardPage,
          ),
      },
      {
        path: 'business-profile',
        loadComponent: () =>
          import(
            './dashboard/business-profile/business-profile.page'
          ).then((m) => m.BusinessProfilePage),
      },
      {
        path: 'templates',
        loadComponent: () =>
          import('./templates/templates.component').then(
            (m) => m.TemplatesComponent,
          ),
      },
      {
        path: 'template-gallery',
        loadComponent: () =>
          import(
            './templates/template-gallery/template-gallery.component'
          ).then((m) => m.TemplateGalleryComponent),
      },
      {
        path: 'campaigns',
        loadComponent: () =>
          import('./campaigns/campaigns.component').then(
            (m) => m.CampaignsComponent,
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./customers/customers.page').then(
            (m) => m.CustomersPage,
          ),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./messages/messages.page').then(
            (m) => m.MessagesPage,
          ),
      },

      {
        path: 'broadcast',
        loadComponent: () =>
          import('./broadcast/broadcast.page').then(
            (m) => m.BroadcastPage,
          ),
      },
      {
        path: 'broadcast/history/:id',
        loadComponent: () =>
          import('./broadcast/broadcast-details.page').then(
            (m) => m.BroadcastDetailsPage,
          ),
      },
      {
        path: 'broadcast/:channel',
        loadComponent: () =>
          import('./broadcast/broadcast-channel.page').then(
            (m) => m.BroadcastChannelPage,
          ),
      },

      {
        path: 'social',
        loadComponent: () =>
          import(
            './social/social-overview/social-overview.page'
          ).then((m) => m.SocialOverviewPage),
      },
      {
        path: 'social/connected-accounts',
        loadComponent: () =>
          import(
            './social/connected-accounts/connected-accounts.page'
          ).then((m) => m.ConnectedAccountsPage),
      },
      {
        path: 'social/create-post',
        loadComponent: () =>
          import(
            './social/create-post/create-social-post.page'
          ).then((m) => m.CreateSocialPostPage),
      },
      {
        path: 'social/facebook',
        loadComponent: () =>
          import('./social/facebook/facebook.page').then(
            (m) => m.FacebookPage,
          ),
      },
      {
        path: 'social/instagram',
        loadComponent: () =>
          import('./social/instagram/instagram.page').then(
            (m) => m.InstagramPage,
          ),
      },
      {
        path: 'social/linkedin',
        loadComponent: () =>
          import('./social/linkedin/linkedin.page').then(
            (m) => m.LinkedInPage,
          ),
      },
      {
        path: 'social/google-business',
        loadComponent: () =>
          import(
            './social/google-business/google-business.page'
          ).then((m) => m.GoogleBusinessPage),
      },
      {
        path: 'social/scheduled',
        loadComponent: () =>
          import('./social/scheduled/scheduled.page').then(
            (m) => m.ScheduledPage,
          ),
      },
      {
        path: 'social/published',
        loadComponent: () =>
          import('./social/published/published.page').then(
            (m) => m.PublishedPage,
          ),
      },

      // Keep older links working by redirecting them to Settings.
      {
        path: 'pricing',
        pathMatch: 'full',
        redirectTo: 'settings/pricing',
      },
      {
        path: 'payment-history',
        pathMatch: 'full',
        redirectTo: 'settings/payment-history',
      },

      // Settings parent route and its child pages.
      // Do not add a separate "settings/:section" route here.
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.page').then(
            (m) => m.SettingsPage,
          ),
        children: SETTING_ROUTES,
      },

      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },

  {
    path: ':businessSlug/:pageSlug',
    loadComponent: () =>
      import('./public/campaign-page.component').then(
        (m) => m.TemplateApiService,
      ),
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];