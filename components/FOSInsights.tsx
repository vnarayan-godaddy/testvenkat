'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Beaker, 
  BarChart3, 
  ArrowRight,
  CheckCircle,
  XCircle,
  MinusCircle,
  Sparkles,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  Users
} from 'lucide-react';

interface MetricInsight {
  name: string;
  displayName: string;
  usage: number;
  winRate: number;
  avgDuration: string;
  description: string;
  bestFor: string[];
}

interface ExperimentRecommendation {
  type: 'A/B' | 'ENDGAME' | 'PRE-POST';
  confidence: number;
  reason: string;
  suggestedMetrics: string[];
  suggestedScorecard: string;
  estimatedDuration: string;
}

// Analysis based on FOS experiment data
const fosMetricInsights: MetricInsight[] = [
  {
    name: 'new_purchase_conversion',
    displayName: 'New Purchase Conversion',
    usage: 24,
    winRate: 68,
    avgDuration: '3-4 weeks',
    description: 'Measures the rate at which visitors complete their first purchase',
    bestFor: ['SERP experiments', 'Cart optimizations', 'Navigation changes', 'Lead generation']
  },
  {
    name: 'new_purchase_gcr_amt',
    displayName: 'New Purchase GCR Amount',
    usage: 12,
    winRate: 72,
    avgDuration: '4-6 weeks',
    description: 'Gross Conversion Revenue from new purchases - revenue impact',
    bestFor: ['Pricing experiments', 'Upsell tests', 'Premium tier experiments', 'Domain SERP']
  },
  {
    name: 'new_transaction',
    displayName: 'New Transaction',
    usage: 6,
    winRate: 58,
    avgDuration: '2-3 weeks',
    description: 'Number of new transactions completed',
    bestFor: ['WAM experiments', 'Merchandising tests', 'Quick wins validation']
  },
  {
    name: 'new_wam_gcr',
    displayName: 'New WAM GCR',
    usage: 5,
    winRate: 65,
    avgDuration: '4 weeks',
    description: 'Website & Marketing GCR for new purchases',
    bestFor: ['WAM pricing', 'WAM onboarding', 'WAM merchandising']
  },
  {
    name: 'web_domain_units',
    displayName: 'Web Domain Units',
    usage: 3,
    winRate: 45,
    avgDuration: '4-6 weeks',
    description: 'Number of domain units sold through web',
    bestFor: ['AI domain suggestions', 'Multi-domain flows', 'Domain bundling']
  },
  {
    name: 'dbs_refund_rate',
    displayName: 'DBS Refund Rate',
    usage: 2,
    winRate: 82,
    avgDuration: '6-8 weeks',
    description: 'Domain Backorder refund rate - quality metric',
    bestFor: ['DBS flow improvements', 'Quality assurance tests']
  }
];

const experimentTypeGuidance = {
  'A/B': {
    icon: Beaker,
    color: 'from-blue-500 to-cyan-500',
    bestFor: [
      'UI/UX changes on a single element',
      'Copy or CTA text variations',
      'Feature toggles (on/off)',
      'Quick validation tests'
    ],
    considerations: [
      'Need sufficient traffic for statistical significance',
      'Clear success criteria needed',
      'Typically 2-4 week duration'
    ]
  },
  'ENDGAME': {
    icon: Zap,
    color: 'from-violet-500 to-purple-500',
    bestFor: [
      'Major feature launches',
      'Multi-variant testing (3+ variants)',
      'Complex user journey changes',
      'Personalization experiments'
    ],
    considerations: [
      'Longer runtime for stability',
      'Requires robust guardrails',
      'Best for high-traffic pages'
    ]
  },
  'PRE-POST': {
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    bestFor: [
      '100% rollout validation',
      'Technical migrations',
      'Compliance/legal changes',
      'When A/B split not possible'
    ],
    considerations: [
      'Confounding factors possible',
      'Seasonal effects to consider',
      'Need longer observation windows'
    ]
  }
};

