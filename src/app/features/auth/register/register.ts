import {
  ChangeDetectionStrategy, Component, inject, signal, computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  form, FormField, required, minLength, pattern, validate, email,
} from '@angular/forms/signals';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';

const CAMEROON_REGIONS = [
  'ADAMAOUA', 'CENTRE', 'EST', 'EXTREME_NORD',
  'LITTORAL', 'NORD', 'NORD_OUEST', 'OUEST',
  'SUD', 'SUD_OUEST',
] as const;

const REGION_LABELS: Record<string, string> = {
  ADAMAOUA: 'Adamaoua',
  CENTRE: 'Centre',
  EST: 'Est',
  EXTREME_NORD: 'Extrême-Nord',
  LITTORAL: 'Littoral',
  NORD: 'Nord',
  NORD_OUEST: 'Nord-Ouest',
  OUEST: 'Ouest',
  SUD: 'Sud',
  SUD_OUEST: 'Sud-Ouest',
};

interface RegisterModel {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  region: string;
  cniNumber: string;
}

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);

  protected readonly regions = CAMEROON_REGIONS;
  protected readonly regionLabels = REGION_LABELS;
  protected readonly isLoading = this.authService.isLoading;
  protected readonly serverError = this.authService.error;

  // ── Modèle de données ────────────────────────
  protected readonly registerModel = signal<RegisterModel>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    region: '',
    cniNumber: '',
  });

  // ── FieldTree avec validation ────────────────
  protected readonly f = form(this.registerModel, (s) => {
    required(s.firstName, { message: 'Le prénom est obligatoire' });
    minLength(s.firstName, 2, { message: 'Le prénom doit avoir au moins 2 caractères' });

    required(s.lastName, { message: 'Le nom est obligatoire' });
    minLength(s.lastName, 2, { message: 'Le nom doit avoir au moins 2 caractères' });

    required(s.email, { message: "L'email est obligatoire" });
    email(s.email, { message: "Format d'email invalide" });

    required(s.phone, { message: 'Le numéro de téléphone est obligatoire' });
    pattern(s.phone, /^[623]\d{8}$/, {
      message: 'Numéro invalide — doit commencer par 6, 2 ou 3 (9 chiffres)',
    });

    required(s.password, { message: 'Le mot de passe est obligatoire' });
    minLength(s.password, 8, { message: 'Minimum 8 caractères' });
    validate(s.password, ({ value }) => {
      const v = value();
      if (!/[A-Z]/.test(v)) return { kind: 'uppercase', message: 'Au moins une majuscule requise' };
      if (!/\d/.test(v)) return { kind: 'digit', message: 'Au moins un chiffre requis' };
      return null;
    });

    required(s.confirmPassword, { message: 'Confirmez le mot de passe' });
    validate(s.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(s.password)) {
        return { kind: 'passwordMismatch', message: 'Les mots de passe ne correspondent pas' };
      }
      return null;
    });

    required(s.dateOfBirth, { message: 'La date de naissance est obligatoire' });
    validate(s.dateOfBirth, ({ value }) => {
      const dob = new Date(value());
      const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (age < 18) return { kind: 'minAge', message: 'Vous devez avoir au moins 18 ans' };
      return null;
    });

    required(s.region, { message: 'La région est obligatoire' });

    required(s.cniNumber, { message: 'Le numéro de CNI est obligatoire' });
  });

  // ── Computed — phone display ─────────────────
  protected readonly phonePreview = computed(() => {
    const raw = this.f.phone().value();
    return raw ? `+237 ${raw}` : '';
  });

  // ── Computed — état global formulaire ────────
  protected readonly canSubmit = computed(() =>
    this.f.firstName().valid()
    && this.f.lastName().valid()
    && this.f.email().valid()
    && this.f.phone().valid()
    && this.f.password().valid()
    && this.f.confirmPassword().valid()
    && this.f.dateOfBirth().valid()
    && this.f.region().valid()
    && this.f.cniNumber().valid()
    && !this.isLoading(),
  );

  // ── Helpers état champ ──────────────────────
  protected fieldState(field: { touched: () => boolean; valid: () => boolean; invalid: () => boolean }) {
    if (!field.touched()) return 'neutral' as const;
    return field.valid() ? 'valid' as const : 'invalid' as const;
  }

  // ── Soumission ──────────────────────────────
  protected submit(event: Event): void {
     event.preventDefault();
    // Perform registration logic here
    const credentials = this.registerModel();
    console.log('Registering with:', credentials);
    if (!this.canSubmit()) return;

    this.authService.clearError();
    const v = this.registerModel();

    const request: RegisterRequest = {
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: `+237${v.phone}`,
      password: v.password,
      dateOfBirth: new Date(v.dateOfBirth),
      region: v.region,
      cniNumber: v.cniNumber,
    };

    this.authService.register(request);
  }
}
