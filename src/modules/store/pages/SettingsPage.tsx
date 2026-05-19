import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input, Select, Textarea } from '@/shared/ui/Input';
import { Card } from '@/shared/ui/Card';
import { useVendorAuthStore } from '@/modules/auth/hooks/useVendorAuthStore';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { vendorUser, storeSlug } = useVendorAuthStore();
  const slug = storeSlug || 'Yallamatgar';
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: slug.replace('-', ' '), description: 'Your amazing store.', email: vendorUser?.email ?? '', currency: 'USD', category: 'General' });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success('Settings saved (mock)!');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Store Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure your store's identity and preferences.</p>
      </div>

      <Card>
        <h2 className="font-semibold text-white mb-4">General Information</h2>
        <div className="space-y-4">
          <Input label="Store Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Contact Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Select
              label="Currency"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              options={[{ label: 'USD ($)', value: 'USD' }, { label: 'EUR (€)', value: 'EUR' }, { label: 'GBP (£)', value: 'GBP' }]}
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-white mb-4">Store URL</h2>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-sm">matajer.app/store/</span>
          <Input value={slug} disabled className="!w-auto flex-1 opacity-60 cursor-not-allowed" hint="Contact platform admin to change your store slug." />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button icon={<Save size={16} />} onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
