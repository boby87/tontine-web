import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);

  readonly menuToggled = output<void>();
  readonly collapseToggled = output<void>();

  protected logout(): void {
    this.authService.logout();
  }
}
