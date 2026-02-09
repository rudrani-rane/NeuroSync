import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Mic, Brain, Hash, Globe, Lock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const LogView = () => {
    const [content, setContent] = useState('');
    const [scope, setScope] = useState('personal');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSave = async () => {
        if (!content.trim()) return;
        setLoading(true);
        setStatus('idle');

        try {
            const formData = new URLSearchParams();
            formData.append('content', content);
            formData.append('brain_scope', scope);

            const res = await fetch('http://localhost:8000/ingestion/ingest/text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            if (!res.ok) throw new Error("Ingestion error");

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#06b6d4']
            });

            setContent('');
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-white mb-2">Log Your Day</h2>
                    <p className="text-gray-500 text-sm font-medium">Capture thoughts, meetings, or observations directly into your cognitive network.</p>
                </div>
                <div className="flex gap-2 bg-white/5 p-1.5 rounded-[20px] border border-white/5">
                    <ScopeButton active={scope === 'personal'} onClick={() => setScope('personal')} icon={Lock} label="Personal" />
                    <ScopeButton active={scope === 'global'} onClick={() => setScope('global')} icon={Globe} label="Global" />
                </div>
            </div>

            <div className="glass rounded-[32px] p-2 border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type or speak - anything here is added to your Episodic Memory and synthesized into your Knowledge Graph."
                    className="w-full min-h-[300px] bg-black/20 rounded-[28px] p-8 text-lg text-white placeholder:text-gray-600 outline-none resize-none font-medium leading-relaxed"
                />

                <div className="flex items-center justify-between p-4 px-6 bg-white/[0.02] border-t border-white/5 rounded-b-[32px]">
                    <div className="flex gap-4">
                        <button className="p-3 glass rounded-2xl text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-white/5">
                            <Mic className="w-5 h-5" />
                        </button>
                        <button className="p-3 glass rounded-2xl text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all border border-white/5">
                            <Hash className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        {status === 'success' && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-green-400 text-xs font-black uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4" />
                                Synchronized
                            </motion.div>
                        )}
                        {status === 'error' && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-red-400 text-xs font-black uppercase tracking-widest">
                                <AlertCircle className="w-4 h-4" />
                                Sync Failed
                            </motion.div>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className={`flex items-center gap-3 px-8 py-4 rounded-[22px] font-black text-sm uppercase tracking-widest transition-all ${loading ? 'bg-gray-800 text-gray-500' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20 border border-white/10 active:scale-95'}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Commit Memory
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <QuickTip icon={Brain} title="Proactive Synthesis" description="NeuraLink will automatically cluster this memory with related engineering notes overnight." />
                <QuickTip icon={Sparkles} title="Contextual Magic" description="Mention names or projects to automatically link them in the 3D Brain Map." />
            </div>
        </div>
    );
};

function ScopeButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
        >
            <Icon className="w-3.5 h-3.5" />
            {label}
        </button>
    );
}

function QuickTip({ icon: Icon, title, description }: any) {
    return (
        <div className="p-6 glass rounded-3xl border border-white/5 flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-blue-500" />
            </div>
            <div>
                <h4 className="text-sm font-black text-white mb-1">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{description}</p>
            </div>
        </div>
    );
}

export default LogView;
