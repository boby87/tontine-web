# Angular Signals & Zoneless Standards — TontineConnect

> **Skill** : Imposer les standards Angular 2026 (v21+) basés sur les Signals et l'architecture Zoneless pour le projet TontineConnect.
> **Contexte** : Application de gestion de tontines camerounaises (cotisations en XAF, Mobile Money, rôles bureau : Président, Trésorier, Secrétaire, Censeur, Commissaire, Membre).

---

## 1. Zoneless par défaut — Aucun Zone.js

- **Ne jamais** importer ni utiliser `zone.js`. L'application fonctionne en mode Zoneless.
- **Tout composant** doit déclarer `changeDetection: ChangeDetectionStrategy.OnPush` :

```typescript
@Component({
  selector: 'app-session-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './session-list.html',
})
export class SessionListComponent { }
```

- **Interdit** :
  - Importer `NgZone` ou appeler `ngZone.run()`.
  - Appeler `ChangeDetectorRef.detectChanges()` ou `markForCheck()`.
  - Utiliser `setTimeout` / `setInterval` pour déclencher le rendu.
- La détection de changement repose **entièrement** sur les Signals. Toute donnée affichée dans un template doit transiter par un `signal()`, `computed()`, `input()` ou `model()`.

---

## 2. State Management — Signals exclusivement

- Utiliser `signal()`, `computed()` et `effect()` pour **toute** gestion d'état (local et partagé).
- **Interdit** : `BehaviorSubject`, `ReplaySubject`, ou tout `Observable` comme store d'état.
- Les `Observable` restent autorisés **uniquement** pour les flux temps réel (WebSocket, événements push) et les opérateurs complexes (`combineLatest`, `switchMap`…).

### État local d'un composant

```typescript
// ✅ Correct
protected readonly isLoading = signal(false);
protected readonly selectedMember = signal<TontineMember | null>(null);
protected readonly contributionAmount = signal(0);

protected readonly formattedAmount = computed(() =>
  new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' })
    .format(this.contributionAmount())
);

// ❌ Interdit
private isLoading$ = new BehaviorSubject(false);
```

### Service / Store partagé

```typescript
@Injectable({ providedIn: 'root' })
export class TontineStore {
  // État privé mutable
  private readonly _tontines = signal<Tontine[]>([]);
  private readonly _selectedId = signal<string | null>(null);

  // Lecture seule pour les consommateurs
  readonly tontines = this._tontines.asReadonly();

  readonly activeTontines = computed(() =>
    this._tontines().filter(t => t.deleted_at === null)
  );

  readonly selectedTontine = computed(() =>
    this._tontines().find(t => t.id === this._selectedId())
  );

  select(id: string): void {
    this._selectedId.set(id);
  }

  updateList(tontines: Tontine[]): void {
    this._tontines.set(tontines);
  }
}
```

---

## 3. Inputs / Outputs — input(), output(), model()

- **Interdit** : décorateurs `@Input()`, `@Output()` et `EventEmitter`.
- Utiliser les fonctions `input()`, `output()` et `model()` :

```typescript
// ✅ Correct
export class MemberCardComponent {
  // Input obligatoire
  readonly member = input.required<TontineMember>();
  // Input optionnel avec valeur par défaut
  readonly showActions = input(true);
  // Output typé
  readonly sanctioned = output<Sanction>();
  // Two-way binding (formulaires, sélections)
  readonly selectedRole = model<MemberRole>('MEMBER');
}
```

```typescript
// ❌ Interdit
export class MemberCardComponent {
  @Input() member!: TontineMember;
  @Output() sanctioned = new EventEmitter<Sanction>();
}
```

- Utiliser `input.required<T>()` pour les données obligatoires (ex : `member`, `tontineId`).
- Utiliser `model()` pour le two-way binding : sélection du rôle d'un membre, choix du mode de distribution, bascule de thème clair/sombre.

---

## 4. Injection de dépendances — inject()

- **Interdit** : injection par constructeur.
- Utiliser `inject()` comme champ de classe :

```typescript
// ✅ Correct
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tontineStore = inject(TontineStore);
}

// ❌ Interdit
export class PaymentService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}
}
```

- Pour les `InjectionToken` personnalisés : `inject(API_BASE_URL)`.
- Les constructeurs doivent rester **vides** ou absents.

---

## 5. Signal-based Forms — Formulaires réactifs par Signals

- Pour les formulaires de saisie (montants de cotisation, configuration tontine, demande de prêt), utiliser les **Signal-based Forms**.
- Chaque champ de formulaire est un `signal()` ou `model()`. La validation et les valeurs dérivées utilisent `computed()`.

### Formulaire de paiement de cotisation

```typescript
export class ContributionPaymentComponent {
  private readonly tontineStore = inject(TontineStore);

  // Champs de formulaire
  protected readonly amount = signal(0);
  protected readonly paymentMethod = signal<'MTN_MOMO' | 'ORANGE_MONEY' | 'CASH'>('MTN_MOMO');
  protected readonly mobileMoneyNumber = signal('');

  // Validation dérivée
  protected readonly minAmount = computed(() =>
    this.tontineStore.selectedTontine()?.contribution_amount ?? 0
  );

  protected readonly isAmountValid = computed(() =>
    this.amount() >= this.minAmount() && this.amount() > 0
  );

  protected readonly isPhoneRequired = computed(() =>
    this.paymentMethod() !== 'CASH'
  );

  protected readonly isFormValid = computed(() =>
    this.isAmountValid()
    && (!this.isPhoneRequired() || this.mobileMoneyNumber().length >= 9)
  );

  protected submit(): void {
    if (!this.isFormValid()) return;
    // ...
  }
}
```

