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
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Valid email required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.data) {
        setAuth(data.data.user, data.data.token);
        toast.success(`Welcome back, ${data.data.user.name}!`);
        navigate('/dashboard');
      }
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) mutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
            <Zap size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl font-700 text-slate-900 dark:text-white">SmartLeads</span>
        </div>

        <div className="card p-8 shadow-lg">
          <h1 className="font-display text-2xl font-700 text-slate-900 dark:text-white mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Sign in to your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className={`input ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: undefined })); }}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input pr-10 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
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
              {mutation.isPending ? <Spinner size="sm" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
              Sign up
            </Link>
          </p>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Create an account to get started. First user can register as admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
