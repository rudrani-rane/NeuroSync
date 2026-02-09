import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Upload, FileText, Globe, CheckCircle2, AlertCircle, Sparkles, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const IngestView = () => {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [manualText, setManualText] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleIngest = async (type: 'youtube' | 'manual') => {
        const content = type === 'youtube' ? youtubeUrl : manualText;
        if (!content.trim()) return;

        setLoading(true);
        setStatus('idle');

        try {
            const formData = new URLSearchParams();
            formData.append('content', content);
            formData.append('brain_scope', 'global');
            if (type === 'youtube') formData.append('source_url', youtubeUrl);

            const res = await fetch('http://localhost:8000/ingestion/ingest/text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData
            });

            if (!res.ok) throw new Error("Ingestion failure");

            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.8 },
                colors: ['#a855f7', '#3b82f6']
            });

            if (type === 'youtube') setYoutubeUrl('');
            else setManualText('');

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
            <div>
                <h2 className="text-3xl font-black tracking-tight text-white mb-2">Transcript Sources</h2>
                <p className="text-gray-500 text-sm font-medium">Extract transcripts from YouTube videos or paste meeting logs for neural synthesis.</p>
            </div>

            <div className="grid gap-8">
                {/* YouTube Card */}
                <div className="glass rounded-[32px] p-8 border border-white/5 neo-shadow relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Youtube className="w-24 h-24 text-red-500" />
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-red-500/10 rounded-xl">
                            <Youtube className="w-5 h-5 text-red-500" />
                        </div>
                        <h3 className="text-lg font-black text-white">YouTube Video</h3>
                    </div>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="Paste YouTube URL here (e.g., https://youtube.com/watch?v=...)"
                            className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-gray-700 outline-none focus:border-red-500/30 transition-all font-medium"
                        />
                        <button
                            onClick={() => handleIngest('youtube')}
                            disabled={loading}
                            className="px-8 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-500/10 border border-white/10 active:scale-95 transition-all disabled:opacity-50"
                        >
                            Fetch
                        </button>
                    </div>

                    <div className="flex gap-6 mt-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-5 h-5 rounded-md border border-white/10 bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center p-1 transition-all">
                                <div className="w-full h-full bg-red-500 rounded-sm opacity-100" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300">Translate to English</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-5 h-5 rounded-md border border-white/10 bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center p-1 transition-all">
                                <div className="w-full h-full bg-red-500 rounded-sm opacity-100" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300">Use local Whisper model</span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center gap-4 py-2">
                    <div className="h-[1px] flex-1 bg-white/5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700">OR paste manually</span>
                    <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                {/* Manual Text Card */}
                <div className="glass rounded-[32px] p-8 border border-white/5 neo-shadow relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl">
                            <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-black text-white">Direct Transcript</h3>
                    </div>

                    <textarea
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        placeholder="Paste full transcript here... Meeting notes, document content, or long-form thoughts."
                        className="w-full min-h-[200px] bg-black/40 border border-white/5 rounded-[24px] p-6 text-white placeholder:text-gray-700 outline-none focus:border-blue-500/30 transition-all font-medium resize-none mb-6"
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="w-5 h-5 rounded-md border border-white/10 bg-white/5 group-hover:bg-blue-500/20 flex items-center justify-center p-1 transition-all">
                                    <div className="w-full h-full bg-blue-500 rounded-sm" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300">Shared Knowledge</span>
                            </label>
                            <select className="bg-white/5 border border-white/5 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-400 outline-none focus:border-blue-500/30">
                                <option>General</option>
                                <option>Engineering</option>
                                <option>Strategy</option>
                            </select>
                        </div>

                        <button
                            onClick={() => handleIngest('manual')}
                            disabled={loading}
                            className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-[20px] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/10 border border-white/10 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <Wand2 className="w-4 h-4" />
                            Distill & Save
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {status !== 'idle' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-12 right-12 z-50 p-6 rounded-[24px] shadow-2xl border transition-all ${status === 'success' ? 'glass border-green-500/20 text-green-400' : 'glass border-red-500/20 text-red-400'}`}
                    >
                        <div className="flex items-center gap-4">
                            {status === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                            <div>
                                <p className="font-black text-sm uppercase tracking-widest">{status === 'success' ? 'Ingestion Imminent' : 'Sync Terminated'}</p>
                                <p className="text-xs font-medium opacity-60">{status === 'success' ? 'Neural pathways are being updated successfully.' : 'An error occurred during cognitive transfer.'}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IngestView;
