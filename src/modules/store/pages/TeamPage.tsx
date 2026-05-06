import React, { useState } from 'react';
import { Plus, Shield, UserCheck } from 'lucide-react';
import { TeamMember } from '@/core/types';
import { Table, Column } from '@/shared/components/Table';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/components/Modal';
import { Input, Select } from '@/shared/ui/Input';
import toast from 'react-hot-toast';

const mockTeam: TeamMember[] = [
  { id: 'tm1', name: 'Sarah Connor', email: 'sarah@demo-store.com', role: 'STORE_ADMIN', status: 'active', joinedAt: '2024-02-15T10:30:00Z' },
  { id: 'tm2', name: 'Tom Manager', email: 'tom@demo-store.com', role: 'STORE_MANAGER', status: 'active', joinedAt: '2024-04-01T11:00:00Z' },
  { id: 'tm3', name: 'Jane Invited', email: 'jane@demo-store.com', role: 'STORE_MANAGER', status: 'invited', joinedAt: '2024-04-18T09:00:00Z' },
];

const TeamPage: React.FC = () => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('STORE_MANAGER');

  const columns: Column<TeamMember>[] = [
    {
      key: 'name',
      header: 'Member',
      sortable: true,
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600/30 to-brand-800/20 flex items-center justify-center">
            <span className="text-brand-300 font-semibold text-xs">{m.name[0]}</span>
          </div>
          <div>
            <p className="font-medium text-white text-sm">{m.name}</p>
            <p className="text-xs text-slate-500">{m.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (m) => (
        <div className="flex items-center gap-2">
          {m.role === 'STORE_ADMIN' ? <Shield size={14} className="text-brand-400" /> : <UserCheck size={14} className="text-green-400" />}
          <span className="text-slate-300 text-sm">{m.role.replace('_', ' ')}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (m) => (
        <Badge variant={m.status === 'active' ? 'green' : 'yellow'}>{m.status}</Badge>
      ),
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      sortable: true,
      render: (m) => <span className="text-slate-400 text-sm">{new Date(m.joinedAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your store team and permissions.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setInviteOpen(true)}>
          Invite Member
        </Button>
      </div>

      <Table data={mockTeam} columns={columns} emptyMessage="No team members yet." />

      <Modal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite Team Member"
        footer={
          <>
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success(`Invite sent to ${inviteEmail} (mock)!`); setInviteOpen(false); }}>
              Send Invite
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Email Address" type="email" placeholder="colleague@email.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
          <Select
            label="Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            options={[
              { label: 'Store Admin', value: 'STORE_ADMIN' },
              { label: 'Store Manager', value: 'STORE_MANAGER' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default TeamPage;
