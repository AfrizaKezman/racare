"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SettingsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    role: 'user',
    isActive: true
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId, newRole) {
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole })
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  }

  async function handleStatusChange(userId, newStatus) {
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, isActive: newStatus })
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  }

  async function handleDeleteUser(userId) {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await fetch('/api/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId })
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }

  async function handleAddUser(e) {
    e.preventDefault();
    setErrorMsg('');
    if (!newUser.username || !newUser.email || !newUser.password) {
      setErrorMsg('Username, email, dan password wajib diisi');
      return;
    }
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Gagal menambah user');
        return;
      }
      setShowModal(false);
      setNewUser({ username: '', email: '', fullName: '', password: '', role: 'user', isActive: true });
      fetchUsers();
    } catch (error) {
      setErrorMsg('Gagal menambah user');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pengaturan Pengguna</h1>
            <p className="mt-2 text-gray-600">Kelola pengguna dan hak akses sistem</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-fuchsia-600 transition-all duration-200 shadow-md"
          >
            + Tambah User
          </button>
        </div>
        {/* Modal Tambah User */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full m-4">
              <h2 className="text-2xl font-bold mb-6 text-fuchsia-700">Tambah User Baru</h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-pink-400 focus:border-pink-400"
                  value={newUser.username}
                  onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-pink-400 focus:border-pink-400"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Nama Lengkap (opsional)"
                  className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-pink-400 focus:border-pink-400"
                  value={newUser.fullName}
                  onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-pink-400 focus:border-pink-400"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:ring-pink-400 focus:border-pink-400"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newUser.isActive}
                    onChange={e => setNewUser({ ...newUser, isActive: e.target.checked })}
                    id="isActive"
                  />
                  <label htmlFor="isActive" className="text-sm">Aktif</label>
                </div>
                {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setErrorMsg(''); }}
                    className="px-4 py-2 rounded-full border border-pink-200 hover:bg-pink-50 text-pink-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white hover:from-pink-600 hover:to-fuchsia-600"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Users Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pengguna
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.fullName || user.username}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                              <div className="text-xs text-gray-400">
                                @{user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={user.id === currentUser?.id}
                            className="text-sm text-gray-900 border rounded-md px-2 py-1"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.isActive ? 'active' : 'inactive'}
                            onChange={(e) => handleStatusChange(user.id, e.target.value === 'active')}
                            disabled={user.id === currentUser?.id}
                            className="text-sm border rounded-md px-2 py-1"
                          >
                            <option value="active">Aktif</option>
                            <option value="inactive">Nonaktif</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Hapus
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}