import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'auth', loadComponent: () => import('./auth/auth-shell.component').then(m => m.AuthShellComponent), children: [
      { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./auth/registation/register.component').then(m => m.RegisterComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'login' }
    ]
  },
  { path: 'template/:id/view', canActivate: [authGuard], loadComponent: () => import('./templates/template-view.component').then(m => m.TemplateViewComponent) },
  { path: 'template/:id', canActivate: [authGuard], loadComponent: () => import('./templates/editor/template-editor/template-editor.component').then(m => m.TemplateEditorComponent) },
  {
    path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./admin/admin-shell.component').then(m => m.AdminShellComponent), children: [
      { path: 'dashboard', loadComponent: () => import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  {
    path: 'app', canActivate: [authGuard], loadComponent: () => import('./layout/dashboard-shell/dashboard-shell.component').then(m => m.DashboardShellComponent), children: [
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage) },
      { path: 'business-profile', loadComponent: () => import('./dashboard/business-profile/business-profile.page').then(m => m.BusinessProfilePage) },
      { path: 'templates', loadComponent: () => import('./templates/templates.component').then(m => m.TemplatesComponent) },
      { path: 'template-gallery', loadComponent: () => import('./templates/template-gallery/template-gallery.component').then(m => m.TemplateGalleryComponent) },
      { path: 'campaigns', loadComponent: () => import('./campaigns/campaigns.component').then(m => m.CampaignsComponent) },
      { path: 'customers', loadComponent: () => import('./customers/customers.page').then(m => m.CustomersPage) },
      { path: 'messages', loadComponent: () => import('./messages/messages.page').then(m => m.MessagesPage) },
      { path: 'settings', loadComponent: () => import('./settings/settings.page').then(m => m.SettingsPage) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: ':businessSlug/:pageSlug', loadComponent: () => import('./public/campaign-page.component').then(m => m.TemplateApiService) },
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: '**', redirectTo: 'auth/login' }
];
