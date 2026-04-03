import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ArrowRight, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { api } from '../services/api';

export default function Cart() {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showCheckoutOptionsModal, setShowCheckoutOptionsModal] = useState(false);
    const [customerInfo, setCustomerInfo] = useState({ firstName: '', lastName: '', address: '', phone: '' });
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart');
            setCartItems(res.data?.items || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const isUserLoggedIn = () => {
        const user = localStorage.getItem('user');
        return user && user !== 'undefined' && user !== 'null';
    };

    const [showUpsellModal, setShowUpsellModal] = useState(false);
    const [upsellProducts, setUpsellProducts] = useState<any[]>([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('checkout') === 'true' && isUserLoggedIn()) {
            setShowCheckout(true);
        }
        fetchCart();
        // Fetch upsell products
        api.get('/products?promo=true')
            .then(async (res) => {
                let products = res.data;
                if (products.length === 0) {
                    const fallback = await api.get('/products');
                    products = fallback.data;
                }
                setUpsellProducts(products.slice(0, 3));
            })
            .catch(console.error);
    }, []);

    const initiateCheckout = () => {
        if (!isUserLoggedIn()) {
            setShowCheckoutOptionsModal(true);
        } else {
            setShowUpsellModal(true);
        }
    };

    const confirmCheckout = () => {
        setShowUpsellModal(false);
        setShowCheckout(true);
    };

    const updateQuantity = async (productId: string, delta: number) => {
        const item = cartItems.find(i => i.product?._id === productId || i.product?.id === productId);
        if (!item) return;

        if (item.quantity + delta < 1) {
            removeItem(productId);
            return;
        }

        // Stock check
        if (delta > 0 && item.quantity + delta > (item.product?.stock || 0)) {
            alert(`Désolé, il ne reste que ${item.product?.stock || 0} article(s) en stock pour ce produit.`);
            return;
        }
        try {
            await api.post('/cart/add', { productId, quantity: delta });
            fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error(err);
        }
    };

    const removeItem = async (productId: string) => {
        try {
            await api.delete(`/cart/remove/${productId}`);
            fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (err) {
            console.error(err);
        }
    };

    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.product?.price || 0;
        return sum + (price * item.quantity);
    }, 0);
    const delivery = subtotal > 0 ? 7000 : 0;
    const tva = subtotal * 0.19;
    const total = subtotal + delivery + tva;

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.address || !customerInfo.phone) {
            alert('Veuillez remplir tous les champs !');
            return;
        }

        const phoneRegex = /^(?:\+216|00216)?[2345789]\d{7}$/;
        const cleanedPhone = customerInfo.phone.replace(/\s+/g, '');
        if (!phoneRegex.test(cleanedPhone)) {
            alert('Veuillez entrer un numéro de téléphone tunisien valide (ex: 29123456).');
            return;
        }

        try {
            await api.post('/orders', { customerInfo });
            await fetchCart();
            window.dispatchEvent(new Event('cartUpdated'));
            alert('Commande confirmée avec succès ! Votre panier a été vidé.');
            navigate('/');
        } catch (err: any) {
            console.error('Checkout error:', err);
            alert(err.response?.data?.message || 'Erreur lors de la création de la commande.');
        }
    };

    if (loading) return <div className="container" style={{ padding: '60px 24px' }}>Loading cart...</div>;

    return (
        <div className="container animate-fade-in-up" style={{ padding: '60px 24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 700 }}>Votre Panier</h1>
                <span className="text-muted" style={{ fontSize: '16px', fontWeight: 500 }}>({cartItems.length} articles)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
                {/* Cart Items */}
                <div className="flex flex-col gap-6">
                    {cartItems.map((item, idx) => {
                        const product = item.product || {};
                        const pid = product._id || product.id;
                        return (
                            <div key={pid} className={`flex gap-6 items-center animate-fade-in-up delay-${Math.min((idx + 1) * 100, 500)} hover-lift`} style={{ backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                                <div className="image-wrapper" style={{ width: '100px', height: '100px', flexShrink: 0, borderRadius: 'var(--radius-md)' }}>
                                    <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3'} alt={product.name} />
                                </div>
                                <div className="flex flex-col flex-1 gap-2">
                                    <div className="flex items-start justify-between">
                                        <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{product.name}</h3>
                                        <button onClick={() => removeItem(pid)} className="text-muted hover:text-error transition-all"><Trash2 size={20} /></button>
                                    </div>
                                    <div className="text-muted" style={{ fontSize: '14px' }}>
                                        {product.category?.name && <span>Catégorie: {product.category.name}</span>}
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center justify-between" style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', width: '100px', padding: '6px 12px', backgroundColor: 'var(--color-background-alt)' }}>
                                            <button onClick={() => updateQuantity(pid, -1)} className="text-muted hover:text-text transition-all"><Minus size={16} /></button>
                                            <span style={{ fontWeight: 600, fontSize: '14px' }}>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(pid, 1)} className="text-muted hover:text-text transition-all"><Plus size={16} /></button>
                                        </div>
                                        <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>{((product.price * item.quantity) / 1000).toFixed(3)} DT</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <Link to="/shop" className="flex items-center gap-2 text-primary hover:underline mt-4 animate-fade-in-up delay-400 w-fit" style={{ fontWeight: 600 }}>
                        <ArrowLeft size={16} /> Continuer mes achats
                    </Link>
                </div>

                {/* Summary / Checkout Form */}
                <div className="animate-fade-in-left delay-200">
                    <div style={{ backgroundColor: 'var(--color-background-alt)', padding: '32px', borderRadius: 'var(--radius-lg)' }}>
                        {!showCheckout ? (
                            <>
                                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Récapitulatif</h2>

                                <div className="flex flex-col gap-4 text-muted" style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
                                    <div className="flex justify-between"><span>Sous-total</span> <span>{(subtotal / 1000).toFixed(3)} DT</span></div>
                                    <div className="flex justify-between"><span>Livraison estimée</span> <span>{(delivery / 1000).toFixed(3)} DT</span></div>
                                    <div className="flex justify-between"><span>TVA (19%)</span> <span>{(tva / 1000).toFixed(3)} DT</span></div>
                                </div>

                                <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
                                    <span style={{ fontSize: '20px', fontWeight: 700 }}>Total</span>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>{(total / 1000).toFixed(3)} DT</span>
                                </div>
                                <p className="text-muted text-right" style={{ fontSize: '12px', marginBottom: '32px' }}>
                                    Ou 3 mensualités de {((total / 3) / 1000).toFixed(3)} DT sans frais
                                </p>

                                <button onClick={initiateCheckout} className="btn btn-primary w-full hover-scale" style={{ padding: '16px', fontSize: '16px', marginBottom: '16px' }}>
                                    Passer la commande
                                </button>
                                <div className="flex items-center justify-center gap-2 text-muted" style={{ fontSize: '12px', marginBottom: '32px' }}>
                                    <ShieldCheck size={16} /> Paiement sécurisé et livraison garantie
                                </div>

                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', display: 'block' }}>Code Promo</span>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Entrez votre code" style={{ flex: 1, backgroundColor: 'var(--color-surface)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px', outline: 'none' }} className="focus:border-primary transition-colors" />
                                        <button className="btn hover-scale" style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text)', padding: '10px 20px', fontSize: '14px', borderRadius: '8px' }}>Appliquer</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleCheckoutSubmit}>
                                <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
                                    <button type="button" onClick={() => setShowCheckout(false)} className="text-muted hover:text-text transition-all"><ArrowLeft size={20} /></button>
                                    <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Vos Coordonnées</h2>
                                </div>

                                <div className="flex flex-col gap-4" style={{ marginBottom: '24px' }}>
                                    <div className="flex gap-4">
                                        <input type="text" placeholder="Prénom" value={customerInfo.firstName} onChange={e => setCustomerInfo({ ...customerInfo, firstName: e.target.value })} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '14px', outline: 'none', width: '100%' }} className="focus:border-primary transition-colors" required />
                                        <input type="text" placeholder="Nom" value={customerInfo.lastName} onChange={e => setCustomerInfo({ ...customerInfo, lastName: e.target.value })} style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '14px', outline: 'none', width: '100%' }} className="focus:border-primary transition-colors" required />
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin size={18} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input type="text" placeholder="Adresse complète de livraison" value={customerInfo.address} onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })} style={{ padding: '12px 16px 12px 40px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '14px', outline: 'none', width: '100%' }} className="focus:border-primary transition-colors" required />
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={18} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input type="tel" placeholder="Numéro de téléphone" value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} style={{ padding: '12px 16px 12px 40px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '14px', outline: 'none', width: '100%' }} className="focus:border-primary transition-colors" required />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center" style={{ marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 500 }}>Total à payer</span>
                                    <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>{(total / 1000).toFixed(3)} DT</span>
                                </div>

                                <button type="submit" className="btn btn-primary w-full hover-scale" style={{ padding: '16px', fontSize: '16px' }}>
                                    Confirmer la Commande
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Checkout Options Modal (Guests) */}
            {showCheckoutOptionsModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowCheckoutOptionsModal(false)}></div>
                    <div className="animate-fade-in-up" style={{ backgroundColor: 'var(--color-surface)', width: '90%', maxWidth: '450px', borderRadius: '24px', position: 'relative', zIndex: 10, padding: '40px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
                        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                            <button onClick={() => setShowCheckoutOptionsModal(false)} className="btn-ghost" style={{ padding: '8px' }}>✕</button>
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '16px' }}>Commander</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px', fontSize: '15px' }}>
                            Comment souhaitez-vous finaliser votre commande ?
                        </p>
                        <div className="flex flex-col gap-4">
                            <button onClick={() => navigate('/login?redirect=/cart?checkout=true')} className="btn btn-primary w-full" style={{ padding: '14px', fontSize: '16px' }}>
                                Se connecter
                            </button>
                            <button onClick={() => navigate('/register?redirect=/cart?checkout=true')} className="btn btn-outline w-full" style={{ padding: '14px', fontSize: '16px' }}>
                                Créer un compte
                            </button>
                            <div style={{ margin: '16px 0', borderTop: '1px solid var(--color-border)', position: 'relative' }}>
                                <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--color-surface)', padding: '0 12px', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>OU</span>
                            </div>
                            <button onClick={() => { setShowCheckoutOptionsModal(false); setShowUpsellModal(true); }} className="btn-ghost w-full hover:text-primary transition-colors" style={{ padding: '14px', fontSize: '16px', fontWeight: 600, textDecoration: 'underline' }}>
                                Continuer en tant qu'invité
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upsell Modal */}
            {showUpsellModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={confirmCheckout}></div>
                    <div className="animate-fade-in-up" style={{ backgroundColor: 'var(--color-surface)', width: '90%', maxWidth: '900px', borderRadius: '24px', position: 'relative', zIndex: 10, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                        <div style={{ padding: '32px', borderBottom: '1px solid var(--color-border)' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '8px' }}>Avant de valider...</h2>
                            <p className="text-muted">Vous aimerez peut-être aussi ces produits pour votre compagnon :</p>
                        </div>
                        <div style={{ padding: '32px', display: 'flex', gap: '24px', backgroundColor: 'var(--color-background-alt)', overflowX: 'auto' }}>
                            {upsellProducts.map(product => (
                                <div key={product._id || product.id} className="hover-lift" style={{ minWidth: '200px', flex: 1, backgroundColor: 'var(--color-surface)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ position: 'relative', height: '120px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3'} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', margin: 'auto' }} />
                                    </div>
                                    <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3, flex: 1 }}>{product.name}</h3>
                                    <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px' }}>{(product.price / 1000).toFixed(3)} DT</span>
                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        api.post('/cart/add', { productId: product._id || product.id, quantity: 1 }).then(() => {
                                            fetchCart();
                                            window.dispatchEvent(new Event('cartUpdated'));
                                        }).catch(console.error);
                                    }} className="btn hover-scale" style={{ width: '100%', padding: '10px', fontSize: '12px', backgroundColor: '#1a1a1a', color: 'white', borderRadius: '8px' }}>
                                        <Plus size={14} style={{ display: 'inline', marginRight: '4px' }} /> Ajouter
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '24px 32px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={confirmCheckout} className="text-muted hover:text-text transition-all" style={{ fontWeight: 600, textDecoration: 'underline' }}>
                                Non merci, passer au paiement
                            </button>
                            <button onClick={confirmCheckout} className="btn btn-primary hover-scale" style={{ padding: '14px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: 700 }}>
                                Continuer au paiement <ArrowRight size={18} style={{ display: 'inline', marginLeft: '8px' }} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
