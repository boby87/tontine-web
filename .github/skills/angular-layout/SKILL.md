# Angular Layout & Structure — TontineConnect

> **Skill** : Définir l'architecture des dossiers, le layout principal (Sidebar + Navbar), la navigation par rôle et les bonnes pratiques Tailwind CSS / Responsive / Accessibilité.
> **Contexte** : Application web d'administration de tontines camerounaises (Angular 21+, Tailwind CSS 4, Zoneless OnPush, Signals).

---

## 1. Architecture des dossiers

```
src/app/
│
├── core/                         # Singleton — chargé une seule fois à la racine
│   ├── auth/
│   │   ├── auth.guard.ts         # Guard de route (canActivate basé sur le token)
│   │   ├── auth.interceptor.ts   # HttpInterceptor — injection du JWT
│   │   ├── auth.service.ts       # Login, logout, refresh token, état utilisateur
│   │   └── auth.model.ts         # Types : AuthUser, LoginRequest, TokenPair
│   ├── guards/
│   │   └── role.guard.ts         # Guard basé sur MemberRole (Président, Trésorier…)
│   ├── interceptors/
│   │   └── error.interceptor.ts  # Gestion centralisée des erreurs HTTP (401, 403, 500)
│   ├── services/
│   │   ├── navigation.service.ts # Signal : état sidebar, menu actif, breadcrumb
│   │   └── notification.service.ts
│   └── models/
│       ├── member-role.model.ts  # Enum MemberRole + type NavItem
│       └── api-response.model.ts
│
├── shared/                       # Composants UI réutilisables — aucune logique métier
│   ├── components/
│   │   ├── button/
│   │   │   ├── button.ts
│   │   │   └── button.html
│   │   ├── badge/
│   │   │   ├── badge.ts
│   │   │   └── badge.html
│   │   ├── modal/
│   │   │   ├── modal.ts
│   │   │   └── modal.html
│   │   ├── spinner/
│   │   ├── avatar/
│   │   ├── card/
│   │   ├── empty-state/
│   │   └── error-message/
│   ├── directives/
│   └── pipes/
│       └── xaf-currency.pipe.ts  # Formate les montants en XAF (ex : 25 000 FCFA)
│
├── layout/                       # Shell de l'application (Sidebar + Navbar + Outlet)
│   ├── main-layout/
│   │   ├── main-layout.ts
│   │   └── main-layout.html
│   ├── sidebar/
│   │   ├── sidebar.ts
│   │   └── sidebar.html
│   ├── navbar/
│   │   ├── navbar.ts
│   │   └── navbar.html
│   └── sidebar-item/
│       ├── sidebar-item.ts
│       └── sidebar-item.html
│
├── features/                     # Un dossier par domaine métier
│   ├── dashboard/
│   ├── tontine/                  # Création, configuration, cycles
│   ├── member/                   # Inscription, profil, adhésion
│   ├── session/                  # Planification, présences, PV
│   ├── payment/                  # Cotisations, Mobile Money, trésorerie
│   ├── sanction/                 # Application, suivi, barème
│   ├── loan/                     # Demande, garants, remboursement
│   ├── bureau/                   # Postes, nominations, élections
│   ├── report/                   # Bilans, exports PDF/Excel
│   └── settings/                 # Profil utilisateur, 2FA, langue
│
├── app.ts
├── app.html
├── app.config.ts
├── app.routes.ts
└── app.css
```

### Règles

| Dossier | Contenu autorisé | Interdit |
|---------|-----------------|----------|
| `core/` | Services `providedIn: 'root'`, guards, interceptors, modèles globaux | Composants avec template |
| `shared/` | Composants UI purs (input → output), pipes, directives | Services métier, appels API |
| `layout/` | Composants de structure (shell, sidebar, navbar) | Logique métier |
| `features/` | Composants, services, routes, modèles d'un domaine métier | Code partagé entre features (→ `shared/`) |

