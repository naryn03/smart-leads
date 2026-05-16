import { Pencil, Trash2, Globe, Instagram, Users } from 'lucide-react';
import { Lead } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { useAuthStore } from '../../store/authStore';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const sourceIcon = {
  Website: <Globe size={13} className="text-slate-400" />,
  Instagram: <Instagram size={13} className="text-pink-400" />,
  Referral: <Users size={13} className="text-purple-400" />,
};

export const LeadTable = ({ leads, onEdit, onDelete }: LeadTableProps) => {
  const { user } = useAuthStore();

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-700/60">
            {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
              <th
                key={h}
                className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3 px-2 first:pl-0 last:pr-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
          {leads.map((lead) => (
            <tr key={lead._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors animate-fade-in">
              <td className="py-3.5 px-2 pl-0">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-medium float-left mr-2.5 mt-0.5">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{lead.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{lead._id.slice(-6)}</p>
                </div>
              </td>
              <td className="py-3.5 px-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">{lead.email}</span>
              </td>
              <td className="py-3.5 px-2">
                <StatusBadge status={lead.status} />
              </td>
              <td className="py-3.5 px-2">
                <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                  {sourceIcon[lead.source]}
                  {lead.source}
                </span>
              </td>
              <td className="py-3.5 px-2">
                <span className="text-xs text-slate-400">
                  {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </td>
              <td className="py-3.5 px-2 pr-0">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"
                    title="Edit lead"
                  >
                    <Pencil size={14} />
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => onDelete(lead)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      title="Delete lead"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
