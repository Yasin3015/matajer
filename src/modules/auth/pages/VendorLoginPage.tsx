import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Lock, Mail, Eye, EyeOff, TrendingUp, Users } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
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
  const [rememberMe, setRememberMe] = useState(false);
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
    <div className="min-h-screen flex bg-white">
      {/* ── Left Side: Form Area ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 relative">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Store size={20} className="text-white" />
            </div>
            <span className="font-bold text-textPrimary text-xl">Matajer</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-textPrimary mb-2">Welcome back</h1>
          <p className="text-textSecondary mb-8">
            Enter your credentials to access your vendor dashboard.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="vendor-slug"
              label="Store Slug"
              placeholder="my-store"
              value={vendorSlug}
              onChange={(e) => setVendorSlug(e.target.value)}
              icon={<Store size={16} />}
              error={errors.vendor?.[0]}
              required
            />
            <Input
              id="vendor-identity"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              icon={<Mail size={16} />}
              error={errors.identity?.[0] ?? errors.email?.[0]}
              autoComplete="email"
              required
            />

            <div className="w-full">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-textSecondary" htmlFor="vendor-password">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-primary hover:text-primaryHover transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  id="vendor-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={clsx('input ps-10 pe-10', errors.password && 'border-danger')}
                  style={errors.password ? { borderColor: '#BA1A1A', boxShadow: '0 0 0 3px rgba(186,26,26,0.15)' } : undefined}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-danger font-medium">{errors.password[0]}</p>}
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-inputBorder text-primary focus:ring-primary/20 cursor-pointer"
              />
              <label htmlFor="remember-me" className="text-sm text-textSecondary cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            <Button type="submit" className="w-full justify-center mt-2" loading={loading} size="lg">
              Sign In to Store
            </Button>
          </form>

          <p className="text-start text-sm text-textSecondary mt-8">
            Don't have a store account?{' '}
            <Link to={ROUTES.VENDOR_REGISTER} className="text-primary hover:text-primaryHover font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right Side: Showcase Area ── */}
      <div className="hidden lg:flex flex-1 relative bg-appBg overflow-hidden p-12 items-center justify-center">
        {/* Decorative elements behind */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative w-full max-w-lg">
          {/* Main Image */}
          <div 
            className="w-full aspect-[4/5] sm:aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl relative"
            style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.08)' }}
          >
            <img 
              src="/showcase-bg.png" 
              alt="Premium E-commerce Showcase" 
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient to ensure text/cards pop */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Floating Analytics Card (Top Left) */}
          <div 
            className="absolute -top-6 -left-8 bg-white rounded-2xl p-4 flex items-start gap-4 animate-fade-in"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
          >
            <div className="w-10 h-10 rounded-xl bg-successLight flex items-center justify-center shrink-0">
              <TrendingUp size={20} className="text-success" />
            </div>
            <div>
              <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-1">Revenue</p>
              <p className="text-lg font-bold text-textPrimary">$124,500</p>
              <p className="text-xs font-medium text-success mt-1">+14.2% this month</p>
            </div>
          </div>

          {/* Floating Social Proof Card (Bottom Right) */}
          <div 
            className="absolute -bottom-6 -right-8 bg-white rounded-2xl p-4 flex flex-col gap-3 animate-fade-in"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)', animationDelay: '150ms' }}
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-appBg flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User avatar" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-primaryLight flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">+2k</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-textPrimary">Join growing merchants</p>
              <p className="text-xs text-textSecondary mt-0.5">Scale your business instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLoginPage;
