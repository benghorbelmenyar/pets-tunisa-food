import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Categories() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        api.get('/categories')
            .then(res => setCategories(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="container animate-fade-in-up" style={{ padding: '60px 24px', minHeight: '80vh' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>Toutes nos Catégories</h1>
                <p className="text-muted" style={{ fontSize: '18px', maxWidth: '600px' }}>Explorez nos différentes gammes spécialement conçues pour répondre aux besoins de tous vos compagnons.</p>
            </div>

            {categories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
                    <p className="text-muted">Aucune catégorie disponible pour le moment.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {categories.map((cat, idx) => (
                        <Link
                            to={`/shop?categoryName=${encodeURIComponent(cat.name)}`}
                            key={cat._id}
                            className={`image-wrapper hover-lift animate-fade-in-up delay-${Math.min((idx + 1) * 100, 500)}`}
                            style={{ position: 'relative', height: '350px', borderRadius: 'var(--radius-lg)' }}
                        >
                            <img
                                src={cat.imageUrl || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                alt={cat.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}></div>
                            <div style={{ position: 'absolute', bottom: '32px', left: '32px', right: '32px', color: 'white' }}>
                                <h3 style={{ fontSize: '32px', color: 'white', fontWeight: 700, marginBottom: '8px' }}>{cat.name}</h3>
                                {cat.description && (
                                    <p style={{ opacity: 0.9, fontSize: '14px', marginBottom: '16px', lineHeight: 1.5 }}>{cat.description}</p>
                                )}
                                <span className="flex items-center gap-2 transition-all mt-4" style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-primary-light)' }}>
                                    Explorer la gamme →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
