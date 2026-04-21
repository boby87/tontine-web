---
name: financial-workflows
description: Use this skill when implementing TontineConnect business forms related to XAF contributions, Mobile Money payments, sanctions, loans, and member financial workflows.
---

# TontineConnect Financial Workflows

Use this skill for:
- cotisations
- MTN MoMo
- Orange Money
- sanctions
- prêts
- remboursements
- session payouts

---

# Currency Rules

All monetary amounts MUST use XAF.

```html
{{ amount | currency:'XAF':'symbol':'1.0-0' }}
```

---

# Minimum Contribution Rules

```ts
min(s.amount, 1000, {
  message: 'Minimum 1 000 XAF'
});
```

---

# Mobile Money Validation

```ts
pattern(s.mobileNumber, /^6[5-9]\\d{7}$/, {
  message: 'Numéro camerounais invalide'
});
```

---

# Conditional Payment Rules

```ts
required(s.mobileNumber, {
  when: ({ valueOf }) =>
    valueOf(s.paymentMethod) !== 'CASH'
});
```

---

# Loan Rules

```ts
min(s.amount, 10000)
```

Interest defaults:
- STANDARD = 5%
- EMERGENCY = 10%

Use linkedSignal for resettable defaults.
```

