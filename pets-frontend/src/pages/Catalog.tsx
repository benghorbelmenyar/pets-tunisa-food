import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, Check, Search } from 'lucide-react';
import { api } from '../services/api';

export default function Catalog() {
    const [searchParams] = useSearchParams();
    const [companion, setCompanion] = useState('Tous');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [maxPrice, setMaxPrice] = useState<number>(1000000);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const cat = searchParams.get('category');
        const catName = searchParams.get('categoryName');
        const search = searchParams.get('search');

        if (cat === 'dogs') setCompanion('Chiens');
        else if (cat === 'cats') setCompanion('Chats');
        else if (catName) setCompanion(catName);
        else setCompanion('Tous');

        if (search) {
            setSearchQuery(search);
        }
    }, [searchParams]);

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(console.error);
    }, []);

    const filteredProducts = products.filter(p => {
        // 1. Category Filter
        let matchesCategory = false;
        const catName = p.category?.name?.toLowerCase() || '';
        const prodName = (p.name || p.title || '').toLowerCase();

        if (companion === 'Tous') {
            matchesCategory = true;
        } else if (companion === 'Chiens') {
            matchesCategory = catName.includes('chien') || prodName.includes('chien') || prodName.includes('dog') || prodName.includes('chiot');
        } else if (companion === 'Chats') {
            matchesCategory = catName.includes('chat') || prodName.includes('chat') || prodName.includes('cat') || prodName.includes('chaton');
        } else {
            matchesCategory = p.category?.name === companion || catName.includes(companion.toLowerCase());
        }

        if (!matchesCategory) return false;

        // 2. Search Query Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const desc = (p.description || p.desc || '').toLowerCase();
            if (!prodName.includes(query) && !desc.includes(query)) {
                return false;
            }
        }

        // 3. Brand Filter
        if (selectedBrands.length > 0) {
            const brand = (p.brand || 'PREMIUM').toLowerCase();
            const hasBrand = selectedBrands.some(b => b.toLowerCase() === brand || prodName.includes(b.toLowerCase()));
            if (!hasBrand) return false;
        }

        // 4. Price Filter
        const price = parseFloat(p.price);
        if (!isNaN(price) && price > maxPrice) {
            return false;
        }

        return true;
    });

    // Extract top brands dynamically
    const availableBrands = Array.from(new Set(products.map(p => p.brand || 'PREMIUM'))).slice(0, 6);
    // Find highest price for the range maximum
    const highestPrice = Math.max(...products.map(p => parseFloat(p.price) || 0), 1000);

    return (
        <div className="container animate-fade-in-up" style={{ padding: '60px 24px', display: 'flex', gap: '40px' }}>
            {/* Sidebar */}
            <aside className="animate-fade-in-left delay-100" style={{ width: '280px', flexShrink: 0 }}>
                <h2 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Catégorie</h2>
                <div className="flex gap-2 flex-wrap" style={{ marginBottom: '32px' }}>
                    {['Tous', 'Chiens', 'Chats'].map(item => (
                        <button
                            key={item}
                            onClick={() => setCompanion(item)}
                            className="hover-scale transition-all"
                            style={{
                                padding: '8px 16px', borderRadius: '30px', fontSize: '14px', fontWeight: 500,
                                backgroundColor: companion === item ? 'var(--color-primary)' : 'var(--color-background-alt)',
                                color: companion === item ? 'white' : 'var(--color-text)',
                                border: companion === item ? '1px solid var(--color-primary)' : '1px solid var(--color-border)'
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <h2 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Recherche</h2>
                <div style={{ position: 'relative', marginBottom: '32px' }}>
                    <Search size={18} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Chercher un produit..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background-alt)', fontSize: '14px', outline: 'none' }}
                        className="focus:border-primary transition-colors"
                    />
                </div>

                <h2 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Marques</h2>
                <div className="flex flex-col gap-3" style={{ marginBottom: '40px' }}>
                    {availableBrands.map((brand, _i) => {
                        const isSelected = selectedBrands.includes(brand);
                        return (
                            <label key={brand} className="flex items-center gap-3 hover-scale transition-all" style={{ cursor: 'pointer', fontSize: '15px' }}>
                                <div
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedBrands(prev => isSelected ? prev.filter(b => b !== brand) : [...prev, brand]);
                                    }}
                                    style={{
                                        width: '18px', height: '18px', border: '1px solid var(--color-border)', borderRadius: '4px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent', borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)'
                                    }}>
                                    {isSelected && <Check size={12} color="white" />}
                                </div>
                                <span onClick={() => setSelectedBrands(prev => isSelected ? prev.filter(b => b !== brand) : [...prev, brand])}>
                                    {brand}
                                </span>
                            </label>
                        );
                    })}
                </div>

                <h2 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>Budget Max</h2>
                <div style={{ marginBottom: '40px' }}>
                    <input
                        type="range"
                        min="0"
                        max={highestPrice}
                        step="10"
                        value={maxPrice > highestPrice ? highestPrice : maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                    <div className="flex justify-between text-muted mt-2" style={{ fontSize: '14px', fontWeight: 500 }}>
                        <span>0 TND</span>
                        <span>{maxPrice > highestPrice ? highestPrice : maxPrice} TND</span>
                    </div>
                </div>

                <div className="hover-lift" style={{ backgroundColor: 'var(--color-background-alt)', padding: '32px 24px', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#e2ccab', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <Check size={20} className="text-primary" />
                    </div>
                    <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Conseil Expert</h3>
                    <p className="text-muted" style={{ fontSize: '14px', marginBottom: '20px' }}>Besoin d'un régime spécifique ? Nos vétérinaires partenaires vous répondent en direct.</p>
                    <button className="btn btn-outline w-full hover-scale" style={{ fontSize: '14px', padding: '10px' }}>Contacter un expert</button>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{ flex: 1 }}>
                <div className="flex items-center justify-between animate-fade-in-up delay-200" style={{ marginBottom: '32px' }}>
                    <span className="text-muted" style={{ fontSize: '14px' }}>Affichage de {filteredProducts.length} produits</span>
                    <div className="flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                        <span className="text-muted text-uppercase" style={{ fontSize: '12px' }}>Trier par:</span>
                        <span>Nouveautés</span>
                        <ChevronDown size={16} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
                    {filteredProducts.map((product, idx) => (
                        <div key={product._id || product.id} className={`animate-fade-in-up delay-${Math.min((idx + 1) * 100, 500)}`}>
                            <Link to={`/product/${product._id || product.id}`} className="hover-lift" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div className="image-wrapper" style={{ position: 'relative', height: '320px', backgroundColor: 'var(--color-background-alt)', marginBottom: '20px' }}>
                                    <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3'} alt={product.name || product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {product.badge && (
                                        <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, letterSpacing: '1px' }} className={product.badgeColor || "text-primary"}>
                                            {product.badge}
                                        </div>
                                    )}
                                </div>
                                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '1px', marginBottom: '4px' }}>{product.brand || 'PREMIUM'}</span>
                                <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{product.name || product.title}</h3>
                                <p className="text-muted" style={{ fontSize: '14px', flex: 1, marginBottom: '20px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.description || product.desc}</p>
                                <div className="flex items-center gap-3">
                                    <span style={{ fontSize: '18px', fontWeight: 700 }}>{product.price} TND</span>
                                    {product.oldPrice && <span className="text-muted" style={{ fontSize: '14px', textDecoration: 'line-through' }}>{product.oldPrice} TND</span>}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-2 animate-fade-in-up delay-500" style={{ marginTop: '60px' }}>
                    <button className="btn-ghost hover-scale transition-all" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-border)' }}>&lt;</button>
                    <button className="btn-primary hover-scale transition-all" style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</button>
                    <button className="btn-ghost hover-scale transition-all" style={{ width: '40px', height: '40px', borderRadius: '50%' }}>2</button>
                    <button className="btn-ghost hover-scale transition-all" style={{ width: '40px', height: '40px', borderRadius: '50%' }}>3</button>
                    <button className="btn-ghost hover-scale transition-all" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-border)' }}>&gt;</button>
                </div>
            </div>
        </div>
    );
}
