import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Heart, MapPin, Star } from 'lucide-react';
import { api } from '../services/api';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [promoProducts, setPromoProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const heroImages = [
        "/hero-dog.jpg",
            "/images/croquettes.png"   // ← ajoutez cette ligne

    ];

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setContactStatus('submitting');
        try {
            await api.post('/contacts', contactForm);
            setContactStatus('success');
            setContactForm({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setContactStatus('idle'), 5000);
        } catch (err) {
            setContactStatus('error');
            setTimeout(() => setContactStatus('idle'), 5000);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        api.get('/products')
            .then(res => setFeaturedProducts(res.data.slice(0, 4)))
            .catch(console.error);

        api.get('/products?promo=true')
            .then(res => setPromoProducts(res.data.slice(0, 4)))
            .catch(console.error);

        api.get('/categories')
            .then(res => setCategories(res.data))
            .catch(console.error);
    }, []);

    return (
        <div style={{ paddingBottom: '0' }} className="animate-fade-in">
            {/* --- HERO SECTION: Modern Asymmetrical & Overlapping --- */}
            <section style={{ minHeight: '90vh', position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-background-alt)', overflow: 'hidden' }}>
                {/* Background Text Watermark */}
                <div style={{ position: 'absolute', top: '10%', left: '-5%', fontSize: '15vw', fontWeight: 900, whiteSpace: 'nowrap', zIndex: 0, opacity: 0.5 }} className="text-outline">
                    PREMIUM
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
                    <div className="animate-fade-in-up delay-100">
                        <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
                            <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--color-primary)' }}></div>
                            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Haute Couture Nutrition</span>
                        </div>

                        <h1 style={{ fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '32px' }}>
                            Des petits prix<br />
                            <span style={{ color: 'var(--color-primary)', fontStyle: 'italic', fontWeight: 500 }}>pour vos compagnons.</span>
                        </h1>

                        <p className="text-muted" style={{ fontSize: '15px', maxWidth: '480px', marginBottom: '40px', lineHeight: 1.7 }}>
Pets Tunisia Food : le meilleur rapport Qualité/Prix Premium pour le prix d'une croquette de supermarché. Le choix malin pour de la qualité sans exploser votre budget, et offrir la haute performance à prix accessible à vos compagnons !                        </p>

                        <div className="flex flex-wrap items-center gap-4" style={{ marginBottom: '48px' }}>
                            <Link to="/shop" className="hover-scale" style={{ backgroundColor: '#b38d58', color: '#fff', padding: '16px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(179, 141, 88, 0.3)' }}>
                                Découvrir nos produits
                            </Link>
                           
<button
    onClick={() => document.getElementById('nos-partenaires')?.scrollIntoView({ behavior: 'smooth' })}
    className="hover-scale"
    style={{ backgroundColor: '#fff', color: '#1a1a1a', padding: '16px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, border: '1px solid #e0e0e0', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
>
    Nos partenaires
</button>
                        </div>

                        <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '20px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                            <div>
                                <div style={{ fontSize: '32px', fontWeight: 800, color: '#b38d58', lineHeight: 1 }}>5000+</div>
                                <div style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '8px', fontWeight: 500 }}>Produits</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '32px', fontWeight: 800, color: '#b38d58', lineHeight: 1 }}>50k+</div>
                                <div style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '8px', fontWeight: 500 }}>Clients satisfaits</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '32px', fontWeight: 800, color: '#b38d58', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    4.8 <Star size={24} fill="currentColor" strokeWidth={0} />
                                </div>
                                <div style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '8px', fontWeight: 500 }}>Avis clients</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ position: 'relative', height: '600px' }} className="animate-fade-in-left delay-300">
                        {/* Main Image */}
                        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '80%', height: '80%', borderRadius: '40px 0 100px 40px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                            <img src={heroImages[currentImageIndex]} alt="Hero Dog" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease-in-out' }} key={currentImageIndex} />
                        </div>

                        {/* Overlapping Glass Card */}
                        <div className="glass-panel animate-float" style={{ position: 'absolute', bottom: '10%', left: '0', padding: '24px', borderRadius: '24px', width: '260px', zIndex: 20 }}>
                            <div className="flex gap-1 text-primary" style={{ marginBottom: '8px' }}>
                                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                            </div>
                            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>"Un pelage resplendissant en 2 semaines."</p>
                            <div className="flex items-center gap-3">
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>MC</div>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Marie C. — Vet.</span>
                            </div>
                        </div>

                        {/* Decorative spinning badge */}
                        <div className="animate-spin-slow" style={{ position: 'absolute', top: '10%', left: '10%', width: '100px', height: '100px' }}>
                            <svg viewBox="0 0 100 100" width="100" height="100">
                                <defs>
                                    <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                                </defs>
                                <text fontSize="11" fontWeight="700" letterSpacing="2" fill="var(--color-text)">
                                    <textPath href="#circle">
                                        • QUALITÉ SANS COMPROMIS • DEPUIS 2024
                                    </textPath>
                                </text>
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- DEALS & PROMOTIONS (Redesigned) --- */}
            <section className="animate-fade-in-up delay-200" style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px 40px 24px', backgroundColor: '#f9f9f9', minHeight: '600px', display: 'flex', alignItems: 'center' }}>
