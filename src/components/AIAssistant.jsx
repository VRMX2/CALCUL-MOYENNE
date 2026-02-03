import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeGrades } from '../services/ai';
import { useToast } from '../context/ToastContext';

const AIAssistant = ({ isOpen, onClose, grades, overview }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const toast = useToast();

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const { MODULES } = await import('../constants');

            const gradeList = MODULES.map(mod => ({
                name: mod.name,
                value: grades[mod.id] || '0',
                coef: mod.coef
            })).filter(g => g.value !== '' && g.value !== '0');

            if (gradeList.length === 0) {
                toast.error("Please enter some grades first!");
                setLoading(false);
                return;
            }

            const response = await analyzeGrades(null, gradeList, overview);
            setResult(response);
        } catch (e) {
            console.error(e);
            toast.error("Analysis failed. Ensure the Python backend is running!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[80vh] bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">AI Academic Advisor</h2>
                                    <p className="text-xs text-purple-300">Powered by Gemini (Python Backend)</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="space-y-6">
                                {!result && !loading && (
                                    <div className="text-center py-8">
                                        <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4 animate-pulse" />
                                        <h3 className="text-xl font-medium text-white mb-2">Ready to Analyze</h3>
                                        <p className="text-gray-400 mb-6">
                                            I will analyze your current grades ({Object.values(grades).filter(g => g !== '').length} entered)
                                            and provide a personalized study strategy.
                                        </p>
                                        <button
                                            onClick={handleAnalyze}
                                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 mx-auto"
                                        >
                                            <Sparkles className="w-5 h-5" />
                                            Analyze Results
                                        </button>
                                    </div>
                                )}

                                {loading && (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                                        <p className="text-purple-300 animate-pulse">Consulting the digital oracle...</p>
                                    </div>
                                )}

                                {result && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="prose prose-invert max-w-none bg-black/20 p-6 rounded-xl border border-white/5"
                                    >
                                        <ReactMarkdown>{result}</ReactMarkdown>

                                        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
                                            <button
                                                onClick={() => setResult('')}
                                                className="text-sm text-gray-400 hover:text-white transition-colors"
                                            >
                                                Start New Analysis
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AIAssistant;
