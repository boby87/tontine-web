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
  { path: '**', redirectTo: 'dashboard' },
];
