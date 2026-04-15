import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../models/auth.model';
import { UserResponse } from '../models/api.model';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/api/v1`;
const TOKEN_KEY = 'access_token';
const USER_KEY = 'current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // ── État privé mutable ──────────────────────
  private readonly _currentUser = signal<UserResponse | null>(this.loadUser());
  private readonly _accessToken = signal<string | null>(this.loadToken());
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  // ── Signaux publics en lecture seule ─────────
  readonly currentUser = this._currentUser.asReadonly();
  readonly accessToken = this._accessToken.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly isAuthenticated = computed(() => !!this._accessToken() && !!this._currentUser());

  readonly fullName = computed(() => {
    const user = this._currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  readonly initials = computed(() => {
    const user = this._currentUser();
    if (!user) return '';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  });

  readonly userRole = computed(() => this._currentUser()?.role ?? null);

  constructor() {
    effect(() => {
      const token = this._accessToken();
      const user = this._currentUser();

      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }

      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    });
  }

  // ── Actions ─────────────────────────────────

  login(request: LoginRequest): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.post<LoginResponse>(`${API_URL}/auth/login`, request).pipe(
      switchMap((loginRes) => {
        this._accessToken.set(loginRes.accessToken);
        return this.http.get<UserResponse>(`${API_URL}/users/${loginRes.userId}`, {
          headers: { Authorization: `${loginRes.tokenType} ${loginRes.accessToken}` },
        });
      }),
    ).subscribe({
      next: (user) => {
        this._currentUser.set(user);
        this._isLoading.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this._error.set(err.error?.message ?? 'Échec de la connexion');
        this._isLoading.set(false);
      },
    });
  }

  register(request: RegisterRequest): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.post<RegisterResponse>(`${API_URL}/users/register`, request).subscribe({
      next: () => {
        this._isLoading.set(false);
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this._error.set(err.error?.message ?? "Échec de l'inscription");
        this._isLoading.set(false);
      },
    });
  }

  logout(): void {
    this._accessToken.set(null);
    this._currentUser.set(null);
    this.router.navigateByUrl('/login');
  }

  clearError(): void {
    this._error.set(null);
  }

  // ── Helpers privés ──────────────────────────

  private loadToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUser(): UserResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserResponse;
    } catch {
      return null;
    }
  }
}
