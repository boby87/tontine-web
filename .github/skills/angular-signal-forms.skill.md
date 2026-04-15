# Angular Signal Forms — TontineConnect

> **Skill** : Imposer l'utilisation des Signal Forms (Angular 21+) pour tous les formulaires du projet TontineConnect.
> **Contexte** : Application de gestion de tontines camerounaises — cotisations en XAF, paiements Mobile Money (MTN MoMo, Orange Money), rôles bureau, sanctions, prêts.

---

## 1. Signal-based Forms — `form()` + `[formField]`

Tous les formulaires **doivent** utiliser l'API Signal Forms de `@angular/forms/signals`. Le flux standard est :

1. Créer un `signal<T>()` contenant le modèle de données.
2. Passer ce signal à `form()` pour obtenir un `FieldTree`.
3. Lier les inputs HTML avec la directive `[formField]`.
4. Lire l'état via `field().value()`, `field().valid()`, `field().errors()`, etc.

### Exemple — Formulaire de paiement de cotisation

```typescript
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { form, FormField, required, min, pattern, validate } from '@angular/forms/signals';

interface ContributionPayment {
  amount: number;
  paymentMethod: 'MTN_MOMO' | 'ORANGE_MONEY' | 'CASH';
  mobileNumber: string;
  reference: string;
}

@Component({
  selector: 'app-contribution-payment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField],
  templateUrl: './contribution-payment.html',
})
export class ContributionPaymentComponent {
  private readonly tontineStore = inject(TontineStore);

  // 1. Modèle de données (signal source)
  protected readonly paymentModel = signal<ContributionPayment>({
    amount: 0,
    paymentMethod: 'MTN_MOMO',
    mobileNumber: '',
    reference: '',
  });

  // 2. FieldTree avec validation via schema
  protected readonly paymentForm = form(this.paymentModel, (s) => {
    required(s.amount, { message: 'Le montant est obligatoire' });
    min(s.amount, 1000, { message: 'Le montant minimum est 1 000 XAF' });
    required(s.paymentMethod, { message: 'Choisissez un mode de paiement' });
    required(s.mobileNumber, {
      message: 'Le numéro Mobile Money est obligatoire',
      when: ({ valueOf }) => valueOf(s.paymentMethod) !== 'CASH',
    });
    pattern(s.mobileNumber, /^6[5-9]\d{7}$/, {
      message: 'Numéro camerounais invalide (ex: 6 55 00 00 00)',
    });
  });
}
```

```html
<!-- 3. Liaison HTML avec [formField] -->
<form novalidate (ngSubmit)="submit()">
  <label>
    Montant (XAF)
    <input type="number" [formField]="paymentForm.amount" />
  </label>

  <select [formField]="paymentForm.paymentMethod">
    <option value="MTN_MOMO">MTN MoMo</option>
    <option value="ORANGE_MONEY">Orange Money</option>
    <option value="CASH">Espèces</option>
  </select>

  <label>
    Numéro Mobile Money
    <input type="tel" [formField]="paymentForm.mobileNumber" />
  </label>

  <button type="submit">Payer</button>
</form>
```

### Interdit

- **Ne jamais** utiliser `FormGroup`, `FormControl`, `FormBuilder`, `FormArray` des Reactive Forms classiques.
- **Ne jamais** utiliser `[(ngModel)]` ou les Template-driven Forms.
- **Ne jamais** importer `ReactiveFormsModule` ou `FormsModule`.
- Seul import autorisé : `@angular/forms/signals` → `form`, `FormField`, validateurs, règles.

---

## 2. Validation Dynamique — Schema + `validate()` + `computed()`

La validation est déclarée dans la **schema function** (2ème argument de `form()`). Toute validation — synchrone, asynchrone, croisée — s'y définit.

### Validateurs intégrés

| Validateur | Import | Usage |
|---|---|---|
| `required()` | `@angular/forms/signals` | Champ obligatoire |
| `email()` | `@angular/forms/signals` | Format email |
| `min(path, n)` | `@angular/forms/signals` | Valeur numérique minimum |
| `max(path, n)` | `@angular/forms/signals` | Valeur numérique maximum |
| `minLength(path, n)` | `@angular/forms/signals` | Longueur minimum (string / array) |
| `maxLength(path, n)` | `@angular/forms/signals` | Longueur maximum (string / array) |
| `pattern(path, regex)` | `@angular/forms/signals` | Regex |
| `validate(path, fn)` | `@angular/forms/signals` | Validation custom synchrone |
| `validateHttp(path, opts)` | `@angular/forms/signals` | Validation async HTTP |
| `validateStandardSchema()` | `@angular/forms/signals` | Intégration Zod / Valibot |

