# API Integration — TontineConnect

> **Skill** : Définir la procédure standard de branchement API pour tout service Angular du projet TontineConnect.
> **Contexte** : Application de gestion de tontines camerounaises — Angular 21+, Zoneless, Signals, HttpClient, environnements dev/prod.

---

## 1. Base URL — Toujours via l'environnement

L'URL de l'API **ne doit jamais** être écrite en dur dans un service ou un composant. Elle provient **exclusivement** du fichier `environment.ts`.

### Fichiers d'environnement

```
src/environments/
├── environment.ts          # Développement — apiUrl: 'http://localhost:8080'
└── environment.prod.ts     # Production    — apiUrl: 'https://api.ftg.cm'
```

### Import et usage dans un service

```typescript
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/api/v1`;
```

### Règles

- **Interdit** : `'http://localhost:8080'`, `'https://api.ftg.cm'` ou toute URL littérale dans les services/composants.
- **Interdit** : construire l'URL via `window.location.origin` ou tout mécanisme dynamique côté client.
- Chaque service déclare une constante `API_URL` en haut du fichier, dérivée de `environment.apiUrl`.
- Les sous-chemins sont concaténés à la constante :

```typescript
// ✅ Correct
this.http.get<TontineResponse>(`${API_URL}/tontines/${id}`)

// ❌ Interdit
this.http.get<TontineResponse>(`http://localhost:8080/api/v1/tontines/${id}`)
```

---

## 2. Type-Safety — Chaque appel HTTP est typé

Toutes les requêtes `HttpClient` doivent être **strictement typées** avec les interfaces générées depuis le Swagger / OpenAPI (`tontine-api.json`).

### Interfaces

Les interfaces se trouvent dans `core/models/` :

| Fichier | Interfaces |
|---|---|
| `auth.model.ts` | `LoginRequest`, `LoginResponse`, `RegisterRequest`, `RegisterResponse` |
| `api.model.ts` | `CreateUserRequest`, `UserResponse`, `CreateTontineRequest`, `TontineResponse`, `CreateSessionRequest`, `SessionResponse`, `ContributionRequest`, `ContributionResponse` |

### Typage des appels

```typescript
// ✅ POST typé — requête ET réponse
this.http.post<LoginResponse>(`${API_URL}/users/login`, request)

// ✅ GET typé — réponse
this.http.get<TontineResponse>(`${API_URL}/tontines/${id}`)

// ✅ GET liste typée
this.http.get<SessionResponse[]>(`${API_URL}/sessions`)

// ❌ Interdit — appel non typé
this.http.post(`${API_URL}/users/login`, request)
this.http.get(`${API_URL}/tontines/${id}`)
```

### Règles

- **Interdit** : appels `http.get()`, `http.post()`, `http.put()`, `http.delete()` sans paramètre de type générique `<T>`.
- **Interdit** : utiliser `any` comme type de réponse.
- Le type de la requête (body) est garanti par le typage du paramètre de la méthode du service :

```typescript
login(request: LoginRequest): void {
  this.http.post<LoginResponse>(`${API_URL}/users/login`, request).subscribe({ ... });
}
```

---

## 3. Error Handling — Signal d'erreur lisible par l'utilisateur

Chaque service qui effectue des appels HTTP doit capturer les erreurs et les transformer en messages lisibles, stockés dans un **signal d'erreur**.

### Pattern standard — `subscribe` avec `error` callback

```typescript
@Injectable({ providedIn: 'root' })
export class TontineService {
  private readonly http = inject(HttpClient);

  private readonly _error = signal<string | null>(null);
  private readonly _isLoading = signal(false);

  readonly error = this._error.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  create(request: CreateTontineRequest): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.post<TontineResponse>(`${API_URL}/tontines`, request).subscribe({
      next: (response) => {
        this._isLoading.set(false);
        // traitement du succès
      },
      error: (err) => {
        this._error.set(this.extractMessage(err));
        this._isLoading.set(false);
      },
    });
  }

  clearError(): void {
    this._error.set(null);
  }

  private extractMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const httpErr = err as { error?: { message?: string }; status?: number };
      if (httpErr.error?.message) return httpErr.error.message;

      switch (httpErr.status) {
        case 0:   return 'Serveur injoignable. Vérifiez votre connexion.';
        case 400: return 'Données invalides. Vérifiez le formulaire.';
        case 401: return 'Session expirée. Veuillez vous reconnecter.';
        case 403: return "Vous n'avez pas les droits pour cette action.";
        case 404: return 'Ressource introuvable.';
        case 409: return 'Conflit : cette donnée existe déjà.';
        case 500: return 'Erreur serveur. Réessayez plus tard.';
        default:  return 'Une erreur inattendue est survenue.';
      }
    }
    return 'Une erreur inattendue est survenue.';
  }
}
```

### Pattern alternatif — `catchError` + `pipe`

Pour les services qui retournent des `Observable` (flux temps réel, opérateurs complexes) :

```typescript
import { catchError, EMPTY, tap } from 'rxjs';

