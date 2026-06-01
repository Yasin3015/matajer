import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Store, BarChart2, Zap, Shield, Truck } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useRegisterVendor } from '@/modules/admin/hooks/useVendors';
import { ROUTES } from '@/core/constants';
import { RegisterVendorPayload } from '@/modules/admin/services/vendorsService';

const VendorRegisterPage: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterVendorPayload>();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const registerVendor = useRegisterVendor();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const pageDir = isRtl ? 'rtl' : 'ltr';

  const onSubmit = async (data: RegisterVendorPayload) => {
    if (!acceptedTerms) {
      setTermsError(true);
      return;
    }
    setTermsError(false);

    try {
      await registerVendor.mutateAsync(data);
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        Object.keys(serverErrors).forEach((field) => {
          setError(field as keyof RegisterVendorPayload, {
            type: 'server',
            message: serverErrors[field][0],
          });
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans" dir={pageDir}>
      {/* ── Left Side: Registration Form (45%) ── */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 xl:px-20 py-12 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Store size={20} className="text-white" />
            </div>
            <span className="font-bold text-textPrimary text-xl">Matajer</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-textPrimary mb-2">{t('vendorRegister.title')}</h1>
          <p className="text-textSecondary mb-8 text-sm sm:text-base">
            {t('vendorRegister.subtitle')}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label={t('vendorRegister.ownerName')}
              placeholder={t('vendorRegister.ownerNamePlaceholder')}
              {...register('owner_name', { required: true })}
              error={errors.owner_name?.message || (errors.owner_name ? t('vendorRegister.ownerNameRequired') : undefined)}
            />

            <Input
              label={t('vendorRegister.storeName')}
              placeholder={t('vendorRegister.storeNamePlaceholder')}
              {...register('vendor_name', { required: true })}
              error={errors.vendor_name?.message || (errors.vendor_name ? t('vendorRegister.storeNameRequired') : undefined)}
            />

            <Input
              label={t('vendorRegister.email')}
              type="email"
              placeholder={t('vendorRegister.emailPlaceholder')}
              {...register('email', { required: true })}
              error={errors.email?.message || (errors.email ? t('vendorRegister.emailRequired') : undefined)}
              dir="ltr"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label={t('vendorRegister.phone')}
                placeholder={t('vendorRegister.phonePlaceholder')}
                {...register('phone')}
                error={errors.phone?.message}
                dir="ltr"
              />
              <Input
                label={t('vendorRegister.slug')}
                placeholder={t('vendorRegister.slugPlaceholder')}
                {...register('slug', { required: true })}
                error={errors.slug?.message || (errors.slug ? t('vendorRegister.slugRequired') : undefined)}
                dir="ltr"
              />
            </div>

            <Input
              label={t('vendorRegister.customDomain')}
              placeholder={t('vendorRegister.customDomainPlaceholder')}
              {...register('custom_domain')}
              error={errors.custom_domain?.message}
              dir="ltr"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label={t('vendorRegister.password')}
                type="password"
                placeholder={t('vendorRegister.passwordPlaceholder')}
                {...register('password', { required: true, minLength: 6 })}
                error={errors.password?.message || (errors.password ? t('vendorRegister.passwordLength') : undefined)}
                dir="ltr"
              />
              <Input
                label={t('vendorRegister.confirmPassword')}
                type="password"
                placeholder={t('vendorRegister.confirmPasswordPlaceholder')}
                {...register('password_confirmation', { required: true })}
                error={errors.password_confirmation?.message || (errors.password_confirmation ? t('vendorRegister.confirmPasswordRequired') : undefined)}
                dir="ltr"
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 py-2">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (e.target.checked) setTermsError(false);
                  }}
                  className="w-4 h-4 rounded border-inputBorder text-primary focus:ring-primary/20 cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="text-sm text-textSecondary cursor-pointer leading-tight">
                {t('vendorRegister.termsText1')}
                <a href="#" className="text-primary hover:underline font-medium">{t('vendorRegister.termsLink1')}</a>
                {t('vendorRegister.termsText2')}
                <a href="#" className="text-primary hover:underline font-medium">{t('vendorRegister.termsLink2')}</a>
                {t('vendorRegister.termsText3')}
              </label>
            </div>
            {termsError && <p className="text-xs text-danger font-medium -mt-2">{t('vendorRegister.termsRequired')}</p>}

            <Button
              type="submit"
              className="w-full justify-center text-base"
              size="lg"
              loading={registerVendor.isPending}
            >
              {t('vendorRegister.submitBtn')}
            </Button>
          </form>

          <div className="mt-8 text-center pt-6">
            <p className="text-textSecondary text-sm">
              {t('vendorRegister.alreadyHaveAccount')}
              <Link to={ROUTES.LOGIN} className="text-primary hover:text-primaryHover font-bold transition-colors">
                {t('vendorRegister.loginLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Side: Marketing Showcase Panel (55%) ── */}
      <div
        className="hidden lg:flex flex-col w-[55%] relative overflow-hidden p-12 justify-center"
        style={{ background: 'linear-gradient(135deg, #0051D5 0%, #316BF3 100%)' }}
      >
        {/* Soft background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-[#316BF3] rounded-full blur-[100px] mix-blend-screen opacity-50" />
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
          {/* Hero Content */}
          <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6 tracking-tight drop-shadow-sm">
            {t('vendorRegister.heroTitle')}
          </h1>
          <p className="text-lg xl:text-xl text-white/90 mb-16 leading-relaxed max-w-xl">
            {t('vendorRegister.heroSubtitle')}
          </p>

          {/* Feature Grid (2x2) */}
          <div className="grid grid-cols-2 gap-4 w-full mb-16">
            {/* Feature 1 */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-start flex flex-col gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/20 hover:-translate-y-1 transition-transform" dir={pageDir}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart2 size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-[#191C1E] text-lg mb-1">{t('vendorRegister.feat1Title')}</h3>
                <p className="text-sm text-[#424754]">{t('vendorRegister.feat1Desc')}</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-start flex flex-col gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/20 hover:-translate-y-1 transition-transform" dir={pageDir}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-[#191C1E] text-lg mb-1">{t('vendorRegister.feat2Title')}</h3>
                <p className="text-sm text-[#424754]">{t('vendorRegister.feat2Desc')}</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-start flex flex-col gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/20 hover:-translate-y-1 transition-transform" dir={pageDir}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-[#191C1E] text-lg mb-1">{t('vendorRegister.feat3Title')}</h3>
                <p className="text-sm text-[#424754]">{t('vendorRegister.feat3Desc')}</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-start flex flex-col gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/20 hover:-translate-y-1 transition-transform" dir={pageDir}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Truck size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-[#191C1E] text-lg mb-1">{t('vendorRegister.feat4Title')}</h3>
                <p className="text-sm text-[#424754]">{t('vendorRegister.feat4Desc')}</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4 mt-auto">
            <p className="text-sm font-medium text-white">{t('vendorRegister.socialProof')}</p>
            <div className="flex -space-x-3 space-x-reverse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0051D5] overflow-hidden bg-white z-10 relative">
                  <img src={`https://i.pravatar.cc/100?img=${i + 40}`} alt="Merchant avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegisterPage;
