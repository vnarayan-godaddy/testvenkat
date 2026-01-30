'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ExperimentCard from '@/components/ExperimentCard';
import ExperimentFilters from '@/components/ExperimentFilters';
import ExperimentDetail from '@/components/ExperimentDetail';
import StatsCards from '@/components/StatsCards';
import MetricsComparison from '@/components/MetricsComparison';
import FOSInsights from '@/components/FOSInsights';
import { Experiment, ExperimentFilters as FiltersType } from '@/types/experiment';
import { Loader2, User, Globe } from 'lucide-react';

// Your actual experiments from Hivemind (fetched via MCP)
const myExperiments: Experiment[] = [
  {
    id: "airo_plus_pricing_experiment",
    name: "Airo Plus Venture Home Pricing Experiment",
    hypothesis: {
      reason: "Assess willingness to pay for customers offering 2 price points. Since this is a new product, we want to evaluate our customers WTP.",
      change: "Airo Plus is offering 2 price points to our customers to check their willingness to pay for the subscription product. Our goal is to assess customer willingness to pay for the Airo Plus product by offering it at two different price points and analyzing their responses",
      expectation: "This is a WTP test. With a lower price point we will measure increase in conversion with minimum impact to GCR. With the higher price point, we will measure the GCR with minimal impact to Conversion"
    },
    metadata: { 
      business_unit: "Partners", 
      owners: ["thill2", "vnarayan"] 
    },
    analysis_configuration: {
      decision_metrics: ["airo_plus_conversion"],
      guardrail_metrics: [],
      scorecard_template: "airo_plus_experiment_4"
    },
    experiment_end_state: { result: "win" },
    experimentType: "A/B",
    status: "live"
  },
  {
    id: "wam_heuristics_pricing_experiment",
    name: "WAM In-App heuristics Pricing test for Free to Paid customers",
    hypothesis: {
      reason: "Matching the price with customer WTP results in higher conversion and gcr",
      change: "Offering a premium pricing tier to users who have published a partial or full website during their free trial will lead to a proportional increase in Gross Conversion Rate (GCR), matching the percentage of the price increase, while maintaining the overall conversion rate.",
      expectation: "We will need to run to track the increase in GCR (in sync to the % increase in the price)"
    },
    metadata: { 
      business_unit: "US Independents", 
      owners: ["vnarayan", "mkimball"] 
    },
    analysis_configuration: {
      decision_metrics: ["wam_conversion"],
      guardrail_metrics: [],
      scorecard_template: "usi_mon_standard_scorecard"
    },
    experiment_end_state: { result: "win" },
    experimentType: "A/B",
    status: "live"
  },
  {
    id: "wam_heuristics_pricing_experiment_pre_post",
    name: "WAM Heuristics Pricing - Pre/Post Analysis",
    hypothesis: {
      reason: "Matching the price with customer WTP results in higher conversion and gcr",
      change: "Offering a premium pricing tier to users who have published a partial or full website during their free trial will lead to a proportional increase in Gross Conversion Rate (GCR), matching the percentage of the price increase, while maintaining the overall conversion rate.",
      expectation: "We will need to run to track the increase in GCR (in sync to the % increase in the price)"
    },
    metadata: { 
      business_unit: "US Independents", 
      owners: ["vnarayan", "mkimball"] 
    },
    analysis_configuration: {
      decision_metrics: ["wam_conversion"],
      scorecard_template: "usi_mon_standard_scorecard"
    },
    experiment_end_state: { result: "win" },
    experimentType: "PRE-POST",
    status: "killed"
  },
  {
    id: "wam_in_app_ftp_test",
    name: "WAM In-App Pricing test for Freemium customers from Day 1",
    hypothesis: {
      reason: "By offering variable discounts to customers, below and above the existing sale price, we believe we can impact the conversion positively by 7% with some impact to GCR.",
      change: "We want to offer differentiated pricing for WAM new purchases to be able to increase the #units (CVR), while keeping total GCR as neutral (or ideally positive). By offering different prices by giving different discounts we expect the conversion to go up by 7% with some impact to GCR.",
      expectation: "By offering different prices by giving different discounts we expect the conversion to go up by 7% with some impact to GCR."
    },
    metadata: { 
      business_unit: "US Independents", 
      owners: ["vnarayan", "mbansiwal"] 
    },
    analysis_configuration: {
      decision_metrics: ["wam_conversion"],
      guardrail_metrics: ["new_wam_receipts"],
      scorecard_template: "usi_mon_standard_scorecard"
    },
    experiment_end_state: { result: "inconclusive" },
    experimentType: "A/B",
    startDate: "2024-08-13",
    endDate: "2024-09-13"
  },
  {
    id: "serp_domain_pricing_test_ca",
    name: "Promo Pricing by experiment - Canada",
    hypothesis: {
      reason: "By offering an average discount of 20% we can increase NCs by 10% using cc TLD's in the GDII market",
      change: "The Domain Sale Price discounts",
      expectation: "To increase new customer acquisition and domain sale units"
    },
    metadata: { 
      business_unit: "Domain Registrars and Investors", 
      owners: ["vnarayan", "zchristie"] 
    },
    analysis_configuration: {
      decision_metrics: ["new_domain_name_reg_units"],
      guardrail_metrics: ["new_purchase_gcr_amt", "two_plus_customer_rate", "average_order_size"],
      scorecard_template: "NewPurchase_DT"
    },
    experiment_end_state: { result: "loss" },
    experimentType: "A/B",
    status: "live"
  },
  {
    id: "serp_domain_pricing_test_de",
    name: "Promo Pricing by experiment - Germany (.DE)",
    hypothesis: {
      reason: "By offering an average discount of 20% we can increase NCs by 10% using cc TLD's in the GDII market",
      change: "Domains Sale Price discounts",
      expectation: "Net Customer Adds positively with the new purchase GCR as a guardrail metric"
    },
    metadata: { 
      business_unit: "CMO", 
      owners: ["vnarayan"] 
    },
    analysis_configuration: {
      decision_metrics: ["units_purchased_new"],
      guardrail_metrics: ["new_purchase_gcr_amt", "two_plus_customer_rate", "average_order_size"],
      scorecard_template: "NewPurchase_DT"
    },
    experiment_end_state: { result: "loss" },
    experimentType: "A/B",
    status: "live"
  },
  {
    id: "mwp_heuristics_test",
    name: "MWP Heuristics test",
    hypothesis: {
      reason: "Test",
      change: "Test",
      expectation: "Test"
    },
    metadata: { 
      business_unit: "Partners", 
      owners: ["vnarayan"] 
    },
    analysis_configuration: {
      decision_metrics: ["new_purchase_conversion"],
      guardrail_metrics: ["gcr_new_purchases"],
      scorecard_template: "Activation-WAM-CVR"
    },
    experimentType: "A/B",
    status: "draft"
  },
  {
    id: "test_venkat_experiment",
    name: "Test Venkat Experiment (MAB)",
    hypothesis: {
      reason: "This is a test environment",
      change: "this is test hypothesis",
      expectation: "CVR and GCR"
    },
    metadata: { 
      business_unit: "USI", 
      owners: ["vnarayan"] 
    },
    analysis_configuration: {
      decision_metrics: ["gcr_amt", "conversion"],
      guardrail_metrics: [],
      scorecard_template: "123reg_OXM365V3"
    },
    experimentType: "MAB",
    status: "draft"
  }
];

