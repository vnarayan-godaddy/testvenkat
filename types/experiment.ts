export interface Hypothesis {
  change: string;
  expectation: string;
  reason: string;
}

export interface Metadata {
  business_unit?: string;
  owners?: string[];
}

export interface AnalysisConfiguration {
  decision_metrics?: string[];
  guardrail_metrics?: string[];
  scorecard_template?: string;
}

export interface ExperimentEndState {
  result?: 'win' | 'loss' | 'inconclusive' | string;
}

export interface Experiment {
  id: string;
  experiment_id?: string;
  name?: string;
  hypothesis?: Hypothesis;
  metadata?: Metadata;
  analysis_configuration?: AnalysisConfiguration;
  experiment_end_state?: ExperimentEndState;
  votes?: number;
  status?: 'draft' | 'scheduled' | 'live' | 'killed' | 'deleted' | string;
  experimentType?: string;
  startDate?: string;
  endDate?: string;
}

export interface ShowcaseExperiment extends Experiment {
  votes: number;
}

export type FilterStatus = 'all' | 'win' | 'loss' | 'inconclusive' | 'running';

export interface ExperimentFilters {
  search: string;
  status: FilterStatus;
  businessUnit: string;
  sortBy: 'votes' | 'name' | 'date';
}
