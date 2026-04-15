import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes'),
      },
      {
        path: 'tontines',
        loadChildren: () => import('./features/tontine/tontine.routes'),
      },
      {
        path: 'sessions',
        loadChildren: () => import('./features/session/session.routes'),
      },
      {
        path: 'sanctions',
        loadChildren: () => import('./features/sanction/sanction.routes'),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.RegisterComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
