import React, { useEffect, useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Shield,
  Edit2,
  UserX,
  UserCheck,
  Check,
  Clock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Table, Column } from '../components/ui/Table';
import { Card } from '../components/ui/Card';
import { UserItem } from '../types';
import { api } from '../services/api';
import { useToast } from '../components/ui/Toast';

export const Users: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserItem['role']>('Resident');
  const [inviteDepartment, setInviteDepartment] = useState('Oral & Maxillofacial Surgery');

  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch {
      toast({ type: 'error', title: 'Failed to load users' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      toast({ type: 'warning', title: 'Name and Email required' });
      return;
    }
    try {
      const newUser = await api.inviteUser({
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
        department: inviteDepartment,
      });
      toast({ type: 'success', title: 'Invitation Sent', message: `Invited ${newUser.name} as ${newUser.role}` });
      setIsInviteModalOpen(false);
      setInviteName('');
      setInviteEmail('');
      loadUsers();
    } catch {
      toast({ type: 'error', title: 'Invitation failed' });
    }
  };

  const handleToggleDeactivate = async (u: UserItem) => {
    try {
      const updated = await api.deactivateUser(u.id);
      toast({
        type: updated.status === 'Active' ? 'success' : 'info',
        title: `User ${updated.status}`,
        message: `${u.name} is now ${updated.status}.`
      });
      loadUsers();
    } catch {
      toast({ type: 'error', title: 'Failed to update user status' });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      await api.updateUser(editingUser.id, editingUser);
      toast({ type: 'success', title: 'Role Updated', message: `${editingUser.name} updated.` });
      setEditingUser(null);
      loadUsers();
    } catch {
      toast({ type: 'error', title: 'Update failed' });
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns: Column<UserItem>[] = [
    {
      key: 'name',
      header: 'Clinical Staff Member',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-elevated border border-border-hairline text-primary font-bold text-xs flex items-center justify-center shrink-0">
            {item.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <span className="font-medium text-primary block">{item.name}</span>
            <span className="text-xs text-muted font-mono">{item.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Clinical Role',
      render: (item) => (
        <span className="text-xs px-2.5 py-1 rounded-pill bg-elevated border border-border-hairline text-primary font-medium">
          {item.role}
        </span>
      )
    },
    {
      key: 'department',
      header: 'Department / Unit',
      render: (item) => (
        <span className="text-xs text-secondary">{item.department}</span>
      )
    },
    {
      key: 'status',
      header: 'Account Status',
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-pill font-medium ${
            item.status === 'Active'
              ? 'bg-status-completed/10 text-status-completed border border-status-completed/30'
              : 'bg-status-failed/10 text-status-failed border border-status-failed/30'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-status-completed' : 'bg-status-failed'}`} />
          {item.status}
        </span>
      )
    },
    {
      key: 'casesCount',
      header: 'Evaluated Cases',
      align: 'center',
      render: (item) => (
        <span className="font-mono text-xs text-primary font-medium">
          {item.casesCount}
        </span>
      )
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      render: (item) => (
        <span className="text-xs text-muted flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {item.lastActive}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingUser(item)}
            className="text-xs text-secondary hover:text-primary"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleDeactivate(item)}
            className={`text-xs ${item.status === 'Active' ? 'text-status-failed hover:bg-status-failed/10' : 'text-status-completed hover:bg-status-completed/10'}`}
          >
            {item.status === 'Active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-up max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-primary">
            Clinical User & Access Administration
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Manage attending surgeons, fellows, residents, and radiologists credentialed for SADIE.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsInviteModalOpen(true)}
          icon={<UserPlus className="w-4 h-4" />}
          iconPosition="left"
        >
          Invite Staff Member
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-surface border border-border-hairline shadow-card flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by physician name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-elevated border border-border-hairline rounded-pill pl-9 pr-3 py-1.5 text-xs sm:text-sm text-primary placeholder-muted focus:outline-none focus:border-border-subtle"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-elevated border border-border-hairline rounded-pill px-3 py-1.5 text-secondary hover:text-primary focus:outline-none"
          >
            <option value="All">All Roles</option>
            <option value="Chief Surgeon">Chief Surgeon</option>
            <option value="Attending Surgeon">Attending Surgeon</option>
            <option value="Fellow">Fellow</option>
            <option value="Resident">Resident</option>
            <option value="Oral Radiologist">Oral Radiologist</option>
            <option value="Administrator">Administrator</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-elevated border border-border-hairline rounded-pill px-3 py-1.5 text-secondary hover:text-primary focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <Table
        columns={columns}
        data={filteredUsers}
        keyExtractor={(u) => u.id}
        isLoading={isLoading}
        emptyMessage="No clinical staff found."
      />

      {/* Invite User Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Clinical Team Member"
        description="Issue institutional access credentials to the SADIE evaluative platform."
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-medium text-secondary block mb-1.5">Full Name & Degree *</label>
            <input
              type="text"
              required
              placeholder="e.g. Julian Vance, MD, DDS"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="w-full bg-elevated border border-border-hairline rounded-md p-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-border-subtle"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-secondary block mb-1.5">Hospital / Institutional Email *</label>
            <input
              type="email"
              required
              placeholder="e.g. j.vance@hospital-omfs.org"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full bg-elevated border border-border-hairline rounded-md p-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-border-subtle"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full bg-elevated border border-border-hairline rounded-md p-2.5 text-sm text-primary focus:outline-none focus:border-border-subtle"
              >
                <option value="Chief Surgeon">Chief Surgeon</option>
                <option value="Attending Surgeon">Attending Surgeon</option>
                <option value="Fellow">Fellow</option>
                <option value="Resident">Resident</option>
                <option value="Oral Radiologist">Oral Radiologist</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">Department</label>
              <input
                type="text"
                value={inviteDepartment}
                onChange={(e) => setInviteDepartment(e.target.value)}
                className="w-full bg-elevated border border-border-hairline rounded-md p-2.5 text-sm text-primary focus:outline-none focus:border-border-subtle"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-border-hairline flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Send Invite ↗
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Role Modal */}
      {editingUser && (
        <Modal
          isOpen={true}
          onClose={() => setEditingUser(null)}
          title={`Edit Permissions — ${editingUser.name}`}
          description="Update surgical privileges and department assignment."
        >
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">Assigned Role</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                className="w-full bg-elevated border border-border-hairline rounded-md p-2.5 text-sm text-primary focus:outline-none focus:border-border-subtle"
              >
                <option value="Chief Surgeon">Chief Surgeon</option>
                <option value="Attending Surgeon">Attending Surgeon</option>
                <option value="Fellow">Fellow</option>
                <option value="Resident">Resident</option>
                <option value="Oral Radiologist">Oral Radiologist</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-secondary block mb-1.5">Department</label>
              <input
                type="text"
                value={editingUser.department}
                onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                className="w-full bg-elevated border border-border-hairline rounded-md p-2.5 text-sm text-primary focus:outline-none focus:border-border-subtle"
              />
            </div>

            <div className="pt-3 border-t border-border-hairline flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
