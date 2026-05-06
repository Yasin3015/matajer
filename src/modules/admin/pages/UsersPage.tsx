import React from 'react';
import { Column, Table } from '@/shared/components/Table';
import { User } from '@/core/types';
import { mockUsers } from '@/modules/auth/mock/users.mock';
import { Badge } from '@/shared/ui/Badge';

const roleColors: Record<string, 'blue' | 'green' | 'yellow' | 'slate'> = {
  PLATFORM_ADMIN: 'blue',
  STORE_ADMIN: 'green',
  STORE_MANAGER: 'yellow',
  CUSTOMER: 'slate',
};

const UsersPage: React.FC = () => {
  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
          <div>
            <p className="font-medium text-white text-sm">{u.name}</p>
            <p className="text-xs text-slate-500">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (u) => (
        <Badge variant={roleColors[u.role] ?? 'slate'}>
          {u.role.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'storeSlug',
      header: 'Store',
      render: (u) => <span className="text-slate-400 text-sm">{u.storeSlug ?? '—'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Joined',
      sortable: true,
      render: (u) => (
        <span className="text-slate-400 text-sm">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-slate-400 text-sm mt-1">All users across the platform.</p>
      </div>
      <Table data={mockUsers} columns={columns} emptyMessage="No users found." />
    </div>
  );
};

export default UsersPage;
