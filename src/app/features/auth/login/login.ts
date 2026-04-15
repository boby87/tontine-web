import {
  ChangeDetectionStrategy, Component, inject, signal, computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { form, FormField, required, minLength, email } from '@angular/forms/signals';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, RouterLink],
  templateUrl: './login.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  protected readonly isLoading = this.authService.isLoading;
  protected readonly serverError = this.authService.error;

  // ── Modèle de données ────────────────────────
  protected readonly loginModel = signal<LoginModel>({
    email: '',
    password: '',
  });

  // ── FieldTree avec validation ────────────────
  protected readonly f = form(this.loginModel, (s) => {
    required(s.email, { message: "L'email est obligatoire" });
    email(s.email, { message: "Format d'email invalide" });

    required(s.password, { message: 'Le mot de passe est obligatoire' });
    minLength(s.password, 8, { message: 'Minimum 8 caractères' });
  });

  // ── Computed — état global formulaire ────────
  protected readonly canSubmit = computed(() =>
    this.f.email().valid()
    && this.f.password().valid()
    && !this.isLoading(),
  );

  // ── Helper état champ ───────────────────────
  protected fieldState(field: { touched: () => boolean; valid: () => boolean; invalid: () => boolean }) {
    if (!field.touched()) return 'neutral' as const;
    return field.valid() ? 'valid' as const : 'invalid' as const;
  }

  // ── Soumission ──────────────────────────────
  protected submit(event: Event): void {
     event.preventDefault();
    // Perform login logic here
    const credentials = this.loginModel();
    console.log('Logging in with:', credentials);
    if (!this.canSubmit()) return;

    this.authService.clearError();

    const request: LoginRequest = {
      email: this.loginModel().email,
      password: this.loginModel().password,
    };

    this.authService.login(request);
  }
}
