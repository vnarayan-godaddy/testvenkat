'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

interface MetricResult {
  metricId: string;
  metricName: string;
  controlValue: number;
  treatmentValue: number;
  relativeDifference: number;
  pValue: number;
  isSignificant: boolean;
  category: 'decision' | 'guardrail' | 'informative';
}

interface ExperimentMetrics {
  experimentId: string;
  experimentName: string;
  result: 'win' | 'loss' | 'inconclusive' | undefined;
  duration: number;
  sampleSize: { control: number; treatment: number };
  decisionMetric: MetricResult | null;
  guardrailMetrics: MetricResult[];
}

// Metrics data extracted from the Hivemind analysis results
const experimentsMetrics: ExperimentMetrics[] = [
  {
    experimentId: "airo_plus_pricing_experiment",
    experimentName: "Airo Plus Pricing",
    result: 'win',
    duration: 36.12,
    sampleSize: { control: 24777, treatment: 25211 },
    decisionMetric: {
      metricId: "airo_plus_conversion",
      metricName: "Airo Plus Conversion",
      controlValue: 0.00593,
      treatmentValue: 0.01123,
      relativeDifference: 0.89203,
      pValue: 0,
      isSignificant: true,
      category: 'decision'
    },
    guardrailMetrics: [
      {
        metricId: "new_airo_plus_gcr",
        metricName: "Airo Plus GCR",
        controlValue: 0.7088,
        treatmentValue: 0.67204,
        relativeDifference: -0.05187,
        pValue: 0.74189,
        isSignificant: false,
        category: 'guardrail'
      }
    ]
  },
  {
    experimentId: "wam_heuristics_pricing_experiment",
    experimentName: "WAM Heuristics Pricing",
    result: 'win',
    duration: 29.55,
    sampleSize: { control: 14309, treatment: 14585 },
    decisionMetric: {
      metricId: "wam_conversion",
      metricName: "W+M Conversion",
      controlValue: 0.27123,
      treatmentValue: 0.28742,
      relativeDifference: 0.05969,
      pValue: 0.00217,
      isSignificant: true,
      category: 'decision'
    },
    guardrailMetrics: [
      {
        metricId: "new_wam_gcr",
        metricName: "W+M GCR",
        controlValue: 21.91088,
        treatmentValue: 21.78574,
        relativeDifference: -0.00571,
        pValue: 0.88411,
        isSignificant: false,
        category: 'guardrail'
      },
      {
        metricId: "gcr_new_purchases",
        metricName: "GCR New Purchases",
        controlValue: 41.41486,
        treatmentValue: 41.27336,
        relativeDifference: -0.00342,
        pValue: 0.88411,
        isSignificant: false,
        category: 'guardrail'
      }
    ]
  },
  {
    experimentId: "wam_in_app_ftp_test",
    experimentName: "WAM In-App FTP",
    result: 'inconclusive',
    duration: 27.79,
    sampleSize: { control: 30548, treatment: 29941 },
    decisionMetric: {
      metricId: "wam_conversion",
      metricName: "W+M Conversion",
      controlValue: 0.09005,
      treatmentValue: 0.08761,
      relativeDifference: -0.0272,
      pValue: 0.57956,
      isSignificant: false,
      category: 'decision'
    },
    guardrailMetrics: [
      {
        metricId: "new_wam_receipts",
        metricName: "W+M Receipts",
        controlValue: 9.35407,
        treatmentValue: 9.28191,
        relativeDifference: -0.00771,
        pValue: 0.41071,
        isSignificant: false,
        category: 'guardrail'
      }
    ]
  },
  {
    experimentId: "serp_domain_pricing_test_ca",
    experimentName: "Domain Pricing (CA)",
    result: 'loss',
    duration: 39.63,
    sampleSize: { control: 437480, treatment: 436146 },
    decisionMetric: {
      metricId: "new_domain_name_reg_units",
      metricName: "New Domain Units",
      controlValue: 0.06269,
      treatmentValue: 0.06167,
      relativeDifference: -0.0163,
      pValue: 0.25852,
      isSignificant: false,
      category: 'decision'
    },
    guardrailMetrics: [
      {
        metricId: "new_purchase_gcr_amt",
        metricName: "New Purchase GCR",
        controlValue: 3.36642,
        treatmentValue: 3.30074,
        relativeDifference: -0.01951,
        pValue: 0.27557,
        isSignificant: false,
        category: 'guardrail'
      },
      {
        metricId: "two_plus_customer_rate",
        metricName: "2+ Customer Rate",
        controlValue: 0.24968,
        treatmentValue: 0.2491,
        relativeDifference: -0.00232,
        pValue: 0.39829,
        isSignificant: false,
        category: 'guardrail'
      }
    ]
  },
  {
    experimentId: "serp_domain_pricing_test_de",
    experimentName: "Domain Pricing (DE)",
    result: 'loss',
    duration: 43.68,
    sampleSize: { control: 229215, treatment: 229630 },
    decisionMetric: {
      metricId: "units_purchased_new",
      metricName: "New Units Purchased",
      controlValue: 0.06133,
      treatmentValue: 0.06262,
      relativeDifference: 0.02099,
      pValue: 0.38381,
      isSignificant: false,
      category: 'decision'
    },
    guardrailMetrics: [
      {
        metricId: "new_purchase_gcr_amt",
        metricName: "New Purchase GCR",
        controlValue: 0.77103,
        treatmentValue: 0.76962,
        relativeDifference: -0.00183,
        pValue: 0.71221,
        isSignificant: false,
        category: 'guardrail'
      },
      {
        metricId: "two_plus_customer_rate",
        metricName: "2+ Customer Rate",
        controlValue: 0.05025,
        treatmentValue: 0.04969,
        relativeDifference: -0.01108,
        pValue: 0.58014,
        isSignificant: false,
        category: 'guardrail'
      }
    ]
  }
];

