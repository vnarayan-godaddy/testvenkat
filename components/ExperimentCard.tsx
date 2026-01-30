'use client';

import { motion } from 'framer-motion';
import { 
  Beaker, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle, 
  Zap,
  Users,
  Target,
  ChevronRight,
  Star
} from 'lucide-react';
import { Experiment } from '@/types/experiment';
import clsx from 'clsx';

interface ExperimentCardProps {
  experiment: Experiment;
  index: number;
  onClick: () => void;
}

export default function ExperimentCard({ experiment, index, onClick }: ExperimentCardProps) {
  const result = experiment.experiment_end_state?.result;
  
  const getStatusConfig = () => {
    switch (result) {
      case 'win':
        return { 
          icon: TrendingUp, 
          label: 'Win', 
          className: 'status-win',
          bgGlow: 'rgba(63, 185, 80, 0.1)'
        };
      case 'loss':
        return { 
          icon: TrendingDown, 
          label: 'Loss', 
          className: 'status-loss',
          bgGlow: 'rgba(248, 81, 73, 0.1)'
        };
      case 'inconclusive':
        return { 
          icon: HelpCircle, 
          label: 'Inconclusive', 
          className: 'status-inconclusive',
          bgGlow: 'rgba(210, 153, 34, 0.1)'
        };
      default:
        return { 
          icon: Zap, 
          label: 'Running', 
          className: 'status-running',
          bgGlow: 'rgba(0, 164, 166, 0.1)'
        };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;
  const experimentId = experiment.id || experiment.experiment_id || 'Unknown';
  const businessUnit = experiment.metadata?.business_unit || 'General';
  const owners = experiment.metadata?.owners || [];
  const votes = experiment.votes || 0;
  
  // Truncate hypothesis for card view
  const hypothesisChange = experiment.hypothesis?.change || '';
  const truncatedHypothesis = hypothesisChange.length > 120 
    ? hypothesisChange.substring(0, 120) + '...' 
    : hypothesisChange;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="glass glass-hover card-glow rounded-xl p-5 cursor-pointer group"
      style={{ '--glow-color': status.bgGlow } as React.CSSProperties}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-hive-500/20 to-hive-600/10 border border-hive-500/20">
            <Beaker className="w-5 h-5 text-hive-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight line-clamp-1 group-hover:text-hive-400 transition-colors">
              {experimentId}
            </h3>
            <span className="text-xs text-gray-500">{businessUnit}</span>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={clsx('px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5', status.className)}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </div>
      </div>

      {/* Hypothesis Preview */}
      {truncatedHypothesis && (
        <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2">
          {truncatedHypothesis}
        </p>
      )}

      {/* Metrics */}
      {experiment.analysis_configuration?.decision_metrics && 
       experiment.analysis_configuration.decision_metrics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {experiment.analysis_configuration.decision_metrics.slice(0, 3).map((metric, i) => (
            <span 
              key={i}
              className="px-2 py-0.5 bg-slate-800/50 border border-slate-700/50 rounded text-xs text-gray-400 font-mono"
            >
              {metric}
            </span>
          ))}
          {experiment.analysis_configuration.decision_metrics.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-gray-500">
              +{experiment.analysis_configuration.decision_metrics.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
        <div className="flex items-center gap-4">
          {/* Votes */}
          <div className="flex items-center gap-1.5 text-nectar-500">
            <Star className="w-4 h-4 fill-nectar-500" />
            <span className="text-sm font-medium">{votes}</span>
          </div>
          
          {/* Owners */}
          {owners.length > 0 && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <Users className="w-4 h-4" />
              <span className="text-xs">{owners.length}</span>
            </div>
          )}
        </div>

        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-hive-400 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
}
