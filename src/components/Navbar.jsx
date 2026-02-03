import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, History, Calculator, UserCircle, Settings } from 'lucide-react';

const Navbar = () => {
    const { currentUser, userProfile, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Calculator className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            S1 Calculator
                        </span>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className={`text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all ${location.pathname === '/' ? 'bg-white/10 text-white' : ''
                                }`}
                        >
                            Calculator
                        </button>
                        <button
                            onClick={() => navigate('/history')}
                            className={`text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2 ${location.pathname === '/history' ? 'bg-white/10 text-white' : ''
                                }`}
                        >
                            <History className="w-4 h-4" />
                            History
                        </button>

                        {/* User Menu */}
                        <div className="relative ml-4 pl-4 border-l border-white/20">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-all"
                            >
                                {userProfile?.photoURL ? (
                                    <img
                                        src={userProfile.photoURL}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <span className="text-sm text-gray-300 hidden sm:block">
                                    {userProfile?.displayName || currentUser?.email?.split('@')[0]}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
                                    >
                                        <button
                                            onClick={() => {
                                                navigate('/profile');
                                                setShowDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                                        >
                                            <UserCircle className="w-4 h-4" />
                                            Profile
                                        </button>
                                        <div className="h-px bg-white/10"></div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setShowDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
