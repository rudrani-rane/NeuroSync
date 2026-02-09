import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    thoughts?: string;
    sources?: any[];
}

const RecallView = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hello! I'm your cognitive assistant. Ask me anything about your saved memories.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:8000/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: input })
            });
            const data = await res.json();

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response || "Neural link stable, but no matching context found.",
                sender: 'bot',
                thoughts: data.thoughts,
                sources: data.sources
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            setMessages(prev => [...prev, { id: 'err', text: "Neural synchronization error. Is the gateway active?", sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto p-6">
            <div className="flex-1 overflow-y-auto space-y-6 pr-4 no-scrollbar">
                <AnimatePresence>
                    {messages.map((m) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 ${m.sender === 'user' ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white/5'}`}>
                                    {m.sender === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-blue-400" />}
                                </div>
                                <div className="space-y-3">
                                    <div className={`p-4 rounded-[24px] text-sm leading-relaxed ${m.sender === 'user' ? 'bg-blue-600/10 border border-blue-500/20 text-white' : 'glass text-gray-200'}`}>
                                        {m.text}
                                    </div>

                                    {m.thoughts && (
                                        <div className="text-[10px] text-gray-500 italic px-4 font-medium flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" />
                                            Deep Research: {m.thoughts.substring(0, 100)}...
                                        </div>
                                    )}

                                    {m.sources && m.sources.length > 0 && (
                                        <div className="flex flex-wrap gap-2 px-1">
                                            {m.sources.map((src: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold text-gray-400 hover:text-white transition-colors cursor-help" title={src.content}>
                                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                    Memory {idx + 1}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {loading && (
                    <div className="flex justify-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center animate-pulse">
                            <Bot className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="p-4 rounded-[24px] glass border border-white/5 flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 relative drop-shadow-2xl">
                <div className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-[#030305] to-transparent pointer-events-none" />
                <div className="flex gap-4 p-2.5 glass rounded-[32px] border border-white/10 shadow-2xl bg-white/[0.02]">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Interrogate your cognitive network..."
                            className="w-full bg-transparent border-none py-4 px-6 text-white placeholder:text-gray-600 outline-none font-medium"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-500/50" />
                        </div>
                    </div>
                    <button
                        onClick={handleSend}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-[24px] shadow-xl shadow-blue-500/10 transition-all active:scale-95 border border-white/10"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecallView;
