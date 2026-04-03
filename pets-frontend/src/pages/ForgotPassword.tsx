import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, KeyRound, Eye } from 'lucide-react';
import { api } from '../services/api';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Form fields
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Status & Feedback
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/forgot-password', { email });
            setStep(2);
            setSuccessMessage("Code envoyé à votre adresse email.");
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de l\'envoi de l\'email.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            await api.post('/auth/verify-reset-code', { email, code });
            setStep(3);
            setSuccessMessage("Code vérifié avec succès. Entrez votre nouveau mot de passe.");
        } catch (err: any) {
            setError(err.response?.data?.message || 'Code invalide ou expiré.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/reset-password', { email, code, newPassword });
            setSuccessMessage("Mot de passe réinitialisé avec succès ! Redirection vers la connexion...");
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la réinitialisation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center animate-fade-in" style={{ minHeight: '100vh', padding: '60px 24px', position: 'relative' }}>

            {/* Dotted Background Grid */}
            <div style={{ position: 'fixed', inset: 0, zIndex: -2, backgroundColor: '#f4f5f6', backgroundImage: 'radial-gradient(#d5d7db 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

            {/* Fading Cat Image Overlay */}
            <div style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '900px', height: '90%', zIndex: -1, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Background Cat" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', opacity: 0.8, filter: 'blur(2px)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 20%, #f4f5f6 60%), linear-gradient(to bottom, transparent 50%, #f4f5f6 90%)' }}></div>
            </div>

            <div className="animate-fade-in-up" style={{ backgroundColor: '#ffffff', padding: '50px 60px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>

                <div className="text-center" style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <img src="/logo.png" alt="Pets Tunisia Food" style={{ height: '56px' }} />
                    </div>
                    <p className="text-muted" style={{ fontSize: '14px' }}>Password Recovery</p>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Verification Code"}
                        {step === 3 && "Reset Password"}
                    </h2>
                    <p className="text-muted" style={{ fontSize: '14px' }}>
                        {step === 1 && "Enter your email address and we'll send you a recovery code."}
                        {step === 2 && "Enter the recovery code sent to your email."}
                        {step === 3 && "Create a new strong password for your account."}
                    </p>
                </div>

                {error && <div style={{ color: 'var(--color-error)', fontSize: '14px', marginBottom: '20px', padding: '12px', backgroundColor: '#fdebeb', borderRadius: '6px' }}>{error}</div>}
                {successMessage && <div style={{ color: 'var(--color-success)', fontSize: '14px', marginBottom: '20px', padding: '12px', backgroundColor: '#e8f5ec', borderRadius: '6px' }}>{successMessage}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendCode} className="flex flex-col gap-5 animate-slide-in-right">
                        <div>
                            <label style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block', color: '#1a1a1a' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" style={{ backgroundColor: '#efebe6', border: 'none', borderRadius: '6px', padding: '14px 14px 14px 40px', fontSize: '14px', width: '100%', color: '#1a1a1a', fontWeight: 500 }} required disabled={loading} />
                                <Mail size={18} style={{ color: '#a0a0a0', position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="hover-scale transition-all" style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '16px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
                            {loading ? 'Envoi...' : 'Send Recovery Code'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="flex flex-col gap-5 animate-slide-in-right">
                        <div>
                            <label style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block', color: '#1a1a1a' }}>Verification Code</label>
                            <div style={{ position: 'relative' }}>
                                <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="123456" style={{ backgroundColor: '#efebe6', border: 'none', borderRadius: '6px', padding: '14px 14px 14px 40px', fontSize: '16px', letterSpacing: '2px', width: '100%', color: '#1a1a1a', fontWeight: 500 }} required disabled={loading} />
                                <KeyRound size={18} style={{ color: '#a0a0a0', position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="hover-scale transition-all" style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '16px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
                            {loading ? 'Vérification...' : 'Verify Code'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-5 animate-slide-in-right">
                        <div>
                            <label style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block', color: '#1a1a1a' }}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" style={{ backgroundColor: '#efebe6', border: 'none', borderRadius: '6px', padding: '14px 40px 14px 14px', fontSize: '14px', width: '100%', color: '#1a1a1a', fontWeight: 500 }} required disabled={loading} />
                                <Eye size={18} style={{ color: '#a0a0a0', position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="hover-scale transition-all" style={{ backgroundColor: '#b38d58', color: 'white', padding: '16px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px' }}>
                            {loading ? 'Réinitialisation...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <p className="text-center" style={{ fontSize: '12px', marginTop: '32px', marginBottom: '40px', color: '#6d6d6d', fontWeight: 500 }}>
                    Remembered your password? <Link to="/login" style={{ fontWeight: 800, color: '#1a1a1a' }} className="hover:underline transition-all">Back to Sign In</Link>
                </p>

                <div className="flex items-center justify-center gap-8" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: '#888' }}>
                    <span className="flex items-center gap-2"><Lock size={12} /> Secure Access</span>
                    <span className="flex items-center gap-2"><ShieldCheck size={12} /> SSL Encrypted</span>
                </div>
            </div>

            {/* Footer matching mockup */}
            <div style={{ position: 'absolute', bottom: '24px', left: '48px', right: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: '#6d6d6d', zIndex: 10 }}>
                <div style={{ maxWidth: '200px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', marginBottom: '8px' }}>Pets Tunisia</h3>
                    <p style={{ fontSize: '12px', lineHeight: 1.5 }}>© 2024 Pets Tunisia. La qualité au meilleur prix.</p>
                </div>
                <div style={{ display: 'flex', gap: '80px' }}>
                    <div>
                        <h4 style={{ fontSize: '10px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>Support</h4>
                        <div className="flex flex-col gap-3" style={{ fontSize: '12px', fontWeight: 500 }}>
                            <span className="cursor-pointer hover:text-black">Store Locator</span>
                            <span className="cursor-pointer hover:text-black">Shipping Info</span>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '10px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>Legal</h4>
                        <div className="flex flex-col gap-3" style={{ fontSize: '12px', fontWeight: 500 }}>
                            <span className="cursor-pointer hover:text-black">Privacy Policy</span>
                            <span className="cursor-pointer hover:text-black">Terms of Service</span>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: '10px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>Social</h4>
                        <div className="flex items-center gap-4" style={{ color: '#6d6d6d' }}>
                            <svg className="cursor-pointer hover:text-black" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            <svg className="cursor-pointer hover:text-black" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