- Chaque feature possède son propre fichier de routes chargé en **lazy loading** :

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes') },
      { path: 'tontines', loadChildren: () => import('./features/tontine/tontine.routes') },
      { path: 'members', loadChildren: () => import('./features/member/member.routes') },
      { path: 'sessions', loadChildren: () => import('./features/session/session.routes') },
      { path: 'payments', loadChildren: () => import('./features/payment/payment.routes') },
      { path: 'sanctions', loadChildren: () => import('./features/sanction/sanction.routes') },
      { path: 'loans', loadChildren: () => import('./features/loan/loan.routes') },
      { path: 'bureau', loadChildren: () => import('./features/bureau/bureau.routes') },
      { path: 'reports', loadChildren: () => import('./features/report/report.routes') },
      { path: 'settings', loadChildren: () => import('./features/settings/settings.routes') },
    ],
  },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) },
  { path: '**', redirectTo: 'dashboard' },
];
```

---

## 2. Layout Principal — MainLayoutComponent

Le `MainLayoutComponent` est le shell authentifié. Il compose la **Sidebar** fixe à gauche et la **Navbar** en haut, avec le `<router-outlet>` au centre.

### Template (`main-layout.html`)

```html
<div class="flex h-screen overflow-hidden bg-gray-50">
  <!-- Overlay mobile -->
  @if (navService.isSidebarOpen() && isMobile()) {
    <div
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      (click)="navService.closeSidebar()"
      aria-hidden="true"
    ></div>
  }

  <!-- Sidebar -->
  <app-sidebar
    [collapsed]="navService.isSidebarCollapsed()"
    [open]="navService.isSidebarOpen()"
    class="z-40"
  />

  <!-- Contenu principal -->
  <div class="flex flex-1 flex-col overflow-hidden">
    <app-navbar
      (toggleSidebar)="navService.toggleSidebar()"
      (toggleCollapse)="navService.toggleCollapse()"
    />

    <main class="flex-1 overflow-y-auto p-4 lg:p-6">
      <router-outlet />
    </main>
  </div>
</div>
```

### Composant (`main-layout.ts`)

```typescript
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { NavbarComponent } from '../navbar/navbar';
import { NavigationService } from '../../core/services/navigation.service';

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './main-layout.html',
})
export class MainLayoutComponent {
  protected readonly navService = inject(NavigationService);

  // Détection mobile via matchMedia (pas de resize listener)
  protected readonly isMobile = signal(window.matchMedia('(max-width: 1023px)').matches);

  constructor() {
    const mql = window.matchMedia('(max-width: 1023px)');
    mql.addEventListener('change', (e) => this.isMobile.set(e.matches));
  }
}
```

---

## 3. Navigation Service — État Sidebar par Signals

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  // --- État sidebar ---
  private readonly _isSidebarOpen = signal(false);       // mobile : drawer ouvert/fermé
  private readonly _isSidebarCollapsed = signal(false);   // desktop : icônes seules / pleine largeur

  readonly isSidebarOpen = this._isSidebarOpen.asReadonly();
  readonly isSidebarCollapsed = this._isSidebarCollapsed.asReadonly();

  readonly sidebarWidth = computed(() =>
    this._isSidebarCollapsed() ? 'w-16' : 'w-64'
  );

  toggleSidebar(): void {
    this._isSidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this._isSidebarOpen.set(false);
  }

  toggleCollapse(): void {
    this._isSidebarCollapsed.update(v => !v);
  }
}
```

---

## 4. Sidebar — Navigation adaptée aux rôles

La sidebar affiche les liens de navigation **filtrés par le rôle** de l'utilisateur connecté, conformément à la matrice des permissions du cahier des charges.

### Modèle de navigation

```typescript
// core/models/member-role.model.ts
export type MemberRole =
  | 'SUPER_ADMIN' | 'PRESIDENT' | 'VICE_PRESIDENT'
  | 'SECRETARY'   | 'TREASURER' | 'AUDITOR'
  | 'CENSOR'      | 'MEMBER';

export interface NavItem {
  label: string;
  icon: string;            // Nom d'icône (ex : heroicon, lucide)
  route: string;
  roles: MemberRole[];     // Rôles autorisés à voir ce lien
}
```

### Définition des liens par rôle