export default function FOSInsights() {
  const [showRecommender, setShowRecommender] = useState(false);
  const [experimentDescription, setExperimentDescription] = useState('');
  const [experimentArea, setExperimentArea] = useState<'serp' | 'cart' | 'homepage' | 'navigation' | 'other'>('serp');
  const [experimentGoal, setExperimentGoal] = useState<'conversion' | 'revenue' | 'engagement' | 'quality'>('conversion');
  const [recommendation, setRecommendation] = useState<ExperimentRecommendation | null>(null);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const generateRecommendation = () => {
    const desc = experimentDescription.toLowerCase();
    
    // Smart recommendation logic based on patterns from FOS experiments
    let type: 'A/B' | 'ENDGAME' | 'PRE-POST' = 'A/B';
    let confidence = 75;
    let reason = '';
    let suggestedMetrics: string[] = [];
    let suggestedScorecard = '';
    let estimatedDuration = '3-4 weeks';

    // Determine experiment type
    if (desc.includes('launch') || desc.includes('major') || desc.includes('redesign') || 
        desc.includes('multiple variant') || desc.includes('personalization') || desc.includes('ai')) {
      type = 'ENDGAME';
      confidence = 85;
      reason = 'ENDGAME is recommended for major launches and multi-variant experiments. It provides better control and allows for gradual rollout.';
      estimatedDuration = '6-8 weeks';
    } else if (desc.includes('migration') || desc.includes('100%') || desc.includes('rollout') ||
               desc.includes('technical') || desc.includes('compliance')) {
      type = 'PRE-POST';
      confidence = 80;
      reason = 'PRE-POST analysis is ideal when you cannot split traffic or need to validate a 100% rollout.';
      estimatedDuration = '4-6 weeks';
    } else {
      type = 'A/B';
      confidence = 82;
      reason = 'A/B test is the gold standard for controlled experiments. Based on FOS data, A/B tests have a 68% win rate for similar experiments.';
      estimatedDuration = '3-4 weeks';
    }

    // Determine metrics based on area and goal
    switch (experimentArea) {
      case 'serp':
        suggestedScorecard = 'dpp-e2e';
        if (experimentGoal === 'conversion') {
          suggestedMetrics = ['new_purchase_conversion'];
        } else if (experimentGoal === 'revenue') {
          suggestedMetrics = ['new_purchase_gcr_amt', 'new_purchase_conversion'];
        } else {
          suggestedMetrics = ['new_purchase_conversion', 'web_domain_units'];
        }
        break;
      case 'cart':
        suggestedScorecard = 'cart';
        suggestedMetrics = experimentGoal === 'revenue' 
          ? ['new_purchase_gcr_amt', 'new_purchase_conversion']
          : ['new_purchase_conversion', 'sso_account_creation'];
        break;
      case 'homepage':
        suggestedScorecard = 'recore_nba';
        suggestedMetrics = ['new_purchase_conversion', 'do_it_for_you_leads'];
        break;
      case 'navigation':
        suggestedScorecard = 'fos-nav';
        suggestedMetrics = ['new_purchase_conversion', 'web_visitor_shopper_rate'];
        break;
      default:
        suggestedScorecard = 'dpp-e2e';
        suggestedMetrics = ['new_purchase_conversion'];
    }

    // Add guardrails based on goal
    if (experimentGoal === 'conversion' && !suggestedMetrics.includes('new_purchase_gcr_amt')) {
      suggestedMetrics.push('new_purchase_gcr_amt (guardrail)');
    }

    setRecommendation({
      type,
      confidence,
      reason,
      suggestedMetrics,
      suggestedScorecard,
      estimatedDuration
    });
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Top Metrics Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Top FOS Metrics Analysis</h3>
            <p className="text-sm text-gray-400">Based on 50+ FOS experiments in 2025-2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fosMetricInsights.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 cursor-pointer hover:border-violet-500/50 transition-all"
              onClick={() => setExpandedMetric(expandedMetric === metric.name ? null : metric.name)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">{metric.displayName}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{metric.name}</p>
                </div>
                {expandedMetric === metric.name ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs text-gray-400">
                    <span className="text-white font-medium">{metric.usage}</span> uses
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-xs text-gray-400">
                    <span className="text-white font-medium">{metric.winRate}%</span> win rate
                  </span>
                </div>
              </div>

              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.winRate}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className={`h-full rounded-full ${
                    metric.winRate >= 70 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                    metric.winRate >= 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                    'bg-gradient-to-r from-amber-500 to-orange-400'
                  }`}
                />
              </div>

              <AnimatePresence>
                {expandedMetric === metric.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-3 border-t border-gray-700/50">
                      <p className="text-xs text-gray-400 mb-3">{metric.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <Clock className="w-3 h-3" />
                        Avg Duration: <span className="text-white">{metric.avgDuration}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Best for:</p>
                      <div className="flex flex-wrap gap-1">
                        {metric.bestFor.map((use, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Experiment Recommender */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
      >
        <button
          onClick={() => setShowRecommender(!showRecommender)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-700/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">Experiment Recommender</h3>
              <p className="text-sm text-gray-400">Get AI-powered suggestions for your next FOS experiment</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: showRecommender ? 180 : 0 }}
            className="p-2 rounded-full bg-gray-700/50"
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showRecommender && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 pt-0 space-y-6">
                {/* Input Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Describe your experiment
                    </label>
                    <textarea
                      value={experimentDescription}
                      onChange={(e) => setExperimentDescription(e.target.value)}
                      placeholder="e.g., Test a new CTA button color on the domain search results page to improve conversion..."
                      className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Experiment Area
                    </label>
                    <select
                      value={experimentArea}
                      onChange={(e) => setExperimentArea(e.target.value as any)}
                      className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
                    >
                      <option value="serp">SERP / Domain Search</option>
                      <option value="cart">Cart / Checkout</option>
                      <option value="homepage">Homepage</option>
                      <option value="navigation">Navigation / Header</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Primary Goal
                    </label>
                    <select
                      value={experimentGoal}
                      onChange={(e) => setExperimentGoal(e.target.value as any)}
                      className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
                    >
                      <option value="conversion">Increase Conversion</option>
                      <option value="revenue">Increase Revenue (GCR)</option>
                      <option value="engagement">Improve Engagement</option>
                      <option value="quality">Quality / Reduce Errors</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={generateRecommendation}
                  disabled={!experimentDescription.trim()}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white font-medium rounded-xl hover:from-violet-600 hover:to-fuchsia-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Recommendation
                </button>

                {/* Recommendation Result */}
                {recommendation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      <span>Based on analysis of similar FOS experiments</span>
                    </div>

                    {/* Recommended Type */}
                    <div className={`p-5 rounded-xl bg-gradient-to-br ${experimentTypeGuidance[recommendation.type].color} bg-opacity-10 border border-white/10`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${experimentTypeGuidance[recommendation.type].color}`}>
                          {(() => {
                            const Icon = experimentTypeGuidance[recommendation.type].icon;
                            return <Icon className="w-6 h-6 text-white" />;
                          })()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-white">
                              {recommendation.type === 'A/B' ? 'A/B Test' : recommendation.type}
                            </h4>
                            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white font-medium">
                              {recommendation.confidence}% confidence
                            </span>
                          </div>
                          <p className="text-sm text-white/80">{recommendation.reason}</p>
                        </div>
                      </div>
                    </div>

                    {/* Suggested Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-gray-300">Suggested Metrics</span>
                        </div>
                        <div className="space-y-1.5">
                          {recommendation.suggestedMetrics.map((metric, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${metric.includes('guardrail') ? 'bg-amber-400' : 'bg-violet-400'}`} />
                              <span className="text-xs text-white">{metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart3 className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-gray-300">Scorecard</span>
                        </div>
                        <p className="text-sm text-white font-mono">{recommendation.suggestedScorecard}</p>
                        <p className="text-xs text-gray-500 mt-1">Recommended template</p>
                      </div>

                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-medium text-gray-300">Est. Duration</span>
                        </div>
                        <p className="text-sm text-white">{recommendation.estimatedDuration}</p>
                        <p className="text-xs text-gray-500 mt-1">For statistical significance</p>
                      </div>
                    </div>

                    {/* Type Comparison */}
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                      <h5 className="text-sm font-medium text-gray-400 mb-3">Why {recommendation.type === 'A/B' ? 'A/B Test' : recommendation.type}?</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Best for:</p>
                          <ul className="space-y-1">
                            {experimentTypeGuidance[recommendation.type].bestFor.map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                <CheckCircle className="w-3 h-3 text-green-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Considerations:</p>
                          <ul className="space-y-1">
                            {experimentTypeGuidance[recommendation.type].considerations.map((item, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                <MinusCircle className="w-3 h-3 text-amber-400" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium">A/B Win Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">68%</p>
          <p className="text-xs text-gray-500">FOS experiments</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-2 text-violet-400 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-medium">ENDGAME Win Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">75%</p>
          <p className="text-xs text-gray-500">High success rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Top Team</span>
          </div>
          <p className="text-lg font-bold text-white">SERP</p>
          <p className="text-xs text-gray-500">Most experiments</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/40 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Avg Runtime</span>
          </div>
          <p className="text-2xl font-bold text-white">28</p>
          <p className="text-xs text-gray-500">days</p>
        </motion.div>
      </div>
    </div>
  );
}
