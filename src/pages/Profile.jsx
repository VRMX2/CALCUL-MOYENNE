import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { User, Mail, Calendar as CalendarIcon, TrendingUp, Settings, Save } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, query, getDocs } from 'firebase/firestore';

const Profile = () => {
    const { currentUser, logout } = useAuth();
    const toast = useToast();
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [stats, setStats] = useState({
        totalCalculations: 0,
        averageGrade: 0,
        highestGrade: 0,
        lowestGrade: 0
    });

    useEffect(() => {
        fetchUserData();
        fetchStats();
    }, [currentUser]);

    const fetchUserData = async () => {
        if (!currentUser) return;

        try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
                setDisplayName(userDoc.data().displayName || '');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        if (!currentUser) return;

        try {
            const q = query(collection(db, `users/${currentUser.uid}/calculations`));
            const querySnapshot = await getDocs(q);
            const calculations = querySnapshot.docs.map(doc => doc.data());

            if (calculations.length > 0) {
                const grades = calculations.map(calc => calc.average);
                setStats({
                    totalCalculations: calculations.length,
                    averageGrade: (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2),
                    highestGrade: Math.max(...grades).toFixed(2),
                    lowestGrade: Math.min(...grades).toFixed(2)
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSave = async () => {
        if (!currentUser) return;

        setSaving(true);
        try {
            await setDoc(doc(db, 'users', currentUser.uid), {
                displayName,
                email: currentUser.email,
                updatedAt: new Date()
            }, { merge: true });
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const getJoinDate = () => {
        if (!currentUser?.metadata?.creationTime) return 'N/A';
        return new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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
                        Profile Settings
                    </h1>
                    <p className="text-gray-400">
                        Manage your account information and preferences
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Settings className="w-6 h-6 text-purple-400" />
                                <h2 className="text-xl font-bold text-white">Account Information</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Display Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    />
                                </div>

                                {/* Email (Read-only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-lg px-4 py-3">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-300">{currentUser?.email}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                {/* Join Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Member Since
                                    </label>
                                    <div className="flex items-center gap-3 bg-black/20 border border-white/10 rounded-lg px-4 py-3">
                                        <CalendarIcon className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-300">{getJoinDate()}</span>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Statistics Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">
                                {displayName || currentUser?.email?.split('@')[0]}
                            </h3>
                            <p className="text-sm text-gray-400">{currentUser?.email}</p>
                        </motion.div>

                        {/* Statistics */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <TrendingUp className="w-5 h-5 text-purple-400" />
                                <h3 className="text-lg font-bold text-white">Statistics</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Total Calculations</span>
                                    <span className="text-lg font-bold text-white">{stats.totalCalculations}</span>
                                </div>
                                <div className="h-px bg-white/10"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Average Grade</span>
                                    <span className="text-lg font-bold text-purple-400">{stats.averageGrade}</span>
                                </div>
                                <div className="h-px bg-white/10"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Highest Grade</span>
                                    <span className="text-lg font-bold text-green-400">{stats.highestGrade}</span>
                                </div>
                                <div className="h-px bg-white/10"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Lowest Grade</span>
                                    <span className="text-lg font-bold text-red-400">{stats.lowestGrade}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