const formatPercent = (value: number, isRelative = false): string => {
  if (isRelative) {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${(value * 100).toFixed(2)}%`;
  }
  return `${(value * 100).toFixed(2)}%`;
};

const formatNumber = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  if (value < 0.01 && value > 0) return value.toExponential(2);
  if (value >= 1) return value.toFixed(2);
  return (value * 100).toFixed(2) + '%';
};

const ResultBadge = ({ result }: { result: 'win' | 'loss' | 'inconclusive' | undefined }) => {
  if (!result) return null;
  
  const config = {
    win: { icon: CheckCircle, bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    loss: { icon: XCircle, bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
    inconclusive: { icon: Minus, bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' }
  };
  
  const { icon: Icon, bg, text, border } = config[result];
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text} border ${border}`}>
      <Icon className="w-3 h-3" />
      {result.charAt(0).toUpperCase() + result.slice(1)}
    </div>
  );
};

const MetricRow = ({ metric, showLabels = false }: { metric: MetricResult; showLabels?: boolean }) => {
  const isPositive = metric.relativeDifference > 0;
  const Icon = isPositive ? TrendingUp : metric.relativeDifference < 0 ? TrendingDown : Minus;
  
  return (
    <div className="grid grid-cols-5 gap-2 py-2 text-sm items-center border-b border-gray-800/50 last:border-0">
      <div className="font-medium text-gray-300 truncate" title={metric.metricName}>
        {metric.metricName}
      </div>
      <div className="text-center text-gray-400">
        {formatNumber(metric.controlValue)}
      </div>
      <div className="text-center text-gray-300">
        {formatNumber(metric.treatmentValue)}
      </div>
      <div className={`text-center flex items-center justify-center gap-1 ${
        isPositive ? 'text-emerald-400' : metric.relativeDifference < 0 ? 'text-rose-400' : 'text-gray-400'
      }`}>
        <Icon className="w-3 h-3" />
        {formatPercent(metric.relativeDifference, true)}
      </div>
      <div className="text-center">
        {metric.isSignificant ? (
          <span className="text-emerald-400 font-medium">✓ Sig</span>
        ) : (
          <span className="text-gray-500">NS</span>
        )}
      </div>
    </div>
  );
};

