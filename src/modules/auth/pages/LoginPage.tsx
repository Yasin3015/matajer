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
}[] = [
  { labelKey: 'login.demoPlatformAdmin', email: 'admin@matajer.com', password: 'admin123', color: 'text-brand-400' },
  { labelKey: 'login.demoStoreDemo', email: 'sarah@demo-store.com', password: 'store123', color: 'text-green-400' },
  { labelKey: 'login.demoStoreTech', email: 'mark@tech-store.com', password: 'store123', color: 'text-yellow-400' },
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
      className="min-h-screen bg-surface flex items-center justify-center p-4 relative"
      dir={rtl ? 'rtl' : 'ltr'}
      lang={i18n.language}
    >
      <div className="absolute top-4 end-4 z-10">
        <LanguageSwitcher variant="dark" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 start-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 mb-4 shadow-xl shadow-brand-900/40">
            <Store size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('login.welcome')}</h1>
          <p className="text-slate-400 text-sm mt-1">{t('login.subtitle')}</p>
        </div>

        <div className="card mb-6 space-y-2">
          <p className="text-xs font-medium text-slate-400 mb-3">{t('login.demoHint')}</p>
          <div className="grid gap-2">
            {DEMO_LOGINS.map((d) => (
              <button
                key={d.email}
                type="button"
                onClick={() => fillDemo(d.email, d.password)}
                className="flex items-center justify-between text-start px-3 py-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors group"
              >
                <span className={`text-xs font-medium ${d.color}`}>{t(d.labelKey)}</span>
                <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors">{t('login.clickToFill')}</span>
              </button>
            ))}
          </div>
        </div>

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
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={clsx(
                    'input ps-10 pe-10',
                    errors.password && 'border-red-500 focus:ring-red-500',
                  )}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password[0]}</p>}
            </div>
            <Button type="submit" className="w-full justify-center" loading={loading} size="lg">
              {t('login.signIn')}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">{t('login.footerTag')}</p>
      </div>
    </div>
  );
};

export default LoginPage;