### Messages d'erreur personnalisés

Tous les validateurs acceptent `{ message: '...' }`. Toujours fournir un message clair en français :

```typescript
required(s.name, { message: 'Le nom de la tontine est obligatoire' });
min(s.amount, 5000, { message: 'Le montant minimum de cotisation est 5 000 XAF' });
```

### Validation conditionnelle (`when`)

```typescript
required(s.mobileNumber, {
  message: 'Numéro requis pour le paiement mobile',
  when: ({ valueOf }) => valueOf(s.paymentMethod) !== 'CASH',
});
```

### Validation croisée (cross-field) avec `validate()`

```typescript
protected readonly passwordForm = form(this.passwordModel, (s) => {
  required(s.password, { message: 'Mot de passe requis' });
  minLength(s.password, 8, { message: 'Minimum 8 caractères' });
  required(s.confirmPassword, { message: 'Confirmez le mot de passe' });
  validate(s.confirmPassword, ({ value, valueOf }) => {
    if (value() !== valueOf(s.password)) {
      return { kind: 'passwordMismatch', message: 'Les mots de passe ne correspondent pas' };
    }
    return null;
  });
});
```

### Validation async avec `validateHttp()`

```typescript
validateHttp(s.email, {
  request: ({ value }) => `/api/members/check-email?email=${value()}`,
  onSuccess: (response: { exists: boolean }) =>
    response.exists
      ? { kind: 'emailTaken', message: 'Cet email est déjà utilisé' }
      : null,
  onError: () => ({
    kind: 'networkError',
    message: 'Impossible de vérifier la disponibilité',
  }),
});
```

### Lecture de l'état de validation dans le template

Chaque champ du `FieldTree` expose des signaux réactifs :

| Signal | Type | Description |
|---|---|---|
| `field().value()` | `T` | Valeur courante |
| `field().valid()` | `boolean` | Toutes les validations passent |
| `field().invalid()` | `boolean` | Au moins une erreur |
| `field().touched()` | `boolean` | L'utilisateur a interagi (focus + blur) |
| `field().dirty()` | `boolean` | L'utilisateur a modifié la valeur |
| `field().pending()` | `boolean` | Validation async en cours |
| `field().errors()` | `{ kind, message }[]` | Liste des erreurs |
| `field().disabled()` | `boolean` | Champ désactivé |
| `field().hidden()` | `boolean` | Champ masqué |

### Pattern d'affichage d'erreur — `touched() && invalid()`

```html
@if (paymentForm.amount().touched() && paymentForm.amount().invalid()) {
  <div class="mt-1 text-sm text-red-600">
    @for (error of paymentForm.amount().errors(); track error.kind) {
      <p>{{ error.message }}</p>
    }
  </div>
}
```

### Computed dérivés pour l'état global

Utiliser `computed()` pour agréger l'état du formulaire et piloter les boutons / indicateurs :

```typescript
protected readonly isFormValid = computed(() =>
  this.paymentForm.amount().valid()
  && this.paymentForm.paymentMethod().valid()
  && (!this.isPhoneRequired() || this.paymentForm.mobileNumber().valid())
);

protected readonly isSubmitting = signal(false);

protected readonly canSubmit = computed(() =>
  this.isFormValid() && !this.isSubmitting()
);
```

---

## 3. Liaison (Binding) — `[formField]` bidirectionnel

La directive `[formField]` crée une **liaison bidirectionnelle automatique** entre le champ HTML et le signal du modèle.

### Règles

- Utiliser `[formField]` sur **tous** les éléments de formulaire : `<input>`, `<select>`, `<textarea>`, `<input type="checkbox">`, `<input type="radio">`.
- La directive synchronise automatiquement les attributs HTML natifs : `required`, `disabled`, `readonly`, `min`, `max`, `maxlength`.
- **Ne jamais** ajouter manuellement `[disabled]`, `[required]`, `[readonly]` quand `[formField]` est utilisé — les configurer via les **rules** du schema.
- L'élément `<form>` doit avoir `novalidate` pour désactiver la validation native du navigateur.

