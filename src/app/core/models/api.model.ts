// ──────────────────────────────────────────────
// Réponses API (GET / POST responses)
// ──────────────────────────────────────────────

export interface UserResponse {
  userId: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;        // ISO date (YYYY-MM-DD)
  role: string;
  region: string;
  cniNumber: string;
  createdAt: string;          // ISO date-time
}

export interface TontineResponse {
  id: number;
  nom: string;
  description: string;
  montantCotisation: number;
  contributionFrequency: string;
  distributionMode: string;
  cycleSessionsCount: number;
  createdByUserId: string;
  presidentMemberId: string;
  createdAt: string;          // ISO date-time
}

export interface SessionResponse {
  id: number;
  tontineId: number;
  sessionNumber: number;
  scheduledDate: string;      // ISO date (YYYY-MM-DD)
  startTime: string;          // HH:mm:ss
  endTimePlanned: string;     // HH:mm:ss
  locationAddress: string;
  agenda: string;
  status: string;
  createdByUserId: string;
  createdAt: string;          // ISO date-time
}

export interface ContributionResponse {
  id: number;
  cleIdempotence: string;
  membreId: number;
  seanceId: number;
  montant: number;
  statut: string;
  montantAmende: number;
  joursRetard: number;
  dateOperation: string;      // ISO date-time
}

// ──────────────────────────────────────────────
// Requêtes API (POST / PUT bodies)
// ──────────────────────────────────────────────

export interface CreateUserRequest {
  email: string;
  phone: string;              // Format: +237XXXXXXXXX
  password: string;           // min 8 caractères
  firstName: string;          // min 2 caractères
  lastName: string;           // min 2 caractères
  dateOfBirth: string;        // ISO date (YYYY-MM-DD)
  region: string;
  cniNumber: string;
}

export interface CreateTontineRequest {
  nom: string;
  description?: string;
  montantCotisation: number;
  tauxAmendeForfaitaireJour: number;
  plafondAmendeEnPourcentage: number;
  contributionFrequency: string;
  distributionMode: string;
  cycleSessionsCount?: number;
  createdByUserId: string;
}

export interface CreateSessionRequest {
  tontineId: number;
  scheduledDate: string;      // ISO date (YYYY-MM-DD)
  startTime?: string;         // HH:mm:ss
  endTimePlanned?: string;    // HH:mm:ss
  locationAddress?: string;
  agenda?: string;
  createdByUserId: string;
}

export interface ContributionRequest {
  membreId: number;
  tontineId: number;
  seanceId: number;
  montant: number;
}
