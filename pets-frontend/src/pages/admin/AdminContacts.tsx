import { useState, useEffect } from 'react';
import { Eye, Mail, MailOpen, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminContacts() {
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    const fetchMessages = async () => {
        try {
            const res = await api.get('/contacts');
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 30000);
        window.addEventListener('focus', fetchMessages);
        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', fetchMessages);
        };
    }, []);

    const markAsRead = async (id: string, read: boolean) => {
        try {
            await api.patch(`/contacts/${id}`, { read });
            fetchMessages();
            window.dispatchEvent(new Event('adminDataUpdated'));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            await api.delete(`/contacts/${id}`);
            fetchMessages();
            window.dispatchEvent(new Event('adminDataUpdated'));
        } catch (err) {
            console.error(err);
            alert('Failed to delete message.');
        }
    }

    const handleViewMessage = (msg: any) => {
        setSelectedMessage(msg);
        if (!msg.read) {
            markAsRead(msg._id || msg.id, true);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Messages</h1>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--color-background-alt)', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Date</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Name</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Email</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Sujet</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Statut</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map(msg => {
                            const id = msg._id || msg.id;
                            const date = new Date(msg.createdAt).toLocaleDateString() + ' ' + new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                                <tr key={id} onClick={() => handleViewMessage(msg)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--color-border)', backgroundColor: msg.read ? 'transparent' : '#f9fafb' }} className="hover-background">
                                    <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>{date}</td>
                                    <td style={{ padding: '16px 24px', fontWeight: 600 }}>{msg.name}</td>
                                    <td style={{ padding: '16px 24px' }}>{msg.email}</td>
                                    <td style={{ padding: '16px 24px' }}>{msg.subject}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        {msg.read ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                                                <MailOpen size={16} /> Lu
                                            </span>
                                        ) : (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600 }}>
                                                <Mail size={16} /> Non lu
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div className="flex justify-end gap-2 text-muted">
                                            <button onClick={(e) => { e.stopPropagation(); handleViewMessage(msg); }} className="hover:text-primary"><Eye size={18} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteMessage(id); }} className="hover:text-error"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {selectedMessage && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }} onClick={() => setSelectedMessage(null)}>
                    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Détails du message</h2>
                            <button onClick={() => setSelectedMessage(null)} className="btn-ghost" style={{ padding: '8px' }}>✕</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Éxpéditeur</div>
                                <div style={{ fontWeight: 600, fontSize: '16px' }}>{selectedMessage.name} ({selectedMessage.email})</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Date</div>
                                <div>{new Date(selectedMessage.createdAt).toLocaleString()}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Sujet</div>
                                <div style={{ fontWeight: 600 }}>{selectedMessage.subject}</div>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-background)', padding: '24px', borderRadius: '12px', marginTop: '8px' }}>
                                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{selectedMessage.message}</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                            <button className="btn btn-primary" onClick={() => setSelectedMessage(null)}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