fetchTontine(id: number): void {
  this._isLoading.set(true);
  this._error.set(null);

  this.http.get<TontineResponse>(`${API_URL}/tontines/${id}`).pipe(
    tap((response) => {
      this._tontine.set(response);
      this._isLoading.set(false);
    }),
    catchError((err) => {
      this._error.set(this.extractMessage(err));
      this._isLoading.set(false);
      return EMPTY;
    }),
  ).subscribe();
}
```

### Règles

- **Chaque** service HTTP expose un signal `error: Signal<string | null>` en lecture seule.
- **Chaque** méthode d'appel reset l'erreur au début : `this._error.set(null)`.
- **Chaque** service expose une méthode `clearError()`.
- Les messages d'erreur sont en **français** et adaptés au contexte camerounais.
- **Interdit** : afficher le message brut de l'API sans transformation (`err.message` brut).
- **Interdit** : ignorer silencieusement les erreurs (subscribe vide sans `error` callback).

### Affichage dans le template

```html
@if (service.error()) {
  <div class="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
    <svg class="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
    </svg>
    <span>{{ service.error() }}</span>
  </div>
}
```

---

## 4. Loading State — Signal `isLoading` pour désactiver les interactions

Chaque service HTTP gère un signal `isLoading` qui reflète l'état d'une requête en cours. Les composants l'utilisent pour désactiver les boutons et afficher des indicateurs visuels.

### Cycle de vie du signal

```
Début requête  →  _isLoading.set(true)
Succès         →  _isLoading.set(false)
Erreur         →  _isLoading.set(false)
```

### Service — pattern

```typescript
private readonly _isLoading = signal(false);
readonly isLoading = this._isLoading.asReadonly();

someAction(request: SomeRequest): void {
  this._isLoading.set(true);  // ← toujours en premier
  this._error.set(null);

  this.http.post<SomeResponse>(`${API_URL}/endpoint`, request).subscribe({
    next: () => { this._isLoading.set(false); },
    error: () => { this._isLoading.set(false); },
  });
}
```

### Composant — `computed` pour désactiver le bouton

```typescript
protected readonly canSubmit = computed(() =>
  this.form.email().valid()
  && this.form.password().valid()
  && !this.authService.isLoading()   // ← requête en cours = bouton désactivé
);
```

### Template — bouton avec spinner

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
  @if (isLoading()) {
    <span class="flex items-center justify-center gap-2">
      <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Chargement…
    </span>
  } @else {
    Valider
  }
</button>
```

### Règles

- **Chaque** service HTTP expose un signal `isLoading: Signal<boolean>` en lecture seule.
- Le signal passe à `false` **dans les deux cas** (`next` et `error`) — jamais de loading infini.
- Les composants **n'utilisent jamais** leur propre signal `isLoading` pour les appels API — ils lisent celui du service injecté.
- **Interdit** : utiliser `finalize()` de RxJS pour gérer le loading (le `subscribe` observer suffit).
- **Interdit** : laisser un bouton actif pendant une requête en cours.

---

## 5. Checklist de revue — Intégration API

Avant chaque commit qui ajoute ou modifie un appel HTTP :

- [ ] **Environment** : l'URL utilise `environment.apiUrl`, aucune URL en dur
- [ ] **Type-Safety** : `http.get<T>()` / `http.post<T>()` avec interface du modèle
- [ ] **Error signal** : `_error` signal reset à `null` en début de requête, mis à jour dans `error` callback
- [ ] **Loading signal** : `_isLoading` à `true` au début, `false` dans `next` ET `error`
- [ ] **Messages français** : erreurs transformées en messages lisibles, pas de messages bruts de l'API
- [ ] **Template** : erreur affichée via `@if (service.error())`, bouton désactivé via `canSubmit()` computed
- [ ] **clearError()** : méthode exposée et appelée avant chaque nouvelle soumission
