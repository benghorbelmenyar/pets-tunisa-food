import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Globe, Volume2, LayoutGrid, LogOut, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function MainLayout() {
    const [cartCount, setCartCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const loadCartCount = async () => {
        try {
            const res = await api.get('/cart');
            const items = res.data?.items || [];
            const count = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
            setCartCount(count);
        } catch (err) {
            console.error('Failed to load cart count', err);
        }
    };

    const loadNotifications = async () => {
        try {
            const sid = localStorage.getItem('sessionId');
            const userStr = localStorage.getItem('user');
            let uid = '';
            if (userStr && userStr !== 'undefined' && userStr !== 'null') {
                uid = JSON.parse(userStr)._id || JSON.parse(userStr).id;
            }
            if (!sid && !uid) return;

            const res = await api.get(`/notifications?sessionId=${sid || ''}&userId=${uid || ''}`);
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to load notifications', err);
        }
    };

    const handleNotificationClick = async (notif: any) => {
        if (!notif.read) {
            try {
                await api.patch(`/notifications/${notif._id}/read`);
                loadNotifications();
            } catch (e) { }
        }
    };

    useEffect(() => {
        loadCartCount();
        loadNotifications();

        const interval = setInterval(() => {
            loadNotifications();
        }, 10000);

        window.addEventListener('cartUpdated', loadCartCount);
        return () => {
            window.removeEventListener('cartUpdated', loadCartCount);
            clearInterval(interval);
        };
    }, []);

    let user = null;
    try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'undefined' && userStr !== 'null') {
            user = JSON.parse(userStr);
        }
    } catch (e) { }

    return (
        <div className="flex flex-col" style={{ minHeight: '100vh', position: 'relative' }}>
            {/* Header */}
            <header style={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
                zIndex: 50,
                padding: '24px 0'
            }}>
                <div className="container flex items-center justify-between relative">
                    <Link to="/" className="flex items-center gap-4 w-fit" style={{ textDecoration: 'none' }}>
                        <img src="/logo.png" alt="Pets Tunisia Food" style={{ height: '80px', position: 'relative', zIndex: 10 }} />
                        <div style={{ overflow: 'visible' }}>
                            <span className="animate-brand-reveal" style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px' }}>Pets Tunisia Food</span>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-6" style={{ fontWeight: 500, fontSize: '15px' }}>
                        <Link to="/categories" className="flex items-center gap-2 text-muted hover-lift" style={{ transform: 'none', boxShadow: 'none' }} title="Toutes les catégories">
                            <LayoutGrid size={18} /> Catégories
                        </Link>
                        <Link to="/shop?category=dogs" className="text-primary hover-lift" style={{ transform: 'none', boxShadow: 'none' }}>Dogs</Link>
                        <Link to="/shop?category=cats" className="text-muted hover-lift" style={{ transform: 'none', boxShadow: 'none' }}>Cats</Link>
                        <Link to="/about" className="text-muted">Qui sommes-nous ?</Link>
                    </nav>

                    <div className="flex items-center gap-4 text-primary relative">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchQuery.trim()) {
                                    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                                    setSearchQuery('');
                                }
                            }}
                            className="relative flex items-center"
                        >
                            <Search size={16} className="absolute left-3 text-muted" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '200px',
                                    padding: '8px 16px 8px 36px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-background-alt)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease',
                                    color: 'var(--color-text)'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                            />
                        </form>

                        {/* Notifications Bell */}
                        <div style={{ position: 'relative' }}>
                            <button className="btn-ghost" onClick={() => setShowNotifications(!showNotifications)}>
                                <Bell size={20} />
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span style={{
                                        position: 'absolute', top: 2, right: 8, background: 'var(--color-error)',
                                        color: 'white', fontSize: '10px', width: 14, height: 14, borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>{notifications.filter(n => !n.read).length}</span>
                                )}
                            </button>

                            {showNotifications && (
                                <div style={{
                                    position: 'absolute', top: '40px', right: '-60px', width: '320px',
                                    backgroundColor: 'var(--color-surface)', borderRadius: '12px',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid var(--color-border)',
                                    zIndex: 100, overflow: 'hidden'
                                }}>
                                    <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>
                                        Notifications
                                    </div>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {notifications.length === 0 ? (
                                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                                                Aucune notification
                                            </div>
                                        ) : (
                                            notifications.map((n, i) => (
                                                <div key={i} onClick={() => handleNotificationClick(n)} style={{
                                                    padding: '16px', borderBottom: '1px solid var(--color-border)',
                                                    backgroundColor: n.read ? 'transparent' : 'var(--color-background-alt)',
                                                    cursor: 'pointer', transition: 'background-color 0.2s'
                                                }} className="hover:bg-gray-50">
                                                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>{n.title}</div>
                                                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{n.message}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                                                        {new Date(n.createdAt).toLocaleString('fr-FR')}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/cart" className="btn-ghost" style={{ position: 'relative' }}>
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: 2, right: 8, background: 'var(--color-primary)',
                                    color: 'white', fontSize: '10px', width: 14, height: 14, borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>{cartCount}</span>
                            )}
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-2 text-muted" style={{ marginLeft: '4px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.firstName || 'User'}</span>
                                <button onClick={() => {
                                    localStorage.removeItem('user');
                                    localStorage.removeItem('access_token');
                                    window.location.reload();
                                }} className="btn-ghost hover:text-error transition-colors" title="Se déconnecter">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-ghost"><User size={20} /></Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            {/* Footer */}
            {/* Footer */}
<footer style={{
    backgroundColor: 'var(--color-surface)',
    borderTop: '1px solid var(--color-border)',
    padding: '60px 0',
    marginTop: '60px'
}}>
    <div className="container flex justify-between gap-8" style={{ flexWrap: 'wrap' }}>
        <div style={{ maxWidth: '300px' }}>
<img src="/logo.png" alt="Pets Tunisia Food" style={{ height: '120px', marginBottom: '16px' }} />            <p className="text-muted" style={{ fontSize: '14px', marginBottom: '24px' }}>
                Le partenaire privilégié de vos compagnons en Tunisie. Passion, qualité et excellence nutritionnelle.
            </p>
            <p className="text-muted" style={{ fontSize: '14px' }}>
                © 2024 Pets Tunisia. La qualité au meilleur prix.
            </p>
        </div>

        <div>
            <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>Boutique</div>
            <ul className="flex flex-col gap-2 text-muted" style={{ fontSize: '14px' }}>
                <li><Link to="/store-locator">Store Locator</Link></li>
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/tracking">Suivi de commande</Link></li>
            </ul>
        </div>

        <div>
            <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>Légal</div>
            <ul className="flex flex-col gap-2 text-muted" style={{ fontSize: '14px' }}>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/cookies">Cookie Settings</Link></li>
            </ul>
        </div>

        <div>
            <div style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>Contact</div>
            <ul className="flex flex-col gap-2 text-muted" style={{ fontSize: '14px' }}>
                <li>+216 71 000 000</li>
                <li>contact@petstunisia.tn</li>
                <li className="flex gap-4 mt-4 text-primary">
                    <Volume2 size={20} className="cursor-pointer" />
                    <Globe size={20} className="cursor-pointer" />
                </li>
                <li className="flex gap-4 mt-2" style={{ color: 'var(--color-primary)' }}>
                    <a href="" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                            <circle cx="12" cy="12" r="4"/>
                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                        </svg>
                    </a>
                    <a href="" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                        </svg>
                    </a>
                    <a href="" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                            <rect x="2" y="9" width="4" height="12"/>
                            <circle cx="4" cy="4" r="2"/>
                        </svg>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</footer>
        </div>
    );
}
