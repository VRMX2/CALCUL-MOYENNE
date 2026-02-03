import React from 'react';
import { motion } from 'framer-motion';

const ResultCard = ({ average, onSave, isSaving }) => {
    const getGradeColor = (grade) => {
        if (grade >= 16) return 'from-green-400 to-emerald-600';
        if (grade >= 14) return 'from-blue-400 to-cyan-600';
        if (grade >= 10) return 'from-yellow-400 to-orange-600';
        return 'from-red-400 to-rose-600';
    };

    const gradeColor = getGradeColor(average);

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden"
        >
            <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${gradeColor} blur-3xl rounded-full transform -translate-y-1/2`}></div>

            <h2 className="text-gray-300 mb-2 uppercase tracking-widest text-sm font-semibold">Moyenne Générale</h2>

            <div className="relative z-10 my-6">
                <span className={`text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradeColor}`}>
                    {average.toFixed(2)}
                </span>
                <span className="text-2xl text-gray-500 font-medium ml-2">/20</span>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    {isSaving ? (
                        'Saving...'
                    ) : (
                        <>
                            Save Result
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default ResultCard;
