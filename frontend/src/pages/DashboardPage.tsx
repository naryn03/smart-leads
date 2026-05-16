import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, Target, AlertCircle, Globe, Instagram } from 'lucide-react';
import { leadsService } from '../services/leadsService';
import { useAuthStore } from '../store/authStore';
import { StatCard } from '../components/dashboard/StatCard';
import { PageLoader } from '../components/ui/Spinner';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leadStats'],
    queryFn: leadsService.getStats,
  });

  const stats = data?.data?.overview;
  const bySource = data?.data?.bySource || [];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-700 text-slate-900 dark:text-white">
          Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening with your leads today.
        </p>
      </div>

      {isError && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">Failed to load statistics.</p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Leads"
          value={stats?.total ?? 0}
          icon={<Users size={18} className="text-brand-600 dark:text-brand-400" />}
          color="bg-brand-50 dark:bg-brand-900/30"
        />
        <StatCard
          label="New Leads"
          value={stats?.New ?? 0}
          icon={<TrendingUp size={18} className="text-blue-600 dark:text-blue-400" />}
          color="bg-blue-50 dark:bg-blue-900/30"
        />
        <StatCard
          label="Qualified"
          value={stats?.Qualified ?? 0}
          icon={<Target size={18} className="text-emerald-600 dark:text-emerald-400" />}
          color="bg-emerald-50 dark:bg-emerald-900/30"
        />
        <StatCard
          label="Lost"
          value={stats?.Lost ?? 0}
          icon={<AlertCircle size={18} className="text-red-500 dark:text-red-400" />}
          color="bg-red-50 dark:bg-red-900/30"
        />
      </div>

      {/* Funnel & Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Funnel */}
        <div className="card p-6">
          <h2 className="font-display text-base font-600 text-slate-900 dark:text-white mb-4">Lead Pipeline</h2>
          {stats && stats.total > 0 ? (
            <div className="space-y-3">
              {[
                { label: 'New', value: stats.New, color: 'bg-blue-500' },
                { label: 'Contacted', value: stats.Contacted, color: 'bg-amber-500' },
                { label: 'Qualified', value: stats.Qualified, color: 'bg-emerald-500' },
                { label: 'Lost', value: stats.Lost, color: 'bg-red-500' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 dark:text-slate-400">{label}</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-700`}
                      style={{ width: `${stats.total ? (value / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No pipeline data yet</p>
          )}
        </div>

        {/* By Source */}
        <div className="card p-6">
          <h2 className="font-display text-base font-600 text-slate-900 dark:text-white mb-4">Leads by Source</h2>
          {bySource.length > 0 ? (
            <div className="space-y-3">
              {bySource.map(({ _id, count }) => (
                <div key={_id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2.5">
                    {_id === 'Website' && <Globe size={15} className="text-slate-400" />}
                    {_id === 'Instagram' && <Instagram size={15} className="text-pink-400" />}
                    {_id === 'Referral' && <Users size={15} className="text-purple-400" />}
                    <span className="text-sm text-slate-700 dark:text-slate-300">{_id}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No source data yet</p>
          )}
        </div>
      </div>

      {/* Role info */}
      {user?.role === 'admin' && (
        <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/40">
          <p className="text-sm text-brand-700 dark:text-brand-300 font-medium">
            👑 Admin Access — You can view all leads and delete any lead.
          </p>
        </div>
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