```typescript
// layout/sidebar/nav-items.ts
import { NavItem } from '../../core/models/member-role.model';

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Tableau de bord',
    icon: 'home',
    route: '/dashboard',
    roles: ['SUPER_ADMIN', 'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY', 'TREASURER', 'AUDITOR', 'CENSOR', 'MEMBER'],
  },
  {
    label: 'Tontines',
    icon: 'building',
    route: '/tontines',
    roles: ['SUPER_ADMIN', 'PRESIDENT', 'VICE_PRESIDENT'],
  },
  {
    label: 'Membres',
    icon: 'users',
    route: '/members',
    roles: ['SUPER_ADMIN', 'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY'],
  },
  {
    label: 'Sessions',
    icon: 'calendar',
    route: '/sessions',
    roles: ['SUPER_ADMIN', 'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY', 'MEMBER'],
  },
  {
    label: 'Paiements',
    icon: 'credit-card',
    route: '/payments',
    roles: ['SUPER_ADMIN', 'PRESIDENT', 'TREASURER'],
  },
  {
    label: 'Sanctions',
    icon: 'alert-triangle',
    route: '/sanctions',
    roles: ['SUPER_ADMIN', 'CENSOR'],
  },
  {
    label: 'Prêts',
    icon: 'banknote',
    route: '/loans',
    roles: ['SUPER_ADMIN', 'PRESIDENT', 'VICE_PRESIDENT', 'TREASURER', 'MEMBER'],
  },
  {
    label: 'Bureau',
    icon: 'shield',
    route: '/bureau',
    roles: ['SUPER_ADMIN', 'PRESIDENT'],
  },
  {
    label: 'Rapports',
    icon: 'bar-chart',
    route: '/reports',
    roles: ['SUPER_ADMIN', 'PRESIDENT', 'TREASURER', 'AUDITOR'],
  },
  {
    label: 'Paramètres',
    icon: 'settings',
    route: '/settings',
    roles: ['SUPER_ADMIN', 'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY', 'TREASURER', 'AUDITOR', 'CENSOR', 'MEMBER'],
  },
];
```

### Composant Sidebar

```typescript
// layout/sidebar/sidebar.ts
import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NavigationService } from '../../core/services/navigation.service';
import { NAV_ITEMS } from './nav-items';
import { SidebarItemComponent } from '../sidebar-item/sidebar-item';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, SidebarItemComponent],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  protected readonly navService = inject(NavigationService);

  readonly collapsed = input(false);
  readonly open = input(false);

  // Liens filtrés par le rôle actuel de l'utilisateur
  protected readonly visibleItems = computed(() => {
    const role = this.authService.currentRole();
    if (!role) return [];
    return NAV_ITEMS.filter(item => item.roles.includes(role));
  });
}
```

### Template Sidebar (`sidebar.html`)

```html
<aside
  [class]="'fixed inset-y-0 left-0 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 '
    + navService.sidebarWidth()
    + (open() ? ' translate-x-0' : ' -translate-x-full lg:translate-x-0')"
  role="navigation"
  aria-label="Menu principal de navigation"
>
  <!-- Logo / Titre -->
  <div class="flex h-16 items-center gap-3 border-b border-gray-200 px-4">
    <img src="/logo.svg" alt="TontineConnect" class="h-8 w-8 shrink-0" />
    @if (!collapsed()) {
      <span class="text-lg font-bold text-gray-900 truncate">TontineConnect</span>
    }
  </div>

  <!-- Liens de navigation -->
  <nav class="flex-1 overflow-y-auto px-2 py-4" aria-label="Navigation latérale">
    <ul role="list" class="flex flex-col gap-1">
      @for (item of visibleItems(); track item.route) {
        <li>
          <app-sidebar-item
            [item]="item"
            [collapsed]="collapsed()"
          />
        </li>
      }
    </ul>
  </nav>

  <!-- Pied de sidebar : profil utilisateur -->
  <div class="border-t border-gray-200 p-4">
    <a
      routerLink="/settings"
      class="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      aria-label="Paramètres du profil"
    >
      <app-avatar [name]="authService.userName()" size="sm" />
      @if (!collapsed()) {
        <span class="truncate">{{ authService.userName() }}</span>
      }
    </a>
  </div>
</aside>
```

### Composant SidebarItem

