import { Component, ChangeDetectionStrategy, inject, computed, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DashboardService } from './services/dashboard.service';
import { ContributionResponse } from '../../core/models/api.model';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  protected readonly ds = inject(DashboardService);

  /** Nom de la première tontine active */
  protected readonly activeTontineName = computed(() => {
    const data = this.ds.summary();
    if (!data || data.tontines.length === 0) return 'Aucune tontine';
    return data.tontines[0].nom;
  });

  /** Montant formaté en XAF */
  protected readonly formattedCagnotte = computed(() =>
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 })
      .format(this.ds.totalCagnotte()),
  );

  /** Compte à rebours simple (J-X) */
  protected readonly countdown = computed(() => {
    const dateStr = this.ds.nextSessionDate();
    if (!dateStr) return 'Aucune séance';

    const target = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffMs = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Demain';
    return `J-${diffDays}`;
  });

  /** Taux de présence (cotisations payées / total membres) */
  protected readonly attendanceRate = computed(() => {
    const data = this.ds.summary();
    if (!data || data.totalMembers === 0) return 0;
    const paid = data.currentSessionContributions.filter(c => c.statut === 'PAID' || c.statut === 'LATE_PAID').length;
    return Math.round((paid / data.totalMembers) * 100);
  });

  /** 5 dernières transactions triées par date décroissante */
  protected readonly recentTransactions = computed<ContributionResponse[]>(() => {
    const data = this.ds.summary();
    if (!data) return [];
    return [...data.currentSessionContributions]
      .sort((a, b) => b.dateOperation.localeCompare(a.dateOperation))
      .slice(0, 5);
  });

  ngOnInit(): void {
    this.ds.loadStatistics();
  }
}
