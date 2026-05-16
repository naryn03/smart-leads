import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { Spinner } from '../components/ui/Spinner';
import { AxiosError } from 'axios';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      if (data.data) {
        setAuth(data.data.user, data.data.token);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) mutation.mutate(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
            <Zap size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl font-700 text-slate-900 dark:text-white">SmartLeads</span>
        </div>

        <div className="card p-8 shadow-lg">
          <h1 className="font-display text-2xl font-700 text-slate-900 dark:text-white mb-1">Create account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Start managing your leads today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                className={`input ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : ''}`}
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className={`input ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={(e) => setField('role', e.target.value)}>
                <option value="sales">Sales User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input pr-10 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : ''}`}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button type="submit" disabled={mutation.isPending} className="btn-primary w-full justify-center py-3 mt-2">
              {mutation.isPending ? <Spinner size="sm" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
