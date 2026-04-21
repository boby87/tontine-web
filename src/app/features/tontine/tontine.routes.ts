import { Routes } from '@angular/router';
import { TontineListComponent } from './tontine-list';

const routes: Routes = [
  { path: '', component: TontineListComponent },
  {
    path: 'create',
    loadComponent: () =>
      import('./create-wizard/create-wizard').then((m) => m.CreateWizardComponent),
  },
];
export default routes;
