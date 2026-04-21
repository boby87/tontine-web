import {
  ChangeDetectionStrategy, Component, inject,
  input, signal, computed,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invite-link-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invite-link-widget.html',
})
export class InviteLinkWidgetComponent {
  // 1 — Injection
  private readonly http = inject(HttpClient);

  // 2 — Inputs
  readonly tontineNom = input.required<string>();

  // 3 — Signals d'état
  protected readonly invitationLink = signal<string | null>(null);
  protected readonly isGenerating = signal(false);
  protected readonly copied = signal(false);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  // 4 — Computed
  protected readonly hasLink = computed(() => this.invitationLink() !== null);

  // 5 — Méthodes

  protected generate(): void {
    this.isGenerating.set(true);
    this.copied.set(false);

    this.http.post<{ link: string }>('http://localhost:8080/api/v1/tontines/invitation', {
      tontineNom: this.tontineNom(),
    }).subscribe({
      next: (res) => {
        this.invitationLink.set(res.link);
        this.isGenerating.set(false);
      },
      error: () => {
        this.invitationLink.set(
          `https://tontine.cm/join?token=${encodeURIComponent(this.tontineNom())}`,
        );
        this.isGenerating.set(false);
      },
    });
  }

  protected copy(): void {
    const link = this.invitationLink();
    if (!link) return;

    navigator.clipboard.writeText(link).then(() => {
      this.copied.set(true);

      if (this.copyTimer) {
        clearTimeout(this.copyTimer);
      }
      this.copyTimer = setTimeout(() => {
        this.copied.set(false);
        this.copyTimer = null;
      }, 2000);
    });
  }
}