// FOS (Front of Site) experiments from Hivemind - 2026
const fosExperiments: Experiment[] = [
  {
    id: "am-fos-5722_pre_post",
    name: "AM FOS 5722 Pre-Post Analysis",
    metadata: {
      business_unit: "Domain Registrars and Investors",
      owners: ["amarek", "psadarangani"]
    },
    analysis_configuration: {
      scorecard_template: "am-fos-v2"
    },
    experimentType: "PRE-POST",
    startDate: "2025-12-03"
  },
  {
    id: "am-fos-export-staging",
    name: "AM FOS Export Staging",
    metadata: {
      business_unit: "Domain Registrars and Investors",
      owners: ["amarek"]
    },
    analysis_configuration: {
      decision_metrics: ["gcr_amt"],
      scorecard_template: "am-fos-v2"
    },
    experimentType: "A/B",
    startDate: "2025-12-17"
  },
  {
    id: "hcs_abn_gdexp_12143",
    name: "HCS ABN GDEXP 12143 - FOS Navigation",
    metadata: {
      business_unit: "CMO",
      owners: ["agelinas"]
    },
    analysis_configuration: {
      decision_metrics: ["new_purchase_conversion"],
      scorecard_template: "fos-nav"
    },
    experiment_end_state: { result: "win" },
    experimentType: "A/B",
    startDate: "2025-12-16"
  },
  {
    id: "hcs_abn_gdexp_12144",
    name: "HCS ABN GDEXP 12144 - FOS Navigation",
    metadata: {
      business_unit: "CMO",
      owners: ["agelinas"]
    },
    analysis_configuration: {
      decision_metrics: ["new_purchase_conversion"],
      scorecard_template: "fos-nav"
    },
    experiment_end_state: { result: "inconclusive" },
    experimentType: "A/B",
    startDate: "2025-12-16"
  },
  {
    id: "abn_gdexp_11767",
    name: "ABN GDEXP 11767 - FOS Merch Domain",
    metadata: {
      business_unit: "Domain Registrars and Investors",
      owners: ["cbradley1", "alyson0609"]
    },
    analysis_configuration: {
      decision_metrics: ["new_purchase_conversion"],
      scorecard_template: "fos_merch_domain"
    },
    experiment_end_state: { result: "inconclusive" },
    experimentType: "A/B",
    startDate: "2025-12-10"
  },
  {
    id: "abn_gdexp_11928",
    name: "ABN GDEXP 11928 - FOS Merch Domain",
    metadata: {
      business_unit: "Domain Registrars and Investors",
      owners: ["cbradley1", "alyson0609"]
    },
    analysis_configuration: {
      decision_metrics: ["new_purchase_conversion"],
      scorecard_template: "fos_merch_domain"
    },
    experiment_end_state: { result: "inconclusive" },
    experimentType: "A/B",
    startDate: "2025-12-11"
  },
  {
    id: "abn_gdexp_11891",
    name: "ABN GDEXP 11891 - FOS Merch WAM",
    metadata: {
      business_unit: "Customer & Site",
      owners: ["kblalock", "cbradley1"]
    },
    analysis_configuration: {
      decision_metrics: ["new_transaction"],
      scorecard_template: "fos_merch_wam"
    },
    experiment_end_state: { result: "loss" },
    experimentType: "A/B",
    startDate: "2025-12-10"
  },
  {
    id: "serp_precheck_multi_domain_en_us_mobile",
    name: "SERP Precheck Multi Domain EN-US Mobile",
    metadata: {
      business_unit: "CMO",
      owners: ["asahu1", "gwright1", "sparmar"]
    },
    analysis_configuration: {
      decision_metrics: ["new_purchase_conversion", "new_purchase_gcr_amt"],
      scorecard_template: "dpp-e2e-precheck"
    },
    experimentType: "A/B",
    startDate: "2025-12-04"
  },
  {
    id: "serp_exactbadge_enmarkets_alldevices_non_mod_endgame",
    name: "SERP Exact Badge EN Markets All Devices",
    metadata: {
      business_unit: "Customer & Site",
      owners: ["kcheung", "jtrishuleshwar"]
    },
    analysis_configuration: {
      decision_metrics: ["new_purchase_gcr_amt"],
      guardrail_metrics: ["new_purchase_conversion"],
      scorecard_template: "dpp-e2e-lite"
    },
    experiment_end_state: { result: "win" },
    experimentType: "ENDGAME",
    startDate: "2025-10-13"
  },
  {
    id: "serp_confetti_for_all_atcs_allmarkets_desktop_mod_and_non_mod",
    name: "SERP Confetti for All ATCs - Desktop",
    metadata: {
      business_unit: "Customer & Site",
      owners: ["kcheung", "jtrishuleshwar"]
    },
    analysis_configuration: {
      decision_metrics: ["new_purchase_gcr_amt"],
      scorecard_template: "dpp-e2e"
    },
    experimentType: "A/B",
    startDate: "2025-12-10"
  },
  {
    id: "serp_cta_text_get_it_en_us_desktop_mod_and_non_mod_pre_post",
    name: "SERP CTA Text 'Get It' EN-US Desktop Pre-Post",
    metadata: {
      business_unit: "Customer & Site",
      owners: ["kcheung", "jtrishuleshwar"]
    },
    analysis_configuration: {
      scorecard_template: "dpp-e2e"
    },
    experimentType: "PRE-POST",
    startDate: "2025-12-30"
  },
  {
    id: "cart_abandon_leadgen_intl",
    name: "Cart Abandon Lead Gen - International",
    metadata: {
      business_unit: "CMO",
      owners: ["mxdoty"]
    },
    analysis_configuration: {
      decision_metrics: ["sso_account_creation"],
      scorecard_template: "cart"
    },
    experiment_end_state: { result: "win" },
    experimentType: "A/B",
    startDate: "2025-12-09"
  },
  {
    id: "cart_discount_additional_m365",
    name: "Cart Discount Additional M365",
    metadata: {
      business_unit: "CMO",
      owners: ["mxdoty"]
    },
    analysis_configuration: {
      decision_metrics: ["new_purchase_conversion", "new_o365_purchase_units"],
      scorecard_template: "cart"
    },
    experiment_end_state: { result: "loss" },
    experimentType: "A/B",
    startDate: "2025-12-22"
  },
  {
    id: "hp_recore_dify_leadgen_cta_pre_post",
    name: "Homepage Recore Dify Lead Gen CTA Pre-Post",
    metadata: {
      business_unit: "CMO",
      owners: ["mdelbrocco"]
    },
    analysis_configuration: {
      scorecard_template: "recore_nba"
    },
    experiment_end_state: { result: "win" },
    experimentType: "PRE-POST",
    startDate: "2025-12-17"
  }
];

