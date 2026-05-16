interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

export const StatCard = ({ label, value, icon, color, trend }: StatCardProps) => (
  <div className="card p-5 flex items-start gap-4 animate-slide-up hover:shadow-md transition-shadow">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-display font-700 text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
      {trend && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">{trend}</p>}
    </div>
  </div>
);
