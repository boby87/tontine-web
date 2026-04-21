import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  protected readonly userService = inject(UserService);

  readonly menuToggled = output<void>();
  readonly collapseToggled = output<void>();
}
