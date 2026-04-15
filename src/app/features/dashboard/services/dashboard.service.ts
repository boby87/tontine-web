import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TontineResponse, SessionResponse, ContributionResponse } from '../../../core/models/api.model';
import { DashboardSummary } from '../models/dashboard.model';

const API_URL = `${environment.apiUrl}/api/v1`;

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  // ── État privé mutable ──────────────────────
  private readonly _summary = signal<DashboardSummary | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  // ── Signaux publics en lecture seule ─────────
  readonly summary = this._summary.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // ── Calculs temps réel (computed) ────────────

  /** Somme des cotisations de la séance en cours */
  readonly totalCagnotte = computed(() => {
    const data = this._summary();
    if (!data) return 0;
    return data.currentSessionContributions.reduce((sum, c) => sum + c.montant, 0);
  });

  /** Date de la prochaine séance planifiée */
  readonly nextSessionDate = computed<string | null>(() => {
    const data = this._summary();
    if (!data || data.upcomingSessions.length === 0) return null;

    const today = new Date().toISOString().split('T')[0];

    const upcoming = data.upcomingSessions
      .filter(s => s.scheduledDate >= today && s.status === 'SCHEDULED')
      .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

    return upcoming.length > 0 ? upcoming[0].scheduledDate : null;
  });

  /** Nombre de membres en retard de paiement */
  readonly alertCount = computed(() => {
    const data = this._summary();
    if (!data) return 0;
    return data.currentSessionContributions.filter(c => c.joursRetard > 0).length;
  });

  // ── Actions ─────────────────────────────────

  loadStatistics(): void {
    this._isLoading.set(true);
    this._error.set(null);

    forkJoin({
      tontines: this.http.get<TontineResponse[]>(`${API_URL}/tontines`),
      sessions: this.http.get<SessionResponse[]>(`${API_URL}/sessions`),
      contributions: this.http.get<ContributionResponse[]>(`${API_URL}/contributions`),
    }).subscribe({
      next: ({ tontines, sessions, contributions }) => {
        const today = new Date().toISOString().split('T')[0];

        // Séances à venir (SCHEDULED et date >= aujourd'hui)
        const upcomingSessions = sessions
          .filter(s => s.scheduledDate >= today && s.status === 'SCHEDULED')
          .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

        // Séance en cours (IN_PROGRESS) ou la prochaine planifiée
        const currentSession = sessions.find(s => s.status === 'IN_PROGRESS')
          ?? upcomingSessions[0]
          ?? null;

        // Cotisations de la séance courante
        const currentSessionContributions = currentSession
          ? contributions.filter(c => c.seanceId === currentSession.id)
          : [];

        // Nombre total de membres uniques ayant cotisé
        const uniqueMembers = new Set(contributions.map(c => c.membreId));

        this._summary.set({
          tontines,
          upcomingSessions,
          currentSessionContributions,
          totalMembers: uniqueMembers.size,
        });
        this._isLoading.set(false);
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

  // ── Helpers privés ──────────────────────────

  private extractMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const httpErr = err as { error?: { message?: string }; status?: number };
      if (httpErr.error?.message) return httpErr.error.message;

      switch (httpErr.status) {
        case 0:   return 'Serveur injoignable. Vérifiez votre connexion.';
        case 401: return 'Session expirée. Veuillez vous reconnecter.';
        case 403: return "Vous n'avez pas les droits pour cette action.";
        case 500: return 'Erreur serveur. Réessayez plus tard.';
        default:  return 'Une erreur inattendue est survenue.';
      }
    }
    return 'Une erreur inattendue est survenue.';
  }
}
