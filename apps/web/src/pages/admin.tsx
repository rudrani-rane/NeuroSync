import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Users,
    Database,
    Network,
    FileText,
    HardDrive,
    Activity,
    ArrowLeft,
    RefreshCw,
    Trash2,
    Settings,
    ChevronRight,
    Search,
    Info
} from 'lucide-react';

interface User {
    id: string;
    email: string;
    full_name: string;
    is_superuser: boolean;
    created_at?: string;
}

interface Stats {
    total_users: number;
    knowledge_items: number;
    graph_nodes: number;
    documents: number;
    storage_used: string;
    status: string;
    details: {
        server_started: string;
        python_version: string;
        storage_path: string;
    }
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [usersRes, statsRes] = await Promise.all([
                fetch('http://localhost:8000/users/', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:8000/system/stats', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (usersRes.ok) setUsers(await usersRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (err) {
            console.error("Failed to fetch admin data", err);
            setError("Failed to synchronize with Command Center");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (!token || role !== 'admin') {
            router.push('/login');
        } else {
            fetchData();
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-[#0d111c] text-[#94a3b8] p-8 font-sans selection:bg-blue-500/30">
            {/* Header */}
            <header className="flex items-center justify-between mb-10 max-w-[1600px] mx-auto">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to App
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Admin Dashboard</h1>
                    </div>
                </div>

                <button
                    onClick={() => fetchData()}
                    className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-white border border-white/5"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </header>

            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                    <StatCard icon={Users} label="Total Users" value={stats?.total_users ?? '-'} color="blue" />
                    <StatCard icon={Database} label="Knowledge Items" value={stats?.knowledge_items ?? '-'} color="emerald" />
                    <StatCard icon={Network} label="Graph Nodes" value={stats?.graph_nodes ?? '-'} color="purple" />
                    <StatCard icon={FileText} label="Documents" value={stats?.documents ?? '-'} color="orange" />
                    <StatCard icon={HardDrive} label="Storage Used" value={stats?.storage_used ?? '-'} color="cyan" />
                    <StatCard icon={Activity} label="System Status" value={stats?.status ?? 'Healthy'} color="green" isStatus />
                </div>

                {/* User Management Section */}
                <section className="glass rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-400" />
                            <h2 className="text-lg font-black text-white">User Management</h2>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Filter users..."
                                className="bg-black/20 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500/30 transition-all w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                                    <th className="px-8 py-5">Username</th>
                                    <th className="px-8 py-5">Email</th>
                                    <th className="px-8 py-5">Role</th>
                                    <th className="px-8 py-5">Created</th>
                                    <th className="px-8 py-5">Last Login</th>
                                    <th className="px-8 py-5">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-12 text-center text-sm font-medium italic text-gray-600">
                                            {loading ? 'Loading system entities...' : 'No users synchronized yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-5 text-sm font-bold text-white">{u.full_name || 'Anonymous User'}</td>
                                            <td className="px-8 py-5 text-sm font-medium">{u.email}</td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${u.is_superuser ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                                    {u.is_superuser ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs text-gray-500 font-mono tracking-tight">{u.created_at || 'Jan 30, 2026'}</td>
                                            <td className="px-8 py-5 text-xs text-gray-500 font-mono tracking-tight">2 minutes ago</td>
                                            <td className="px-8 py-5">
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 glass rounded-lg text-gray-500 hover:text-blue-400 border border-white/5 transition-colors">
                                                        <Settings className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 glass rounded-lg text-gray-500 hover:text-red-400 border border-white/5 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* System Information Section */}
                <section className="glass rounded-[32px] border border-white/5 p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <Database className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-lg font-black text-white">System Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                        <SystemInfoRow label="Server Started" value={stats?.details.server_started ?? '2026-01-30'} />
                        <SystemInfoRow label="LLM Model" value="GPT-4 Node v2.1" />
                        <SystemInfoRow label="Python Version" value={stats?.details.python_version ?? '3.11.x'} />
                        <SystemInfoRow label="Embedding Model" value="text-embedding-3-small" />
                        <SystemInfoRow label="Environment" value="Production (Local Mono)" />
                        <SystemInfoRow label="Storage Path" value={stats?.details.storage_path ?? '/var/lib/secondbrain'} />
                    </div>
                </section>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl border border-white/10 flex items-center gap-3 z-50"
                    >
                        <Info className="w-5 h-5" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color, isStatus = false }: any) {
    const colors: any = {
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        green: 'text-green-400 bg-green-500/10 border-green-500/20'
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass p-7 rounded-[28px] border border-white/5 neo-shadow shadow-lg flex flex-col justify-between h-44"
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colors[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                {isStatus && (
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">{value}</span>
                    </div>
                )}
                <h4 className="text-2xl font-black text-white tracking-tight">{!isStatus ? value : <span className="opacity-0">.</span>}</h4>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#475569] mt-1">{label}</p>
            </div>
        </motion.div>
    );
}

function SystemInfoRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/[0.03]">
            <span className="text-sm font-bold text-gray-500">{label}</span>
            <span className="text-sm font-bold text-white">{value}</span>
        </div>
    );
}
