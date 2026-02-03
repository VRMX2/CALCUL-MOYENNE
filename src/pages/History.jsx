import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trash2, TrendingUp } from 'lucide-react';

const History = () => {
    const [calculations, setCalculations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const { currentUser } = useAuth();
    const toast = useToast();

    useEffect(() => {
        fetchHistory();
    }, [currentUser]);

    const fetchHistory = async () => {
        if (!currentUser) return;

        try {
            const q = query(
                collection(db, `users/${currentUser.uid}/calculations`),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCalculations(data);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, `users/${currentUser.uid}/calculations`, id));
            setCalculations(prev => prev.filter(calc => calc.id !== id));
            toast.success('Calculation deleted successfully');
        } catch (error) {
            console.error('Error deleting calculation:', error);
            toast.error('Failed to delete calculation');
        }
    };

    const openDeleteModal = (id) => {
        setDeleteModal({ isOpen: true, id });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, id: null });
    };

    const confirmDelete = () => {
        if (deleteModal.id) {
            handleDelete(deleteModal.id);
        }
    };

    const getGradeColor = (grade) => {
        if (grade >= 16) return 'from-green-400 to-emerald-600';
        if (grade >= 14) return 'from-blue-400 to-cyan-600';
        if (grade >= 10) return 'from-yellow-400 to-orange-600';
        return 'from-red-400 to-rose-600';
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                        Calculation History
                    </h1>
                    <p className="text-gray-400">
                        View and manage your past semester averages
                    </p>
                </motion.div>

                {calculations.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No calculations yet</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Start calculating your semester average to see your history here
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {calculations.map((calc, index) => (
                                <motion.div
                                    key={calc.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getGradeColor(calc.average)}`}>
                                                    {calc.average.toFixed(2)}
                                                </span>
                                                <span className="text-gray-500 text-xl">/20</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(calc.createdAt)}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => openDeleteModal(calc.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Delete Calculation?"
                message="Are you sure you want to delete this calculation? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default History;
