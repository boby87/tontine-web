---
name: api-integration
description: Procédure standard de branchement API et communication HTTP pour TontineConnect. À utiliser pour la génération de services et la gestion d'état asynchrone.
---

# API Integration Standards (Angular 21+)

When implementing or reviewing HTTP communication, strictly follow these rules to ensure consistency between the Angular frontend and the Spring Boot backend.

## 1. Base URL & Environment
- **Exclusive Source**: All URLs must derive from `environment.apiUrl`. Never hardcode strings like `localhost:8080`.
- **Service Pattern**: Declare a local constant `API_URL` at the top of the service file.
- **Example**:
  ```typescript
  import { environment } from '../../../environments/environment';
  const API_URL = `${environment.apiUrl}/api/v1`;