type TabType = 'my-experiments' | 'fos-2026';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('my-experiments');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState<FiltersType>({
    search: '',
    status: 'all',
    businessUnit: '',
    sortBy: 'name'
  });

  // Get current experiments based on active tab
  const currentExperiments = activeTab === 'my-experiments' ? myExperiments : fosExperiments;

  // Get unique business units
  const businessUnits = useMemo(() => {
    const units = new Set<string>();
    currentExperiments.forEach(exp => {
      if (exp.metadata?.business_unit) {
        units.add(exp.metadata.business_unit);
      }
    });
    return Array.from(units).sort();
  }, [currentExperiments]);

  // Filter and sort experiments
  const filteredExperiments = useMemo(() => {
    let result = [...currentExperiments];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(exp => 
        (exp.id || exp.experiment_id || '').toLowerCase().includes(search) ||
        (exp.name || '').toLowerCase().includes(search) ||
        (exp.hypothesis?.change || '').toLowerCase().includes(search) ||
        (exp.hypothesis?.expectation || '').toLowerCase().includes(search) ||
        (exp.metadata?.business_unit || '').toLowerCase().includes(search)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      if (filters.status === 'running') {
        result = result.filter(exp => !exp.experiment_end_state?.result);
      } else {
        result = result.filter(exp => exp.experiment_end_state?.result === filters.status);
      }
    }

    // Business unit filter
    if (filters.businessUnit) {
      result = result.filter(exp => exp.metadata?.business_unit === filters.businessUnit);
    }

    // Sort
    switch (filters.sortBy) {
      case 'votes':
        result.sort((a, b) => (b.votes || 0) - (a.votes || 0));
        break;
      case 'name':
        result.sort((a, b) => (a.name || a.id || '').localeCompare(b.name || b.id || ''));
        break;
    }

    return result;
  }, [currentExperiments, filters]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExperimentClick = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setIsDetailOpen(true);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setFilters({ search: '', status: 'all', businessUnit: '', sortBy: 'name' });
  };

  return (
    <div className="min-h-screen">
      <Header 
        onRefresh={handleRefresh} 
        isLoading={isLoading}
        showcaseMonth={activeTab === 'my-experiments' ? 'Your Experiments' : 'FOS Experiments 2026'}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => handleTabChange('my-experiments')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'my-experiments'
                ? 'bg-gradient-to-r from-hive-500 to-hive-600 text-white shadow-lg shadow-hive-500/25'
                : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300'
            }`}
          >
            <User className="w-4 h-4" />
            My Experiments
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'my-experiments' ? 'bg-white/20' : 'bg-gray-700'
            }`}>
              {myExperiments.length}
            </span>
          </button>
          <button
            onClick={() => handleTabChange('fos-2026')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'fos-2026'
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
                : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300'
            }`}
          >
            <Globe className="w-4 h-4" />
            FOS 2026
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'fos-2026' ? 'bg-white/20' : 'bg-gray-700'
            }`}>
              {fosExperiments.length}
            </span>
          </button>
        </div>

        {/* Stats */}
        <StatsCards experiments={currentExperiments} />

        {/* Metrics Comparison - only show for My Experiments tab */}
        {activeTab === 'my-experiments' && <MetricsComparison />}

        {/* FOS Insights - only show for FOS 2026 tab */}
        {activeTab === 'fos-2026' && <FOSInsights />}

        {/* Filters */}
        <ExperimentFilters
          filters={filters}
          onFiltersChange={setFilters}
          businessUnits={businessUnits}
        />

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing <span className="text-white font-medium">{filteredExperiments.length}</span> {activeTab === 'my-experiments' ? 'of your experiments' : 'FOS experiments'}
          </p>
        </div>

        {/* Experiments Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-hive-500 animate-spin" />
          </div>
        ) : filteredExperiments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExperiments.map((experiment, index) => (
              <ExperimentCard
                key={experiment.id || experiment.experiment_id}
                experiment={experiment}
                index={index}
                onClick={() => handleExperimentClick(experiment)}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">No experiments match your filters</p>
            <button
              onClick={() => setFilters({ search: '', status: 'all', businessUnit: '', sortBy: 'name' })}
              className="mt-4 text-hive-400 hover:text-hive-300 text-sm"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </main>

      {/* Experiment Detail Drawer */}
      <ExperimentDetail
        experiment={selectedExperiment}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
