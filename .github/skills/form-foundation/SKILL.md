---
name: form-foundation
description: Use this skill when creating or refactoring Angular 21+ form components. Enforce Signal Forms architecture with form(), FormField, signal model, computed submit state, and linkedSignal patterns.
---

# Angular Form Foundation

Use this skill when building:
- create forms
- edit forms
- filter forms
- wizard steps
- modal forms

---

# Mandatory Architecture

Always use:

```ts
signal()
form()
computed()
linkedSignal()
inject()
input()
output()
```

Never use:

```ts
FormGroup
FormControl
FormBuilder
[(ngModel)]
ReactiveFormsModule
FormsModule
```

---

# Standard Component Structure

Every form component MUST follow this order:

1. inject()
2. input / output
3. model signal
4. form()
5. linkedSignal()
6. computed()
7. methods

```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField]
})
export class ExampleFormComponent {
  private readonly store = inject(StoreService);

  readonly memberId = input.required<string>();
  readonly submitted = output<FormValue>();

  protected readonly model = signal({
    amount: 0
  });

  protected readonly formState = form(this.model, (s) => {
    required(s.amount);
  });

  protected readonly canSubmit = computed(() =>
    this.formState.amount().valid()
  );
}
```

---

# Template Binding

All fields MUST use:

```html
[formField]
```

All forms MUST include:

```html
<form novalidate>
```
```