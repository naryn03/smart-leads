import { useState } from 'react';
import { X } from 'lucide-react';
import { Lead, LeadFormData, LeadSource, LeadStatus } from '../../types';
import { Spinner } from '../ui/Spinner';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void;
  isLoading: boolean;
  initialData?: Lead;
}

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS: LeadSource[] = ['Website', 'Instagram', 'Referral'];

interface FormErrors {
  name?: string;
  email?: string;
  source?: string;
}

export const LeadModal = ({ isOpen, onClose, onSubmit, isLoading, initialData }: LeadModalProps) => {
  const [form, setForm] = useState<LeadFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    status: initialData?.status || 'New',
    source: initialData?.source || 'Website',
    notes: initialData?.notes || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.source) newErrors.source = 'Source is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const set = (field: keyof LeadFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg card p-6 animate-scale-in shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-600 text-slate-900 dark:text-white">
            {initialData ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input
              className={`input ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : ''}`}
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Email Address *</label>
            <input
              type="email"
              className={`input ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : ''}`}
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Source *</label>
              <select
                className={`input ${errors.source ? 'border-red-400' : ''}`}
                value={form.source}
                onChange={(e) => set('source', e.target.value)}
              >
                {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Optional notes about this lead..."
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? <Spinner size="sm" /> : initialData ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
