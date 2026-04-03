import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, Minus, Plus, ChevronUp, Star } from 'lucide-react';
import { api } from '../services/api';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [similarProducts, setSimilarProducts] = useState<any[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [weight, setWeight] = useState('12kg');
    const [expanded, setExpanded] = useState<string | null>('ingredients');

    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (id) {
            api.get(`/products/${id}`)
                .then(res => {
                    setProduct(res.data);
                    const catId = res.data.category?._id || res.data.category?.id || res.data.category;
                    if (catId) {
                        api.get(`/products${catId ? `?category=${catId}` : ''}`)
                            .then(catRes => {
                                const similar = catRes.data.filter((p: any) => (p._id || p.id) !== id).slice(0, 4);
                                setSimilarProducts(similar);
                            })
                            .catch(console.error);
                    }
                })
                .catch(console.error);
        }
    }, [id]);

    const handleAddToCart = async () => {
        if (product) {
            try {
                await api.post('/cart/add', { productId: product._id || product.id, quantity });
                window.dispatchEvent(new Event('cartUpdated'));
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const toggleAccordion = (id: string) => {
        setExpanded(expanded === id ? null : id);
    };

    if (!product) return <div className="container" style={{ padding: '60px 24px' }}>Loading...</div>;

    return (
        <div className="container animate-fade-in-up" style={{ padding: '60px 24px', position: 'relative' }}>
            {/* Custom Toast Notification */}
            {showToast && (
                <div className="animate-fade-in-up" style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#1a1a1a', color: 'white', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1000 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Produit ajouté au panier avec succès !</span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginBottom: '80px' }}>
                {/* Gallery */}
                <div className="animate-fade-in-left delay-100" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {product.images && product.images.length > 0 ? (
                        <>
                            <div className="image-wrapper" style={{ gridColumn: '1 / -1', height: '500px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
                                <img
                                    src={product.images[0]}
                                    alt={product.name || 'Product'}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </div>
                            {product.images.slice(1, 4).map((imgUrl: string, idx: number) => (
                                <div key={idx} className="image-wrapper hover-lift" style={{ height: '200px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
                                    <img src={imgUrl} alt={`Detail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="image-wrapper" style={{ gridColumn: '1 / -1', height: '500px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-background-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>Image non disponible</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col animate-fade-in-right delay-200">
                    <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '12px' }}>
                        {product.category?.name || 'Elite Nutrition Series'}
                    </span>
                    <h1 style={{ fontSize: '40px', fontWeight: 700, lineHeight: 1.1, marginBottom: '20px' }}>
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-2" style={{ marginBottom: '24px' }}>
                        <div className="flex text-primary">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                        </div>
                        <span className="text-muted" style={{ fontSize: '14px' }}>(124 Reviews)</span>
                    </div>

                    <div className="flex items-center gap-4" style={{ marginBottom: '32px' }}>
                        <span style={{ fontSize: '32px', fontWeight: 700 }}>{(product.price / 1000).toFixed(3)} TND</span>
                        {product.oldPrice && <span className="text-muted" style={{ fontSize: '20px', textDecoration: 'line-through' }}>{(product.oldPrice / 1000).toFixed(3)} TND</span>}
                    </div>

                    <p className="text-muted" style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '40px' }}>
                        {product.description}
                    </p>

                    <div style={{ marginBottom: '32px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Select Weight</span>
                        <div className="flex gap-4">
                            {['12kg', '18kg', '5kg'].map(w => (
                                <button
                                    key={w}
                                    onClick={() => setWeight(w)}
                                    className="hover-scale transition-all"
                                    style={{
                                        padding: '12px 24px', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 500,
                                        border: `1px solid ${weight === w ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                        backgroundColor: weight === w ? 'var(--color-primary-light)' : 'var(--color-surface)',
                                        color: weight === w ? 'var(--color-primary)' : 'var(--color-text)'
                                    }}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <span style={{
                            backgroundColor: product.stock > 10 ? '#e8f5ec' : product.stock > 0 ? 'var(--color-primary-light)' : '#fdebeb',
                            color: product.stock > 10 ? 'var(--color-success)' : product.stock > 0 ? 'var(--color-primary)' : 'var(--color-error)',
                            padding: '6px 14px', borderRadius: '30px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center'
                        }}>
                            {product.stock > 0 ? `En stock : ${product.stock} disponibles` : 'Rupture de stock'}
                        </span>
                    </div>

                    <div className="flex gap-4" style={{ marginBottom: '40px' }}>
                        <div className="flex items-center justify-between" style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', width: '120px', padding: '0 16px', opacity: product.stock === 0 ? 0.5 : 1, pointerEvents: product.stock === 0 ? 'none' : 'auto' }}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-muted hover:text-text transition-all"><Minus size={16} /></button>
                            <span style={{ fontWeight: 600 }}>{quantity}</span>
                            <button onClick={() => {
                                if (quantity < product.stock) {
                                    setQuantity(quantity + 1);
                                } else {
                                    alert(`Désolé, il ne reste que ${product.stock} article(s) en stock.`);
                                }
                            }} className="text-muted hover:text-text transition-all"><Plus size={16} /></button>
                        </div>
                        <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn btn-primary hover-scale" style={{ flex: 1, opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}>
                            {product.stock === 0 ? 'Indisponible' : 'Add to Cart'}
                        </button>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border)' }}>
                        <div className="flex items-center justify-between cursor-pointer hover-scale transition-all" style={{ padding: '24px 0' }} onClick={() => toggleAccordion('ingredients')}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Premium Ingredients</h3>
                            {expanded === 'ingredients' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        {expanded === 'ingredients' && (
                            <p className="text-muted animate-fade-in-up" style={{ fontSize: '14px', lineHeight: 1.6, paddingBottom: '24px' }}>
                                Dehydrated poultry protein, maize, vegetable protein isolate, wheat, animal fats, maize gluten, hydrolysed animal proteins, beet pulp, minerals, fish oil, soya oil, yeasts and parts thereof.
                            </p>
                        )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border)' }}>
                        <div className="flex items-center justify-between cursor-pointer hover-scale transition-all" style={{ padding: '24px 0' }} onClick={() => toggleAccordion('nutrition')}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Nutritional Value</h3>
                            {expanded === 'nutrition' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        {expanded === 'nutrition' && (
                            <div className="animate-fade-in-up" style={{ paddingBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="flex justify-between text-muted" style={{ fontSize: '14px' }}><span style={{ fontWeight: 500, color: 'var(--color-text)' }}>Protein</span> <span>26.0%</span></div>
                                <div className="flex justify-between text-muted" style={{ fontSize: '14px' }}><span style={{ fontWeight: 500, color: 'var(--color-text)' }}>Fat</span> <span>17.0%</span></div>
                                <div className="flex justify-between text-muted" style={{ fontSize: '14px' }}><span style={{ fontWeight: 500, color: 'var(--color-text)' }}>Crude Fiber</span> <span>1.2%</span></div>
                                <div className="flex justify-between text-muted" style={{ fontSize: '14px' }}><span style={{ fontWeight: 500, color: 'var(--color-text)' }}>Ash</span> <span>6.7%</span></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cross-Sell */}
            {similarProducts.length > 0 && (
                <div className="animate-fade-in-up delay-300">
                    <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                        <div>
                            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '8px', display: 'block' }}>
                                Produits Similaires
                            </span>
                            <h2 style={{ fontSize: '32px', fontWeight: 700 }}>Complétez votre achat</h2>
                        </div>
                        <Link to="/shop" className="flex items-center gap-2 text-primary hover-scale transition-all" style={{ fontWeight: 600 }}>Voir tout le catalogue <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} /></Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                        {similarProducts.map((item, i) => (
                            <div key={item._id || item.id} className={`animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}>
                                <Link to={`/product/${item._id || item.id}`} className="hover-lift" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div className="image-wrapper" style={{ height: '240px', borderRadius: 'var(--radius-lg)', marginBottom: '16px', backgroundColor: 'var(--color-surface)' }}>
                                        <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{item.name}</h3>
                                    <span className="text-primary" style={{ fontSize: '14px', fontWeight: 600 }}>{(item.price / 1000).toFixed(3)} TND</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
