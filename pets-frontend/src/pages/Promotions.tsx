import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Promotions() {
    const [promotions, setPromotions] = useState<any[]>([]);

    useEffect(() => {
        api.get('/promotions')
            .then(res => {
                // Filter only active promotions
                const activePromos = res.data.filter((p: any) => {
                    const isExpired = new Date(p.endDate) < new Date();
                    const isStarted = new Date(p.startDate) <= new Date();
                    return isStarted && !isExpired;
                });
                setPromotions(activePromos);
            })
            .catch(console.error);
    }, []);

    const gold = '#c49a5b';
    const darkBg = '#141414';
    const lightBg = '#f7f6f4';
    const white = '#ffffff';

    return (
        <div style={{ backgroundColor: lightBg, minHeight: '100vh', paddingBottom: '80px', fontFamily: "'Inter', sans-serif" }}>
            <style>
                {`
                    @keyframes fadeUpAnim {
                        from { opacity: 0; transform: translateY(40px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes revealLeftAnim {
                        from { opacity: 0; transform: translateX(-40px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes slowZoomAnim {
                        from { transform: scale(1.05); }
                        to { transform: scale(1); }
                    }
                    .animate-zoom {
                        animation: slowZoomAnim 12s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                    }
                    .reveal-stagger-1 { animation: fadeUpAnim 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s both; }
                    .reveal-stagger-2 { animation: fadeUpAnim 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s both; }
                    .reveal-stagger-3 { animation: fadeUpAnim 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s both; }
                    .reveal-left-1 { animation: revealLeftAnim 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s both; }
                    
                    .promo-card-hover {
                        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease;
                    }
                    .promo-card-hover:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
                    }
                    .promo-img-wrapper img {
                        transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .promo-card-hover:hover .promo-img-wrapper img {
                        transform: scale(1.08); /* slight smooth zoom on hover */
                    }
                    .hero-btn:hover {
                        transform: scale(1.05);
                        background-color: #dcb375 !important;
                        box-shadow: 0 10px 20px rgba(196, 154, 91, 0.3);
                    }
                `}
            </style>

            {/* HERO SECTION */}
            <div style={{ position: 'relative', height: '650px', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', marginTop: '-80px', paddingTop: '80px' }}>
                {/* Background Image with slow elegant zoom */}
                <img
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                    alt="Golden Retriever"
                    className="animate-zoom"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.7) 40%, rgba(20,20,20,0) 100%)', zIndex: 1 }} />

                {/* Hero Content */}
                <div className="container relative z-10 px-8" style={{ marginLeft: 'auto', marginRight: 'auto', paddingLeft: '32px', paddingRight: '32px', maxWidth: '1280px' }}>
                    <div style={{ maxWidth: '500px' }}>
                        <div className="reveal-stagger-1 text-uppercase">
                            <span style={{ display: 'inline-block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', border: `1px solid ${gold}`, color: gold, padding: '4px 12px', borderRadius: '4px', marginBottom: '24px', fontWeight: 600 }}>
                                Collection Privée
                            </span>
                        </div>
                        <h1 className="reveal-left-1" style={{ fontSize: '72px', fontWeight: 800, color: white, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-2px' }}>
                            Promotions<br />
                            <span style={{ color: gold }}>Exclusives</span>
                        </h1>
                        <p className="reveal-stagger-2" style={{ color: '#d1d1d1', fontSize: '16px', lineHeight: 1.6, marginBottom: '40px' }}>
                            Découvrez nos offres du moment conçues spécialement pour vous. Les grandes promotions que notre équipe vous a réservées sont là !
                        </p>
                        <div className="reveal-stagger-3">
                            <button style={{ backgroundColor: gold, color: white, display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', borderRadius: '4px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} className="hero-btn">
                                Découvrir les offres <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRODUCT GRID - NOW DISPLAYS TRUE PROMOTIONS */}
            <div className="container" style={{ marginTop: '80px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '32px', paddingRight: '32px', maxWidth: '1280px' }}>
                {promotions.length === 0 ? (
                    <div className="reveal-stagger-2" style={{ textAlign: 'center', padding: '100px', backgroundColor: white, borderRadius: '16px', border: '1px solid #eaeaea' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 600, color: darkBg }}>Aucune exclusivité en cours pour le moment</h3>
                        <p style={{ color: '#777', marginTop: '16px' }}>Revenez plus tard ou inscrivez-vous au Programme Privilège pour être le premier informé.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px' }}>
                        {promotions.map((promo, index) => {
                            const isFeatured = index === 0;
                            const firstProd = promo.applicableProducts?.[0];
                            const mainImg = firstProd?.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3';
                            const productCount = promo.applicableProducts?.length || 0;

                            // Robust dual-pricing calculation
                            const dbPrice = firstProd?.price;
                            let promoPrice = 0;
                            let origPrice = 0;

                            if (firstProd?.isPromo && firstProd?.oldPrice) {
                                // DB updated the product
                                origPrice = firstProd.oldPrice;
                                promoPrice = firstProd.price;
                            } else if (dbPrice) {
                                // Fallback computed mathematically on Frontend
                                origPrice = dbPrice;
                                promoPrice = dbPrice * (1 - promo.discountPercentage / 100);
                            }

                            const dualPriceSupported = origPrice > 0 && promoPrice > 0 && origPrice > promoPrice;
                            const formatPrice = (p: number) => (p / 1000).toFixed(3) + ' DT';

                            if (isFeatured) {
                                // FEATURED CARD (Spans 8 columns)
                                return (
                                    <div key={promo._id} className="promo-card-hover reveal-stagger-2" style={{ gridColumn: 'span 8', backgroundColor: '#f0ece6', borderRadius: '16px', overflow: 'hidden', display: 'flex', position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: '24px', left: '24px', backgroundColor: '#8b7355', color: white, padding: '6px 16px', fontSize: '14px', fontWeight: 800, borderRadius: '4px', zIndex: 10, boxShadow: '0 4px 12px rgba(139, 115, 85, 0.3)' }}>
                                            -{promo.discountPercentage}%
                                        </div>
                                        <div style={{ padding: '64px 48px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1, borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                                            <h2 style={{ fontSize: '36px', fontWeight: 800, color: darkBg, lineHeight: 1.15, marginBottom: '24px', letterSpacing: '-0.5px' }}>{promo.title}</h2>
                                            <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px', maxWidth: '300px' }}>
                                                {promo.description || "Découvrez notre promotion phare du moment sur une sélection exclusive de produits !"}
                                            </p>

                                            {promo.applicableProducts && promo.applicableProducts.length > 0 && (
                                                <div style={{ marginBottom: '32px' }}>
                                                    <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#999', letterSpacing: '1px', marginBottom: '12px', display: 'block', fontWeight: 700 }}>Produits concernés ({productCount})</span>
                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                        {promo.applicableProducts.slice(0, 4).map((p: any) => (
                                                            <div key={p._id || p} style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', backgroundColor: white, border: '2px solid white', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                                                <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3'} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            </div>
                                                        ))}
                                                        {productCount > 4 && (
                                                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#dcd7ce', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#555' }}>
                                                                +{productCount - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {dualPriceSupported && (
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px', backgroundColor: 'rgba(255,255,255,0.4)', padding: '16px', borderRadius: '8px', width: 'fit-content' }}>
                                                    {productCount > 1 && <span style={{ fontSize: '14px', color: '#555', fontWeight: 600 }}>À partir de</span>}
                                                    <span style={{ fontSize: '36px', fontWeight: 800, color: '#d32f2f', letterSpacing: '-1px' }}>{formatPrice(promoPrice)}</span>
                                                    <span style={{ fontSize: '20px', color: '#999', textDecoration: 'line-through', fontWeight: 600 }}>{formatPrice(origPrice)}</span>
                                                </div>
                                            )}

                                            <Link to="/shop" style={{ backgroundColor: '#a68a61', color: white, textAlign: 'center', padding: '16px 40px', borderRadius: '4px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', width: 'max-content', transition: 'all 0.3s', boxShadow: '0 8px 20px rgba(166, 138, 97, 0.3)' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#8b7355'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#a68a61'}>
                                                Parcourir la boutique
                                            </Link>
                                        </div>
                                        <div className="promo-img-wrapper" style={{ flex: 1, position: 'relative', minHeight: '450px', backgroundColor: '#e2dcca', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            <img src={mainImg} alt={promo.title} style={{ width: '80%', height: '80%', objectFit: 'contain', zIndex: 1, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }} />
                                            {/* Gradient behind image to make it look premium */}
                                            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(226,220,202,0) 70%)', zIndex: 0 }} />
                                        </div>
                                    </div>
                                );
                            } else {
                                // STANDARD CARDS (Spans 4 columns)
                                return (
                                    <div key={promo._id} className="promo-card-hover reveal-stagger-3" style={{ gridColumn: 'span 4', backgroundColor: white, borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', border: '1px solid #eaeaea' }}>
                                        <div className="promo-img-wrapper" style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px', backgroundColor: '#faf9f7', position: 'relative', overflow: 'hidden' }}>
                                            <img src={mainImg} alt={promo.title} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                                            <div style={{ position: 'absolute', top: '24px', right: '24px', backgroundColor: '#8b7355', color: white, padding: '6px 12px', fontSize: '12px', fontWeight: 800, borderRadius: '4px', boxShadow: '0 4px 12px rgba(139, 115, 85, 0.3)' }}>
                                                -{promo.discountPercentage}%
                                            </div>
                                        </div>
                                        <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', letterSpacing: '2px', marginBottom: '12px', fontWeight: 700 }}>
                                                {productCount} Produits Inclus
                                            </span>
                                            <h3 style={{ fontSize: '20px', fontWeight: 800, color: darkBg, marginBottom: '16px', lineHeight: 1.3 }}>{promo.title}</h3>

                                            <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.5, marginBottom: '24px', flex: 1 }}>
                                                {promo.description?.substring(0, 90) || "Ne manquez pas cette offre exceptionnelle à durée limitée."}...
                                            </p>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                                                {dualPriceSupported ? (
                                                    <>
                                                        {productCount > 1 && <span style={{ fontSize: '12px', color: '#555', fontWeight: 600, marginRight: '4px' }}>À partir de</span>}
                                                        <span style={{ fontSize: '20px', fontWeight: 800, color: '#d32f2f' }}>{formatPrice(promoPrice)}</span>
                                                        <span style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through', fontWeight: 600 }}>{formatPrice(origPrice)}</span>
                                                    </>
                                                ) : (
                                                    <span style={{ fontSize: '13px', fontWeight: 700, color: darkBg }}>
                                                        Expire le : <span style={{ color: '#d32f2f' }}>{new Date(promo.endDate).toLocaleDateString()}</span>
                                                    </span>
                                                )}
                                            </div>

                                            <Link to="/shop" style={{ backgroundColor: darkBg, color: white, textAlign: 'center', padding: '16px', borderRadius: '4px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', transition: 'all 0.3s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#333'} onMouseLeave={e => e.currentTarget.style.backgroundColor = darkBg}>
                                                Voir les produits
                                            </Link>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}
            </div>

            {/* SUBSCRIPTION BANNER */}
            <div className="container reveal-stagger-3" style={{ marginTop: '100px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '32px', paddingRight: '32px', maxWidth: '1280px' }}>
                <div style={{ backgroundColor: '#1a1816', borderRadius: '24px', overflow: 'hidden', display: 'flex', position: 'relative', minHeight: '400px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}>
                    <div style={{ flex: 1, padding: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
                        <h2 style={{ fontSize: '48px', fontWeight: 800, color: white, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1.5px' }}>
                            Rejoignez le<br />
                            <span style={{ color: gold }}>Programme Privilège</span>
                        </h2>
                        <p style={{ color: '#aaa', fontSize: '16px', lineHeight: 1.6, marginBottom: '40px', maxWidth: '450px' }}>
                            Bénéficiez d'un accès anticipé à nos ventes privées et recevez des offres personnalisées pour vos compagnons.
                        </p>
                        <form style={{ display: 'flex', gap: '16px' }} onSubmit={(e) => { e.preventDefault(); alert('Inscrit avec succès !'); }}>
                            <input
                                type="email"
                                placeholder="Votre adresse e-mail"
                                style={{ flex: 1, maxWidth: '350px', padding: '18px 24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', color: white, fontSize: '15px', outline: 'none', transition: 'border-color 0.3s' }}
                                onFocus={e => e.currentTarget.style.borderColor = gold}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                required
                            />
                            <button type="submit" style={{ backgroundColor: gold, color: white, padding: '18px 48px', borderRadius: '4px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: 'none', transition: 'all 0.3s' }} className="hero-btn">
                                S'inscrire
                            </button>
                        </form>
                    </div>
                    {/* Shadow overlay for text readability */}
                    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '70%', background: 'linear-gradient(90deg, #1a1816 50%, transparent 100%)', zIndex: 1 }} />

                    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', overflow: 'hidden', zIndex: 0 }}>
                        <img
                            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Luxury Cat"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center right', opacity: 0.8 }}
                        />
                    </div>
                </div>
            </div>

            {/* SIMPLE INLINE FOOTER FOR LUXURY PAGE */}
            <div className="container" style={{ marginTop: '100px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0e0e0', paddingTop: '60px', paddingBottom: '60px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '32px', paddingRight: '32px', maxWidth: '1280px' }}>
                <div style={{ maxWidth: '300px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: darkBg, letterSpacing: '1.5px', marginBottom: '20px', textTransform: 'uppercase' }}>Luxe Pets</h3>
                    <p style={{ fontSize: '13px', color: '#777', lineHeight: 1.7 }}>L'excellence de la nutrition animale livrée chez vous. La qualité au meilleur prix, sans compromis sur le luxe.</p>
                </div>
                <div style={{ display: 'flex', gap: '80px' }}>
                    <div>
                        <h4 style={{ fontSize: '13px', fontWeight: 800, color: darkBg, letterSpacing: '1px', marginBottom: '24px', textTransform: 'uppercase' }}>Aide</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li style={{ fontSize: '13px', color: '#777', cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = gold} onMouseLeave={e => e.currentTarget.style.color = '#777'}>Mentions Légales</li>
                            <li style={{ fontSize: '13px', color: '#777', cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = gold} onMouseLeave={e => e.currentTarget.style.color = '#777'}>Livraison Premium</li>
                            <li style={{ fontSize: '13px', color: '#777', cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = gold} onMouseLeave={e => e.currentTarget.style.color = '#777'}>Retours</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '13px', fontWeight: 800, color: darkBg, letterSpacing: '1px', marginBottom: '24px', textTransform: 'uppercase' }}>Société</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <li style={{ fontSize: '13px', color: '#777', cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = gold} onMouseLeave={e => e.currentTarget.style.color = '#777'}>Contact</li>
                            <li style={{ fontSize: '13px', color: '#777', cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = gold} onMouseLeave={e => e.currentTarget.style.color = '#777'}>Programme Privilège</li>
                            <li style={{ fontSize: '13px', color: '#777', cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = gold} onMouseLeave={e => e.currentTarget.style.color = '#777'}>Notre Histoire</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
