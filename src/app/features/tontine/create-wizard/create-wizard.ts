import {
  ChangeDetectionStrategy, Component, inject,
  signal, computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  form, FormField, required, minLength, min, pattern, validate,
  readonly as formReadonly,
} from '@angular/forms/signals';
import { CreateTontineRequest, TontineResponse } from '../../../core/models/api.model';
import { AuthService } from '../../../core/services/auth.service';
import { InviteLinkWidgetComponent } from '../../../shared/components/invite-link-widget/invite-link-widget';

interface TontineInfoModel {
  nom: string;
  description: string;
  devise: string;
  montantCotisation: number;
  contributionFrequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | '';
  distributionMode: 'ROTATION' | 'AUCTION' | 'LOTTERY' | '';
}

interface PhoneSearchModel {
  phone: string;
}

@Component({
  selector: 'app-create-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, InviteLinkWidgetComponent],
  templateUrl: './create-wizard.html',
})
export class CreateWizardComponent {
  // 1 — Injection
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  // 2 — Modèles de données (signals)
  protected readonly infoModel = signal<TontineInfoModel>({
    nom: '',
    description: '',
    devise: 'XAF',
    montantCotisation: 0,
    contributionFrequency: '',
    distributionMode: '',
  });

  protected readonly phoneModel = signal<PhoneSearchModel>({
    phone: '',
  });

  // 3 — FieldTrees (form)
  protected readonly infoForm = form(this.infoModel, (s) => {
    required(s.nom, { message: 'Le nom de la tontine est obligatoire' });
    minLength(s.nom, 3, { message: 'Le nom doit contenir au moins 3 caractères' });
    formReadonly(s.devise);
    required(s.montantCotisation, { message: 'Le montant de cotisation est obligatoire' });
    min(s.montantCotisation, 500, { message: 'Le montant minimum est 500 XAF' });
    required(s.contributionFrequency, { message: 'Choisissez une fréquence de cotisation' });
    required(s.distributionMode, { message: 'Choisissez un mode de distribution' });
  });

  protected readonly phoneForm = form(this.phoneModel, (s) => {
    required(s.phone, { message: 'Le numéro de téléphone est obligatoire' });
    pattern(s.phone, /^[623]\d{8}$/, {
      message: 'Le numéro doit commencer par 6, 2 ou 3 suivi de 8 chiffres',
    });
  });

  // 4 — Signals d'état (Stepper + Step 2)
  protected readonly currentStep = signal(1);
  protected readonly totalSteps = 2;
  protected readonly searchResults = signal<{ userId: string; firstName: string; lastName: string; phone: string }[]>([]);
  protected readonly isSearching = signal(false);
  protected readonly addedMembers = signal<{ userId: string; firstName: string; lastName: string; phone: string }[]>([]);
  protected readonly isSubmitting = signal(false);

  // 5 — Computed (état dérivé en lecture seule)
  protected readonly isStep1Valid = computed(() =>
    this.infoForm.nom().valid()
    && this.infoForm.montantCotisation().valid()
    && this.infoForm.contributionFrequency().valid()
    && this.infoForm.distributionMode().valid()
  );

  protected readonly isPhoneValid = computed(() =>
    this.phoneForm.phone().valid()
  );

  protected readonly canSubmit = computed(() =>
    this.isStep1Valid() && !this.isSubmitting()
  );

  // 6 — Méthodes

  protected nextStep(): void {
    if (this.currentStep() < this.totalSteps && this.isStep1Valid()) {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  protected previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  protected searchMember(): void {
    if (!this.isPhoneValid()) return;
    const phone = this.phoneForm.phone().value();

    this.isSearching.set(true);
    this.http.get<{ userId: string; firstName: string; lastName: string; phone: string }[]>(
      `http://localhost:8080/api/v1/users/search?phone=+237${phone}`,
    ).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.isSearching.set(false);
      },
      error: () => {
        this.searchResults.set([]);
        this.isSearching.set(false);
      },
    });
  }

  protected addMember(member: { userId: string; firstName: string; lastName: string; phone: string }): void {
    const already = this.addedMembers().some(m => m.userId === member.userId);
    if (!already) {
      this.addedMembers.set([...this.addedMembers(), member]);
    }
    this.searchResults.set([]);
    this.phoneForm.phone().value.set('');
  }

  protected removeMember(userId: string): void {
    this.addedMembers.set(this.addedMembers().filter(m => m.userId !== userId));
  }

  protected submit(): void {
    if (!this.canSubmit()) return;
    this.isSubmitting.set(true);

    const model = this.infoModel();
    const body: CreateTontineRequest = {
      nom: model.nom,
      description: model.description || undefined,
      montantCotisation: model.montantCotisation,
      tauxAmendeForfaitaireJour: 0,
      plafondAmendeEnPourcentage: 0,
      contributionFrequency: model.contributionFrequency,
      distributionMode: model.distributionMode,
      createdByUserId: this.auth.currentUser()?.userId ?? '',
    };

    this.http.post<TontineResponse>('http://localhost:8080/api/v1/tontines', body).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigateByUrl('/tontines');
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }
}
