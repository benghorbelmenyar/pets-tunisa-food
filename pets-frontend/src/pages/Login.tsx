import { Link, useNavigate } from 'react-router-dom';
import { Eye, ShieldCheck, Lock } from 'lucide-react';
import { useState } from 'react';
import { api } from '../services/api';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            const sessionId = localStorage.getItem('session_id');
            if (sessionId) {
                await api.post('/cart/sync', { sessionId }).catch(console.error);
            }

            if (response.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');
                if (redirect) {
                    navigate(redirect);
                } else {
                    navigate('/');
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center animate-fade-in" style={{ minHeight: '100vh', padding: '60px 24px', position: 'relative' }}>

            {/* Dotted Background Grid */}
            <div style={{ position: 'fixed', inset: 0, zIndex: -2, backgroundColor: '#f4f5f6', backgroundImage: 'radial-gradient(#d5d7db 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

            {/* Fading Cat Image Overlay */}
            <div style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '900px', height: '90%', zIndex: -1, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Background Cat" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', opacity: 0.8, filter: 'blur(2px)' }} />
                {/* Radial & Linear gradient composite to blend out the edges of the cat */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 20%, #f4f5f6 60%), linear-gradient(to bottom, transparent 50%, #f4f5f6 90%)' }}></div>
            </div>

            <div className="animate-fade-in-up" style={{ backgroundColor: '#ffffff', padding: '50px 60px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>

                <div className="text-center" style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <img src="/logo.png" alt="Pets Tunisia Food" style={{ height: '56px' }} />
                    </div>
                    <p className="text-muted" style={{ fontSize: '14px' }}>La qualité au meilleur prix</p>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Welcome Back</h2>
                    <p className="text-muted" style={{ fontSize: '14px' }}>Please enter your details to access your sanctuary.</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    {error && <div style={{ color: 'var(--color-error)', fontSize: '14px', marginBottom: '10px' }}>{error}</div>}
                    <div>
                        <label style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block', color: '#1a1a1a' }}>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" style={{ backgroundColor: '#efebe6', border: 'none', borderRadius: '6px', padding: '14px', fontSize: '14px', width: '100%', color: '#1a1a1a', fontWeight: 500 }} required />
                    </div>

                    <div>
                        <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
                            <label style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#1a1a1a' }}>Password</label>
                            <Link to="/forgot-password" className="cursor-pointer hover:underline transition-all" style={{ fontSize: '10px', fontWeight: 800, color: '#b38d58' }}>Forgot Password?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ backgroundColor: '#efebe6', border: 'none', borderRadius: '6px', padding: '14px 40px 14px 14px', fontSize: '14px', width: '100%', color: '#1a1a1a', fontWeight: 500 }} required />
                            <Eye size={18} style={{ color: '#a0a0a0', position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
                        </div>
                    </div>

                    <div className="flex gap-2 items-center" style={{ marginTop: '4px', marginBottom: '12px' }}>
                        <input type="checkbox" id="remember" style={{ width: '16px', height: '16px', accentColor: '#b38d58', border: '1px solid #d1d1d1', borderRadius: '4px', cursor: 'pointer' }} />
                        <label htmlFor="remember" style={{ fontSize: '12px', color: '#6d6d6d', cursor: 'pointer', fontWeight: 500 }}>Remember me for 30 days</label>
                    </div>

                    <button type="submit" className="hover-scale transition-all" style={{ backgroundColor: '#b38d58', color: 'white', padding: '16px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Sign In</button>
                </form>

                <p className="text-center" style={{ fontSize: '12px', marginTop: '32px', marginBottom: '40px', color: '#6d6d6d', fontWeight: 500 }}>
                    Don't have an account? <Link to={`/register${window.location.search}`} style={{ fontWeight: 800, color: '#1a1a1a' }} className="hover:underline transition-all">Create an Account</Link>
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
