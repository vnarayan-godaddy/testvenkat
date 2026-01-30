'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Beaker, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle, 
  Zap,
  Users,
  Target,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Star,
  ExternalLink
} from 'lucide-react';
import { Experiment } from '@/types/experiment';
import clsx from 'clsx';

interface ExperimentDetailProps {
  experiment: Experiment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExperimentDetail({ experiment, isOpen, onClose }: ExperimentDetailProps) {
  if (!experiment) return null;

  const result = experiment.experiment_end_state?.result;
  
  const getStatusConfig = () => {
    switch (result) {
      case 'win':
        return { 
          icon: TrendingUp, 
          label: 'Win', 
          className: 'status-win',
          description: 'This experiment achieved its success criteria'
        };
      case 'loss':
        return { 
          icon: TrendingDown, 
          label: 'Loss', 
          className: 'status-loss',
          description: 'This experiment did not meet its goals'
        };
      case 'inconclusive':
        return { 
          icon: HelpCircle, 
          label: 'Inconclusive', 
          className: 'status-inconclusive',
          description: 'Results were not statistically significant'
        };
      default:
        return { 
          icon: Zap, 
          label: 'Running', 
          className: 'status-running',
          description: 'This experiment is currently active'
        };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;
  const experimentId = experiment.id || experiment.experiment_id || 'Unknown';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl glass z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 glass border-b border-slate-700/50 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-hive-500/20 to-hive-600/10 border border-hive-500/30">
                    <Beaker className="w-6 h-6 text-hive-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{experimentId}</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">
                        {experiment.metadata?.business_unit || 'General'}
                      </span>
                      <div className={clsx('px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5', status.className)}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={clsx('p-4 rounded-xl border', status.className)}>
                <div className="flex items-center gap-3">
                  <StatusIcon className="w-5 h-5" />
                  <div>
                    <div className="font-medium">{status.label}</div>
                    <div className="text-sm opacity-80">{status.description}</div>
                  </div>
                </div>
              </div>

              {/* Votes */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-nectar-500/10 border border-nectar-500/20">
                <Star className="w-6 h-6 text-nectar-400 fill-nectar-400" />
                <div>
                  <div className="text-2xl font-bold text-nectar-400">{experiment.votes || 0}</div>
                  <div className="text-sm text-gray-400">Showcase Votes</div>
                </div>
              </div>

              {/* Hypothesis */}
              {experiment.hypothesis && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-nectar-400" />
                    Hypothesis
                  </h3>
                  
                  {experiment.hypothesis.change && (
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-xs text-hive-400 uppercase tracking-wider mb-2 font-medium">
                        Change
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {experiment.hypothesis.change}
                      </p>
                    </div>
                  )}

                  {experiment.hypothesis.expectation && (
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-xs text-green-400 uppercase tracking-wider mb-2 font-medium flex items-center gap-2">
                        <ArrowRight className="w-3 h-3" />
                        Expectation
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {experiment.hypothesis.expectation}
                      </p>
                    </div>
                  )}

                  {experiment.hypothesis.reason && (
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-xs text-purple-400 uppercase tracking-wider mb-2 font-medium">
                        Reason
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {experiment.hypothesis.reason}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Metrics */}
              {experiment.analysis_configuration && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-hive-400" />
                    Metrics
                  </h3>

                  {experiment.analysis_configuration.decision_metrics && 
                   experiment.analysis_configuration.decision_metrics.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-xs text-hive-400 uppercase tracking-wider mb-3 font-medium">
                        Decision Metrics
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {experiment.analysis_configuration.decision_metrics.map((metric, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1.5 bg-hive-500/20 border border-hive-500/30 rounded-lg text-sm text-hive-300 font-mono"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {experiment.analysis_configuration.guardrail_metrics && 
                   experiment.analysis_configuration.guardrail_metrics.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-xs text-yellow-400 uppercase tracking-wider mb-3 font-medium flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        Guardrail Metrics
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {experiment.analysis_configuration.guardrail_metrics.map((metric, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-sm text-yellow-300 font-mono"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {experiment.analysis_configuration.scorecard_template && (
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">
                        Scorecard Template
                      </div>
                      <span className="font-mono text-gray-300">
                        {experiment.analysis_configuration.scorecard_template}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Owners */}
              {experiment.metadata?.owners && experiment.metadata.owners.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-hive-400" />
                    Owners
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {experiment.metadata.owners.map((owner, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-gray-300"
                      >
                        @{owner}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Open in Hivemind */}
              <div className="pt-4">
                <a
                  href={`https://hivemind.godaddy.com/experiment/${experimentId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-hive-500 hover:bg-hive-600 text-white rounded-lg font-medium transition-colors"
                >
                  Open in Hivemind
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
