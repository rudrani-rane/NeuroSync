import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Eye,
    Zap,
    Brain,
    Wand2,
    Image as ImageIcon,
    FileSearch,
    BrainCircuit,
    Sparkles,
    CheckCircle2,
    Lock,
    Shield
} from 'lucide-react';

export default function VisionView() {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [mode, setMode] = useState<'manual' | 'auto'>('auto');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [ocr, setOcr] = useState(true);
    const [scene, setScene] = useState(true);
    const [objects, setObjects] = useState(true);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        setStatus('idle');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('brain_scope', 'personal'); // Default for vision hub for now
            formData.append('tags', `vision,${ocr ? 'ocr,' : ''}${scene ? 'scene,' : ''}${objects ? 'objects' : ''}`);
            formData.append('ocr', ocr.toString());
            formData.append('scene', scene.toString());
            formData.append('objects', objects.toString());

            const res = await fetch('http://127.0.0.1:8000/ingestion/ingest/file', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error("Vision integration failed");

            const data = await res.json();
            console.log("Vision Analysis Success:", data);

            // Success feedback
            setStatus('success');
            setTimeout(() => {
                setFile(null);
                setStatus('idle');
            }, 3000);

        } catch (err) {
            console.error(err);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />
            <div className="flex items-end justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary-400 font-bold text-xs uppercase tracking-[0.2em]">
                        <Eye className="w-4 h-4" />
                        Visual Cognition
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Vision Hub</h1>
                    <p className="text-gray-500 max-w-xl">
                        Upload images, diagrams, or whiteboards. NeuraLink will extract text and
                        generate semantic descriptions using advanced vision models.
                    </p>
                </div>

                <div className="flex bg-gray-800/50 p-1 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setMode('auto')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${mode === 'auto' ? 'bg-primary-500 text-white' : 'text-gray-500'}`}
                    >
                        <Zap className="w-4 h-4" /> AI Analysis
                    </button>
                    <button
                        onClick={() => setMode('manual')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${mode === 'manual' ? 'bg-primary-500 text-white' : 'text-gray-500'}`}
                    >
                        <Brain className="w-4 h-4" /> Manual Meta
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`glass-card min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed transition-all p-12 text-center relative ${dragActive ? 'border-primary-500 bg-primary-500/5' : 'border-white/5'}`}
                    >
                        {file ? (
                            <div className="space-y-6 w-full">
                                <div className="aspect-ratio bg-black/40 rounded-3xl overflow-hidden flex items-center justify-center relative group max-h-[400px]">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        className="max-h-[400px] w-auto object-contain"
                                        alt="Upload preview"
                                    />
                                    <button
                                        onClick={() => setFile(null)}
                                        className="absolute top-4 right-4 p-3 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="p-3 bg-primary-500/10 rounded-xl text-primary-400">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-200">{file.name}</p>
                                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {status !== 'idle' && (
                                            <span className={`text-xs font-bold uppercase tracking-widest ${status === 'success' ? 'text-success-500' : 'text-error-500'}`}>
                                                {status === 'success' ? 'Linked to Knowledge Graph' : 'Analysis Failed'}
                                            </span>
                                        )}
                                        <button
                                            onClick={handleAnalyze}
                                            className="btn-brand px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2"
                                            disabled={loading}
                                        >
                                            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                            Analyze Image
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-24 h-24 rounded-3xl bg-gray-800 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                    <Upload className="w-10 h-10 text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-100 mb-2">Drop image to start analysis</h3>
                                    <p className="text-sm text-gray-500">Supports PNG, JPG, and WebP up to 25MB</p>
                                </div>
                                <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-300">
                                    Browse Files
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-card p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <BrainCircuit className="w-5 h-5 text-secondary-400" />
                            <h3 className="font-bold text-gray-50">Vision Parameters</h3>
                        </div>
                        <div className="space-y-4">
                            <Toggle
                                label="OCR Extraction"
                                description="Identify and extract printed text"
                                active={ocr}
                                onChange={setOcr}
                            />
                            <Toggle
                                label="Scene Description"
                                description="Generate natural language details"
                                active={scene}
                                onChange={setScene}
                            />
                            <Toggle
                                label="Object Recognition"
                                description="Tag entities and items found"
                                active={objects}
                                onChange={setObjects}
                            />
                        </div>
                    </div>

                    <div className="glass-card p-6 border-primary-500/20 bg-primary-500/5">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="w-5 h-5 text-primary-400" />
                            <h3 className="text-sm font-bold text-gray-50">Did you know?</h3>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            NeuraLink Vision can understand <span className="text-primary-400">whiteboard diagrams</span> and
                            automatically convert them into <span className="text-primary-400">structured nodes</span> in your
                            knowledge graph.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Toggle({ label, description, active, onChange }: any) {
    return (
        <label className="flex items-center justify-between cursor-pointer group">
            <div className="pr-4">
                <p className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">{label}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{description}</p>
            </div>
            <div
                onClick={() => onChange?.(!active)}
                className={`w-10 h-6 rounded-full p-1 transition-all ${active ? 'bg-primary-600' : 'bg-gray-800 border border-white/5'}`}
            >
                <div className={`w-4 h-4 bg-white rounded-full transition-all ${active ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </label>
    );
}

const Trash2 = (props: any) => (
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
        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
    </svg>
);