### Tous les types d'inputs

```html
<!-- Texte -->
<input type="text" [formField]="tontineForm.name" />

<!-- Nombre — conversion automatique string → number -->
<input type="number" [formField]="tontineForm.contributionAmount" />

<!-- Email -->
<input type="email" [formField]="tontineForm.contactEmail" />

<!-- Date — stocke en format YYYY-MM-DD -->
<input type="date" [formField]="sessionForm.scheduledDate" />

<!-- Checkbox — booléen -->
<label>
  <input type="checkbox" [formField]="tontineForm.loanEnabled" />
  Activer les prêts
</label>

<!-- Radio — même [formField] = même group -->
<label>
  <input type="radio" value="ROTATION" [formField]="tontineForm.distributionMode" />
  Rotation
</label>
<label>
  <input type="radio" value="AUCTION" [formField]="tontineForm.distributionMode" />
  Enchères
</label>

<!-- Select -->
<select [formField]="tontineForm.frequency">
  <option value="">-- Choisir --</option>
  <option value="WEEKLY">Hebdomadaire</option>
  <option value="BIWEEKLY">Bi-mensuel</option>
  <option value="MONTHLY">Mensuel</option>
</select>

<!-- Textarea -->
<textarea [formField]="tontineForm.description" rows="4"></textarea>
```

### Mise à jour programmatique via `value.set()`

```typescript
// Met à jour le champ ET le modèle source
this.paymentForm.amount().value.set(50000);
```

### Form Logic — Règles du schema

Utiliser les **rules** dans le schema pour contrôler `disabled`, `hidden`, `readonly`, `debounce` :

```typescript
protected readonly form = form(this.model, (s) => {
  // Désactiver le champ coupon si total < 50 000
  disabled(s.couponCode, ({ valueOf }) =>
    valueOf(s.total) < 50000 ? 'Le coupon nécessite un total ≥ 50 000 XAF' : false,
  );

  // Masquer le champ adresse de livraison si retrait en agence
  hidden(s.shippingAddress, ({ valueOf }) => valueOf(s.pickupInStore));

  // Readonly pour un champ système
  readonly(s.referenceNumber);

  // Debounce pour les recherches
  debounce(s.searchQuery, 300);
});
```

