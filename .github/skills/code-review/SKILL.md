---
name: code-review
description: Expert code review standards for Angular 21 frontend. Focuses on service/component separation, signals, and architectural integrity.
---

# Frontend Code Review Standards

When reviewing or auditing Angular frontend code, apply these validation rules:

## Signals & Reactivity
- **Signals First**: Reject any use of `BehaviorSubject` or `Subject` for UI state. Everything must be a `signal`.
- **Derived State**: Ensure `computed()` is used for dependent data instead of manual updates inside functions.
- **Leak Detection**: Flag any manual `subscribe()` calls. Use `toSignal()` for Observables or keep them strictly within services.

## Architecture (STRICT)
- **Service/Component Separation**: 
    - ❌ **REJECT**: `HttpClient` injected or used inside a component.
    - ✅ **REQUIRE**: API calls must reside in a dedicated Service, exposing data via Signals.
- **Functional DI**: Ensure `inject()` is used for all dependencies. Flag any constructor-based injection.
- **Zoneless Readiness**: Check for `changeDetection: ChangeDetectionStrategy.OnPush` in every component.

## Modern Syntax
- **Control Flow**: Ensure use of `@if`, `@for`, and `@switch`. Flag old `*ngIf` or `*ngFor` directives.
- **Signal Props**: Verify use of `input()`, `output()`, and `model()` instead of old decorators.
- **Zoneless Logic**: Ensure no reliance on `Zone.js` side effects for UI updates.

## Business & Localization
- **President Flows**: For features in `#Flows_President.md`, verify that the UI correctly restricts access using `authService.isPresident()`.
- **Cameroon Context**: 
    - Currency must be formatted as `XAF`.
    - Phone number validations must follow local patterns (9 digits, starting with 6, 2, or 3).

## Review Output Format
Always present your findings in this table format:

| File | Line | Severity | Issue & Corrective Action |
| :--- | :--- | :--- | :--- |
| `filename.ts` | XX | 🔴 High | `HttpClient` found in component. Move logic to a service. |
| `filename.ts` | XX | 🟡 Med | Using `*ngIf`. Refactor to `@if` syntax. |

**Final Verdict**: [Approve / Request Changes / Comment]

---

## 💾 Post-Review Action (MANDATORY)
**À la fin de chaque revue, tu dois générer l'intégralité du rapport ci-dessus dans un nouveau fichier nommé `code-review.md` à la racine du projet ou dans le dossier spécifié par l'utilisateur.**