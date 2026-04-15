import { Injectable, signal, computed } from '@angular/core';
import { MemberRole } from '../models/member-role.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _userName = signal('Jean Kamga');
  private readonly _currentRole = signal<MemberRole>('PRESIDENT');
  private readonly _isAuthenticated = signal(true);

  readonly userName = this._userName.asReadonly();
  readonly currentRole = this._currentRole.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  readonly initials = computed(() => {
    const name = this._userName();
    const parts = name.split(' ');
    return parts.map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  });

  setRole(role: MemberRole): void {
    this._currentRole.set(role);
  }

  logout(): void {
    this._isAuthenticated.set(false);
  }
}
