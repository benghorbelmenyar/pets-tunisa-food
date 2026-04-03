import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Package, Tags, ShoppingBag, LayoutDashboard, LogOut, Mail, Users } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminLayout() {
    const [pendingOrders, setPendingOrders] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    const fetchBadges = async () => {
        try {
            const [ordersRes, msgsRes] = await Promise.all([
                api.get('/orders'),
                api.get('/contacts')
            ]);
            const orders = ordersRes.data || [];
            const msgs = msgsRes.data || [];
            setPendingOrders(orders.filter((o: any) => o.status === 'PENDING').length);
            setUnreadMessages(msgs.filter((m: any) => !m.read).length);
        } catch (err) {
            console.error("Failed to fetch admin badges", err);
        }
    };

    useEffect(() => {
        fetchBadges();
        const interval = setInterval(fetchBadges, 30000); // refresh every 30s
        window.addEventListener('adminDataUpdated', fetchBadges);
        return () => {
            clearInterval(interval);
            window.removeEventListener('adminDataUpdated', fetchBadges);
        };
    }, []);

    return (
        <div className="flex" style={{ minHeight: '100vh', backgroundColor: 'var(--color-background-alt)' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
                <Link to="/admin" style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/logo.png" alt="Pets Tunisia Food" style={{ height: '40px' }} />
                    <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)' }}>Admin</span>
                </Link>

                <nav className="flex flex-col gap-2" style={{ flex: 1 }}>
                    <Link to="/admin" className="flex items-center gap-3" style={{ padding: '12px 16px', borderRadius: '8px', color: 'var(--color-text)', fontWeight: 500 }}>
                        <LayoutDashboard size={20} className="text-primary" /> Dashboard
                    </Link>
                    <Link to="/admin/categories" className="flex items-center gap-3" style={{ padding: '12px 16px', borderRadius: '8px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        <Tags size={20} /> Categories
                    </Link>
                    <Link to="/admin/products" className="flex items-center gap-3" style={{ padding: '12px 16px', borderRadius: '8px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        <Package size={20} /> Products
                    </Link>
                    <Link to="/admin/orders" className="flex items-center justify-between hover-bg-alt" style={{ padding: '12px 16px', borderRadius: '8px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        <div className="flex items-center gap-3"><ShoppingBag size={20} /> Orders</div>
                        {pendingOrders > 0 && <span style={{ backgroundColor: 'var(--color-error)', color: 'white', fontSize: '12px', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>{pendingOrders}</span>}
                    </Link>
                    <Link to="/admin/users" className="flex items-center justify-between hover-bg-alt" style={{ padding: '12px 16px', borderRadius: '8px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        <div className="flex items-center gap-3"><Users size={20} /> Users</div>
                    </Link>
                    <Link to="/admin/promotions" className="flex items-center gap-3 hover-bg-alt" style={{ padding: '12px 16px', borderRadius: '8px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        <Tags size={20} className="text-error" /> Promotions
                    </Link>
                    <Link to="/admin/contacts" className="flex items-center justify-between hover-bg-alt" style={{ padding: '12px 16px', borderRadius: '8px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        <div className="flex items-center gap-3"><Mail size={20} className="text-primary" /> Messages</div>
                        {unreadMessages > 0 && <span style={{ backgroundColor: 'var(--color-error)', color: 'white', fontSize: '12px', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>{unreadMessages}</span>}
                    </Link>
                </nav>

                <button
                    onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('access_token');
                        window.location.href = '/';
                    }}
                    className="flex items-center gap-3 text-error w-full hover-bg-alt"
                    style={{ padding: '12px 16px', fontWeight: 500, marginTop: 'auto', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '40px' }}>
                <Outlet />
            </main>
        </div>
    );
}
