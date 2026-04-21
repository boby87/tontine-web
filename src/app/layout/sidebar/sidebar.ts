import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { NavigationService } from '../../core/services/navigation.service';
import { NAV_ITEMS } from './nav-items';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  protected readonly userService = inject(UserService);
  protected readonly navService = inject(NavigationService);

  readonly collapsed = input(false);
  readonly open = input(false);

  protected readonly visibleItems = computed(() => {
    const role = this.userService.currentRole();
    if (!role) return [];
    return NAV_ITEMS.filter((item) => item.roles.includes(role));
  });
}