Utiliser `@if` dans le template pour les champs `hidden` (la directive ne lie pas l'attribut `hidden` automatiquement) :

```html
@if (!form.shippingAddress().hidden()) {
  <label>
    Adresse de livraison
    <input [formField]="form.shippingAddress" />
  </label>
}
```

---

## 4. LinkedSignal — Réinitialisation liée au contexte

Utiliser `linkedSignal()` pour les champs qui doivent **se réinitialiser** quand une dépendance change, tout en restant modifiables localement par l'utilisateur.

### Quand utiliser `linkedSignal` dans un formulaire

| Besoin | API |
|---|---|
| Valeur dérivée en lecture seule (label, total formaté) | `computed()` |
| Valeur dérivée ET modifiable localement | `linkedSignal()` |
| Champ de formulaire standard | `signal()` dans le modèle + `form()` |

### Montant pré-rempli depuis la config, modifiable par le trésorier

```typescript
export class ContributionFormComponent {
  private readonly tontineStore = inject(TontineStore);

  // Se réinitialise quand la tontine sélectionnée change
  protected readonly amount = linkedSignal(() =>
    this.tontineStore.selectedTontine()?.contribution_amount ?? 0
  );
}
```

### Bénéficiaire par défaut calculé selon le numéro de session

```typescript
export class SessionPlanningComponent {
  readonly sessionNumber = input.required<number>();
  private readonly memberStore = inject(MemberStore);

  protected readonly defaultBeneficiary = linkedSignal({
    source: () => this.sessionNumber(),
    computation: (sessionNum) => {
      const members = this.memberStore.orderedMembers();
      return members[(sessionNum - 1) % members.length] ?? null;
    },
  });
}
```

### Taux d'intérêt lié au type de prêt

```typescript
export class LoanRequestComponent {
  protected readonly loanModel = signal({
    loanType: 'STANDARD' as 'STANDARD' | 'EMERGENCY',
    amount: 0,
    durationMonths: 6,
  });

  protected readonly loanForm = form(this.loanModel, (s) => {
    required(s.amount, { message: 'Le montant est obligatoire' });
    min(s.amount, 10000, { message: 'Minimum 10 000 XAF' });
  });

  // Taux par défaut lié au type — STANDARD: 5%, EMERGENCY: 10%
  // Le trésorier peut ajuster manuellement
  protected readonly interestRate = linkedSignal({
    source: () => this.loanForm.loanType().value(),
    computation: (type) => (type === 'EMERGENCY' ? 10 : 5),
  });
}
```

### Combinaison avec `form()` — Pattern recommandé

Quand le modèle du formulaire contient un champ qui doit se réinitialiser, utiliser `linkedSignal` comme **signal source du modèle** :

```typescript
export class MemberFilterComponent {
  readonly tontineId = input.required<string>();

  // Le filtre de rôle se reset à 'ALL' quand on change de tontine
  protected readonly roleFilter = linkedSignal<string, MemberRole | 'ALL'>({
    source: () => this.tontineId(),
    computation: () => 'ALL',
  });
}
```

### Interdit

- **Ne jamais** utiliser `effect()` + `.set()` pour simuler un `linkedSignal` — c'est un anti-pattern.
- **Préférer `computed()`** si la valeur n'a jamais besoin d'être modifiée localement.

---

## 5. Tailwind Integration — Classes dynamiques selon l'état du Signal

Les bordures, couleurs et messages d'erreur doivent refléter **en temps réel** l'état de validation du champ via des classes Tailwind appliquées dynamiquement.

### Pattern standard — Bordure conditionnelle

```html
<input
  type="number"
  [formField]="paymentForm.amount"
  class="w-full rounded-lg border px-4 py-2 text-sm transition-colors
         focus:outline-none focus:ring-2"
  [class.border-gray-300]="!paymentForm.amount().touched()"
  [class.focus\:ring-indigo-500]="!paymentForm.amount().touched()"
  [class.border-red-500]="paymentForm.amount().touched() && paymentForm.amount().invalid()"
  [class.focus\:ring-red-500]="paymentForm.amount().touched() && paymentForm.amount().invalid()"
  [class.border-green-500]="paymentForm.amount().touched() && paymentForm.amount().valid()"
  [class.focus\:ring-green-500]="paymentForm.amount().touched() && paymentForm.amount().valid()"
/>
```

### Utiliser des `computed()` pour simplifier les classes répétitives

```typescript
protected readonly amountState = computed(() => {
  const field = this.paymentForm.amount();
  if (!field.touched()) return 'neutral' as const;
  return field.valid() ? 'valid' as const : 'invalid' as const;
});
```

```html
<input
  type="number"
  [formField]="paymentForm.amount"
  class="w-full rounded-lg border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2"
  [class.border-gray-300]="amountState() === 'neutral'"
  [class.border-red-500]="amountState() === 'invalid'"
  [class.border-green-500]="amountState() === 'valid'"
/>
```

### Message d'erreur avec icône

```html
@if (paymentForm.amount().touched() && paymentForm.amount().invalid()) {
  <div class="mt-1 flex items-center gap-1 text-sm text-red-600">
    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clip-rule="evenodd" />
    </svg>
    @for (error of paymentForm.amount().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  </div>
}

@if (paymentForm.amount().touched() && paymentForm.amount().valid()) {
  <div class="mt-1 flex items-center gap-1 text-sm text-green-600">
    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clip-rule="evenodd" />
    </svg>
    <span>Valide</span>
  </div>
}
```

### Indicateur de chargement (validation async)

```html
@if (paymentForm.email().pending()) {
  <div class="mt-1 flex items-center gap-1 text-sm text-amber-600">
    <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <span>Vérification en cours…</span>
  </div>
}
```

### Bouton submit désactivé

```html
<button
  type="submit"
  class="w-full rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors"
  [class.bg-indigo-600]="canSubmit()"
  [class.hover\:bg-indigo-700]="canSubmit()"
  [class.bg-gray-400]="!canSubmit()"
  [class.cursor-not-allowed]="!canSubmit()"
  [disabled]="!canSubmit()"
>
  @if (isSubmitting()) {
    <span class="flex items-center justify-center gap-2">
      <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Paiement en cours…
    </span>
  } @else {
    Payer {{ paymentForm.amount().value() | number:'1.0-0' }} XAF
  }
</button>
```

### Règles Tailwind

- Les classes de base (`w-full`, `rounded-lg`, `px-4`, `py-2`, `text-sm`) sont **statiques** dans `class=""`.
- Les classes dynamiques (`border-red-500`, `border-green-500`, `bg-gray-400`) utilisent **`[class.xxx]="signal()"`**.
- **Ne jamais** utiliser `[ngClass]` — préférer `[class.xxx]` avec des expressions signal.
- **Ne jamais** écrire de CSS custom pour les états d'erreur — les classes Tailwind suffisent.
- Palette de couleurs pour les états :
  - Neutre (non touché) : `border-gray-300`, `ring-indigo-500`
  - Erreur : `border-red-500`, `text-red-600`, `ring-red-500`
  - Succès : `border-green-500`, `text-green-600`, `ring-green-500`
  - Chargement : `text-amber-600`, `animate-spin`
  - Désactivé : `bg-gray-400`, `cursor-not-allowed`

---

## 6. Structure de composant — Récapitulatif

Chaque composant de formulaire doit respecter cet ordre :

```typescript
import {
  ChangeDetectionStrategy, Component, inject,
  input, output, signal, computed, linkedSignal,
} from '@angular/core';
import {
  form, FormField, required, min, max, minLength,
  pattern, validate, disabled, hidden, debounce,
} from '@angular/forms/signals';

@Component({
  selector: 'app-contribution-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField],
  templateUrl: './contribution-form.html',
})
export class ContributionFormComponent {
  // 1 — Injection
  private readonly tontineStore = inject(TontineStore);

  // 2 — Inputs / Outputs
  readonly memberId = input.required<string>();
  readonly submitted = output<Payment>();

  // 3 — Modèle de données (signal)
  protected readonly paymentModel = signal<ContributionPayment>({
    amount: 0,
    paymentMethod: 'MTN_MOMO',
    mobileNumber: '',
  });

  // 4 — FieldTree (form)
  protected readonly paymentForm = form(this.paymentModel, (s) => {
    required(s.amount);
    min(s.amount, 1000);
    required(s.mobileNumber, {
      when: ({ valueOf }) => valueOf(s.paymentMethod) !== 'CASH',
    });
    disabled(s.mobileNumber, ({ valueOf }) =>
      valueOf(s.paymentMethod) === 'CASH' ? 'Pas requis pour le paiement en espèces' : false,
    );
  });

  // 5 — LinkedSignals (valeurs dérivées mutables)
  protected readonly amount = linkedSignal(() =>
    this.tontineStore.selectedTontine()?.contribution_amount ?? 0
  );

  // 6 — Computed (état dérivé en lecture seule)
  protected readonly canSubmit = computed(() =>
    this.paymentForm.amount().valid()
    && this.paymentForm.paymentMethod().valid()
  );

  // 7 — Méthodes
  protected submit(): void { /* ... */ }
}
```

---

## 7. Checklist de revue de code — Formulaires

Avant chaque commit, vérifier :

- [ ] **Signal Forms** : le formulaire utilise `form()` + `[formField]` (pas de `FormGroup`, `FormControl`, `FormBuilder`)
- [ ] **Import** : seul `@angular/forms/signals` est importé (pas `@angular/forms` directement)
- [ ] **Validation schema** : toute validation est déclarée dans la schema function de `form()`
- [ ] **Messages** : chaque validateur a un `{ message: '...' }` en français
- [ ] **`touched() && invalid()`** : les erreurs ne s'affichent qu'après interaction utilisateur
- [ ] **`computed()`** : l'état global du formulaire (`canSubmit`, `isFormValid`) est un `computed`
- [ ] **`linkedSignal()`** : les valeurs pré-remplies dépendantes utilisent `linkedSignal` (pas `effect` + `set`)
- [ ] **`[formField]`** : aucun `[(ngModel)]`, `[formControl]`, `formControlName` dans les templates
- [ ] **`novalidate`** : la balise `<form>` a l'attribut `novalidate`
- [ ] **Tailwind dynamique** : bordures rouge/verte via `[class.border-red-500]` / `[class.border-green-500]` (pas de `[ngClass]`, pas de CSS custom)
- [ ] **OnPush** : le composant a `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] **inject()** : aucune injection par constructeur
