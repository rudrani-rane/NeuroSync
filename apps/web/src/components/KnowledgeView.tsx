import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Mic,
    Link as LinkIcon,
    Save,
    Globe,
    Lock,
    Shield,
    CheckCircle2,
    AlertCircle,
    Play,
    Square,
    Trash2,
    Youtube,
    FileSearch,
    Wand2,
    Plus,
    LayoutGrid,
    Cpu as CpuIcon,
    Users as UsersIcon,
    Wallet,
    Scale,
    Database as DbIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

type IngestMode = 'text' | 'audio' | 'url' | 'document';

const BRAIN_SCOPES = [
    { id: 'personal', name: 'Personal Brain', color: 'primary', icon: Lock },
    { id: 'work_engineering', name: 'Engineering', color: 'cyan', icon: CpuIcon },
    { id: 'work_hr', name: 'Human Resources', color: 'purple', icon: UsersIcon },
    { id: 'work_finance', name: 'Finance', color: 'success', icon: Wallet },
    { id: 'work_legal', name: 'Legal', color: 'gray', icon: Scale },
    { id: 'work_marketing', name: 'Marketing', color: 'error', icon: Globe },
];

export default function KnowledgeView() {
    const [mode, setMode] = useState<IngestMode>('text');
    const [content, setContent] = useState('');
    const [url, setUrl] = useState('');
    const [selectedScopes, setSelectedScopes] = useState<string[]>(['personal']);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [transcribe, setTranscribe] = useState(true);
    const [translate, setTranslate] = useState(false);
    const [lastResult, setLastResult] = useState<any>(null);
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (isRecording) {
            startRecording();
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            stopRecording();
            if (timerRef.current) clearInterval(timerRef.current);
            setRecordingTime(0);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                // Auto-ingest if user stopped recording? Or let them click ingest? 
                // User said "Everything on the tab, make sure it works". 
                // Let's make them click "Synthesize" for confirmation.
            };

            mediaRecorder.start();
        } catch (err) {
            console.error("Audio access denied", err);
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleScope = (id: string) => {
        if (id === 'personal' && selectedScopes.includes('personal') && selectedScopes.length > 1) {
            setSelectedScopes(selectedScopes.filter(s => s !== id));
            return;
        }
        if (selectedScopes.includes(id)) {
            setSelectedScopes(selectedScopes.filter(s => s !== id));
        } else {
            setSelectedScopes([...selectedScopes, id]);
        }
    };

    const handleIngest = async () => {
        if (mode === 'text' && !content.trim()) return;
        if (mode === 'url' && !url.trim()) return;
        if (mode === 'audio' && !audioBlob) return;

        setLoading(true);
        setStatus('idle');

        try {
            const formData = new FormData();

            // Loop through selected scopes and ingest to each
            const results = [];
            const baseUrl = 'http://127.0.0.1:8000';

            for (const scopeId of selectedScopes) {
                const scopeFormData = new FormData();
                scopeFormData.append('brain_scope', scopeId);
                scopeFormData.append('transcribe', transcribe.toString());

                let endpoint = '';
                if (mode === 'text') {
                    endpoint = `${baseUrl}/ingestion/ingest/text`;
                    scopeFormData.append('content', content);
                } else if (mode === 'url') {
                    endpoint = `${baseUrl}/ingestion/ingest/url`;
                    scopeFormData.append('url', url);
                    scopeFormData.append('translate', translate.toString());
                } else if (mode === 'audio') {
                    endpoint = `${baseUrl}/ingestion/ingest/audio`;
                    scopeFormData.append('transcribe', transcribe.toString());
                    if (audioBlob) {
                        scopeFormData.append('file', audioBlob, 'recording.webm');
                    }
                } else if (mode === 'document') {
                    endpoint = `${baseUrl}/ingestion/ingest/file`;
                    if (documentFile) {
                        scopeFormData.append('file', documentFile);
                    }
                }

                const res = await fetch(endpoint, {
                    method: 'POST',
                    body: scopeFormData,
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Neural Link Failure (${res.status}) for ${scopeId}: ${errorText}`);
                }

                const data = await res.json();
                results.push(data);
            }

            console.log("Ingestion Success:", results);
            setLastResult(results[0]); // Show first result as preview

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3B82F6', '#8B5CF6']
            });

            setContent('');
            setUrl('');
            setAudioBlob(null);
            setDocumentFile(null);
            setStatus('success');
            // Keep status longer if showing results
        } catch (err) {
            console.error(err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32">
            <AnimatePresence>
                {lastResult && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card p-6 border-success-500/20 bg-success-500/5 relative overflow-hidden group mb-8"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-success-500/10 blur-3xl rounded-full -translate-y-12 translate-x-12" />

                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-success-500/20 rounded-2xl text-success-400">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-100">Neural Integration Complete</h3>
                                    <p className="text-sm text-gray-500">Memory successfully indexed across {selectedScopes.length} brains</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setLastResult(null)}
                                className="p-2 text-gray-500 hover:text-white transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-black/40 rounded-2xl border border-white/5">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Wand2 className="w-3 h-3" />
                                Extraction Preview
                            </h4>
                            <p className="text-sm text-gray-300 italic line-clamp-3 leading-relaxed">
                                "{lastResult.transcript || lastResult.summary || lastResult.extracted || lastResult.content}"
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-400 font-bold text-xs uppercase tracking-[0.2em]">
                        <Plus className="w-4 h-4" />
                        Knowledge Acquisition
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Add Knowledge</h1>
                    <p className="text-gray-500 max-w-xl">
                        Capture thoughts, record audio, or import URLs. NeuraLink will automatically structure,
                        summarize, and integrate this into your selected brains.
                    </p>
                </div>

                <div className="flex bg-gray-800/50 p-1 rounded-2xl border border-white/5">
                    <ModeButton active={mode === 'text'} onClick={() => setMode('text')} icon={FileText} label="Text" />
                    <ModeButton active={mode === 'audio'} onClick={() => setMode('audio')} icon={Mic} label="Audio" />
                    <ModeButton active={mode === 'url'} onClick={() => setMode('url')} icon={LinkIcon} label="URL" />
                    <ModeButton active={mode === 'document'} onClick={() => setMode('document')} icon={FileSearch} label="Document" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card min-h-[400px] flex flex-col overflow-hidden">
                        <AnimatePresence mode="wait">
                            {mode === 'text' && (
                                <motion.div
                                    key="text"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 p-8 flex flex-col"
                                >
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Record your thoughts, meeting notes, or research findings..."
                                        className="flex-1 bg-transparent text-lg text-gray-100 placeholder:text-gray-600 outline-none resize-none font-medium leading-relaxed"
                                    />
                                </motion.div>
                            )}

                            {mode === 'audio' && (
                                <motion.div
                                    key="audio"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center p-8 space-y-8"
                                >
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-primary-500/20 rounded-full blur-3xl transition-opacity duration-500 ${isRecording ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
                                        <button
                                            onClick={() => setIsRecording(!isRecording)}
                                            className={`relative w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isRecording ? 'bg-error-500 border-error-600 shadow-2xl shadow-error-500/20' : 'bg-primary-600 border-primary-500 shadow-2xl shadow-primary-500/20 hover:scale-105'}`}
                                        >
                                            {isRecording ? <Square className="w-10 h-10 text-white fill-white" /> : <Mic className="w-10 h-10 text-white" />}
                                        </button>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-5xl font-mono font-bold tracking-tighter mb-2 ${isRecording ? 'text-white' : 'text-gray-500'}`}>
                                            {formatTime(recordingTime)}
                                        </div>
                                        <p className="text-sm font-medium text-gray-500">
                                            {isRecording ? 'NeuraLink is listening...' : 'Click to start neural audio capture'}
                                        </p>
                                        {!isRecording && audioBlob && (
                                            <div className="flex flex-col items-center gap-4 mt-6">
                                                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                                    <input
                                                        type="checkbox"
                                                        id="transcribe"
                                                        checked={transcribe}
                                                        onChange={(e) => setTranscribe(e.target.checked)}
                                                        className="w-4 h-4 rounded bg-gray-800 border-white/10 text-primary-500 focus:ring-primary-500/20"
                                                    />
                                                    <label htmlFor="transcribe" className="text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer">
                                                        Transcribe Audio
                                                    </label>
                                                </div>
                                                <button
                                                    onClick={() => setAudioBlob(null)}
                                                    className="text-[10px] font-bold text-error-400 uppercase tracking-[0.2em] hover:text-error-300 transition-colors"
                                                >
                                                    Discard Recording
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {mode === 'url' && (
                                <motion.div
                                    key="url"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 p-8 flex flex-col justify-center space-y-6"
                                >
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">Source Intelligence URL</label>
                                        <div className="relative flex items-center">
                                            <LinkIcon className="absolute left-6 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                placeholder="Paste YouTube, Wikipedia, or Blog URL..."
                                                className="w-full bg-gray-900/50 border border-white/5 rounded-2xl py-6 pl-16 pr-6 text-white placeholder:text-gray-700 outline-none focus:border-primary-500/50 transition-all font-medium text-lg"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-8">
                                            <div className="col-span-2 flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                                <input
                                                    type="checkbox"
                                                    id="translate"
                                                    checked={translate}
                                                    onChange={(e) => setTranslate(e.target.checked)}
                                                    className="w-4 h-4 rounded bg-gray-800 border-white/10 text-primary-500 focus:ring-primary-500/20"
                                                />
                                                <label htmlFor="translate" className="text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer flex-1">
                                                    Translate to English (for non-English videos)
                                                </label>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    alert("YouTube Synthesis activated. Please paste a YouTube URL to extract transcriptions and summaries.");
                                                    if (!url) setUrl("https://www.youtube.com/watch?v=example");
                                                }}
                                                className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center gap-4 hover:bg-white/[0.05] hover:border-white/20 transition-all text-left group"
                                            >
                                                <Youtube className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                                                <div className="text-xs">
                                                    <p className="font-bold text-gray-300">Video Synthesis</p>
                                                    <p className="text-gray-500">Transcribe & Summarize</p>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    alert("Web Intelligence activated. Please paste a blog or article URL for deep semantic extraction.");
                                                    if (!url) setUrl("https://medium.com/example-article");
                                                }}
                                                className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center gap-4 hover:bg-white/[0.05] hover:border-white/20 transition-all text-left group"
                                            >
                                                <Globe className="w-6 h-6 text-cyan-500 group-hover:scale-110 transition-transform" />
                                                <div className="text-xs">
                                                    <p className="font-bold text-gray-300">Web Scraping</p>
                                                    <p className="text-gray-500">Extract insights from blogs</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {mode === 'document' && (
                                <motion.div
                                    key="document"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex-1 flex flex-col items-center justify-center p-8 space-y-6"
                                >
                                    <div className="w-full max-w-md">
                                        <label
                                            htmlFor="document-upload"
                                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer bg-black/20 hover:bg-black/30 transition-all group"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FileSearch className="w-12 h-12 mb-4 text-gray-500 group-hover:text-primary-400 transition-colors" />
                                                <p className="mb-2 text-sm text-gray-400">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PDF, DOCX, TXT, or Markdown (MAX. 10MB)
                                                </p>
                                                {documentFile && (
                                                    <p className="mt-4 text-sm text-primary-400 font-medium">
                                                        Selected: {documentFile.name}
                                                    </p>
                                                )}
                                            </div>
                                            <input
                                                id="document-upload"
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.docx,.doc,.txt,.md"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setDocumentFile(file);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-6 bg-gray-800/30 border-t border-white/5 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            const res = await fetch('http://127.0.0.1:8000/analyst/neural_mapping', { method: 'POST' });
                                            const data = await res.json();
                                            alert(`Neural Mapping Complete: ${data.message}`);
                                        } catch (err) {
                                            alert("Failed to trigger neural mapping");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                    className="p-3 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-xl transition-all disabled:opacity-50"
                                    title="Knowledge Workflows"
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={async () => {
                                        const query = prompt("Enter deep search query:");
                                        if (!query) return;
                                        setLoading(true);
                                        try {
                                            const res = await fetch('http://127.0.0.1:8000/analyst/deep_search', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ query })
                                            });
                                            const data = await res.json();
                                            if (data.results && data.results.length > 0) {
                                                setLastResult({
                                                    content: `Deep Search Results for "${query}": Found ${data.results.length} related memories.`,
                                                    extracted: data.results.map((r: any) => r.content).join('\n\n')
                                                });
                                            } else {
                                                alert(data.message || "No results found");
                                            }
                                        } catch (err) {
                                            alert("Deep search failed");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={loading}
                                    className="p-3 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-xl transition-all disabled:opacity-50"
                                    title="Memory Deep Search"
                                >
                                    <FileSearch className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <AnimatePresence>
                                    {status !== 'idle' && (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${status === 'success' ? 'text-success-500' : 'text-error-500'}`}>
                                            {status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                            {status === 'success' ? 'Stored' : 'Failed'}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <button
                                    onClick={handleIngest}
                                    disabled={loading || (mode === 'text' && !content.trim()) || (mode === 'url' && !url.trim())}
                                    className="btn-brand px-10 py-3.5 rounded-xl text-sm font-bold flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            {mode === 'audio' ? 'Synthesize' : 'Ingest Memory'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 pb-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary-500/10 rounded-lg text-secondary-500">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-50">Brain Governance</h3>
                        </div>

                        <div className="space-y-2">
                            {BRAIN_SCOPES.map(scope => (
                                <button
                                    key={scope.id}
                                    onClick={() => toggleScope(scope.id)}
                                    className={`w-full group flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedScopes.includes(scope.id) ? 'bg-primary-500/10 border-primary-500/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg transition-colors ${selectedScopes.includes(scope.id) ? 'bg-primary-500 text-white' : 'bg-gray-800 text-gray-600'}`}>
                                            <scope.icon className="w-4 h-4" />
                                        </div>
                                        <span className={`text-sm font-bold ${selectedScopes.includes(scope.id) ? 'text-gray-100' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                            {scope.name}
                                        </span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedScopes.includes(scope.id) ? 'bg-primary-500 border-primary-500' : 'border-white/10'}`}>
                                        {selectedScopes.includes(scope.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ModeButton({ active, onClick, icon: Icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${active ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
}

const Sparkles = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
);