```typescript
// layout/sidebar-item/sidebar-item.ts
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../core/models/member-role.model';

@Component({
  selector: 'app-sidebar-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-item.html',
})
export class SidebarItemComponent {
  readonly item = input.required<NavItem>();
  readonly collapsed = input(false);
}
```

```html
<!-- sidebar-item.html -->
<a
  [routerLink]="item().route"
  routerLinkActive="bg-indigo-50 text-indigo-700 font-semibold"
  [attr.aria-label]="item().label"
  [attr.title]="collapsed() ? item().label : null"
  class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
>
  <span class="shrink-0 h-5 w-5" aria-hidden="true"><!-- icône dynamique --></span>
  @if (!collapsed()) {
    <span class="truncate">{{ item().label }}</span>
  }
</a>
```

---

## 5. Navbar supérieure

```typescript
// layout/navbar/navbar.ts
import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);

  readonly toggleSidebar = output<void>();   // mobile : ouvre le drawer
  readonly toggleCollapse = output<void>();  // desktop : réduit la sidebar
}
```

```html
<!-- navbar.html -->
<header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
  <!-- Bouton hamburger (mobile) -->
  <button
    type="button"
    class="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
    (click)="toggleSidebar.emit()"
    aria-label="Ouvrir le menu de navigation"
  >
    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  </button>

  <!-- Bouton collapse (desktop) -->
  <button
    type="button"
    class="hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:block"
    (click)="toggleCollapse.emit()"
    aria-label="Réduire la barre latérale"
  >
    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </svg>
  </button>

  <!-- Zone droite : notifications + profil -->
  <div class="flex items-center gap-4">
    <button
      type="button"
      class="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
      aria-label="Voir les notifications"
    >
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    </button>

    <span class="text-sm font-medium text-gray-700">
      {{ authService.userName() }}
    </span>
  </div>
</header>
```

---

## 6. Tailwind CSS — Bonnes pratiques

### 6.1 Classes utilitaires directement dans le HTML

- **Toujours** écrire les classes Tailwind dans le template HTML, jamais dans un fichier CSS séparé.
- **Interdit** : `@apply` dans les fichiers `.css` des composants pour du layout courant.

```html
<!-- ✅ Correct -->
<div class="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
  <h3 class="text-lg font-semibold text-gray-900">{{ tontine().name }}</h3>
</div>

<!-- ❌ Interdit -->
<!-- component.css : .card { @apply flex items-center gap-4 ... } -->
```

### 6.2 Composants de base pour éviter la répétition

Quand un groupe de classes est répété **plus de 3 fois** à l'identique, extraire un composant `shared/` :

```typescript
// shared/components/button/button.ts
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      [attr.aria-label]="ariaLabel()"
    >
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  readonly variant = input<'primary' | 'secondary' | 'danger'>('primary');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly ariaLabel = input<string>();

  protected readonly buttonClasses = computed(() => {
    const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants: Record<string, string> = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    };

    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  });
}
```

Usage :

```html
<app-button variant="primary" (click)="submit()">Payer la cotisation</app-button>
<app-button variant="danger" ariaLabel="Supprimer le membre">Supprimer</app-button>
```

### 6.3 Composant Badge (rôles, statuts)

```typescript
// shared/components/badge/badge.ts
@Component({
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="badgeClasses()" role="status">
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  readonly color = input<'green' | 'red' | 'yellow' | 'blue' | 'gray'>('gray');

  protected readonly badgeClasses = computed(() => {
    const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    const colors: Record<string, string> = {
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      gray: 'bg-gray-100 text-gray-800',
    };
    return `${base} ${colors[this.color()]}`;
  });
}
```

```html
<app-badge color="green">Actif</app-badge>
<app-badge color="red">Absent</app-badge>
<app-badge color="blue">Président</app-badge>
```

---

## 7. Accessibilité (a11y)

### Règles obligatoires

