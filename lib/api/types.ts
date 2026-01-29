// API Response Types based on proposed schema

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Summary Types
export interface ProtocolSummary {
  id: string;
  name: string;
  tvl: number;
  apy: number;
  activePoolsCount: number;
}

export interface Summary {
  totalTvl: number;
  totalActiveLoans: number;
  avgApy: number;
  protocols: ProtocolSummary[];
}

// Protocol Types
export type ProtocolStatus = "active" | "paused" | "deprecated";

export interface Protocol {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProtocolStatus;
  tvl: number;
  apy: number;
  activePoolsCount: number;
  activeLoansCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProtocolWithPools extends Protocol {
  pools: Pool[];
}

// Pool Types
export type PoolStatus = "open" | "closed" | "defaulted";
export type AssetClass = "corporate" | "real_estate" | "trade_finance" | "consumer" | "mixed";

export interface Pool {
  id: string;
  protocolId: string;
  name: string;
  status: PoolStatus;
  assetClass: AssetClass;
  tvl: number;
  utilizationRate: number;
  apy: number;
  minDeposit: number;
  lockupPeriodDays: number;
  activeLoansCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PoolWithLoans extends Pool {
  loans: Loan[];
}

// Loan Types
export type LoanStatus = "current" | "late" | "defaulted" | "repaid";

export interface Loan {
  id: string;
  poolId: string;
  borrowerName: string;
  borrowerAddress: string;
  principalAmount: number;
  outstandingAmount: number;
  interestRate: number;
  status: LoanStatus;
  originationDate: string;
  maturityDate: string;
  lastPaymentDate: string | null;
  nextPaymentDate: string | null;
}

// Event Types
export type EventType = "deposit" | "withdrawal" | "loan_originated" | "loan_repaid" | "interest_payment" | "default";

export interface PoolEvent {
  id: string;
  poolId: string;
  type: EventType;
  amount: number;
  walletAddress: string;
  txHash: string;
  timestamp: string;
}

export interface LoanEvent {
  id: string;
  loanId: string;
  type: EventType;
  amount: number;
  txHash: string;
  timestamp: string;
}

// Filter Types
export interface PoolFilters {
  protocolId?: string;
  status?: PoolStatus;
  assetClass?: AssetClass;
  page?: number;
  pageSize?: number;
}

export interface LoanFilters {
  poolId?: string;
  status?: LoanStatus;
  page?: number;
  pageSize?: number;
}

export interface EventFilters {
  type?: EventType;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

// Capital Flow Types
export interface CapitalFlowInflows {
  deposits: string;
  loan_repayments: string;
  total: string;
}

export interface CapitalFlowOutflows {
  withdrawals: string;
  loan_drawdowns: string;
  defaults: string;
  total: string;
}

export interface CapitalFlowData {
  date: string;
  inflows: CapitalFlowInflows;
  outflows: CapitalFlowOutflows;
  net_flow: string;
  cumulative_position: string;
}

export interface CapitalFlowSummary {
  period_start: string;
  period_end: string;
  total_inflows: string;
  total_outflows: string;
  net_change: string;
  current_position: string;
}

export type CapitalFlowGranularity = "daily" | "weekly" | "monthly";

export interface CapitalFlowFilters {
  granularity?: CapitalFlowGranularity;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface CapitalFlowResponse {
  pool_id: string;
  granularity: CapitalFlowGranularity;
  data: CapitalFlowData[];
  summary: CapitalFlowSummary;
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

// Extended Pool Types with new fields from API spec
export interface PoolAsset {
  address: string;
  symbol: string;
  decimals: number;
}

export interface PoolManagers {
  pool_manager: string;
  loan_manager: string;
  withdrawal_manager: string;
}

export interface LoanSummary {
  total: number;
  active: number;
  repaid: number;
  defaulted: number;
}

export interface PoolExtended extends Pool {
  address?: string;
  asset?: PoolAsset;
  managers?: PoolManagers;
  loan_summary?: LoanSummary;
  nav?: number;
}

// Pool Capacity Types
export interface PoolCapacityData {
  date: string;
  liquidity_cap: string;
  outstanding_balance: string;
  idle_cash: string;
  tvl: string;
  available_capacity: string;
  utilization_rate: number;
}

export interface PoolCapacityCurrent {
  liquidity_cap: string;
  outstanding_balance: string;
  idle_cash: string;
  available_capacity: string;
  utilization_rate: number;
}

export interface PoolCapacityFilters {
  granularity?: CapitalFlowGranularity;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface PoolCapacityResponse {
  pool_id: string;
  pool_name: string;
  asset_symbol: string;
  data: PoolCapacityData[];
  current: PoolCapacityCurrent;
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

// Pool Velocity Types
export interface LoanVelocityData {
  avg_days_to_fund: number;
  median_days_to_fund: number;
  p90_days_to_fund: number;
  loans_funded: number;
  total_principal_funded: string;
}

export interface RedemptionVelocityData {
  avg_days_to_process: number;
  median_days_to_process: number;
  p90_days_to_process: number;
  redemptions_processed: number;
  total_assets_redeemed: string;
}

export interface PoolVelocityData {
  period_start: string;
  period_end: string;
  loan_velocity: LoanVelocityData;
  redemption_velocity: RedemptionVelocityData;
}

export interface PoolVelocitySummary {
  period_start: string;
  period_end: string;
  loan_velocity: {
    avg_days_to_fund: number;
    median_days_to_fund: number;
    total_loans_funded: number;
  };
  redemption_velocity: {
    avg_days_to_process: number;
    median_days_to_process: number;
    total_redemptions_processed: number;
  };
}

export interface PoolVelocityFilters {
  granularity?: CapitalFlowGranularity;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface PoolVelocityResponse {
  pool_id: string;
  pool_name: string;
  granularity: CapitalFlowGranularity;
  data: PoolVelocityData[];
  summary: PoolVelocitySummary;
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}
