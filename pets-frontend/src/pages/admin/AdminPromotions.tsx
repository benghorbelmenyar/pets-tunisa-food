import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminPromotions() {
    const [promotions, setPromotions] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [productSearch, setProductSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newPromo, setNewPromo] = useState({ title: '', description: '', discountPercentage: 0, startDate: '', endDate: '', productIds: [] as string[] });

    const fetchData = async () => {
        try {
            const [promoRes, prodRes, catRes] = await Promise.all([
                api.get('/promotions'),
                api.get('/products'),
                api.get('/categories')
            ]);
            setPromotions(promoRes.data);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let generatedTitle = "Promotion Exceptionnelle";
            if (newPromo.productIds.length > 0) {
                const selectedProducts = products.filter(p => newPromo.productIds.includes(p._id));
                if (selectedProducts.length === 1) {
                    generatedTitle = selectedProducts[0].name || selectedProducts[0].title || "Promotion";
                } else if (selectedProducts.length > 1) {
                    generatedTitle = `${selectedProducts[0].name || selectedProducts[0].title || "Produit"} & ${selectedProducts.length - 1} autre(s)`;
                }
            }
            if (editingId) {
                await api.patch(`/promotions/${editingId}`, {
                    title: generatedTitle,
                    description: newPromo.description,
                    discountPercentage: newPromo.discountPercentage,
                    applicableProducts: newPromo.productIds,
                    startDate: new Date(newPromo.startDate).toISOString(),
                    endDate: new Date(newPromo.endDate).toISOString()
                });
            } else {
                await api.post('/promotions', {
                    title: generatedTitle,
                    description: newPromo.description,
                    discountPercentage: newPromo.discountPercentage,
                    applicableProducts: newPromo.productIds,
                    startDate: new Date(newPromo.startDate).toISOString(),
                    endDate: new Date(newPromo.endDate).toISOString()
                });
            }
            closeModal();
            fetchData();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Erreur lors de la sauvegarde de la promotion.');
        }
    };

    const openEditModal = (promo: any) => {
        setEditingId(promo._id || promo.id);
        setNewPromo({
            title: promo.title,
            description: promo.description,
            discountPercentage: promo.discountPercentage,
            startDate: new Date(promo.startDate).toISOString().slice(0, 16),
            endDate: new Date(promo.endDate).toISOString().slice(0, 16),
            productIds: promo.applicableProducts.map((p: any) => p._id || p.id || p)
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setNewPromo({ title: '', description: '', discountPercentage: 0, startDate: '', endDate: '', productIds: [] });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this promotion?')) return;
        try {
            await api.delete(`/promotions/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleProduct = (productId: string) => {
        setNewPromo(prev => ({
            ...prev,
            productIds: prev.productIds.includes(productId)
                ? prev.productIds.filter(id => id !== productId)
                : [...prev.productIds, productId]
        }));
    };

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Manage Promotions</h1>
                <button className="btn btn-primary" onClick={() => { setEditingId(null); setIsModalOpen(true); }}>
                    <Plus size={18} /> Add Promotion
                </button>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--color-background-alt)', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Title</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Discount</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status/End Date</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Products</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions.map(promo => {
                            const isExpired = new Date(promo.endDate) < new Date();
                            const isActive = new Date(promo.startDate) <= new Date() && !isExpired;
                            return (
                                <tr key={promo._id || promo.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>{promo.title}</td>
                                    <td style={{ padding: '16px 24px', color: 'var(--color-success)', fontWeight: 600 }}>{promo.discountPercentage}% OFF</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div className="flex items-center gap-2">
                                            <span style={{
                                                backgroundColor: isActive ? '#e8f5ec' : '#fdebeb',
                                                color: isActive ? 'var(--color-success)' : 'var(--color-error)',
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600
                                            }}>
                                                {isActive ? 'Active' : isExpired ? 'Expired' : 'Scheduled'}
                                            </span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                                {new Date(promo.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>
                                        {promo.applicableProducts && promo.applicableProducts.length > 0 ? (
                                            <div className="flex items-center gap-1" style={{ flexWrap: 'wrap' }}>
                                                {promo.applicableProducts.map((p: any) => (
                                                    <img key={p._id || p} src={(p.images && p.images[0]) ? p.images[0] : 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3'} alt={p.name || 'Product'} title={p.name} style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid var(--color-border)', objectFit: 'cover' }} />
                                                ))}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '12px' }}>0 items</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                        <div className="flex justify-end gap-2 text-muted">
                                            <button className="hover:text-primary" onClick={() => openEditModal(promo)}><Edit2 size={18} /></button>
                                            <button className="hover:text-error" onClick={() => handleDelete(promo._id || promo.id)}><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {promotions.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No promotions found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ backgroundColor: 'var(--color-surface)', padding: '32px', borderRadius: 'var(--radius-lg)', width: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>{editingId ? 'Edit Promotion' : 'Add New Promotion'}</h2>
                        <form onSubmit={handleAdd} className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Discount Percentage (%)</label>
                                    <input type="number" min="1" max="100" value={newPromo.discountPercentage || ''} onChange={e => setNewPromo({ ...newPromo, discountPercentage: Number(e.target.value) })} required />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Start Date</label>
                                    <input type="datetime-local" value={newPromo.startDate} onChange={e => setNewPromo({ ...newPromo, startDate: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} required />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>End Date</label>
                                    <input type="datetime-local" value={newPromo.endDate} onChange={e => setNewPromo({ ...newPromo, endDate: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }} required />
                                </div>
                            </div>

                            <div style={{ marginTop: '16px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Select Products Included</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '14px', backgroundColor: 'var(--color-surface)', outline: 'none' }}
                                    />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '14px', backgroundColor: 'var(--color-surface)', outline: 'none' }}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px' }} className="flex flex-col gap-2">
                                    {products.filter(p => (!productSearch || (p.name || p.title || '').toLowerCase().includes(productSearch.toLowerCase())) && (!selectedCategory || p.category === selectedCategory || p.category?._id === selectedCategory)).map(prod => (
                                        <label key={prod._id} className="flex items-center gap-3" style={{ fontSize: '14px', cursor: 'pointer', padding: '8px', borderRadius: '6px', backgroundColor: newPromo.productIds.includes(prod._id) ? 'var(--color-primary-light)' : 'transparent', border: newPromo.productIds.includes(prod._id) ? '1px solid var(--color-primary)' : '1px solid transparent', transition: 'all 0.2s' }}>
                                            <input
                                                type="checkbox"
                                                checked={newPromo.productIds.includes(prod._id)}
                                                onChange={() => toggleProduct(prod._id)}
                                                style={{ width: 'auto' }}
                                            />
                                            <img src={(prod.images && prod.images[0]) ? prod.images[0] : 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3'} alt={prod.name || 'product'} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                            <div className="flex flex-col">
                                                <span style={{ fontWeight: 600 }}>{prod.name || prod.title}</span>
                                                <span style={{ fontSize: '12px', color: 'var(--color-primary)' }}>{(prod.price / 1000).toFixed(3)} DT</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'Update Promotion' : 'Save Promotion'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
