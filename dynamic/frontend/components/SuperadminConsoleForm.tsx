'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  CheckCircle, 
  Loader2, 
  FolderOpen, 
  FileText, 
  UserPlus, 
  Check, 
  Send 
} from 'lucide-react';
import { updateSystemSettings, updateUserRole, toggleContentPublishState } from '../app/admin/super/actions';

interface UserItem {
  id: string;
  name: string | null;
  email: string;
  role: string;
  staff: { id: string } | null;
}

interface DraftItem {
  id: string;
  title: string;
  type: string;
  info: string | null;
}

interface Props {
  initialSettings: Record<string, string>;
  initialUsers: UserItem[];
  initialDrafts: DraftItem[];
}

export default function SuperadminConsoleForm({ initialSettings, initialUsers, initialDrafts }: Props) {
  const [activeTab, setActiveTab] = useState<'settings' | 'users' | 'drafts'>('settings');

  // Settings states
  const [vision, setVision] = useState(initialSettings.vision_statement || '');
  const [mission, setMission] = useState(initialSettings.mission_statement || '');
  const [quote, setQuote] = useState(initialSettings.homepage_president_quote || '');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Users states
  const [users, setUsers] = useState(initialUsers);
  const [userRoles, setUserRoles] = useState<Record<string, string>>(
    initialUsers.reduce((acc, curr) => {
      acc[curr.id] = curr.role;
      return acc;
    }, {} as Record<string, string>)
  );
  const [usersLoading, setUsersLoading] = useState<Record<string, boolean>>({});
  const [usersSuccess, setUsersSuccess] = useState<Record<string, boolean>>({});

  // Drafts states
  const [drafts, setDrafts] = useState(initialDrafts);
  const [draftsLoading, setDraftsLoading] = useState<Record<string, boolean>>({});

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(false);
    setSettingsLoading(true);

    try {
      await updateSystemSettings({
        vision_statement: vision,
        mission_statement: mission,
        homepage_president_quote: quote,
      });
      setSettingsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to update system configurations.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'superadmin' | 'lab_staff' | 'researcher') => {
    setUsersLoading(prev => ({ ...prev, [userId]: true }));
    setUsersSuccess(prev => ({ ...prev, [userId]: false }));

    try {
      await updateUserRole(userId, newRole);
      setUserRoles(prev => ({ ...prev, [userId]: newRole }));
      setUsersSuccess(prev => ({ ...prev, [userId]: true }));
      setTimeout(() => {
        setUsersSuccess(prev => ({ ...prev, [userId]: false }));
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update user access role.');
    } finally {
      setUsersLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handlePublish = async (entityType: string, entityId: string | number) => {
    const key = `${entityType}-${entityId}`;
    setDraftsLoading(prev => ({ ...prev, [key]: true }));

    try {
      await toggleContentPublishState(entityType, entityId, false);
      setDrafts(prev => prev.filter(d => !(d.type === entityType && d.id === String(entityId))));
    } catch (err) {
      console.error(err);
      alert('Failed to publish content entry.');
    } finally {
      setDraftsLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Dynamic Tabs Navigation Header */}
      <div className="flex border-b border-slate-200 bg-white p-2.5 rounded-2xl shadow-sm space-x-2">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'settings' 
              ? 'bg-[var(--primary-maroon)] text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>System Configurations</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users' 
              ? 'bg-[var(--primary-maroon)] text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Access Control</span>
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'drafts' 
              ? 'bg-[var(--primary-maroon)] text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Content Approvals Queue ({drafts.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSettingsSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2">
              <Settings className="w-5 h-5 text-[var(--primary-maroon)]" />
              <span>Modify System Settings</span>
            </h3>
            <p className="text-xs text-slate-450 font-medium">Update core mission, vision, and presidential statements displayed on the landing page.</p>
          </div>

          {settingsSuccess && (
            <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold p-4 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>General site configuration variables updated successfully!</span>
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Research Center Vision Statement</label>
              <textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                required
                rows={3}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white h-24"
                placeholder="Vision statement..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Research Center Mission Statement</label>
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                required
                rows={3}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white h-24"
                placeholder="Mission statement..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">President / Office Quote Banner</label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                required
                rows={3}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white h-24"
                placeholder="Director / Quote banner statement..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={settingsLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-[var(--primary-maroon)] hover:bg-[var(--primary-maroon-hover)] text-white text-xs font-bold rounded-xl shadow cursor-pointer disabled:opacity-50"
            >
              {settingsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Save Configurations</span>
            </button>
          </div>
        </form>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2">
              <Users className="w-5 h-5 text-[var(--primary-maroon)]" />
              <span>User Registry Roles</span>
            </h3>
            <p className="text-xs text-slate-450 font-medium">Promote researchers or assign lab technicians to coordinate lab equipment bookings.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-150 bg-slate-50/50">
            <table className="min-w-full divide-y divide-slate-200 text-xs font-medium text-slate-650">
              <thead className="bg-slate-50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-left">
                <tr>
                  <th className="px-6 py-4">Researcher Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Assigned Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-150">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-[var(--secondary-blue)]">
                      {u.name || 'Anonymous User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold capitalize ${
                        userRoles[u.id] === 'superadmin' ? 'bg-red-50 text-red-700' :
                        userRoles[u.id] === 'lab_staff' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {userRoles[u.id]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center space-x-2">
                        {usersSuccess[u.id] && (
                          <span className="text-[10px] text-green-600 font-bold flex items-center space-x-0.5 mr-2">
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved</span>
                          </span>
                        )}
                        <select
                          value={userRoles[u.id]}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                          disabled={usersLoading[u.id]}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-655 focus:outline-none focus:ring-1 focus:ring-[var(--primary-maroon)] focus:border-transparent bg-white transition-all disabled:opacity-50"
                        >
                          <option value="researcher">Researcher</option>
                          <option value="lab_staff">Lab Staff</option>
                          <option value="superadmin">Superadmin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'drafts' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[var(--secondary-blue)] flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-[var(--primary-maroon)]" />
              <span>Pending Approvals Moderation</span>
            </h3>
            <p className="text-xs text-slate-450 font-medium">Verify submissions and push them public to remove draft flags.</p>
          </div>

          {drafts.length === 0 ? (
            <div className="border border-slate-200 rounded-3xl p-8 text-center text-xs text-slate-400 font-medium italic">
              All content records published. Drafts verification queue is currently empty.
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map(draft => {
                const key = `${draft.type}-${draft.id}`;
                return (
                  <div key={key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl bg-slate-50 border border-slate-150 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="inline-block px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-red-50 text-[var(--primary-maroon)] tracking-wider">
                          {draft.type}
                        </span>
                        {draft.info && (
                          <span className="text-[10px] text-slate-400 font-semibold">{draft.info}</span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[var(--secondary-blue)] leading-snug">
                        {draft.title}
                      </h4>
                      <p className="text-[9px] text-slate-400">ID Reference: {draft.id}</p>
                    </div>

                    <button
                      onClick={() => handlePublish(draft.type, draft.id)}
                      disabled={draftsLoading[key]}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-[var(--primary-maroon)] hover:bg-[var(--primary-maroon-hover)] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50 self-end sm:self-auto"
                    >
                      {draftsLoading[key] ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
