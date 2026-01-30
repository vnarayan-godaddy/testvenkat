'use client';

import { motion } from 'framer-motion';
import { Hexagon, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  showcaseMonth: string;
}

export default function Header({ onRefresh, isLoading, showcaseMonth }: HeaderProps) {
  // Format showcase month
  const formatMonth = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return monthStr;
    }
  };

  return (
    <header className="glass border-b border-slate-700/50 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-hive-500 to-nectar-500 rounded-xl blur-lg opacity-50" />
              <div className="relative p-3 bg-gradient-to-br from-hive-500 to-hive-600 rounded-xl">
                <Hexagon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>
            
            <div>
              <h1 className="text-xl font-bold">
                <span className="gradient-text">Hivemind</span>
                <span className="text-white"> Experiments</span>
              </h1>
              <p className="text-sm text-gray-500">
                Showcase: {formatMonth(showcaseMonth)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-sm text-gray-300 transition-smooth disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
