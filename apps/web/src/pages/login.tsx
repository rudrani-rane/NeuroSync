import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    User,
    Lock,
    ArrowRight,
    Brain,
    Zap,
    Cpu,
    Network,
    Sparkles
} from 'lucide-react';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<'user' | 'admin'>('user');

    useEffect(() => {
        // Clear old sessions
        localStorage.clear();
    }, []);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:8000/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username: email, password: password })
            });

            if (!res.ok) throw new Error("Synchronization Failed. Invalid Credentials.");

            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', role);

            if (role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || "Security Gateway Unreachable");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-deep flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-brand-blue/30">
            {/* Background Neural Matrix Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1)_0%,transparent_50%)]" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0.1, 0.3, 0.1],
                            scale: [1, 1.5, 1],
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute w-1 h-1 bg-brand-blue/40 rounded-full blur-[1px]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-[480px] z-10"
            >
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="inline-flex p-5 bg-gradient-to-br from-brand-blue to-brand-purple rounded-[32px] shadow-2xl shadow-brand-blue/20 border border-white/10 mb-6"
                    >
                        <Brain className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-5xl font-black tracking-tighter text-white mb-3 text-glow">
                        NeuraLink<span className="text-brand-blue">.</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Your Personal Networked Knowledge</p>
                </div>

                {/* Login Card */}
                <div className="glass rounded-[40px] p-10 border border-white/5 neo-shadow relative group">
                    {/* Role Switcher */}
                    <div className="flex bg-black/40 p-1.5 rounded-3xl mb-10 border border-white/5 relative">
                        <motion.div
                            animate={{ x: role === 'user' ? 0 : '100%' }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-brand-blue to-blue-500 rounded-[22px] shadow-xl"
                        />
                        <button
                            onClick={() => setRole('user')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[22px] text-sm font-black transition-all z-10 ${role === 'user' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Network className="w-4 h-4" />
                            User Portal
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[22px] text-sm font-black transition-all z-10 ${role === 'admin' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Shield className="w-4 h-4" />
                            Admin Console
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group/field">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/field:text-brand-blue transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Neural Identity (Email)"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-[24px] py-5 pl-14 pr-6 text-white placeholder:text-gray-600 outline-none focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm font-medium"
                                    required
                                />
                            </div>
                            <div className="relative group/field">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/field:text-brand-blue transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Access Key"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-[24px] py-5 pl-14 pr-6 text-white placeholder:text-gray-600 outline-none focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 transition-all text-sm font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-500 text-xs font-bold flex items-center gap-3"
                                >
                                    <Zap className="w-4 h-4 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-brand-blue to-brand-indigo hover:from-blue-500 hover:to-indigo-500 text-white py-5 rounded-[24px] font-black text-sm shadow-2xl shadow-brand-blue/20 border border-white/10 transition-all overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-10 transition-opacity" />
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Establish Neural Connection
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-loose">
                            Secured by NeuraLink Advanced Neural Encryption<br />
                            v4.0.2 Monolithic Core
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
