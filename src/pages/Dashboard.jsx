import React, { useState, useEffect } from 'react';
import { MODULES, TOTAL_COEF } from '../constants';
import GradeInput from '../components/GradeInput';
import ResultCard from '../components/ResultCard';
import Navbar from '../components/Navbar';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RotateCcw, Sparkles } from 'lucide-react';
import AIAssistant from '../components/AIAssistant';

function Dashboard() {
    const [grades, setGrades] = useState({});
    const [average, setAverage] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { currentUser } = useAuth();
    const toast = useToast();

    // Load grades from localStorage on mount
    useEffect(() => {
        if (currentUser) {
            const savedGrades = localStorage.getItem(`grades_${currentUser.uid}`);
            if (savedGrades) {
                try {
                    setGrades(JSON.parse(savedGrades));
                } catch (error) {
                    console.error('Error loading saved grades:', error);
                }
            }
        }
    }, [currentUser]);

    // Save grades to localStorage whenever they change
    useEffect(() => {
        if (currentUser && Object.keys(grades).length > 0) {
            localStorage.setItem(`grades_${currentUser.uid}`, JSON.stringify(grades));
        }
    }, [grades, currentUser]);

    const handleGradeChange = (id, value) => {
        if (value === '') {
            setGrades(prev => ({ ...prev, [id]: '' }));
            return;
        }

        let numValue = parseFloat(value);
        if (numValue > 20) value = '20';
        if (numValue < 0) value = '0';

        setGrades(prev => ({
            ...prev,
            [id]: value
        }));
    };

    useEffect(() => {
        let totalScore = 0;

        MODULES.forEach(mod => {
            const grade = parseFloat(grades[mod.id]) || 0;
            totalScore += grade * mod.coef;
        });

        setAverage(totalScore / TOTAL_COEF);
    }, [grades]);

    const saveToFirebase = async () => {
        if (!currentUser) {
            toast.error('You must be logged in to save results');
            return;
        }

        // Check if there are any grades entered
        const hasGrades = Object.values(grades).some(grade => grade !== '' && grade !== '0');
        if (!hasGrades) {
            toast.error('Please enter at least one grade before saving');
            return;
        }

        try {
            setIsSaving(true);
            await addDoc(collection(db, `users/${currentUser.uid}/calculations`), {
                average: parseFloat(average.toFixed(2)),
                details: grades,
                semester: 'Semester 1',
                createdAt: serverTimestamp()
            });
            toast.success('Calculation saved successfully!');
        } catch (error) {
            console.error("Error adding document: ", error);
            toast.error('Failed to save calculation. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const loadLastCalculation = async () => {
        if (!currentUser) {
            toast.error('You must be logged in to load calculations');
            return;
        }

        try {
            setIsLoading(true);
            const q = query(
                collection(db, `users/${currentUser.uid}/calculations`),
                orderBy('createdAt', 'desc'),
                limit(1)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const lastCalc = querySnapshot.docs[0].data();
                setGrades(lastCalc.details || {});
                toast.success('Last calculation loaded successfully!');
            } else {
                toast.info('No saved calculations found');
            }
        } catch (error) {
            console.error("Error loading calculation: ", error);
            toast.error('Failed to load calculation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const [showAI, setShowAI] = useState(false);

    // ... (existing functions)

    return (
        <div className="min-h-screen">
            <Navbar />

            <AIAssistant
                isOpen={showAI}
                onClose={() => setShowAI(false)}
                grades={grades}
                overview={{
                    average: parseFloat(average.toFixed(2)),
                    highest: Object.entries(grades).length > 0 ? (Math.max(...Object.values(grades).map(v => parseFloat(v) || 0))).toFixed(2) : '0',
                    lowest: Object.entries(grades).length > 0 ? (Math.min(...Object.values(grades).map(v => parseFloat(v) || 0))).toFixed(2) : '0'
                }}
            />

            <div className="p-4 md:p-8 flex flex-col items-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-10 w-full"
                >
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                        Semester 1
                    </h1>
                    <p className="text-gray-400 text-lg uppercase tracking-wider">Average Calculator</p>
                    <p className="text-gray-500 text-sm mt-2">
                        Welcome back, <span className="text-purple-400 font-semibold">{currentUser?.email?.split('@')[0]}</span>
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                    {/* Modules List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <h2 className="text-xl font-semibold text-white">Modules</h2>
                            <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                                Total Coef: {TOTAL_COEF}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {MODULES.map(mod => (
                                <GradeInput
                                    key={mod.id}
                                    module={mod}
                                    value={grades[mod.id] || ''}
                                    onChange={handleGradeChange}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Result Panel */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            {/* Load Last Calculation Button */}
                            <button
                                onClick={loadLastCalculation}
                                disabled={isLoading}
                                className="w-full mb-4 bg-white/5 hover:bg-white/10 border border-white/20 text-gray-300 hover:text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <RotateCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                {isLoading ? 'Loading...' : 'Load Last Calculation'}
                            </button>

                            <ResultCard
                                average={average}
                                onSave={saveToFirebase}
                                isSaving={isSaving}
                            />

                            {/* AI Analysis Button */}
                            <div className="mt-4">
                                <button
                                    onClick={() => setShowAI(true)}
                                    className="w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/40 hover:to-pink-600/40 border border-purple-500/30 text-purple-200 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group backdrop-blur-sm"
                                >
                                    <Sparkles className="w-5 h-5 group-hover:text-yellow-300 transition-colors" />
                                    Get AI Insights
                                </button>
                            </div>

                            <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                                <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase">Statistics</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Highest Module</span>
                                        <span className="text-white">
                                            {Object.entries(grades).length > 0 ?
                                                (Math.max(...Object.values(grades).map(v => parseFloat(v) || 0))).toFixed(2)
                                                : '0.00'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Lowest Module</span>
                                        <span className="text-white">
                                            {Object.entries(grades).length > 0 ?
                                                (Math.min(...Object.values(grades).map(v => parseFloat(v) || 0))).toFixed(2)
                                                : '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
