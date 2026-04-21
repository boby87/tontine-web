---
name: form-validation-ui
description: Use this skill when implementing Angular Signal Forms validation, error messages, touched states, async validation, and Tailwind reactive field states.
---

# Angular Form Validation and UI

Use this skill when implementing:
- field validation
- async validation
- submit button states
- error display
- Tailwind validation styles

---

# Validation Rules

All validation MUST be inside `form()` schema.

```ts
required(s.amount, {
  message: 'Le montant est obligatoire'
});

min(s.amount, 1000, {
  message: 'Minimum 1 000 XAF'
});

pattern(s.mobileNumber, /^6[5-9]\\d{7}$/, {
  message: 'Numéro invalide'
});
```

---

# Cross-field Validation

```ts
validate(s.confirmPassword, ({ value, valueOf }) => {
  return value() !== valueOf(s.password)
    ? {
        kind: 'mismatch',
        message: 'Les mots de passe ne correspondent pas'
      }
    : null;
});
```

---

# Error Rendering Pattern

```html
@if (field().touched() && field().invalid()) {
  @for (error of field().errors(); track error.kind) {
    <p>{{ error.message }}</p>
  }
}
```

Never show errors before interaction.

---

# Tailwind Validation State

```html
[class.border-red-500]="field().invalid()"
[class.border-green-500]="field().valid()"
```

Forbidden:

```html
[ngClass]
```
