import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
};

const colorMap = {
    success: 'from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-200',
    error: 'from-red-500/20 to-rose-500/20 border-red-500/50 text-red-200',
    warning: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-200',
    info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-200'
};

const iconColorMap = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
};

const Toast = ({ toast }) => {
    const { removeToast } = useToast();
    const Icon = iconMap[toast.type] || Info;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`bg-gradient-to-r ${colorMap[toast.type]} backdrop-blur-xl border rounded-xl p-4 shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${iconColorMap[toast.type]}`} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

const ToastContainer = () => {
    const { toasts } = useToast();

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