export default function MetricsComparison() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
          <BarChart3 className="w-5 h-5 text-violet-400" />
        </div>
        <h2 className="text-xl font-semibold text-white">Key Metrics Comparison</h2>
      </div>

      {/* Horizontal scrollable container for the comparison table */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1200px]">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 mb-4">
            {experimentsMetrics.map((exp, index) => (
              <motion.div
                key={exp.experimentId}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-4 border border-gray-700/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white text-sm leading-tight">
                    {exp.experimentName}
                  </h3>
                  <ResultBadge result={exp.result} />
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
                  <span>{exp.duration.toFixed(0)} days</span>
                  <span className="text-gray-600">|</span>
                  <span>{((exp.sampleSize.control + exp.sampleSize.treatment) / 1000).toFixed(0)}K users</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-5 gap-4">
            {experimentsMetrics.map((exp, expIndex) => (
              <motion.div
                key={exp.experimentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + expIndex * 0.1 }}
                className="space-y-3"
              >
                {/* Decision Metric Card */}
                {exp.decisionMetric && (
                  <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/50">
                    <div className="text-xs font-medium text-violet-400 mb-2 uppercase tracking-wide">
                      Decision Metric
                    </div>
                    <div className="text-sm font-medium text-white mb-1">
                      {exp.decisionMetric.metricName}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-gray-400">
                        <span className="text-gray-500">C:</span> {formatNumber(exp.decisionMetric.controlValue)}
                        <span className="mx-1 text-gray-600">→</span>
                        <span className="text-gray-500">T:</span> {formatNumber(exp.decisionMetric.treatmentValue)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className={`flex items-center gap-1 text-sm font-semibold ${
                        exp.decisionMetric.relativeDifference > 0 ? 'text-emerald-400' : 
                        exp.decisionMetric.relativeDifference < 0 ? 'text-rose-400' : 'text-gray-400'
                      }`}>
                        {exp.decisionMetric.relativeDifference > 0 ? <TrendingUp className="w-4 h-4" /> : 
                         exp.decisionMetric.relativeDifference < 0 ? <TrendingDown className="w-4 h-4" /> : 
                         <Minus className="w-4 h-4" />}
                        {formatPercent(exp.decisionMetric.relativeDifference, true)}
                      </div>
                      {exp.decisionMetric.isSignificant ? (
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          Significant
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded">
                          Not Sig (p={exp.decisionMetric.pValue.toFixed(2)})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Guardrail Metrics */}
                {exp.guardrailMetrics.length > 0 && (
                  <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/30">
                    <div className="text-xs font-medium text-amber-400/80 mb-2 uppercase tracking-wide">
                      Guardrails
                    </div>
                    <div className="space-y-2">
                      {exp.guardrailMetrics.slice(0, 2).map((metric) => (
                        <div key={metric.metricId} className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 truncate mr-2">{metric.metricName}</span>
                          <span className={`flex items-center gap-0.5 ${
                            metric.relativeDifference > 0 ? 'text-emerald-400' : 
                            metric.relativeDifference < 0 ? 'text-rose-400' : 'text-gray-400'
                          }`}>
                            {metric.relativeDifference > 0 ? <TrendingUp className="w-3 h-3" /> : 
                             metric.relativeDifference < 0 ? <TrendingDown className="w-3 h-3" /> : 
                             <Minus className="w-3 h-3" />}
                            {formatPercent(metric.relativeDifference, true)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Stats */}
                <div className="bg-gray-900/40 rounded-lg p-3 border border-gray-800/50">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-gray-500">Control</div>
                      <div className="text-gray-300 font-medium">{(exp.sampleSize.control / 1000).toFixed(1)}K</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Treatment</div>
                      <div className="text-gray-300 font-medium">{(exp.sampleSize.treatment / 1000).toFixed(1)}K</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-500 mt-4 pt-4 border-t border-gray-800/50">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span>Positive lift</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingDown className="w-3 h-3 text-rose-400" />
          <span>Negative lift</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-emerald-400">Sig</span>
          <span>= Statistically Significant (p &lt; α)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">C</span>
          <span>= Control</span>
          <span className="ml-2 text-gray-500">T</span>
          <span>= Treatment</span>
        </div>
      </div>
    </motion.div>
  );
}
