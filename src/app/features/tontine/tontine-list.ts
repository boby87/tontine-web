import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tontine-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Tontines</h2>
      <p class="text-gray-500">Gestion de vos tontines.</p>
    </div>
  `,
})
export class TontineListComponent {}
