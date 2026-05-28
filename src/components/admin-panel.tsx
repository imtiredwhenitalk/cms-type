"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export function AdminPanel({ locale }: { locale: string }) {
  const { user, token, isLoading } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  // Fetch users
  useEffect(() => {
    if (user && token && user.is_admin) {
      fetchUsers();
    }
  }, [user, token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    try {
      setUpdatingUserId(userId);
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user");
      }

      setSuccess(`User ${!isActive ? "activated" : "deactivated"} successfully`);
      fetchUsers();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating user");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleToggleAdmin = async (userId: number, isAdmin: boolean) => {
    try {
      setUpdatingUserId(userId);
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ is_admin: !isAdmin }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user");
      }

      setSuccess(`User ${!isAdmin ? "promoted" : "demoted"} successfully`);
      fetchUsers();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating user");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;

    try {
      setUpdatingUserId(userId);
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }

      setSuccess("User deleted successfully");
      fetchUsers();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting user");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isLoading) {
    return <div className="text-center text-slate-400">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
        <p className="text-slate-300 mb-4">Please log in to access the admin panel</p>
        <Link href={`/${locale}/auth/login`} className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  if (!user.is_admin) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-slate-300">You do not have permission to access the admin panel</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-slate-400">Manage users and system content</p>
      </div>

      {/* Users Management */}
      <div className="rounded-xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Users Management</h2>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-green-400 text-sm mb-4">
            {success}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border border-slate-800/50 bg-slate-900/50 p-4">
            <p className="text-slate-400 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-white">{users.length}</p>
          </div>
          <div className="rounded-lg border border-slate-800/50 bg-slate-900/50 p-4">
            <p className="text-slate-400 text-sm">Active Users</p>
            <p className="text-3xl font-bold text-green-400">{users.filter(u => u.is_active).length}</p>
          </div>
          <div className="rounded-lg border border-slate-800/50 bg-slate-900/50 p-4">
            <p className="text-slate-400 text-sm">Admins</p>
            <p className="text-3xl font-bold text-blue-400">{users.filter(u => u.is_admin).length}</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 py-8">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-slate-400 py-8">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800/50">
                <tr>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Username</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Full Name</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Joined</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{u.username}</td>
                    <td className="py-3 px-4 text-slate-300">{u.email}</td>
                    <td className="py-3 px-4 text-slate-300">{u.full_name || "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.is_active 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        u.is_admin 
                          ? "bg-blue-500/20 text-blue-400" 
                          : "bg-slate-700/50 text-slate-400"
                      }`}>
                        {u.is_admin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(u.id, u.is_active)}
                          disabled={updatingUserId === u.id}
                          className={`px-2 py-1 text-xs rounded border transition-all ${
                            u.is_active
                              ? "border-red-500/50 text-red-400 hover:bg-red-500/10"
                              : "border-green-500/50 text-green-400 hover:bg-green-500/10"
                          } disabled:opacity-50`}
                        >
                          {u.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                          disabled={updatingUserId === u.id}
                          className="px-2 py-1 text-xs rounded border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-50"
                        >
                          {u.is_admin ? "Demote" : "Promote"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.username)}
                          disabled={updatingUserId === u.id}
                          className="px-2 py-1 text-xs rounded border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
