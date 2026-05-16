import { LeadStatus } from '../../types';

interface StatusBadgeProps {
  status: LeadStatus;
}

const statusConfig: Record<LeadStatus, string> = {
  New: 'badge-new',
  Contacted: 'badge-contacted',
  Qualified: 'badge-qualified',
  Lost: 'badge-lost',
};

const statusDot: Record<LeadStatus, string> = {
  New: 'bg-blue-500',
  Contacted: 'bg-amber-500',
  Qualified: 'bg-emerald-500',
  Lost: 'bg-red-500',
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={statusConfig[status]}>
    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]} mr-1.5 inline-block`} />
    {status}
  </span>
);
