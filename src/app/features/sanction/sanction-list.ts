import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sanction-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Sanctions</h2>
      <p class="text-gray-500">Gestion des sanctions (Censeur uniquement).</p>
    </div>
  `,
})
export class SanctionListComponent {}
