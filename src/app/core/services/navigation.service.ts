import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly _isSidebarOpen = signal(false);
  private readonly _isSidebarCollapsed = signal(false);

  readonly isSidebarOpen = this._isSidebarOpen.asReadonly();
  readonly isSidebarCollapsed = this._isSidebarCollapsed.asReadonly();

  readonly sidebarWidth = computed(() =>
    this._isSidebarCollapsed() ? 'w-16' : 'w-64',
  );

  toggleSidebar(): void {
    this._isSidebarOpen.update((v) => !v);
  }

  closeSidebar(): void {
    this._isSidebarOpen.set(false);
  }

  toggleCollapse(): void {
    this._isSidebarCollapsed.update((v) => !v);
  }
}
