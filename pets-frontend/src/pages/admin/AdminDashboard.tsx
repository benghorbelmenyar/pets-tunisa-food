import { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ sales: 0, orders: 0, products: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/products')
                ]);
                const orders = ordersRes.data;
                const products = productsRes.data;

                const sales = orders
                    .filter((o: any) => o.status === 'COMPLETED')
                    .reduce((sum: number, o: any) => sum + (o.total || 0), 0);

                setStats({ sales, orders: orders.length, products: products.length });
                setRecentOrders(orders.slice(-5).reverse());
            } catch (err) {
                console.error(err);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px' }}>Dashboard Overview</h1>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                {[
                    { title: 'Total Sales', value: `${(stats.sales / 1000).toFixed(3)} DT`, icon: <TrendingUp className="text-primary" size={24} />, trend: '+12.5%' },
                    { title: 'Total Orders', value: stats.orders.toString(), icon: <ShoppingBag className="text-primary" size={24} />, trend: '+5.2%' },
                    { title: 'Active Products', value: stats.products.toString(), icon: <Package className="text-primary" size={24} />, trend: '0%' },
                    { title: 'New Customers', value: '48', icon: <Users className="text-primary" size={24} />, trend: '+18.1%' }
                ].map(stat => (
                    <div key={stat.title} style={{ backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                            <span className="text-muted" style={{ fontSize: '14px', fontWeight: 500 }}>{stat.title}</span>
                            <div style={{ backgroundColor: 'var(--color-primary-light)', padding: '8px', borderRadius: '50%' }}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="flex items-end gap-3">
                            <span style={{ fontSize: '28px', fontWeight: 700 }}>{stat.value}</span>
                            <span className="text-success" style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Table */}
            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Recent Orders</h2>
                </div>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--color-background-alt)', color: 'var(--color-text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Order ID</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Customer</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Date</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Total</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map(order => {
                            const id = order._id || order.id;
                            const user = order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}` : 'Guest User';
                            const date = new Date(order.createdAt).toLocaleDateString();
                            const total = `${((order.total || 0) / 1000).toFixed(3)} DT`;

                            let bg = 'var(--color-background-alt)';
                            let statusColor = 'var(--color-text-muted)';
                            if (order.status === 'COMPLETED') { bg = '#e8f5ec'; statusColor = 'var(--color-success)'; }
                            else if (order.status === 'PENDING') { bg = 'var(--color-primary-light)'; statusColor = 'var(--color-primary)'; }
                            else if (order.status === 'CANCELLED') { bg = '#fdebeb'; statusColor = 'var(--color-error)'; }

                            return (
                                <tr key={id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>#{id.slice(-6).toUpperCase()}</td>
                                    <td style={{ padding: '16px 24px' }}>{user}</td>
                                    <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>{date}</td>
                                    <td style={{ padding: '16px 24px', fontWeight: 600 }}>{total}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ backgroundColor: bg, color: statusColor, padding: '6px 12px', borderRadius: '30px', fontSize: '12px', fontWeight: 600 }}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                        {recentOrders.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No recent orders</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
