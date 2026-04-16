import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [newProd, setNewProd] = useState({
        name: '',
        description: '',
        category: '',
        basePrice: 0,
        stock: 0,
        images: [] as string[],
        imagesInput: ''
    });

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setNewProd(prev => ({
                ...prev,
                imagesInput: prev.imagesInput ? `${prev.imagesInput}, ${res.data.url}` : res.data.url
            }));
        } catch (err) {
            console.error(err);
            alert('Failed to upload image');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const productToSave = {
                ...newProd,
                price: Math.round(newProd.basePrice * 1000),
                images: newProd.imagesInput.split(',').map(s => s.trim()).filter(s => s)
            };

            if (editingProductId) {
                await api.patch(`/products/${editingProductId}`, productToSave);
            } else {
                await api.post('/products', productToSave);
            }

            setIsModalOpen(false);
            setEditingProductId(null);
            setNewProd({ name: '', description: '', category: '', basePrice: 0, stock: 0, images: [], imagesInput: '' });
            fetchData();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Erreur lors de la sauvegarde du produit.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Manage Products</h1>
                <button className="btn btn-primary" onClick={() => {
                    setEditingProductId(null);
                    setNewProd({ name: '', description: '', category: '', basePrice: 0, stock: 0, images: [], imagesInput: '' });
                    setIsModalOpen(true);
                }}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--color-background-alt)', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Title</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Category</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Price</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Stock</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(prod => (
                            <tr key={prod._id || prod.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '16px 24px', fontWeight: 500 }}>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={prod.images?.[0] || 'https://via.placeholder.com/40'}
                                            alt={prod.name}
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                        <span>{prod.name || prod.title}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>
                                    {prod.category?.name || prod.category}
                                </td>
                                <td style={{ padding: '16px 24px', fontWeight: 600 }}>
                                    {prod.isPromo && prod.oldPrice ? (
                                        <div className="flex flex-col">
                                            <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '12px', fontWeight: 500 }}>
                                                {(prod.oldPrice / 1000).toFixed(3)} DT
                                            </span>
                                            <span style={{ color: 'var(--color-primary)' }}>
                                                {(prod.price / 1000).toFixed(3)} DT
                                            </span>
                                        </div>
                                    ) : (
                                        <span>{(prod.price / 1000).toFixed(3)} DT</span>
                                    )}
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{
                                        backgroundColor: prod.stock > 10 ? '#e8f5ec' : prod.stock > 0 ? 'var(--color-primary-light)' : '#fdebeb',
                                        color: prod.stock > 10 ? 'var(--color-success)' : prod.stock > 0 ? 'var(--color-primary)' : 'var(--color-error)',
                                        padding: '4px 12px', borderRadius: '30px', fontSize: '12px', fontWeight: 600
                                    }}>
                                        {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of stock'}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <div className="flex justify-end gap-2 text-muted">
                                        <button className="hover:text-primary" onClick={() => {
                                            setEditingProductId(prod._id || prod.id);
                                            setNewProd({
                                                name: prod.name || prod.title || '',
                                                description: prod.description || '',
                                                category: prod.category?._id || prod.category?.id || prod.category || '',
                                                basePrice: (prod.price || 0) / 1000,
                                                stock: prod.stock || 0,
                                                images: prod.images || [],
                                                imagesInput: (prod.images || []).join(', ')
                                            });
                                            setIsModalOpen(true);
                                        }}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="hover:text-error" onClick={() => handleDelete(prod._id || prod.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="animate-fade-in-up" style={{ backgroundColor: 'var(--color-surface)', padding: '32px', borderRadius: 'var(--radius-lg)', width: '500px', boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>
                            {editingProductId ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Product Title</label>
                                <input
                                    type="text"
                                    value={newProd.name}
                                    onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Description</label>
                                <input
                                    type="text"
                                    value={newProd.description}
                                    onChange={e => setNewProd({ ...newProd, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Category</label>
                                <select
                                    value={newProd.category}
                                    onChange={e => setNewProd({ ...newProd, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Base Price (DT)</label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        min="0"
                                        value={newProd.basePrice || ''}
                                        onChange={e => setNewProd({ ...newProd, basePrice: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Initial Stock</label>
                                    <input
                                        type="number"
                                        value={newProd.stock !== undefined ? newProd.stock : ''}
                                        onChange={e => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 items-end">
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Image URLs (comma separated)</label>
                                    <input
                                        type="text"
                                        value={newProd.imagesInput || ''}
                                        onChange={e => setNewProd({ ...newProd, imagesInput: e.target.value })}
                                        placeholder="https://img1.jpg, https://img2.jpg"
                                        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '14px' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Or upload from PC</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        style={{ padding: '8px', fontSize: '14px' }}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}