import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import clsx from 'clsx';

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'light' }) => {
  const { i18n, t } = useTranslation();
  const dark = variant === 'dark';
  const isEn = i18n.language === 'en' || i18n.language.startsWith('en');

  const toggle = () => {
    void i18n.changeLanguage(isEn ? 'ar' : 'en');
  };

  const btn = clsx(
    'inline-flex items-center justify-center rounded-lg border min-h-9 min-w-9 p-2 transition-colors',
    dark
      ? 'border-slate-600 bg-slate-800/60 text-slate-200 hover:bg-slate-700 hover:text-white'
      : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  );

  return (
    <button
      type="button"
      className={btn}
      onClick={toggle}
      aria-label={t('common.language')}
      title={isEn ? t('common.switchToArabic') : t('common.switchToEnglish')}
    >
      <Languages size={20} strokeWidth={2} className="shrink-0" aria-hidden />
    </button>
  );
};
