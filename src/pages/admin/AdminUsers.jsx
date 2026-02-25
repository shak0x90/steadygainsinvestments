import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/utils/api';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        api.getUsers().then(setUsers).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleEdit = (user) => {
        setEditingId(user.id);
        setEditData({ name: user.name, email: user.email, role: user.role, active: user.active });
    };

    const handleSave = async (id) => {
        try {
            const updated = await api.updateUser(id, editData);
            setUsers(users.map((u) => (u.id === id ? { ...u, ...updated } : u)));
            setEditingId(null);
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="font-display text-2xl font-bold text-charcoal">User Management</h1>
                <span className="text-sm text-charcoal/50">{users.length} users</span>
            </div>

            <div className="bg-white rounded-xl border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-border">
                                <th className="text-left px-5 py-3 text-charcoal/50 font-medium text-xs">User</th>
                                <th className="text-left px-5 py-3 text-charcoal/50 font-medium text-xs">Role</th>
                                <th className="text-left px-5 py-3 text-charcoal/50 font-medium text-xs">Plan</th>
                                <th className="text-right px-5 py-3 text-charcoal/50 font-medium text-xs">Invested</th>
                                <th className="text-right px-5 py-3 text-charcoal/50 font-medium text-xs">Value</th>
                                <th className="text-center px-5 py-3 text-charcoal/50 font-medium text-xs">Status</th>
                                <th className="text-right px-5 py-3 text-charcoal/50 font-medium text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-b border-border/50 hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3">
                                        {editingId === u.id ? (
                                            <div className="space-y-1">
                                                <input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" />
                                                <input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full px-2 py-1 border rounded text-sm" />
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-medium text-charcoal">{u.name}</p>
                                                <p className="text-xs text-charcoal/40">{u.email}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        {editingId === u.id ? (
                                            <select value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })} className="px-2 py-1 border rounded text-sm">
                                                <option value="USER">USER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                        ) : (
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.role === 'ADMIN' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{u.role}</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-charcoal/60">{u.plan?.name || '—'}</td>
                                    <td className="px-5 py-3 text-right font-semibold">${u.totalInvested.toLocaleString()}</td>
                                    <td className="px-5 py-3 text-right font-semibold text-emerald-600">${u.currentValue.toLocaleString()}</td>
                                    <td className="px-5 py-3 text-center">
                                        {editingId === u.id ? (
                                            <button onClick={() => setEditData({ ...editData, active: !editData.active })} className={`text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer ${editData.active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                                {editData.active ? 'Active' : 'Disabled'}
                                            </button>
                                        ) : (
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{u.active ? 'Active' : 'Disabled'}</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        {editingId === u.id ? (
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => handleSave(u.id)} className="text-xs bg-emerald-brand text-white px-3 py-1 rounded-lg hover:bg-emerald-dark cursor-pointer">Save</button>
                                                <button onClick={() => setEditingId(null)} className="text-xs text-charcoal/50 hover:text-charcoal cursor-pointer">Cancel</button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 justify-end">
                                                <Link to={`/admin/users/${u.id}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium">View</Link>
                                                <button onClick={() => handleEdit(u)} className="text-xs text-amber-600 hover:text-amber-800 font-medium cursor-pointer">Edit</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
