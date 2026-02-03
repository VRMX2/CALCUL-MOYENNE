import React from 'react';
import { motion } from 'framer-motion';
import { Network, Users, Cpu, Briefcase, Code, Globe, Database, BookOpen } from 'lucide-react';

const icons = {
    Network: Network,
    Users: Users,
    Cpu: Cpu,
    Briefcase: Briefcase,
    Code: Code,
    Globe: Globe,
    Database: Database,
};

const GradeInput = ({ module, value, onChange }) => {
    const Icon = icons[module.icon] || BookOpen;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 hover:bg-white/15 transition-all"
        >
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
                <Icon className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1">
                <h3 className="font-semibold text-white text-lg">{module.name}</h3>
                <span className="text-sm text-gray-300">Coefficient: {module.coef}</span>
            </div>

            <div className="relative">
                <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    placeholder="0.00"
                    value={value}
                    onChange={(e) => onChange(module.id, e.target.value)}
                    className="w-24 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-right text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-lg"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none pr-1">/20</span>
            </div>
        </motion.div>
    );
};

export default GradeInput;