### Formulaire de configuration de tontine (extraits)

```typescript
export class TontineConfigComponent {
  // Identité
  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly currency = signal<'XAF'>('XAF');

  // Cotisations
  protected readonly contributionAmount = signal(0);
  protected readonly contributionFrequency = signal<'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'>('MONTHLY');
  protected readonly distributionMode = model<'ROTATION' | 'AUCTION' | 'LOTTERY'>('ROTATION');

  // Prêts
  protected readonly loanEnabled = signal(false);
  protected readonly loanInterestRate = signal(5);
  protected readonly loanMaxDurationMonths = signal(12);

  // Validation
  protected readonly isNameValid = computed(() => this.name().trim().length >= 2);
  protected readonly isContributionValid = computed(() => this.contributionAmount() > 0);
}
```

- **Interdit** : `FormGroup`, `FormControl`, `FormBuilder` des Reactive Forms classiques pour les formulaires simples. Les Signal-based Forms sont le standard.
- Pour les formulaires dynamiques très complexes (nombre de champs variable), les Reactive Forms restent tolérés en dernier recours.

---

## 6. Performance — linkedSignal pour les états dérivés mutables

- Utiliser `linkedSignal()` quand un signal doit **se réinitialiser automatiquement** lorsqu'un signal source change, tout en restant modifiable localement.
- Cas typiques dans TontineConnect :
  - Montant de cotisation pré-rempli depuis la config mais éditable par le trésorier.
  - Filtre de rôle qui se reset quand on change de tontine.
  - Bénéficiaire par défaut recalculé à chaque nouvelle session.

### Montant de cotisation lié à la config

```typescript
export class ContributionFormComponent {
  private readonly tontineStore = inject(TontineStore);

  // Se réinitialise automatiquement quand selectedTontine change,
  // mais le trésorier peut ajuster manuellement le montant
  protected readonly amount = linkedSignal(() =>
    this.tontineStore.selectedTontine()?.contribution_amount ?? 0
  );

  protected adjustAmount(value: number): void {
    this.amount.set(value); // modification locale
  }
}
```

### Filtre de rôle lié à la tontine active

```typescript
export class MemberListComponent {
  readonly tontineId = input.required<string>();

  // Reset à 'ALL' quand tontineId change
  protected readonly roleFilter = linkedSignal<string, MemberRole | 'ALL'>({
    source: () => this.tontineId(),
    computation: () => 'ALL',
  });
}
```

### Bénéficiaire par défaut lié à la session

```typescript
export class SessionPlanningComponent {
  readonly sessionNumber = input.required<number>();
  private readonly memberStore = inject(MemberStore);

  // Recalculé à chaque changement de numéro de session (rotation)
  protected readonly defaultBeneficiary = linkedSignal({
    source: () => this.sessionNumber(),
    computation: (sessionNum) => {
      const members = this.memberStore.orderedMembers();
      return members[(sessionNum - 1) % members.length] ?? null;
    },
  });
}
```

- **Préférer `linkedSignal`** à un `effect()` qui appelle `.set()` sur un autre signal — c'est plus déclaratif et évite les pièges de timing.
- **Préférer `computed()`** si la valeur n'a jamais besoin d'être modifiée localement.

| Besoin | API à utiliser |
|--------|----------------|
| Valeur dérivée en lecture seule | `computed()` |
| Valeur dérivée **mais modifiable** localement | `linkedSignal()` |
| État indépendant | `signal()` |
| Side-effect (logging, sync localStorage) | `effect()` |

---

## 7. Structure de composant — Récapitulatif

Chaque composant doit respecter cet ordre :

```typescript
import {
  Component, ChangeDetectionStrategy, inject,
  input, output, model, signal, computed, linkedSignal,
} from '@angular/core';

@Component({
  selector: 'app-contribution-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contribution-form.html',
  styleUrl: './contribution-form.css',
})
export class ContributionFormComponent {
  // 1 — Injection
  private readonly tontineStore = inject(TontineStore);
  private readonly paymentService = inject(PaymentService);

  // 2 — Inputs / Outputs / Models
  readonly memberId = input.required<string>();
  readonly sessionId = input.required<string>();
  readonly submitted = output<Payment>();
  readonly paymentMethod = model<PaymentMethod>('MTN_MOMO');

  // 3 — État local (signals)
  protected readonly amount = linkedSignal(() =>
    this.tontineStore.selectedTontine()?.contribution_amount ?? 0
  );
  protected readonly isSubmitting = signal(false);

  // 4 — Computed
  protected readonly isValid = computed(() =>
    this.amount() > 0 && !this.isSubmitting()
  );

  // 5 — Methods
  protected async submit(): Promise<void> {
    if (!this.isValid()) return;
    this.isSubmitting.set(true);
    // ...
  }
}
```

---

## 8. Checklist de revue de code

Avant chaque commit, vérifier :

- [ ] **Zoneless** : aucun import de `zone.js`, aucun `NgZone`, aucun `ChangeDetectorRef`
- [ ] **OnPush** : tous les composants ont `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] **Signals** : aucun `BehaviorSubject` / `Observable` pour de l'état simple
- [ ] **Inputs/Outputs** : aucun `@Input()` / `@Output()` — uniquement `input()`, `output()`, `model()`
- [ ] **Injection** : aucune injection par constructeur — uniquement `inject()`
- [ ] **Forms** : les formulaires de saisie utilisent des `signal()` / `model()` / `computed()` (pas de `FormGroup`)
- [ ] **linkedSignal** : les états dépendants mais mutables utilisent `linkedSignal()` (pas `effect` + `set`)
- [ ] **computed vs linkedSignal** : les valeurs dérivées en lecture seule utilisent `computed()`, pas `linkedSignal()`