| Élément | Attribut requis | Exemple |
|---------|----------------|---------|
| Sidebar `<aside>` | `role="navigation"`, `aria-label` | `aria-label="Menu principal de navigation"` |
| `<nav>` interne | `aria-label` | `aria-label="Navigation latérale"` |
| Listes de navigation | `role="list"` sur `<ul>` | `<ul role="list">` |
| Bouton hamburger | `aria-label` | `aria-label="Ouvrir le menu de navigation"` |
| Bouton collapse | `aria-label` | `aria-label="Réduire la barre latérale"` |
| Icônes décoratives | `aria-hidden="true"` | `<svg aria-hidden="true">` |
| Overlay mobile | `aria-hidden="true"` | Empêche les lecteurs d'écran de lire le fond |
| Liens sidebar (collapsed) | `[attr.title]` ou `aria-label` | Tooltip quand le texte est masqué |
| Badges de statut | `role="status"` | Annonce le statut aux lecteurs d'écran |
| Boutons d'action | `aria-label` quand le texte est ambigu | `aria-label="Supprimer le membre Jean"` |

### Focus et clavier

- Tous les éléments interactifs doivent être atteignables au clavier (`Tab`).
- L'overlay mobile doit être fermable avec `Escape` :

```typescript
// Dans MainLayoutComponent
@HostListener('document:keydown.escape')
protected onEscape(): void {
  this.navService.closeSidebar();
}
```

---

## 8. Responsive — Breakpoints Tailwind

Le layout adopte **trois comportements** selon la taille d'écran :

| Breakpoint | Viewport | Sidebar | Navbar |
|------------|----------|---------|--------|
| < `lg` (mobile) | < 1024px | Masquée, ouverte via bouton hamburger (drawer) | Affiche le bouton hamburger |
| ≥ `lg` (desktop) | ≥ 1024px | Toujours visible, repliable en icônes | Affiche le bouton collapse |

### Classes clés

```html
<!-- Sidebar : masquée sur mobile, visible sur desktop -->
<aside class="fixed inset-y-0 left-0 ... -translate-x-full lg:translate-x-0">

<!-- Bouton hamburger : visible sur mobile uniquement -->
<button class="lg:hidden" aria-label="Ouvrir le menu de navigation">

<!-- Bouton collapse : visible sur desktop uniquement -->
<button class="hidden lg:block" aria-label="Réduire la barre latérale">

<!-- Overlay : mobile uniquement -->
<div class="fixed inset-0 z-30 bg-black/50 lg:hidden">

<!-- Contenu principal : padding adaptatif -->
<main class="flex-1 overflow-y-auto p-4 lg:p-6">
```

### Comportement responsif de la sidebar

```
Mobile (< 1024px)                      Desktop (≥ 1024px)
┌──────────────────────┐               ┌─────┬──────────────────┐
│ [☰] Navbar           │               │     │ Navbar           │
├──────────────────────┤               │ S   ├──────────────────┤
│                      │               │ i   │                  │
│   Contenu            │               │ d   │   Contenu        │
│                      │               │ e   │                  │
│                      │               │ b   │                  │
└──────────────────────┘               │ a   │                  │
                                       │ r   │                  │
  Clic ☰ → drawer overlay             └─────┴──────────────────┘
```

---

## 9. Checklist de revue

Avant chaque commit impliquant le layout ou la structure :

- [ ] **Dossiers** : tout nouveau code est dans `core/`, `shared/`, `layout/` ou `features/` selon sa nature
- [ ] **Lazy loading** : chaque feature a ses propres routes chargées via `loadChildren`
- [ ] **OnPush** : tous les composants layout ont `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] **Signals** : l'état sidebar (ouvert/fermé/collapsed) utilise `signal()` et `computed()`
- [ ] **Rôles** : les liens de navigation sont filtrés par `MemberRole` via `computed()`
- [ ] **Tailwind** : les classes sont dans le HTML, pas de `@apply` dans les `.css`
- [ ] **Composants partagés** : les classes répétées 3+ fois sont extraites dans `shared/`
- [ ] **a11y** : `aria-label` sur tous les boutons, `role="navigation"` sur la sidebar, `aria-hidden` sur les icônes
- [ ] **Responsive** : sidebar masquée < `lg`, hamburger visible < `lg`, collapse visible ≥ `lg`
- [ ] **Clavier** : `Escape` ferme la sidebar mobile, focus piégé correctement
