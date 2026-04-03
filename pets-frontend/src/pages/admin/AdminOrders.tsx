import { useState, useEffect } from 'react';
import { Eye, ChevronDown, X, Package, Trash2, Search, Calendar, LayoutList, LayoutGrid } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        window.addEventListener('focus', fetchOrders);
        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', fetchOrders);
        };
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await api.patch(`/orders/${id}/status`, { status: newStatus.toUpperCase() });
            fetchOrders();
            window.dispatchEvent(new Event('adminDataUpdated'));
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Erreur lors de la mise à jour du statut.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;
        try {
            await api.delete(`/orders/${id}`);
            fetchOrders();
            window.dispatchEvent(new Event('adminDataUpdated'));
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'DELIVERED':
            case 'COMPLETED': return { bg: '#e8f5ec', color: 'var(--color-success)' };
            case 'PROCESSING': return { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' };
            case 'CANCELLED': return { bg: '#fdebeb', color: 'var(--color-error)' };
            default: return { bg: 'var(--color-background-alt)', color: 'var(--color-text-muted)' };
        }
    };

    const filteredOrders = orders.filter(order => {
        // Search Filter
        const q = searchQuery.toLowerCase();
        const idStr = (order._id || order.id || '').toLowerCase();
        const nameStr = order.customerInfo ? `${order.customerInfo.firstName || ''} ${order.customerInfo.lastName || ''}`.toLowerCase() : 'guest user';
        if (q && !idStr.includes(q) && !nameStr.includes(q)) return false;

        // Month Filter
        if (selectedMonth) {
            const orderMonth = new Date(order.createdAt).getMonth() + 1;
            if (orderMonth.toString() !== selectedMonth) return false;
        }

        // Status Filter
        if (selectedStatus && order.status.toUpperCase() !== selectedStatus) return false;

        return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const OrderCard = ({ order }: { order: any }) => {
        const colors = getStatusColor(order.status);
        const id = order._id || order.id;
        const user = order.customerInfo ? `${order.customerInfo.firstName || ''} ${order.customerInfo.lastName || ''}` : 'Guest User';
        return (
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', position: 'relative' }} className="hover-lift flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>#{id.slice(-6).toUpperCase()}</div>
                        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="text-muted hover:text-primary"><Eye size={16} /></button>
                        <button onClick={() => handleDelete(id)} className="text-muted hover:text-error"><Trash2 size={16} /></button>
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{user}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{order.items?.length || 0} articles • {((order.total || 0) / 1000).toFixed(3)} DT</div>
                </div>
                <div style={{ position: 'relative', width: '100%', marginTop: '4px' }}>
                    <select
                        value={order.status.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}
                        onChange={(e) => updateStatus(id, e.target.value)}
                        style={{
                            appearance: 'none', backgroundColor: colors.bg, color: colors.color, width: '100%',
                            padding: '8px 32px 8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                            border: '1px solid transparent', outline: 'none', cursor: 'pointer', transition: 'border 0.2s'
                        }}
                        className="hover:border-gray-300"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: colors.color }} />
                </div>
            </div>
        )
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700 }}>Order Management</h1>
                <div className="flex items-center gap-4 flex-wrap">
                    {/* View Toggles */}
                    <div className="flex items-center" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '4px', height: '40px' }}>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{ padding: '0 12px', borderRadius: '4px', backgroundColor: viewMode === 'list' ? 'var(--color-background-alt)' : 'transparent', color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-text-muted)', height: '100%' }}
                            className="flex items-center gap-2 text-sm font-semibold transition-all"
                        >
                            <LayoutList size={16} /> List
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            style={{ padding: '0 12px', borderRadius: '4px', backgroundColor: viewMode === 'kanban' ? 'var(--color-background-alt)' : 'transparent', color: viewMode === 'kanban' ? 'var(--color-primary)' : 'var(--color-text-muted)', height: '100%' }}
                            className="flex items-center gap-2 text-sm font-semibold transition-all"
                        >
                            <LayoutGrid size={16} /> Kanban
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative flex items-center" style={{ height: '40px' }}>
                        <Search size={16} className="absolute left-3 text-muted pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: '0 16px 0 36px', height: '100%', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '14px', outline: 'none' }}
                        />
                    </div>

                    {/* Filters */}
                    <div className="relative flex items-center" style={{ height: '40px' }}>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            style={{ padding: '0 32px 0 16px', height: '100%', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', appearance: 'none', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 text-muted pointer-events-none" />
                    </div>

                    <div className="relative flex items-center" style={{ height: '40px' }}>
                        <Calendar size={16} className="absolute left-3 text-muted pointer-events-none" />
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{ padding: '0 32px 0 36px', height: '100%', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', appearance: 'none', minWidth: '150px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="">All Months</option>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 text-muted pointer-events-none" />
                    </div>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--color-background-alt)', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Order ID</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Customer</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Date</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Items</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Total</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status Action</th>
                                <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => {
                                const colors = getStatusColor(order.status);
                                const id = order._id || order.id;
                                const user = order.customerInfo ? `${order.customerInfo.firstName || ''} ${order.customerInfo.lastName || ''}` : 'Guest User';
                                const date = new Date(order.createdAt).toLocaleDateString();
                                const total = order.total || 0;
                                const items = order.items?.length || 0;

                                return (
                                    <tr key={id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '16px 24px', fontWeight: 600 }}>#{id.slice(-6).toUpperCase()}</td>
                                        <td style={{ padding: '16px 24px' }}>{user}</td>
                                        <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>{date}</td>
                                        <td style={{ padding: '16px 24px' }}>{items} articles</td>
                                        <td style={{ padding: '16px 24px', fontWeight: 600 }}>{(total / 1000).toFixed(3)} DT</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ position: 'relative', width: 'fit-content' }}>
                                                <select
                                                    value={order.status.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())}
                                                    onChange={(e) => updateStatus(id, e.target.value)}
                                                    style={{
                                                        appearance: 'none', backgroundColor: colors.bg, color: colors.color,
                                                        padding: '6px 32px 6px 16px', borderRadius: '30px', fontSize: '12px', fontWeight: 600,
                                                        border: 'none', outline: 'none', cursor: 'pointer'
                                                    }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: colors.color }} />
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <div className="flex justify-end gap-2 text-muted">
                                                <button onClick={() => setSelectedOrder(order)} className="hover:text-primary"><Eye size={18} /></button>
                                                <button onClick={() => handleDelete(id)} className="hover:text-error"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No orders found matching criteria</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
                    {['PENDING', 'COMPLETED', 'CANCELLED'].map(colStatus => (
                        <div key={colStatus} style={{ backgroundColor: 'var(--color-background-alt)', borderRadius: 'var(--radius-xl)', padding: '20px', border: '1px solid var(--color-border)', minHeight: '500px' }}>
                            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
                                <h3 className="flex items-center gap-2" style={{ fontSize: '16px', fontWeight: 800, textTransform: 'capitalize' }}>
                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getStatusColor(colStatus).color }}></span>
                                    {colStatus.toLowerCase()}
                                </h3>
                                <span style={{ backgroundColor: 'var(--color-surface)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                                    {filteredOrders.filter(o => o.status.toUpperCase() === colStatus).length}
                                </span>
                            </div>
                            <div className="flex flex-col gap-4">
                                {filteredOrders.filter(o => o.status.toUpperCase() === colStatus).map(order => (
                                    <OrderCard key={order._id || order.id} order={order} />
                                ))}
                                {filteredOrders.filter(o => o.status.toUpperCase() === colStatus).length === 0 && (
                                    <div style={{ padding: '32px', textAlign: 'center', backgroundColor: 'var(--color-surface)', border: '1px dashed var(--color-border)', borderRadius: '12px' }}>
                                        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Mettez une commande ici !</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedOrder && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                    <div className="animate-fade-in-up" style={{ backgroundColor: 'var(--color-surface)', width: '100%', maxWidth: '600px', borderRadius: '16px', padding: '32px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', top: '24px', right: '24px' }} className="text-muted hover:text-text"><X size={24} /></button>

                        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Détails de la Commande</h2>

                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-primary)' }}>Coordonnées Client</h3>
                            <div style={{ backgroundColor: 'var(--color-background-alt)', padding: '16px', borderRadius: '8px', fontSize: '14px' }}>
                                <p><strong>Nom:</strong> {selectedOrder.customerInfo?.firstName} {selectedOrder.customerInfo?.lastName}</p>
                                <p><strong>Téléphone:</strong> {selectedOrder.customerInfo?.phone}</p>
                                <p><strong>Adresse:</strong> {selectedOrder.customerInfo?.address}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--color-primary)' }}>Articles ({selectedOrder.items?.length})</h3>
                            <div className="flex flex-col gap-3">
                                {selectedOrder.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-4" style={{ backgroundColor: 'var(--color-background-alt)', padding: '12px', borderRadius: '8px' }}>
                                        <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {item.product?.images?.[0] ?
                                                <img src={item.product.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                                <Package size={24} className="text-muted" />
                                            }
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.product?.name || 'Produit Inconnu'}</div>
                                            <div className="text-muted" style={{ fontSize: '12px' }}>Quantité: {item.quantity} × {((item.product?.price || 0) / 1000).toFixed(3)} DT</div>
                                        </div>
                                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                                            {(((item.product?.price || 0) * item.quantity) / 1000).toFixed(3)} DT
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                            <span style={{ fontSize: '18px', fontWeight: 600 }}>Total Final</span>
                            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>{((selectedOrder.total || 0) / 1000).toFixed(3)} DT</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
