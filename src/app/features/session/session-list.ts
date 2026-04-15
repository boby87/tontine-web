import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-session-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">Séances</h2>
      <p class="text-gray-500">Planification et suivi des réunions.</p>
    </div>
  `,
})
export class SessionListComponent {}
