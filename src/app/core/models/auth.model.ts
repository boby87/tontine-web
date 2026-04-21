// ──────────────────────────────────────────────
// Auth — Register (depuis OpenAPI CreateUserRequest / UserResponse)
// ──────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  phone: string;              // Format : +237XXXXXXXXX
  password: string;           // min 8 caractères
  firstName: string;          // min 2 caractères
  lastName: string;           // min 2 caractères
  dateOfBirth: Date;
  region: string;
  cniNumber: string;
}

export interface RegisterResponse {
  userId: string;             // UUID
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  role: string;
  region: string;
  cniNumber: string;
  createdAt: Date;
}

// ──────────────────────────────────────────────
// Auth — Login (non présent dans le spec OpenAPI,
// interfaces déduites du pattern JWT standard)
// ──────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;          // durée de validité en secondes
  user: RegisterResponse;
}