<img src="/images/animalcoroquette.png" alt="Dog background" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', zIndex: 0 }} />                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)', zIndex: 1 }}></div>

                <div className="container" style={{ zIndex: 10, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    <div style={{ maxWidth: '500px', marginBottom: '80px', marginTop: '20px', alignSelf: 'flex-start', textAlign: 'left' }}>
                        <span style={{ backgroundColor: '#f2e8d9', color: '#8c6b3e', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block', marginBottom: '24px' }}>Offres Limitées</span>
                        <h2 style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 800, margin: '0 0 24px 0', lineHeight: 1.05, color: '#1a1a1a', letterSpacing: '-1px' }}>
                            Deals &<br />
                            <span style={{ color: '#b38d58' }}>Promotions</span>
                        </h2>
                        <p style={{ fontSize: '18px', color: '#4a4a4a', marginBottom: '40px', lineHeight: 1.6, fontWeight: 500 }}>
                            Offrez le meilleur à vos compagnons avec nos sélections premium. Jusqu'à -30% sur les gammes Dog & Cat ce mois-ci.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/shop?promo=deals" className="btn btn-primary hover-scale flex items-center gap-2" style={{ padding: '16px 32px', backgroundColor: '#b38d58', fontSize: '16px', fontWeight: 700, borderRadius: '8px' }}>
                                Commander maintenant <ShoppingBag size={18} />
                            </Link>
                            <Link to="/promotions" className="btn hover-scale" style={{ backgroundColor: 'rgba(255,255,255,0.85)', color: '#1a1a1a', padding: '16px 32px', fontSize: '16px', fontWeight: 700, borderRadius: '8px', backdropFilter: 'blur(10px)' }}>Voir les offres</Link>
                        </div>
                    </div>

                    {promoProducts.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            {promoProducts.slice(0, 4).map((product, idx) => {
                                const badges = ["SALE", "HOT", "NEW", "PROMO"];
                                const badge = product.isPromo ? "PROMO" : badges[idx % badges.length];
                                return (
                                    <Link to={`/product/${product._id || product.id}`} key={product._id || product.id} className="hover-lift" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
                                        {/* Promo Badge */}
                                        <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: badge === 'SALE' ? '#6b8e23' : '#1a1a1a', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, zIndex: 10, letterSpacing: '0.5px' }}>
                                            {badge}
                                        </div>
                                        {/* Image */}
                                        <div style={{ width: '70px', height: '90px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
                                            <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3'} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        </div>
                                        {/* Info */}
                                        <div style={{ flex: 1, color: '#1a1a1a', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block', fontWeight: 600 }}>{product.category?.name || 'Pets Tunisia'}</span>
                                            <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name || product.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <span style={{ fontSize: '14px', fontWeight: 800, color: '#b38d58' }}>{(product.price / 1000).toFixed(3)} DT</span>
                                                {product.oldPrice && <span style={{ fontSize: '10px', textDecoration: 'line-through', color: '#a0a0a0' }}>{(product.oldPrice / 1000).toFixed(3)} DT</span>}
                                            </div>
                                        </div>
                                        {/* Cart Button */}
                                        <button className="flex items-center justify-center hover-scale transition-all" onClick={(e) => { e.preventDefault(); }} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1a1a1a', color: 'white', border: 'none', cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-end' }}>
                                            <ShoppingBag size={14} />
                                        </button>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* --- MEILLEURES VENTES (Best Sellers) --- */}
            <section className="container animate-fade-in-up delay-300" style={{ padding: '80px 24px 40px 24px' }}>
                <div className="flex justify-between items-end" style={{ marginBottom: '40px' }}>
                    <div>
                        <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Meilleures Ventes</h2>
                        <p className="text-muted" style={{ fontSize: '14px' }}>La sélection préférée de nos clients en Tunisie.</p>
                    </div>
                    <Link to="/shop" className="text-primary hover-scale transition-all flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 600 }}>Voir tout le catalogue <ArrowRight size={16} /></Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                    {featuredProducts.length > 0 ? featuredProducts.map(product => (
                        <Link to={`/product/${product._id || product.id}`} key={product._id || product.id} className="hover-lift" style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ position: 'relative', height: '200px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3'} alt={product.name || product.title} style={{ maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{product.category?.name || 'Pets Tunisia'}</span>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', minHeight: '40px' }}>{product.name || product.title}</h3>
                            <div className="flex items-center gap-2" style={{ marginBottom: '20px', flex: 1 }}>
                                <span style={{ fontSize: '18px', fontWeight: 700 }}>{(product.price / 1000).toFixed(3)} DT</span>
                            </div>
                            <button className="btn w-full hover-scale" style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '12px', fontSize: '12px', borderRadius: '6px' }}><ShoppingBag size={14} /> Ajouter au panier</button>
                        </Link>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
                            <p className="text-muted">Aucun produit disponible pour le moment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- CATEGORIES GRID (Redesigned) --- */}
            <section className="bg-alt" style={{ padding: '80px 0' }}>
                <div className="container animate-fade-in-up delay-400">
                    <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Nos Catégories</h2>
                            <p className="text-muted" style={{ fontSize: '14px' }}>Explorez nos gammes spécialement conçues pour vos compagnons.</p>
                        </div>
                        <Link to="/categories" className="text-primary hover-scale flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 600 }}>Voir toutes les catégories <ArrowRight size={16} /></Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                        {categories.slice(0, 3).map((category, idx) => (
                            <Link
                                key={category._id || category.id || idx}
                                to={`/shop?categoryName=${encodeURIComponent(category.name)}`}
                                className={`hover-lift animate-fade-in-up delay-${(idx + 1) * 100}`}
                                style={{ position: 'relative', height: '480px', borderRadius: '24px', overflow: 'hidden', display: 'block', boxShadow: 'var(--shadow-md)' }}
                            >
                                <img
                                    src={category.imageUrl || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3'}
                                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3'; }}
                                    alt={category.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.5s ease' }}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)' }}></div>
                                <div style={{ position: 'absolute', bottom: '32px', left: '32px', right: '32px', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <h3 style={{ fontSize: '32px', color: 'white', fontWeight: 800, marginBottom: '12px' }}>{category.name}</h3>
                                    <p style={{ opacity: 0.9, fontSize: '15px', marginBottom: '24px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{category.description}</p>
                                    <span className="flex items-center gap-2" style={{ backgroundColor: '#b38d58', padding: '12px 24px', borderRadius: '30px', fontSize: '13px', fontWeight: 700, color: 'white', letterSpacing: '0.5px' }}>
                                        Découvrir la gamme <ArrowRight size={16} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SIMPLIFIED ORDER (Prototype Style) --- */}
            <section className="bg-alt animate-fade-in-up" style={{ padding: '40px 24px 80px 24px', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '32px', marginBottom: '8px', fontWeight: 700 }}>Simplified Order</h2>
                    <p className="text-muted" style={{ marginBottom: '48px', fontSize: '14px' }}>Commandez en 3 étapes simples, livré à votre porte.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
                        {[
                            { icon: <ShoppingBag size={24} />, title: "1. Choisissez", desc: "Sélectionnez la meilleure alimentation parmi nos marques premium.", delay: "delay-100" },
                            { icon: <Truck size={24} />, title: "2. Nous Livrons", desc: "Livraison rapide sur toute la Tunisie, directement chez vous ou en point relais.", delay: "delay-200" },
                            { icon: <Heart size={24} />, title: "3. Profitez", desc: "Regardez votre animal s'épanouir avec une alimentation de haute qualité.", delay: "delay-300" }
                        ].map((step, i) => (
                            <div key={i} className={`flex flex-col items-center gap-4 hover-lift animate-fade-in-up ${step.delay}`} style={{ padding: '40px', backgroundColor: '#f5f0e6', borderRadius: 'var(--radius-xl)' }}>
                                <div className="flex items-center justify-center text-white" style={{ backgroundColor: '#b38d58', width: '56px', height: '56px', borderRadius: '50%', marginBottom: '8px' }}>
                                    {step.icon}
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{step.title}</h3>
                                <p className="text-muted" style={{ fontSize: '13px', lineHeight: 1.6 }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* --- NOS REVENDEURS (Prototype Style) --- */}
            <section className="bg-alt animate-fade-in-up" style={{ padding: '0px 24px 100px 24px' }}>
                <div className="container">
                    <div className="flex justify-between items-end" style={{ marginBottom: '40px' }}>
                        <div>
                            <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Nos Revendeurs</h2>
                            <p className="text-muted" style={{ fontSize: '14px' }}>Retrouvez nos produits chez nos partenaires certifiés.</p>
                        </div>
                        <Link to="/about" className="text-primary hover-scale transition-all flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 600 }}>Voir la carte de nos revendeurs <ArrowRight size={16} /></Link>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px', scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                        {[
                            'Zoo Food Tunis', 'Vet House Sousse', 'Animalia Sfax', 'Oasis Pets', 'Golden Paws Nabeul', 'Canine Boutique'
                        ].map((name, i) => (
                            <div key={i} className="hover-lift" style={{ flex: '0 0 auto', minWidth: '180px', backgroundColor: 'var(--color-surface)', padding: '24px 16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MapPin size={20} className="text-muted" />
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: 600 }}>{name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* --- NOS PARTENAIRES --- */}
{/* --- NOS PARTENAIRES --- */}
{/* --- NOS PARTENAIRES --- */}
<section id="nos-partenaires" className="bg-alt animate-fade-in-up" style={{ padding: '0px 0px 100px 0px', overflow: 'hidden' }}>
    <div className="container" style={{ paddingLeft: '24px', paddingRight: '24px', marginBottom: '40px' }}>
        <div className="flex justify-between items-end">
            <div>
                <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Nos Partenaires</h2>
                <p className="text-muted" style={{ fontSize: '14px' }}>Ils nous font confiance et partagent nos valeurs.</p>
            </div>
        </div>
    </div>

    {/* Scrolling track */}
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {/* Fondu gauche */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(to right, var(--color-background-alt), transparent)', zIndex: 10, pointerEvents: 'none' }} />
        {/* Fondu droite */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(to left, var(--color-background-alt), transparent)', zIndex: 10, pointerEvents: 'none' }} />

        <div
            className="partners-track"
            style={{
                display: 'flex',
                gap: '24px',
                width: 'max-content',
                animation: 'scroll-partners 18s linear infinite',
            }}
        >
            {[...Array(2)].flatMap((_, dupIdx) =>
                [
                    { name: 'Primal Spirit', logo: '/images/primal4.png' },
                    { name: 'Alpha Spirit',  logo: '/images/alpha.png'   },
                    { name: 'Mr Meaty',      logo: '/images/meaty.png'   },
                ].map((partner, i) => (
                    <div
                        key={`${dupIdx}-${i}`}
                        className="hover-lift"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            padding: '28px 36px',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            textAlign: 'center',
                            boxShadow: 'var(--shadow-sm)',
                            minWidth: '200px',
                            minHeight: '130px',
                            flexShrink: 0,
                        }}
                    >
                        <img
                            src={partner.logo}
                            alt={partner.name}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                            }}
                            style={{ maxWidth: '120px', maxHeight: '65px', objectFit: 'contain', filter: 'grayscale(15%)' }}
                        />
                        {/* Fallback */}
                        <div style={{ display: 'none', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f2e8d9', alignItems: 'center', justifyContent: 'center' }}>
                            <Heart size={24} style={{ color: '#b38d58' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>{partner.name}</span>
                    </div>
                ))
            )}
        </div>
    </div>
</section>

            {/* --- CONTACT & MAP (Prototype Style) --- */}
            <section className="container animate-fade-in-up delay-200" style={{ padding: '0 24px 100px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'flex-start' }}>
                    <div className="animate-fade-in-left">
                        <h2 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px' }}>Contactez-nous</h2>
                        {contactStatus === 'success' ? (
                            <div style={{ padding: '24px', backgroundColor: 'var(--color-success)', color: 'white', borderRadius: '12px', marginBottom: '24px' }}>
                                Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
                            </div>
                        ) : null}
                        {contactStatus === 'error' ? (
                            <div style={{ padding: '24px', backgroundColor: 'var(--color-error)', color: 'white', borderRadius: '12px', marginBottom: '24px' }}>
                                Une erreur s'est produite lors de l'envoi. Veuillez réessayer plus tard.
                            </div>
                        ) : null}
                        <form className="flex flex-col gap-4" onSubmit={handleContactSubmit}>
                            <div className="flex gap-4">
                                <input type="text" placeholder="Votre prénom" required className="transition-all" style={{ backgroundColor: 'var(--color-border-light)', border: 'none' }} value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} disabled={contactStatus === 'submitting'} />
                                <input type="email" placeholder="Email" required className="transition-all" style={{ backgroundColor: 'var(--color-border-light)', border: 'none' }} value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} disabled={contactStatus === 'submitting'} />
                            </div>
                            <input type="text" placeholder="Sujet" required className="transition-all" style={{ backgroundColor: 'var(--color-border-light)', border: 'none' }} value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })} disabled={contactStatus === 'submitting'} />
                            <textarea placeholder="Votre message" required rows={5} className="transition-all" style={{ backgroundColor: 'var(--color-border-light)', border: 'none', resize: 'vertical' }} value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} disabled={contactStatus === 'submitting'}></textarea>
                            <button type="submit" className="btn btn-primary hover-scale transition-all" style={{ alignSelf: 'flex-start', marginTop: '8px', padding: '14px 32px', backgroundColor: '#b38d58' }} disabled={contactStatus === 'submitting'}>
                                {contactStatus === 'submitting' ? 'Envoi...' : 'Envoyer le message'}
                            </button>
                        </form>
                        <div className="flex flex-col gap-3 mt-8 text-muted" style={{ fontSize: '14px' }}>
                            <span className="flex items-center gap-3"><MapPin size={18} className="text-primary" style={{ color: '#b38d58' }} /> +216 71 000 000</span>
                            <span className="flex items-center gap-3"><Heart size={18} className="text-primary" style={{ color: '#b38d58' }} /> contact@petstunisia.tn</span>
                        </div>
                    </div>
                    <div className="animate-fade-in-right delay-200 hover-lift" style={{ backgroundColor: '#0e413f', borderRadius: '24px', height: '400px', position: 'relative', overflow: 'hidden' }}>
                        {/* Placeholder for the Map, mimicking the prototype visual */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="World Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <a
                            href="https://www.google.com/maps/place/Raoued/@36.9561085,10.1698308,13z/data=!3m1!4b1!4m6!3m5!1s0x12e2c97ac289e379:0x61b5aea07bfabbbb!8m2!3d36.9561815!4d10.2167809!16s%2Fm%2F0b6h120?entry=ttu&g_ep=EgoyMDI2MDMyOS4wIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover-scale"
                            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '12px 24px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, boxShadow: 'var(--shadow-md)', color: 'inherit', cursor: 'pointer' }}>
                            <MapPin size={18} style={{ color: '#b38d58' }} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600 }}>Location de notre boutique</span>
                                <span style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 700 }}>Raoued, Tunisie</span>
                            </div>
                        </a>
                        <div style={{ position: 'absolute', top: '30%', left: '30%', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#b38d58', border: '2px solid white', boxShadow: '0 0 0 4px rgba(179,141,88,0.2)' }}></div>
                        <div style={{ position: 'absolute', top: '60%', left: '70%', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#b38d58', border: '2px solid white', boxShadow: '0 0 0 4px rgba(179,141,88,0.2)' }}></div>
                    </div>
                </div>
            </section>
        </div>
    );
}
