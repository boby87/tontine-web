import { NavItem } from '../../core/models/member-role.model';

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
    roles: [
      'SUPER_ADMIN', 'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY',
      'TREASURER', 'AUDITOR', 'CENSOR', 'MEMBER',
    ],
  },
  {
    label: 'Tontines',
    icon: 'tontine',
    route: '/tontines',
    roles: ['SUPER_ADMIN', 'PRESIDENT', 'VICE_PRESIDENT'],
  },
  {
    label: 'Séances',
    icon: 'session',
    route: '/sessions',
    roles: [
      'SUPER_ADMIN', 'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY', 'MEMBER',
    ],
  },
  {
    label: 'Sanctions',
    icon: 'sanction',
    route: '/sanctions',
    roles: ['SUPER_ADMIN', 'CENSOR'],
  },
];
