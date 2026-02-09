import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Settings,
    LogOut,
    Brain,
    Bell,
    Cpu,
    MessageSquare,
    Database,
    Globe,
    Shield,
    ChevronLeft,
    ChevronRight,
    Home,
    FileText,
    Eye,
    BarChart3,
    Activity
} from 'lucide-react';

// Components
import RecallView from '../components/RecallView';
import AnalystView from '../components/AnalystView';
import MapView from '../components/MapView';
import KnowledgeView from '../components/KnowledgeView';
import VisionView from '../components/VisionView';
import SystemLogsView from '../components/SystemLogsView';
// Placeholder views since they need to be built/updated
const HomeOverview = () => (
    <div className="h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="glass-card p-12 text-center space-y-4">
            <div className="w-20 h-20 bg-primary-500/10 rounded-3xl flex items-center justify-center mx-auto">
                <Brain className="w-10 h-10 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome to your NeuraLink</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Your personal networked knowledge is being synthesized. Start by adding new memories or exploring your existing graph.</p>
            <div className="grid grid-cols-3 gap-6 mt-12">
                <QuickStat label="Active nodes" value="1,284" />
                <QuickStat label="Neural entropy" value="0.12" />
                <QuickStat label="Sync status" value="Healthy" />
            </div>
        </div>
    </div>
);

function QuickStat({ label, value }: { label: string, value: string }) {
    return (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-lg font-bold text-gray-200">{value}</p>
        </div>
    );
}

type AppTab = 'home' | 'logs' | 'admin';
type FeatureTab = 'recall' | 'knowledge' | 'vision' | 'analyst' | 'map';

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FeatureTab>('recall');
    const [appSection, setAppSection] = useState<AppTab>('home');
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) return (
        <div className="min-h-screen bg-[#111827] flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full"
            />
        </div>
    );

    const sidebarWidth = sidebarExpanded ? 'w-72' : 'w-20';

    return (
        <div className="flex h-screen w-full bg-[#111827] text-gray-100 overflow-hidden font-sans selection:bg-primary-500/30">
            {/* Collapsible Sidebar */}
            <aside className={`${sidebarWidth} transition-all duration-300 glass border-r border-white/5 flex flex-col z-40 relative`}>
                <div className="p-6 flex items-center justify-between">
                    <AnimatePresence mode="wait">
                        {sidebarExpanded ? (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-3"
                            >
                                <div className="p-2 bg-primary-600 rounded-xl shadow-lg shadow-primary-900/40">
                                    <Brain className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold tracking-tight">NeuraLink</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mx-auto p-2 bg-primary-600 rounded-xl"
                            >
                                <Brain className="w-6 h-6 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <SidebarItem
                        icon={Home}
                        label="Overview"
                        active={appSection === 'home'}
                        expanded={sidebarExpanded}
                        onClick={() => { setAppSection('home'); }}
                    />
                    <SidebarItem
                        icon={Activity}
                        label="System Logs"
                        active={appSection === 'logs'}
                        expanded={sidebarExpanded}
                        onClick={() => { setAppSection('logs'); }}
                    />
                </nav>

                <div className="px-4 py-8 border-t border-white/5 space-y-2">
                    <SidebarItem
                        icon={Shield}
                        label="Admin Console"
                        active={false}
                        expanded={sidebarExpanded}
                        onClick={() => router.push('/admin')}
                    />
                    <SidebarItem
                        icon={LogOut}
                        label="Logout"
                        active={false}
                        expanded={sidebarExpanded}
                        onClick={() => { localStorage.clear(); router.push('/login'); }}
                    />
                    <button
                        onClick={() => setSidebarExpanded(!sidebarExpanded)}
                        className="w-full flex items-center justify-center p-3 text-gray-500 hover:text-white transition-colors"
                    >
                        {sidebarExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-gray-900/50">
                {/* Header HUD */}
                <header className="h-20 border-b border-white/5 backdrop-blur-md flex items-center justify-between px-10 z-30">
                    <nav className="flex items-center gap-1">
                        <TabButton active={activeTab === 'recall'} onClick={() => setActiveTab('recall')} icon={MessageSquare} label="Recall" />
                        <TabButton active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')} icon={Database} label="Knowledge" />
                        <TabButton active={activeTab === 'vision'} onClick={() => setActiveTab('vision')} icon={Eye} label="Vision" />
                        <TabButton active={activeTab === 'analyst'} onClick={() => setActiveTab('analyst')} icon={BarChart3} label="Analyst" />
                        <TabButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={Globe} label="Brain Map" />
                    </nav>

                    <div className="flex items-center gap-6">
                        <div className={`relative flex items-center transition-all duration-300 ${searchFocused ? 'w-80' : 'w-48'}`}>
                            <Search className={`absolute left-3 w-4 h-4 transition-colors ${searchFocused ? 'text-primary-400' : 'text-gray-500'}`} />
                            <input
                                type="text"
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                placeholder="Quantum search..."
                                className="w-full bg-gray-800/50 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-primary-500/50 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => alert("Neural Notifications: No new alerts in your cognitive network.")}
                                    className="text-gray-500 hover:text-gray-200 transition-colors relative"
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full border-2 border-gray-900" />
                                </button>
                                <div
                                    onClick={() => alert("User Identity: John Doe. Cognitive Tier: Enterprise. Settings integration pending.")}
                                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-secondary-500 p-[1px] cursor-pointer hover:scale-110 transition-transform"
                                >
                                    <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center font-bold text-xs uppercase text-white">JD</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 relative overflow-hidden">
                    {/* Background Decorative Element */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500/5 rounded-full blur-[120px] pointer-events-none" />

                    <div className="h-full overflow-y-auto no-scrollbar p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={appSection === 'home' ? activeTab : appSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                {appSection === 'logs' ? <SystemLogsView /> : (
                                    <>
                                        {activeTab === 'recall' && <RecallView />}
                                        {activeTab === 'knowledge' && <KnowledgeView />}
                                        {activeTab === 'vision' && <VisionView />}
                                        {activeTab === 'analyst' && <AnalystView />}
                                        {activeTab === 'map' && <MapView />}
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    )
}

function SidebarItem({ icon: Icon, label, active, expanded, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${active ? 'bg-primary-600/10 text-primary-400 border border-primary-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'}`}
        >
            <Icon className="w-5 h-5 shrink-0" />
            <AnimatePresence>
                {expanded && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-sm font-medium whitespace-nowrap"
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${active ? 'text-primary-400 bg-primary-600/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'text-gray-500 hover:text-gray-300'}`}
        >
            <Icon className={`w-4 h-4 ${active ? 'text-primary-400' : 'text-gray-500'}`} />
            {label}
        </button>
    );
}
