import React from 'react';
import dynamic from 'next/dynamic';
import { Maximize2, RotateCcw, Filter, Layers } from 'lucide-react';

const BrainGraph = dynamic(() => import('./BrainGraph'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-brand-deep flex items-center justify-center text-blue-500/50">Initializing Neural Mesh...</div>
});

const MapView = () => {
    const [stats, setStats] = React.useState<any>(null);
    const [scopeFilter, setScopeFilter] = React.useState<string | null>(null);
    const [resetTrigger, setResetTrigger] = React.useState(0);

    React.useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/analyst/stats');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch graph stats:', err);
        }
    };

    const handleReset = () => {
        setScopeFilter(null);
        setResetTrigger(prev => prev + 1);
    };

    const handleFilter = () => {
        // Cycle through scopes: null -> personal -> work_engineering -> work_hr -> null
        const scopes = [null, 'personal', 'work_engineering', 'work_hr'];
        const currentIndex = scopes.indexOf(scopeFilter);
        const nextIndex = (currentIndex + 1) % scopes.length;
        setScopeFilter(scopes[nextIndex]);
    };

    const density = stats ? (stats.total_relationships / Math.max(stats.total_memories, 1)) : 0;
    const clustering = stats ? (stats.graph_density || 0) : 0;

    return (
        <div className="w-full h-full relative rounded-[40px] overflow-hidden border border-white/5 bg-black/40">
            {/* Control Panel Layer */}
            <div className="absolute top-8 left-8 z-30 flex flex-col gap-4 pointer-events-none">
                <div className="glass p-6 rounded-[32px] border border-white/5 shadow-2xl pointer-events-auto max-w-[280px]">
                    <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-400" />
                        Graph Topology
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>Nodes</span>
                                <span className="text-blue-400">{stats?.total_memories || 0}</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span>Density</span>
                                <span className="text-purple-400">{(density * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div style={{ width: `${Math.min(density * 100, 100)}%` }} className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            </div>
                        </div>
                        {scopeFilter && (
                            <div className="pt-2 border-t border-white/5">
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Active Filter</div>
                                <div className="text-xs text-primary-400 font-bold">{scopeFilter.replace('_', ' ')}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 pointer-events-auto">
                    <GraphButton icon={RotateCcw} label="Reset" onClick={handleReset} />
                    <GraphButton icon={Filter} label="Filter" onClick={handleFilter} />
                </div>
            </div>

            <div className="absolute top-8 right-8 z-30 pointer-events-auto">
                <GraphButton icon={Maximize2} label="Fullscreen" onClick={() => alert('Fullscreen mode - Coming soon')} />
            </div>

            {/* Sub-surface legend */}
            <div className="absolute bottom-8 right-8 z-30 glass px-6 py-4 rounded-[24px] border border-white/5 flex gap-6 items-center pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
                <LegendItem color="#3b82f6" label="Personal" />
                <LegendItem color="#10b981" label="Engineering" />
                <LegendItem color="#a855f7" label="Research" />
            </div>

            {/* Neural Matrix */}
            <div className="w-full h-full relative z-10">
                <BrainGraph scopeFilter={scopeFilter} resetTrigger={resetTrigger} />
            </div>

            {/* Depth Gradients */}
            <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,3,5,0.4)_100%)] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        </div>
    );
};

function GraphButton({ icon: Icon, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-6 py-3 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-white/5"
        >
            <Icon className="w-3.5 h-3.5" />
            {label}
        </button>
    );
}

function LegendItem({ color, label }: any) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{label}</span>
        </div>
    );
}

export default MapView;
