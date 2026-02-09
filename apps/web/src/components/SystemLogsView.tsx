import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Search,
    Filter,
    Mic,
    FileText,
    Link as LinkIcon,
    Eye,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    Play
} from 'lucide-react';

export default function SystemLogsView() {
    const [filter, setFilter] = useState('all');
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Calculate confidence based on metadata quality
    const calculateConfidence = (log: any) => {
        let confidence = 0.5;

        // Increase for content length
        if (log.content && log.content.length > 100) confidence += 0.2;
        if (log.content && log.content.length > 500) confidence += 0.1;

        // Increase for entities found
        if (log.entities && log.entities.length > 0) {
            confidence += Math.min(log.entities.length * 0.05, 0.2);
        }

        return Math.min(confidence, 1.0);
    };

    const fetchLogs = async () => {
        try {
            // Updated to fetch from System Gateway which proxies to Knowledge Service
            const res = await fetch('http://127.0.0.1:8000/system/logs');
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (err) {
            console.error("Failed to fetch logs", err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 5000); // Faster refresh for real-time feel
        return () => clearInterval(interval);
    }, []);

    const filteredLogs = logs.filter(log => {
        if (filter === 'all') return true;

        // Map filter options to actual source_type values from backend
        const typeMap: Record<string, string[]> = {
            'text': ['manual_text'],
            'audio': ['audio_transcript'],
            'url': ['web_crawl', 'youtube'],
            'vision': ['vision_analysis', 'image_description'],
            'document': ['file_upload', 'pdf', 'docx']
        };

        const allowedTypes = typeMap[filter] || [];
        return allowedTypes.includes(log.source_type);
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32">
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-400 font-bold text-xs uppercase tracking-[0.2em]">
                        <Activity className="w-4 h-4" />
                        Neural Activity Stream
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">System Logs</h1>
                    <p className="text-gray-500 max-w-xl">
                        Monitor every ingestion, transcription, and graph update.
                        Verify the accuracy of your cognitive transitions in real-time.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { setLoading(true); fetchLogs(); }}
                        className="p-2.5 bg-gray-800/50 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all"
                        title="Refresh Logs"
                    >
                        <Activity className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Filter logs..."
                            className="bg-gray-800/50 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-300 outline-none focus:border-primary-500/30 w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {loading && logs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest text-xs glass-card">
                        Scanning Neural Links...
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest text-xs glass-card">
                        No activity detected in the selected spectrum.
                    </div>
                ) : (
                    filteredLogs.map(log => (
                        <LogCard
                            key={log.id}
                            log={{
                                id: log.id,
                                type: log.source_type === 'audio_transcript' ? 'audio' : log.source_type === 'web_crawl' ? 'url' : 'text',
                                timestamp: log.created_at ? new Date(log.created_at).toLocaleTimeString() : 'Just now',
                                user: 'System',
                                scope: [log.scope || 'Personal'],
                                title: log.content.substring(0, 40) + (log.content.length > 40 ? '...' : ''),
                                content: log.content,
                                status: 'synced',
                                hasAudio: log.source_type === 'audio_transcript',
                                confidence: calculateConfidence(log),
                                entities: log.entities || [],
                                topics: log.topics || [],
                                source_url: log.source_url
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
function LogCard({ log }: any) {
    const [expanded, setExpanded] = useState(false);
    const Icon = log.type === 'audio' ? Mic : log.type === 'url' ? LinkIcon : FileText;

    return (
        <div className="glass-card overflow-hidden group">
            <div className="p-6 flex items-start gap-6">
                <div className={`p-4 rounded-2xl shrink-0 ${log.type === 'audio' ? 'bg-primary-500/10 text-primary-400' : log.type === 'url' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-secondary-500/10 text-secondary-400'}`}>
                    <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-gray-100 group-hover:text-primary-400 transition-colors uppercase tracking-tight">{log.title}</h3>
                            <div className="flex gap-1">
                                {log.scope.map((s: string) => (
                                    <span key={s} className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-bold text-gray-500 tracking-widest uppercase">{s}</span>
                                ))}
                            </div>
                        </div>
                        <div className="text-xs text-gray-600 font-bold flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            {log.timestamp}
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-4xl line-clamp-2">
                        {log.content}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-success-500">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Synced
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                                Confidence: <span className="text-primary-400">{(log.confidence * 100).toFixed(0)}%</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {log.hasAudio && (
                                <button className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-lg text-xs font-bold hover:bg-primary-500/20 transition-all">
                                    <Play className="w-3 h-3 fill-primary-400" /> Play Source
                                </button>
                            )}
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="p-1.5 text-gray-500 hover:text-white transition-colors"
                            >
                                <ChevronDown className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6"
                    >
                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Extracted Entities</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {log.entities && log.entities.length > 0 ? (
                                            log.entities.map((ent: string, i: number) => (
                                                <EntityBadge key={i} label={ent} type="tech" />
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-gray-600 italic">No entities detected</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Topic Classification</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {log.topics && log.topics.length > 0 ? (
                                            log.topics.map((topic: string, i: number) => (
                                                <TopicBadge key={i} label={topic} weight={1.0 - (i * 0.1)} />
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-gray-600 italic">No topics identified</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function EntityBadge({ label, type }: any) {
    return (
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${type === 'tech' ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400' : 'bg-primary-500/5 border-primary-500/20 text-primary-400'}`}>
            {label}
        </span>
    );
}

function TopicBadge({ label, weight }: any) {
    return (
        <div className="flex items-center gap-2 group">
            <span className="text-[10px] font-bold text-gray-300">{label}</span>
            <div className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-secondary-500" style={{ width: `${weight * 100}%` }} />
            </div>
        </div>
    );
}
