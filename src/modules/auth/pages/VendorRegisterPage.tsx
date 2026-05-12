import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Store, ArrowLeft, Rocket } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useRegisterVendor } from '@/modules/admin/hooks/useVendors';
import { ROUTES } from '@/core/constants';
import { RegisterVendorPayload } from '@/modules/admin/services/vendorsService';

const VendorRegisterPage: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterVendorPayload>();
  const registerVendor = useRegisterVendor();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterVendorPayload) => {
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
    <div className="min-h-screen flex bg-surface">
      {/* Left Side: Branding / Image */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-brand-900/40 p-12 justify-between">
        {/* Abstract Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Store size={20} className="text-white" />
          </div>
          <span className="font-bold text-white text-xl">Matajer Suite</span>
        </div>

        <div className="relative z-10 max-w-lg mt-20">
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Launch Your E-Commerce Empire Today
          </h1>
          <p className="text-slate-300 text-lg mb-10">
            Join thousands of successful vendors. Get your customizable storefront, full admin control, and scalable infrastructure in seconds.
          </p>

          {/* Example Data Card for visual appeal */}
          <div className="bg-surface/60 backdrop-blur-md p-6 rounded-2xl border border-surface-border max-w-sm transform hover:-translate-y-2 transition-transform duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Rocket className="text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Stores Created</p>
                <p className="text-white font-bold text-2xl">16,048</p>
              </div>
            </div>
            <div className="w-full bg-surface-border h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-400 to-brand-400 w-3/4 h-full rounded-full" />
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm mt-20">
          © {new Date().getFullYear()} Matajer. All rights reserved.
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto">
        {/* Mobile Header (visible only on small screens) */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Store size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg">Matajer</span>
        </div>

        <div className="w-full max-w-md my-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-8">
            <ArrowLeft size={16} />
            Back to home
          </Link>

          <h2 className="text-3xl font-bold text-white mb-2">Create Your Store</h2>
          <p className="text-slate-400 mb-8">Fill in the details to register your new vendor account.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Owner Name"
                placeholder="John Carter"
                {...register('owner_name', { required: true })}
                error={errors.owner_name?.message || (errors.owner_name ? 'Owner name is required' : undefined)}
              />
              <Input
                label="Store Name"
                placeholder="Tech World Store"
                {...register('vendor_name', { required: true })}
                error={errors.vendor_name?.message || (errors.vendor_name ? 'Store name is required' : undefined)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                {...register('email', { required: true })}
                error={errors.email?.message || (errors.email ? 'Email is required' : undefined)}
              />
              <Input
                label="Phone"
                placeholder="201012345678"
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Store Slug"
                placeholder="tech-world-store"
                {...register('slug', { required: true })}
                error={errors.slug?.message || (errors.slug ? 'Slug is required' : undefined)}
              />
              <Input
                label="Custom Domain (optional)"
                placeholder="store.techworld.com"
                {...register('custom_domain')}
                error={errors.custom_domain?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password', { required: true, minLength: 6 })}
                error={errors.password?.message || (errors.password ? 'Password must be at least 6 characters' : undefined)}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                {...register('password_confirmation', { required: true })}
                error={errors.password_confirmation?.message || (errors.password_confirmation ? 'Confirmation is required' : undefined)}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              size="lg"
              loading={registerVendor.isPending}
            >
              Register Store
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-surface-border pt-6">
            <p className="text-slate-400 text-sm">
              Already have a store account?{' '}
              <Link to={ROUTES.LOGIN} className="text-brand-400 hover:text-brand-300 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegisterPage;
