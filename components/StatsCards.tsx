'use client';

import { motion } from 'framer-motion';
import { 
  Beaker, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle,
  Zap,
  Star
} from 'lucide-react';
import { Experiment } from '@/types/experiment';

interface StatsCardsProps {
  experiments: Experiment[];
}

export default function StatsCards({ experiments }: StatsCardsProps) {
  const totalExperiments = experiments.length;
  const wins = experiments.filter(e => e.experiment_end_state?.result === 'win').length;
  const losses = experiments.filter(e => e.experiment_end_state?.result === 'loss').length;
  const inconclusive = experiments.filter(e => e.experiment_end_state?.result === 'inconclusive').length;
  const running = experiments.filter(e => !e.experiment_end_state?.result).length;
  const totalVotes = experiments.reduce((acc, e) => acc + (e.votes || 0), 0);

  const stats = [
    {
      label: 'Total Experiments',
      value: totalExperiments,
      icon: Beaker,
      color: 'from-hive-500/20 to-hive-600/10',
      iconColor: 'text-hive-400',
      borderColor: 'border-hive-500/20'
    },
    {
      label: 'Wins',
      value: wins,
      icon: TrendingUp,
      color: 'from-green-500/20 to-green-600/10',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/20'
    },
    {
      label: 'Losses',
      value: losses,
      icon: TrendingDown,
      color: 'from-red-500/20 to-red-600/10',
      iconColor: 'text-red-400',
      borderColor: 'border-red-500/20'
    },
    {
      label: 'Inconclusive',
      value: inconclusive,
      icon: HelpCircle,
      color: 'from-yellow-500/20 to-yellow-600/10',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/20'
    },
    {
      label: 'Running',
      value: running,
      icon: Zap,
      color: 'from-blue-500/20 to-blue-600/10',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/20'
    },
    {
      label: 'Total Votes',
      value: totalVotes,
      icon: Star,
      color: 'from-nectar-500/20 to-nectar-600/10',
      iconColor: 'text-nectar-400',
      borderColor: 'border-nectar-500/20'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`glass rounded-xl p-4 border ${stat.borderColor}`}
          >
            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.color} mb-3`}>
              <Icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
