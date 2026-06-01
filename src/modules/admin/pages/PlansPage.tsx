import React, { useState } from 'react';
import { usePlans, useUpdatePlan } from '../hooks/usePlans';
import { Plan } from '@/core/types';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/components/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Input';
import { Pencil, Eye, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

interface PlanForm {
  name: string;
  price: number;
  duration_days: number;
  orders_limit: number | '';
  products_limit: number | '';
  support: string;
  custom_domain: 'true' | 'false';
  is_active: 'true' | 'false';
}

const PlansPage: React.FC = () => {
  const { data: plans = [], isLoading } = usePlans();
  const updatePlan = useUpdatePlan();

  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [viewPlan, setViewPlan] = useState<Plan | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PlanForm>();

  const openEdit = (p: Plan) => {
    reset({
      name: p.name,
      price: Number(p.price) || 0,
      duration_days: p.duration_days,
      orders_limit: p.features?.orders_limit ?? '',
      products_limit: p.features?.products_limit ?? '',
      support: p.features?.support ?? 'Standard',
      custom_domain: p.features?.custom_domain ? 'true' : 'false',
      is_active: p.is_active ? 'true' : 'false',
    });
    setEditPlan(p);
  };

  const onSubmit = async (data: PlanForm) => {
    if (!editPlan) return;
    
    await updatePlan.mutateAsync({
      id: editPlan.id,
      payload: {
        name: data.name,
        price: Number(data.price),
        duration_days: Number(data.duration_days),
        is_active: data.is_active === 'true',
        features: {
          orders_limit: data.orders_limit === '' ? null : Number(data.orders_limit),
          products_limit: data.products_limit === '' ? null : Number(data.products_limit),
          support: data.support,
          custom_domain: data.custom_domain === 'true',
        }
      }
    });
    setEditPlan(null);
  };

  if (isLoading) {
    return <div className="text-slate-400">Loading plans...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-textPrimary">Subscription Plans</h1>
        <p className="text-slate-400 text-sm mt-1">Manage platform pricing plans and features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="card flex flex-col relative group">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <Badge variant={plan.is_active ? 'green' : 'slate'}>
                {plan.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="mb-4 pt-2">
              <h3 className="text-xl font-bold text-textPrimary mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-textPrimary">${Number(plan.price).toFixed(2)}</span>
                <span className="text-slate-400 text-sm">/ {plan.duration_days} days</span>
              </div>
            </div>

            <div className="flex-1 mb-6">
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check size={16} className="text-brand-400 flex-shrink-0" />
                  <span>
                    {plan.features?.products_limit === null 
                      ? 'Unlimited Products' 
                      : `${plan.features?.products_limit} Products`}
                  </span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check size={16} className="text-brand-400 flex-shrink-0" />
                  <span>
                    {plan.features?.orders_limit === null 
                      ? 'Unlimited Orders' 
                      : `${plan.features?.orders_limit} Orders`}
                  </span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check size={16} className="text-brand-400 flex-shrink-0" />
                  <span>{plan.features?.support || 'Standard'} Support</span>
                </li>
                <li className={clsx("flex items-center gap-2 text-sm", plan.features?.custom_domain ? "text-slate-300" : "text-slate-500 opacity-75")}>
                  {plan.features?.custom_domain ? <Check size={16} className="text-brand-400 flex-shrink-0" /> : <X size={16} className="text-slate-500 flex-shrink-0" />}
                  <span>Custom Domain</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-2 mt-auto">
              <Button 
                variant="secondary" 
                className="flex-1"
                icon={<Eye size={16} />}
                onClick={() => setViewPlan(plan)}
              >
                Details
              </Button>
              <Button 
                className="flex-1"
                icon={<Pencil size={16} />}
                onClick={() => openEdit(plan)}
              >
                Edit Plan
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Plan Modal */}
      <Modal
        isOpen={!!editPlan}
        onClose={() => setEditPlan(null)}
        title={`Edit Plan: ${editPlan?.name}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditPlan(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={updatePlan.isPending}>
              Save Changes
            </Button>
          </>
        }
      >
        <form className="max-h-[70vh] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Plan Name"
            {...register('name', { required: true })}
            error={errors.name ? 'Name is required' : undefined}
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            {...register('price', { required: true, min: 0 })}
            error={errors.price ? 'Valid price is required' : undefined}
          />
          <Input
            label="Duration (Days)"
            type="number"
            {...register('duration_days', { required: true, min: 1 })}
            error={errors.duration_days ? 'Duration must be at least 1 day' : undefined}
          />
          
          <Select
            label="Status"
            {...register('is_active')}
            options={[
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
          />

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-medium text-textPrimary mb-2 pb-1 border-b border-surface-border">Features Configuration</h4>
          </div>

          <Input
            label="Products Limit"
            type="number"
            placeholder="Leave empty for unlimited"
            {...register('products_limit')}
            hint="Empty means unlimited products"
          />
          <Input
            label="Orders Limit"
            type="number"
            placeholder="Leave empty for unlimited"
            {...register('orders_limit')}
            hint="Empty means unlimited orders"
          />
          <Input
            label="Support Type"
            placeholder="e.g. Email Only, Priority 24/7"
            {...register('support')}
          />
          <Select
            label="Custom Domain Access"
            {...register('custom_domain')}
            options={[
              { label: 'Enabled', value: 'true' },
              { label: 'Disabled', value: 'false' },
            ]}
          />
        </form>
      </Modal>

      {/* View Plan Details Modal */}
      <Modal
        isOpen={!!viewPlan}
        onClose={() => setViewPlan(null)}
        title="Plan Details"
        footer={<Button onClick={() => setViewPlan(null)}>Close</Button>}
      >
        {viewPlan && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">ID</p>
                <p className="text-sm text-textSecondary font-mono mt-1">{viewPlan.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="text-sm text-textSecondary mt-1">{viewPlan.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Price</p>
                <p className="text-sm text-textSecondary mt-1">${Number(viewPlan.price).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Duration</p>
                <p className="text-sm text-textSecondary mt-1">{viewPlan.duration_days} Days</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <p className="text-sm mt-1">
                  <Badge variant={viewPlan.is_active ? 'green' : 'slate'}>
                    {viewPlan.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </p>
              </div>
            </div>

            <hr className="border-surface-border" />

            <div>
              <h4 className="text-sm font-medium text-textPrimary mb-3">Features</h4>
              <div className="grid grid-cols-2 gap-4 bg-surface rounded-lg p-4 border border-surface-border">
                <div>
                  <p className="text-xs text-slate-500">Products Limit</p>
                  <p className="text-sm text-textSecondary mt-1">
                    {viewPlan.features?.products_limit === null ? 'Unlimited' : viewPlan.features?.products_limit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Orders Limit</p>
                  <p className="text-sm text-textSecondary mt-1">
                    {viewPlan.features?.orders_limit === null ? 'Unlimited' : viewPlan.features?.orders_limit}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Support</p>
                  <p className="text-sm text-textSecondary mt-1">{viewPlan.features?.support || 'Standard'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Custom Domain</p>
                  <p className="text-sm text-textSecondary mt-1">
                    {viewPlan.features?.custom_domain ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PlansPage;
