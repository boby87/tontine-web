import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Tableau de bord</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Cotisations du mois</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">250 000 XAF</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Membres actifs</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">24</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p class="text-sm font-medium text-gray-500">Prochaine séance</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">20 Avr</p>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {}
