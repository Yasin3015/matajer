import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { vendorAuthService } from '../services/vendorAuthService';
import { useVendorAuthStore } from '../hooks/useVendorAuthStore';
import { ROUTES } from '@/core/constants';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const VendorLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useVendorAuthStore();
  const [vendorSlug, setVendorSlug] = useState('');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!vendorSlug.trim()) {
      toast.error('Store slug is required.');
      return;
    }
    if (!identity || !password) {
      toast.error('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(vendorSlug.trim(), {
        identity,
        password,
        token: 'fcm_token_web',
        device: 'web',
      });

      if (res.success) {
        toast.success('Logged in successfully!');
        navigate(ROUTES.DASHBOARD);
      } else if (res.errors) {
        setErrors(res.errors);
      } else {
        toast.error(res.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mb-4 shadow-xl shadow-brand-900/40">
            <Store size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Vendor Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to manage your store</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="vendor-slug"
              label="Store Slug"
              placeholder="my-store"
              value={vendorSlug}
              onChange={(e) => setVendorSlug(e.target.value)}
              icon={<Store size={16} />}
              hint="The unique identifier for your store"
              error={errors.vendor?.[0]}
              required
            />
            <Input
              id="vendor-identity"
              label="Email"
              type="email"
              placeholder="you@store.com"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              icon={<Mail size={16} />}
              error={errors.identity?.[0] ?? errors.email?.[0]}
              autoComplete="email"
              required
            />

            <div className="w-full">
              <label className="label" htmlFor="vendor-password">
                Password
              </label>
              <div className="relative">
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  id="vendor-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={clsx(
                    'input ps-10 pe-10',
                    errors.password && 'border-red-500 focus:ring-red-500'
                  )}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password[0]}</p>
              )}
            </div>

            <Button type="submit" className="w-full justify-center" loading={loading} size="lg">
              Sign In to Store
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Don't have a store?{' '}
          <Link to={ROUTES.VENDOR_REGISTER} className="text-brand-400 hover:text-brand-300">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VendorLoginPage;
