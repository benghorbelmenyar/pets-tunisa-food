import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [newCat, setNewCat] = useState({ name: '', description: '', imageUrl: '' });

    const fetchCategories = () => {
        api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setNewCat(prev => ({ ...prev, imageUrl: res.data.url }));
        } catch (err) {
            console.error(err);
            alert('Failed to upload image');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategoryId) {
                await api.patch(`/categories/${editingCategoryId}`, newCat);
            } else {
                await api.post('/categories', newCat);
            }
            setNewCat({ name: '', description: '', imageUrl: '' });
            setIsModalOpen(false);
            setEditingCategoryId(null);
            fetchCategories();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Erreur lors de la sauvegarde de la catégorie. Êtes-vous connecté en tant qu\'administrateur ?');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Manage Categories</h1>
                <button className="btn btn-primary" onClick={() => {
                    setEditingCategoryId(null);
                    setNewCat({ name: '', description: '', imageUrl: '' });
                    setIsModalOpen(true);
                }}>
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--color-background-alt)', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Name</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Slug</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Products Count</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat._id || cat.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '16px 24px', fontWeight: 500 }}>
                                    <div className="flex items-center gap-3">
                                        <img src={cat.imageUrl || 'https://via.placeholder.com/40'} alt={cat.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <span>{cat.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>{cat.description}</td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{ backgroundColor: 'var(--color-background-alt)', padding: '4px 12px', borderRadius: '30px', fontSize: '12px', fontWeight: 600 }}>N/A items</span>
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <div className="flex justify-end gap-2 text-muted">
                                        <button className="hover:text-primary" onClick={() => {
                                            setEditingCategoryId(cat._id || cat.id);
                                            setNewCat({
                                                name: cat.name || '',
                                                description: cat.description || '',
                                                imageUrl: cat.imageUrl || ''
                                            });
                                            setIsModalOpen(true);
                                        }}><Edit2 size={18} /></button>
                                        <button className="hover:text-error" onClick={() => handleDelete(cat._id || cat.id)}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No categories found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="animate-fade-in-up" style={{ backgroundColor: 'var(--color-surface)', padding: '32px', borderRadius: 'var(--radius-lg)', width: '400px', boxShadow: 'var(--shadow-lg)' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>{editingCategoryId ? 'Edit Category' : 'Add New Category'}</h2>
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Category Name</label>
                                <input type="text" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} required />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Description</label>
                                <input type="text" value={newCat.description} onChange={e => setNewCat({ ...newCat, description: e.target.value })} required />
                            </div>
                            <div className="flex gap-4 items-end">
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Category Image URL</label>
                                    <input type="text" value={newCat.imageUrl || ''} onChange={e => setNewCat({ ...newCat, imageUrl: e.target.value })} placeholder="https://example.com/img.jpg" style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '14px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Or upload from PC</label>
                                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ padding: '8px', fontSize: '14px' }} />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
