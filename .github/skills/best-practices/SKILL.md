---
name: best-practices
description: Standards Angular 21 for scalable SaaS applications. Use when generating or reviewing Angular frontend code.
---

# Angular Best Practices

When working on Angular code, always follow these rules:

## Architecture
- **Standalone Components**: Use standalone components for everything. No NgModules.
- **Signals for State**: Prefer signals for all UI state management. Use `computed` for derived data and `effect` sparingly.
- **Service Isolation**: Keep ALL API calls and `HttpClient` logic inside services. Components must only call service methods.
- **Functional DI**: Use the `inject()` function instead of constructor-based dependency injection.

## Performance
- **OnPush Strategy**: Every component must use `changeDetection: ChangeDetectionStrategy.OnPush`.
- **Zoneless Mode**: Write code compatible with a zoneless environment (no reliance on `Zone.js` execution context).
- **Lazy Loading**: Always lazy load feature routes using `loadComponent` or `loadChildren` in the router configuration.

## Forms
- **Critical Flows**: Prefer Reactive Forms for complex or critical business logic.
- **Modern Forms**: Use Angular 21 Signal-based Forms (`formSignal`) progressively for a more reactive developer experience.
- **Validation**: Use `computed` signals to display validation errors in real-time.

## Review checklist
- **No HttpClient in components**: Reject any component injecting or using `HttpClient`.
- **Loading and error states**: Ensure every async operation has a corresponding `isLoading` and `error` signal for UI feedback.
- **Mobile-first Tailwind layout**: Use Tailwind CSS classes starting with mobile-first breakpoints.
- **Currency Formatting**: Always use the `currency` pipe with `XAF` for financial amounts (Cameroon context).