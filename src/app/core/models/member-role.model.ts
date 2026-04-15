export type MemberRole =
  | 'SUPER_ADMIN'
  | 'PRESIDENT'
  | 'VICE_PRESIDENT'
  | 'SECRETARY'
  | 'TREASURER'
  | 'AUDITOR'
  | 'CENSOR'
  | 'MEMBER';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: MemberRole[];
}
