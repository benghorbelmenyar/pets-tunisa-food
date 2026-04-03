import { useState, useEffect } from 'react';
import { Users, Mail, Shield, Calendar } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Registered Users</h1>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--color-background-alt)', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Name</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Email</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Role</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Date Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, idx) => {
                            const id = user._id || user.id || idx;
                            const date = new Date(user.createdAt || Date.now()).toLocaleDateString();
                            return (
                                <tr key={id} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'transparent' }} className="hover-background">
                                    <td style={{ padding: '16px 24px', fontWeight: 600 }}>
                                        <div className="flex items-center gap-3">
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                {(user.firstName || user.email || '?')[0].toUpperCase()}
                                            </div>
                                            {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}` : 'No Name Provided'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-muted" /> {user.email}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '12px',
                                            backgroundColor: user.role === 'admin' ? '#eef2ff' : '#f0fdf4',
                                            color: user.role === 'admin' ? '#4f46e5' : '#16a34a',
                                            width: 'fit-content'
                                        }}>
                                            {user.role === 'admin' ? <Shield size={14} /> : <Users size={14} />}
                                            {user.role === 'admin' ? 'Admin' : 'Client'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} /> {date}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
