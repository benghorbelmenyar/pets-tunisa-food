import { Link, useNavigate } from 'react-router-dom';
import { Eye, ShieldCheck, Lock } from 'lucide-react';
import { useState } from 'react';
import { api } from '../services/api';

export default function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { firstName, lastName, email, password });

            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            if (redirect) {
                navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
            } else {
                navigate('/login');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container flex items-center justify-center animate-fade-in" style={{ minHeight: 'calc(100vh - 200px)', padding: '60px 24px' }}>

            {/* Background cat image overlay similar to mockup */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1 }}>
                <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Background Cat" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--color-background))' }}></div>
            </div>

            <div className="animate-fade-in-up" style={{ backgroundColor: 'var(--color-surface)', padding: '60px', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '500px', position: 'relative', zIndex: 10 }}>

                <div className="text-center" style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <img src="/logo.png" alt="Pets Tunisia Food" style={{ height: '56px' }} />
                    </div>
                    <p className="text-muted" style={{ fontSize: '14px' }}>Rejoignez notre communauté</p>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Create an Account</h2>
                    <p className="text-muted" style={{ fontSize: '14px' }}>Please fill in your details to create your sanctuary.</p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    {error && <div style={{ color: 'var(--color-error)', fontSize: '14px', marginBottom: '10px' }}>{error}</div>}
                    <div className="flex gap-4">
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>First Name</label>
                            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="John" style={{ backgroundColor: 'var(--color-background-alt)' }} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Last Name</label>
                            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" style={{ backgroundColor: 'var(--color-background-alt)' }} required />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" style={{ backgroundColor: 'var(--color-background-alt)' }} required />
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ backgroundColor: 'var(--color-background-alt)', paddingRight: '40px' }} required />
                            <Eye size={20} className="text-muted" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary hover-scale transition-all" style={{ padding: '16px', fontSize: '16px', marginTop: '8px' }}>Create Account</button>
                </form>

                <p className="text-center text-muted" style={{ fontSize: '14px', marginTop: '32px', marginBottom: '40px' }}>
                    Already have an account? <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-text)' }} className="hover:underline transition-all">Sign In</Link>
                </p>

                <div className="flex items-center justify-center gap-8 text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                    <span className="flex items-center gap-2"><Lock size={14} /> Secure Data</span>
                    <span className="flex items-center gap-2"><ShieldCheck size={14} /> Privacy Protected</span>
                </div>
            </div>
        </div>
    );
}
