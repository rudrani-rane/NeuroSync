import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Trash2, Search, Lightbulb, BarChart3, RefreshCw } from 'lucide-react';

export default function AnalystView() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);

    React.useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/analyst/stats');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const runOperation = async (operation: string) => {
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch(`http://127.0.0.1:8000/analyst/${operation}`, {
                method: 'POST'
            });
            const data = await res.json();
            setResult(data);
            fetchStats(); // Refresh stats after operation
        } catch (err) {
            console.error(`Operation ${operation} failed:`, err);
            setResult({ status: 'error', message: String(err) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Brain className="w-8 h-8 text-purple-400" />
                    Cognitive Analyst
                </h1>
                <p className="text-gray-400">Advanced operations and insights for your knowledge graph</p>
            </div>

            {/* Stats Dashboard */}
            {stats && (
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Total Memories</div>
                        <div className="text-2xl font-bold text-white">{stats.total_memories}</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Relationships</div>
                        <div className="text-2xl font-bold text-white">{stats.total_relationships}</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Graph Density</div>
                        <div className="text-2xl font-bold text-white">{(stats.graph_density * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Scopes</div>
                        <div className="text-2xl font-bold text-white">{Object.keys(stats.memories_by_scope || {}).length}</div>
                    </div>
                </div>
            )}

            {/* Operations */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => runOperation('cleanup')}
                    disabled={loading}
                    className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/50 p-6 rounded-xl hover:border-red-400 transition-all disabled:opacity-50"
                >
                    <Trash2 className="w-8 h-8 text-red-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Cleanup Orphan Nodes</h3>
                    <p className="text-sm text-gray-400">Remove disconnected memories with no relationships</p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => runOperation('find_gaps')}
                    disabled={loading}
                    className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/50 p-6 rounded-xl hover:border-blue-400 transition-all disabled:opacity-50"
                >
                    <Search className="w-8 h-8 text-blue-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Find Logic Gaps</h3>
                    <p className="text-sm text-gray-400">Discover missing connections between related topics</p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => runOperation('generate_hypotheses')}
                    disabled={loading}
                    className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/50 p-6 rounded-xl hover:border-purple-400 transition-all disabled:opacity-50"
                >
                    <Lightbulb className="w-8 h-8 text-purple-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Generate Hypotheses</h3>
                    <p className="text-sm text-gray-400">AI-powered insights from your knowledge patterns</p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => runOperation('neural_mapping')}
                    disabled={loading}
                    className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border border-indigo-500/50 p-6 rounded-xl hover:border-indigo-400 transition-all disabled:opacity-50"
                >
                    <RefreshCw className="w-8 h-8 text-indigo-400 mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">Neural Mapping</h3>
                    <p className="text-sm text-gray-400">Synthesize semantic connections across your entire graph</p>
                </motion.button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 text-center">
                    <RefreshCw className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-400">Processing cognitive operation...</p>
                </div>
            )}

            {/* Results */}
            {result && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="w-6 h-6 text-green-400" />
                        <h3 className="text-xl font-semibold text-white">Operation Results</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Status</div>
                            <div className={`text-lg font-semibold ${result.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {result.status}
                            </div>
                        </div>

                        {result.message && (
                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                <div className="text-sm text-gray-400 mb-1">Message</div>
                                <div className="text-white">{result.message}</div>
                            </div>
                        )}

                        {result.hypotheses && (
                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                <div className="text-sm text-gray-400 mb-2">Generated Hypotheses</div>
                                <ul className="space-y-2">
                                    {result.hypotheses.map((h: string, i: number) => (
                                        <li key={i} className="text-white">{h}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.gaps && (
                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                <div className="text-sm text-gray-400 mb-2">Logic Gaps Found: {result.gaps_found}</div>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {result.gaps.slice(0, 10).map((gap: any, i: number) => (
                                        <div key={i} className="text-sm text-gray-300 p-2 bg-gray-800/50 rounded">
                                            <span className="text-purple-400">Shared topics:</span> {gap.shared_topics.join(', ')}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.deleted_count !== undefined && (
                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                <div className="text-sm text-gray-400 mb-1">Nodes Cleaned</div>
                                <div className="text-2xl font-bold text-red-400">{result.deleted_count}</div>
                            </div>
                        )}

                        {result.created_count !== undefined && (
                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                <div className="text-sm text-gray-400 mb-1">Relationships Created</div>
                                <div className="text-2xl font-bold text-indigo-400">{result.created_count}</div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
