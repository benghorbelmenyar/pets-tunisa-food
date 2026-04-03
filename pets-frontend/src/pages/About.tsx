import { Shield, Target, Users } from 'lucide-react';

export default function About() {
    return (
        <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>

            {/* Header / Hero Section */}
            <section style={{ position: 'relative', padding: '160px 24px 180px 24px', textAlign: 'center', color: 'white', overflow: 'hidden' }}>
                <img src="/images/k9-malinois.jpg" alt="K9 Police Dog" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, objectPosition: 'center 30%' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9))', zIndex: -1 }}></div>

                <div className="container relative z-10" style={{ maxWidth: '800px' }}>
                    <span className="animate-fade-in-up" style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '6px 16px', borderRadius: '30px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px', display: 'inline-block', marginBottom: '24px' }}>Qui sommes-nous ?</span>
                    <h1 className="animate-fade-in-up delay-100" style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px', color: 'white' }}>
                        L'art de nourrir l'exceptionnel avec Pets Tunisia Food
                    </h1>
                    <p className="animate-fade-in-up delay-200" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 auto' }}>
                        " DES PETITS PRIX POUR VOS COMPAGNONS "
                    </p>
                </div>
            </section>

            <div className="container" style={{ marginTop: '-100px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
                {/* Introduction Block */}
                <div className="animate-fade-in-up delay-300" style={{ backgroundColor: 'var(--color-surface)', padding: '60px', borderRadius: 'var(--radius-xl)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'grid', gridTemplateColumns: '1fr', gap: '40px', maxWidth: '900px', margin: '0 auto', border: '1px solid var(--color-border-light)' }}>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Pets Tunisia Food</h2>
                            <p className="text-muted" style={{ fontSize: '16px', lineHeight: 1.7 }}>
                                Pets Tunisia Food vous propose un large choix de produits parmi les plus grandes marques au meilleur prix : nourriture pour chiens, chats, oiseaux. Notre devise ? Des prix bas en permanence et des offres spéciales, pour des clients satisfaits !
                            </p>
                        </div>
                    </div>

                    <div style={{ height: '1px', backgroundColor: 'var(--color-border-light)' }}></div>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Target size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Notre mission</h2>
                            <p className="text-muted" style={{ fontSize: '16px', lineHeight: 1.7 }}>
                                Nous voulons démystifier l’alimentation de nos animaux, grâce à des compositions plus transparentes et compréhensibles pour les maîtres. Nous aimons profondément nos animaux, et ils méritent le meilleur, tout simplement !
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main "Qui sommes-nous ?" Section with an image layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', alignItems: 'center', marginTop: '100px' }}>
                    <div className="animate-fade-in-left">
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>Depuis 20 ans</span>
                        <h2 style={{ fontSize: '40px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>Qui sommes-nous ?</h2>
                        <div className="text-muted" style={{ fontSize: '16px', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <p>
                                Nous sommes des professionnels dans le domaine K9 (Instructeur K9), et fort de notre expérience de plus de 20 ans dans le domaine K9 : l'élevage, éducation K9 pour la détection, brigade police K9, et ce à travers plusieurs pays dans le monde (France, Hollande, Belgique, Dubaï, Arabie Saoudite, Koweït, USA, Tunisie,...).
                            </p>
                            <p>
                                Suite aux demandes d'amis propriétaires, en 2012 nous avons commencé à offrir une gamme variée d'aliments pour chien et chat en provenance d'Europe.
                            </p>
                            <p>
                                Notre mission est de faciliter à tous l’accès aux conseils, de proposer notre expérience acquise durant ces années. PETS TUNISIA FOOD c'est des professionnels, qui s’engagent pour le bien-être des animaux et l’accompagnement de leurs propriétaires. Et surtout une offre respectueuse du bien-être animal, au meilleur rapport qualité / prix sur le marché, pour l'alimentation de vos compagnons.
                            </p>
                        </div>
                        <div className="flex gap-4" style={{ marginTop: '40px' }}>
                            <div className="flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--color-background-alt)', padding: '24px', borderRadius: '16px', flex: 1 }}>
                                <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)' }}>20+</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Années K9</span>
                            </div>
                            <div className="flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--color-background-alt)', padding: '24px', borderRadius: '16px', flex: 1 }}>
                                <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)' }}>100%</span>
                                <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Passion</span>
                            </div>
                        </div>
                    </div>

                    <div className="image-wrapper animate-fade-in-right" style={{ height: '500px', borderRadius: '40px 100px 40px 40px', position: 'relative', overflow: 'hidden' }}>
                        <img src="/images/k9-german-shepherd.png" alt="Dog Training and Breeding K9" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div className="glass-panel" style={{ position: 'absolute', bottom: '24px', left: '24px', padding: '16px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Shield size={24} className="text-primary" />
                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>Expertise K9</h4>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Instructeurs & Éleveurs</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
