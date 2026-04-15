import { Component, ChangeDetectionStrategy, inject, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { NavbarComponent } from '../navbar/navbar';
import { NavigationService } from '../../core/services/navigation.service';

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './main-layout.html',
})
export class MainLayoutComponent {
  protected readonly navService = inject(NavigationService);
  protected readonly isMobile = signal(window.matchMedia('(max-width: 1023px)').matches);

  constructor() {
    const mql = window.matchMedia('(max-width: 1023px)');
    mql.addEventListener('change', (e) => this.isMobile.set(e.matches));
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.isMobile() && this.navService.isSidebarOpen()) {
      this.navService.closeSidebar();
    }
  }
}
