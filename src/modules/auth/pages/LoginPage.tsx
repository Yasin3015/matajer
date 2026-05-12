import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Store, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import { ROUTES } from '@/core/constants';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!identity || !password) {
      toast.error('Please enter your email and password.');
      return;
    }
    setLoading(true);
    const result = await login(identity, password);
    setLoading(false);

    if (!result.success) {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        toast.error(result.error ?? 'Login failed.');
      }
      return;
    }

    const { admin } = useAuthStore.getState();
    const role = admin?.role?.toLowerCase() ?? '';
    if (role === 'platform_admin' || role === 'admin') {
      navigate(ROUTES.ADMIN);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };


  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mb-4 shadow-xl shadow-brand-900/40">
            <Store size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to Matajer</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>


        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="login-identity"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              icon={<Mail size={16} />}
              autoComplete="email"
              error={errors.identity?.[0]}
              required
            />
            <div className="w-full">
              <label className="label">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password[0]}</p>}
            </div>
            <Button
              type="submit"
              className="w-full justify-center"
              loading={loading}
              size="lg"
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Yalla-Matgar · Platform Admin
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
