import { Link } from 'react-router-dom';
import { ArrowRight, Zap, BarChart2, Filter, Shield, Download, Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

const features = [
  {
    icon: <BarChart2 size={20} />,
    title: 'Live Dashboard',
    desc: 'Visual pipeline breakdown and source analytics at a glance.',
  },
  {
    icon: <Filter size={20} />,
    title: 'Smart Filtering',
    desc: 'Filter by status, source, and search — all combined, instantly.',
  },
  {
    icon: <Shield size={20} />,
    title: 'Role-Based Access',
    desc: 'Admin and Sales roles with fine-grained permissions per action.',
  },
  {
    icon: <Download size={20} />,
    title: 'CSV Export',
    desc: 'Export any filtered view of leads as a CSV in one click.',
  },
];

const stats = [
  { value: '4', label: 'Lead Stages' },
  { value: '3', label: 'Lead Sources' },
  { value: '2', label: 'User Roles' },
  { value: '∞', label: 'Leads Tracked' },
];

export default function LandingPage() {
  const { isDark, toggle } = useThemeStore();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm shadow-brand-600/30">
            <Zap size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-700 text-slate-900 dark:text-white tracking-tight">
            SmartLeads
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary text-sm py-2">
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-400/10 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-400/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800/40 text-brand-700 dark:text-brand-300 text-xs font-medium mb-6 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          Full-Stack Lead Management
        </div>

        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-800 text-slate-900 dark:text-white leading-[1.1] tracking-tight max-w-4xl mx-auto animate-slide-up">
          Manage your leads,{' '}
          <span className="text-brand-600 dark:text-brand-400">close more deals</span>
        </h1>

        <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed animate-slide-up">
          A smart, fast lead management dashboard built for sales teams. Filter, track, and export leads — all in one place.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap animate-slide-up">
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Start for free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-secondary px-6 py-3 text-base">
            Sign in
          </Link>
        </div>

        <div className="mt-16 inline-grid grid-cols-4 gap-px bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-fade-in">
          {stats.map(({ value, label }) => (
            <div key={label} className="bg-white dark:bg-slate-900 px-8 py-5">
              <p className="font-display text-2xl font-700 text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/60">
            {/* Browser chrome */}
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white dark:bg-slate-700 rounded-lg px-3 py-1 text-xs text-slate-400 text-center">
                  localhost:3000/leads
                </div>
              </div>
            </div>

            {/* Mockup body */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 flex gap-4 min-h-[340px]">
              {/* Sidebar */}
              <div className="w-44 flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center">
                    <Zap size={11} className="text-white" />
                  </div>
                  <span className="text-xs font-display font-600 text-slate-900 dark:text-white">SmartLeads</span>
                </div>
                {['Dashboard', 'Leads'].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${i === 1 ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                    {item}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-12 bg-slate-800 dark:bg-white rounded" />
                  <div className="flex gap-2">
                    <div className="h-7 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                    <div className="h-7 w-20 bg-brand-600 rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700" />
                  <div className="w-24 h-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700" />
                  <div className="w-24 h-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700" />
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                  <div className="grid grid-cols-5 gap-3 px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded" />
                    ))}
                  </div>
                  {[
                    ['bg-blue-100 dark:bg-blue-900/30 text-blue-700', 'New', 'Website'],
                    ['bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700', 'Qualified', 'Instagram'],
                    ['bg-amber-100 dark:bg-amber-900/30 text-amber-700', 'Contacted', 'Referral'],
                    ['bg-red-100 dark:bg-red-900/30 text-red-700', 'Lost', 'Website'],
                  ].map(([color, status, source], i) => (
                    <div key={i} className="grid grid-cols-5 gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0 items-center">
                      <div className="h-2.5 bg-slate-200 dark:bg-slate-600 rounded w-3/4" />
                      <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded" />
                      <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${color} w-fit`}>{status}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{source}</div>
                      <div className="flex gap-1">
                        <div className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700" />
                        <div className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-700 text-slate-900 dark:text-white">
              Everything you need to manage leads
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Built for speed, designed for teams. All the tools your sales pipeline needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 flex gap-4 hover:shadow-md transition-shadow group">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                  {icon}
                </div>
                <div>
                  <h3 className="font-display font-600 text-slate-900 dark:text-white mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl font-700 text-slate-900 dark:text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Create your free account and start managing leads in minutes.
          </p>
          <Link to="/register" className="btn-primary px-8 py-3.5 text-base">
            Create free account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 px-6 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap size={12} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-sm font-600 text-slate-900 dark:text-white">SmartLeads</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Built with React, TypeScript, Node.js & MongoDB
        </p>
      </footer>
    </div>
  );
}