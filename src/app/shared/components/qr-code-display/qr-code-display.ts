import {
  ChangeDetectionStrategy, Component, inject,
  input, signal, computed, effect,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qr-code-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './qr-code-display.html',
})
export class QrCodeDisplayComponent {
  // 1 — Injection
  private readonly http = inject(HttpClient);

  // 2 — Inputs
  readonly invitationToken = input.required<string>();
  readonly tontineNom = input.required<string>();

  // 3 — Signals d'état
  protected readonly qrImageUrl = signal<string | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly hasError = signal(false);

  // 4 — Computed
  protected readonly isReady = computed(() =>
    !this.isLoading() && this.qrImageUrl() !== null && !this.hasError()
  );

  // 5 — Effect : recharge le QR quand le token change
  private readonly tokenEffect = effect(() => {
    const token = this.invitationToken();
    if (!token) return;
    this.fetchQrCode(token);
  });

  // 6 — Méthodes

  private fetchQrCode(token: string): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.qrImageUrl.set(null);

    this.http.get(
      `http://localhost:8080/api/v1/tontines/qrcode?token=${encodeURIComponent(token)}`,
      { responseType: 'blob' },
    ).subscribe({
      next: (blob) => {
        // Libérer l'ancienne URL si elle existe
        const prev = this.qrImageUrl();
        if (prev) URL.revokeObjectURL(prev);

        this.qrImageUrl.set(URL.createObjectURL(blob));
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  protected download(): void {
    const url = this.qrImageUrl();
    if (!url) return;

    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${this.tontineNom().replace(/\s+/g, '-').toLowerCase()}.png`;
    a.click();
  }

  protected retry(): void {
    const token = this.invitationToken();
    if (token) this.fetchQrCode(token);
  }
}
