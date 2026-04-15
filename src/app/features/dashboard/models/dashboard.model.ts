import { TontineResponse, SessionResponse, ContributionResponse } from '../../../core/models/api.model';

export interface DashboardSummary {
  tontines: TontineResponse[];
  upcomingSessions: SessionResponse[];
  currentSessionContributions: ContributionResponse[];
  totalMembers: number;
}
