import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Mail, Lock, Store, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import { ROUTES } from '@/core/constants';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import toast from 'react-hot-toast';

const DEMO_LOGINS: {
  labelKey: 'login.demoPlatformAdmin' | 'login.demoStoreDemo' | 'login.demoStoreTech';
  email: string;
  password: string;
  color: string;
  bg: string;
}[] = [
  { labelKey: 'login.demoPlatformAdmin', email: 'admin@matajer.com', password: 'admin123', color: 'text-primary', bg: 'bg-primaryLight' },
  { labelKey: 'login.demoStoreDemo',     email: 'sarah@Yallamatgar.com', password: 'store123', color: 'text-success', bg: 'bg-successLight' },
  { labelKey: 'login.demoStoreTech',     email: 'mark@tech-store.com', password: 'store123', color: 'text-amber-700', bg: 'bg-amber-50' },
];

const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const rtl = i18n.language === 'ar';

  const fillDemo = (email: string, pwd: string) => {
    setIdentity(email);
    setPassword(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!identity || !password) {
      toast.error(t('login.toastMissing'));
      return;
    }
    setLoading(true);
    const result = await login(identity, password);
    setLoading(false);

    if (!result.success) {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        toast.error(result.error ?? t('login.toastFailed'));
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

  const identityError = errors.identity?.[0] ?? errors.email?.[0];

  return (
    <div
      className="min-h-screen bg-appBg flex items-center justify-center p-4 relative"
      dir={rtl ? 'rtl' : 'ltr'}
      lang={i18n.language}
    >
      <div className="absolute top-4 end-4 z-10">
        <LanguageSwitcher />
      </div>

      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primaryHover mb-4 shadow-lg shadow-primary/20">
            <Store size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary">{t('login.welcome')}</h1>
          <p className="text-textSecondary text-sm mt-1">{t('login.subtitle')}</p>
        </div>

        {/* Demo logins */}
        <div className="card mb-5 space-y-2">
          <p className="text-xs font-semibold text-textSecondary mb-3 uppercase tracking-wider">{t('login.demoHint')}</p>
          <div className="grid gap-2">
            {DEMO_LOGINS.map((d) => (
              <button
                key={d.email}
                type="button"
                onClick={() => fillDemo(d.email, d.password)}
                className={clsx(
                  'flex items-center justify-between text-start px-3 py-2.5 rounded-xl transition-colors group border border-border hover:border-transparent',
                  d.bg
                )}
              >
                <span className={clsx('text-xs font-semibold', d.color)}>{t(d.labelKey)}</span>
                <span className="text-xs text-textSecondary group-hover:text-textPrimary transition-colors">{t('login.clickToFill')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Login form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="login-identity"
              label={t('login.email')}
              type="email"
              placeholder="you@example.com"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              icon={<Mail size={16} />}
              autoComplete="email"
              error={identityError}
              required
            />
            <div className="w-full">
              <label className="label" htmlFor="login-password">
                {t('login.password')}
              </label>
              <div className="relative">
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  id="login-password"
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
                  aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-danger font-medium">{errors.password[0]}</p>}
            </div>
            <Button type="submit" className="w-full justify-center" loading={loading} size="lg">
              {t('login.signIn')}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-textSecondary mt-6">{t('login.footerTag')}</p>
        <p className="text-center text-xs text-textSecondary mt-2">
          Store owner?{' '}
          <a href="/vendor/login" className="text-primary hover:text-primaryHover font-semibold transition-colors">
            Sign in to your vendor dashboard →
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
