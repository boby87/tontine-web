import { Component, ChangeDetectionStrategy, inject, input, computed, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavigationService } from '../../core/services/navigation.service';
import { MemberRole } from '../../core/models/member-role.model';
import { NAV_ITEMS } from './nav-items';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly navService = inject(NavigationService);

  readonly collapsed = input(false);
  readonly open = input(false);
  readonly collapseToggled = output<void>();

  protected readonly visibleItems = computed(() => {
    const role = this.authService.userRole() as MemberRole | null;
    if (!role) return [];
    return NAV_ITEMS.filter((item) => item.roles.includes(role));
  });

  protected logout(): void {
    this.authService.logout();
  }
}
