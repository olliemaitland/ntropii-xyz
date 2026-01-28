import type {
  Summary,
  Protocol,
  ProtocolWithPools,
  Pool,
  PoolWithLoans,
  Loan,
  PoolEvent,
  LoanEvent,
  CapitalFlowResponse,
  CapitalFlowGranularity,
  CapitalFlowFilters,
  PoolExtended,
  PoolCapacityResponse,
  PoolCapacityFilters,
  PoolVelocityResponse,
  PoolVelocityFilters,
} from "./types";

// Mock Protocols
export const mockProtocols: Protocol[] = [
  {
    id: "maple-finance",
    name: "Maple Finance",
    slug: "maple-finance",
    description: "Institutional capital markets powered by blockchain technology",
    status: "active",
    tvl: 245000000,
    apy: 8.5,
    activePoolsCount: 4,
    activeLoansCount: 23,
    createdAt: "2021-05-01T00:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
  },
  {
    id: "centrifuge",
    name: "Centrifuge",
    slug: "centrifuge",
    description: "Real-world asset financing on-chain",
    status: "active",
    tvl: 180000000,
    apy: 7.2,
    activePoolsCount: 6,
    activeLoansCount: 45,
    createdAt: "2020-10-15T00:00:00Z",
    updatedAt: "2024-01-14T08:30:00Z",
  },
  {
    id: "goldfinch",
    name: "Goldfinch",
    slug: "goldfinch",
    description: "Decentralized credit protocol for emerging markets",
    status: "active",
    tvl: 95000000,
    apy: 12.1,
    activePoolsCount: 3,
    activeLoansCount: 18,
    createdAt: "2021-01-20T00:00:00Z",
    updatedAt: "2024-01-13T16:45:00Z",
  },
  {
    id: "truefi",
    name: "TrueFi",
    slug: "truefi",
    description: "Uncollateralized lending powered by on-chain credit scores",
    status: "active",
    tvl: 120000000,
    apy: 9.8,
    activePoolsCount: 2,
    activeLoansCount: 12,
    createdAt: "2020-11-01T00:00:00Z",
    updatedAt: "2024-01-12T10:15:00Z",
  },
];

// Mock Pools
export const mockPools: Pool[] = [
  // Maple Finance Pools
  {
    id: "maple-usdc-01",
    protocolId: "maple-finance",
    name: "USDC Blue Chip Pool",
    status: "open",
    assetClass: "corporate",
    tvl: 85000000,
    utilizationRate: 78.5,
    apy: 8.2,
    minDeposit: 50000,
    lockupPeriodDays: 90,
    activeLoansCount: 8,
    createdAt: "2023-03-15T00:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
  },
  {
    id: "maple-weth-01",
    protocolId: "maple-finance",
    name: "WETH Institutional Pool",
    status: "open",
    assetClass: "corporate",
    tvl: 72000000,
    utilizationRate: 65.2,
    apy: 7.8,
    minDeposit: 25000,
    lockupPeriodDays: 60,
    activeLoansCount: 6,
    createdAt: "2023-05-20T00:00:00Z",
    updatedAt: "2024-01-14T09:30:00Z",
  },
  {
    id: "maple-usdc-02",
    protocolId: "maple-finance",
    name: "USDC Growth Pool",
    status: "open",
    assetClass: "mixed",
    tvl: 58000000,
    utilizationRate: 82.1,
    apy: 9.5,
    minDeposit: 10000,
    lockupPeriodDays: 30,
    activeLoansCount: 5,
    createdAt: "2023-08-10T00:00:00Z",
    updatedAt: "2024-01-13T14:20:00Z",
  },
  {
    id: "maple-usdc-03",
    protocolId: "maple-finance",
    name: "USDC Yield Pool",
    status: "closed",
    assetClass: "corporate",
    tvl: 30000000,
    utilizationRate: 45.0,
    apy: 6.5,
    minDeposit: 100000,
    lockupPeriodDays: 180,
    activeLoansCount: 4,
    createdAt: "2022-12-01T00:00:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
  },
  // Centrifuge Pools
  {
    id: "cfg-real-estate-01",
    protocolId: "centrifuge",
    name: "Real Estate Bridge Loans",
    status: "open",
    assetClass: "real_estate",
    tvl: 45000000,
    utilizationRate: 71.3,
    apy: 7.5,
    minDeposit: 5000,
    lockupPeriodDays: 0,
    activeLoansCount: 12,
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "cfg-trade-finance-01",
    protocolId: "centrifuge",
    name: "Trade Finance Pool",
    status: "open",
    assetClass: "trade_finance",
    tvl: 52000000,
    utilizationRate: 68.9,
    apy: 6.8,
    minDeposit: 10000,
    lockupPeriodDays: 14,
    activeLoansCount: 18,
    createdAt: "2023-04-15T00:00:00Z",
    updatedAt: "2024-01-14T16:30:00Z",
  },
  {
    id: "cfg-consumer-01",
    protocolId: "centrifuge",
    name: "Consumer Credit Pool",
    status: "open",
    assetClass: "consumer",
    tvl: 38000000,
    utilizationRate: 85.2,
    apy: 8.1,
    minDeposit: 1000,
    lockupPeriodDays: 0,
    activeLoansCount: 8,
    createdAt: "2023-06-20T00:00:00Z",
    updatedAt: "2024-01-13T12:15:00Z",
  },
  // Goldfinch Pools
  {
    id: "gf-emerging-01",
    protocolId: "goldfinch",
    name: "Emerging Markets Fund",
    status: "open",
    assetClass: "mixed",
    tvl: 42000000,
    utilizationRate: 91.5,
    apy: 13.2,
    minDeposit: 1000,
    lockupPeriodDays: 0,
    activeLoansCount: 9,
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2024-01-15T08:45:00Z",
  },
  {
    id: "gf-latam-01",
    protocolId: "goldfinch",
    name: "LatAm SME Pool",
    status: "open",
    assetClass: "corporate",
    tvl: 35000000,
    utilizationRate: 78.3,
    apy: 11.5,
    minDeposit: 2500,
    lockupPeriodDays: 30,
    activeLoansCount: 6,
    createdAt: "2023-03-25T00:00:00Z",
    updatedAt: "2024-01-14T11:20:00Z",
  },
  // TrueFi Pools
  {
    id: "tru-usdc-01",
    protocolId: "truefi",
    name: "USDC Lending Pool",
    status: "open",
    assetClass: "corporate",
    tvl: 78000000,
    utilizationRate: 72.8,
    apy: 9.2,
    minDeposit: 0,
    lockupPeriodDays: 0,
    activeLoansCount: 8,
    createdAt: "2022-08-01T00:00:00Z",
    updatedAt: "2024-01-15T14:00:00Z",
  },
  {
    id: "tru-usdt-01",
    protocolId: "truefi",
    name: "USDT Stable Pool",
    status: "open",
    assetClass: "corporate",
    tvl: 42000000,
    utilizationRate: 65.4,
    apy: 8.5,
    minDeposit: 0,
    lockupPeriodDays: 0,
    activeLoansCount: 4,
    createdAt: "2022-10-15T00:00:00Z",
    updatedAt: "2024-01-14T09:45:00Z",
  },
];

// Mock Loans
export const mockLoans: Loan[] = [
  // Maple USDC Blue Chip Pool Loans
  {
    id: "loan-maple-001",
    poolId: "maple-usdc-01",
    borrowerName: "Alameda Digital",
    borrowerAddress: "0x1234...5678",
    principalAmount: 15000000,
    outstandingAmount: 12500000,
    interestRate: 8.5,
    status: "current",
    originationDate: "2023-09-01T00:00:00Z",
    maturityDate: "2024-09-01T00:00:00Z",
    lastPaymentDate: "2024-01-01T00:00:00Z",
    nextPaymentDate: "2024-02-01T00:00:00Z",
  },
  {
    id: "loan-maple-002",
    poolId: "maple-usdc-01",
    borrowerName: "Wintermute Trading",
    borrowerAddress: "0x2345...6789",
    principalAmount: 20000000,
    outstandingAmount: 18750000,
    interestRate: 8.2,
    status: "current",
    originationDate: "2023-10-15T00:00:00Z",
    maturityDate: "2024-10-15T00:00:00Z",
    lastPaymentDate: "2024-01-15T00:00:00Z",
    nextPaymentDate: "2024-02-15T00:00:00Z",
  },
  {
    id: "loan-maple-003",
    poolId: "maple-usdc-01",
    borrowerName: "BlockTower Capital",
    borrowerAddress: "0x3456...7890",
    principalAmount: 10000000,
    outstandingAmount: 10000000,
    interestRate: 8.8,
    status: "current",
    originationDate: "2024-01-05T00:00:00Z",
    maturityDate: "2025-01-05T00:00:00Z",
    lastPaymentDate: null,
    nextPaymentDate: "2024-02-05T00:00:00Z",
  },
  {
    id: "loan-maple-004",
    poolId: "maple-usdc-01",
    borrowerName: "Amber Group",
    borrowerAddress: "0x4567...8901",
    principalAmount: 8000000,
    outstandingAmount: 6200000,
    interestRate: 7.9,
    status: "current",
    originationDate: "2023-06-20T00:00:00Z",
    maturityDate: "2024-06-20T00:00:00Z",
    lastPaymentDate: "2024-01-10T00:00:00Z",
    nextPaymentDate: "2024-02-10T00:00:00Z",
  },
  {
    id: "loan-maple-005",
    poolId: "maple-usdc-02",
    borrowerName: "Genesis Trading",
    borrowerAddress: "0x5678...9012",
    principalAmount: 12000000,
    outstandingAmount: 11000000,
    interestRate: 9.2,
    status: "late",
    originationDate: "2023-07-01T00:00:00Z",
    maturityDate: "2024-07-01T00:00:00Z",
    lastPaymentDate: "2023-12-01T00:00:00Z",
    nextPaymentDate: "2024-01-01T00:00:00Z",
  },
  // Centrifuge Loans
  {
    id: "loan-cfg-001",
    poolId: "cfg-real-estate-01",
    borrowerName: "Harbor Real Estate",
    borrowerAddress: "0x6789...0123",
    principalAmount: 5000000,
    outstandingAmount: 4200000,
    interestRate: 7.5,
    status: "current",
    originationDate: "2023-08-15T00:00:00Z",
    maturityDate: "2024-08-15T00:00:00Z",
    lastPaymentDate: "2024-01-12T00:00:00Z",
    nextPaymentDate: "2024-02-12T00:00:00Z",
  },
  {
    id: "loan-cfg-002",
    poolId: "cfg-trade-finance-01",
    borrowerName: "Global Trade Corp",
    borrowerAddress: "0x7890...1234",
    principalAmount: 3500000,
    outstandingAmount: 3500000,
    interestRate: 6.8,
    status: "current",
    originationDate: "2024-01-10T00:00:00Z",
    maturityDate: "2024-04-10T00:00:00Z",
    lastPaymentDate: null,
    nextPaymentDate: "2024-02-10T00:00:00Z",
  },
  // Goldfinch Loans
  {
    id: "loan-gf-001",
    poolId: "gf-emerging-01",
    borrowerName: "PayJoy Mexico",
    borrowerAddress: "0x8901...2345",
    principalAmount: 8000000,
    outstandingAmount: 6500000,
    interestRate: 13.5,
    status: "current",
    originationDate: "2023-05-01T00:00:00Z",
    maturityDate: "2025-05-01T00:00:00Z",
    lastPaymentDate: "2024-01-08T00:00:00Z",
    nextPaymentDate: "2024-02-08T00:00:00Z",
  },
  {
    id: "loan-gf-002",
    poolId: "gf-latam-01",
    borrowerName: "Creditas Brasil",
    borrowerAddress: "0x9012...3456",
    principalAmount: 6000000,
    outstandingAmount: 5800000,
    interestRate: 11.8,
    status: "current",
    originationDate: "2023-11-01T00:00:00Z",
    maturityDate: "2024-11-01T00:00:00Z",
    lastPaymentDate: "2024-01-05T00:00:00Z",
    nextPaymentDate: "2024-02-05T00:00:00Z",
  },
  // TrueFi Loans
  {
    id: "loan-tru-001",
    poolId: "tru-usdc-01",
    borrowerName: "Folkvang Trading",
    borrowerAddress: "0x0123...4567",
    principalAmount: 25000000,
    outstandingAmount: 22000000,
    interestRate: 9.0,
    status: "current",
    originationDate: "2023-04-01T00:00:00Z",
    maturityDate: "2024-04-01T00:00:00Z",
    lastPaymentDate: "2024-01-14T00:00:00Z",
    nextPaymentDate: "2024-02-14T00:00:00Z",
  },
];

// Mock Pool Events
export const mockPoolEvents: PoolEvent[] = [
  {
    id: "event-001",
    poolId: "maple-usdc-01",
    type: "deposit",
    amount: 2500000,
    walletAddress: "0xabc1...def1",
    txHash: "0x1111...aaaa",
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "event-002",
    poolId: "maple-usdc-01",
    type: "deposit",
    amount: 1000000,
    walletAddress: "0xabc2...def2",
    txHash: "0x2222...bbbb",
    timestamp: "2024-01-14T15:45:00Z",
  },
  {
    id: "event-003",
    poolId: "maple-usdc-01",
    type: "withdrawal",
    amount: 500000,
    walletAddress: "0xabc3...def3",
    txHash: "0x3333...cccc",
    timestamp: "2024-01-14T09:20:00Z",
  },
  {
    id: "event-004",
    poolId: "maple-usdc-01",
    type: "interest_payment",
    amount: 125000,
    walletAddress: "0xabc4...def4",
    txHash: "0x4444...dddd",
    timestamp: "2024-01-13T12:00:00Z",
  },
  {
    id: "event-005",
    poolId: "maple-usdc-01",
    type: "deposit",
    amount: 5000000,
    walletAddress: "0xabc5...def5",
    txHash: "0x5555...eeee",
    timestamp: "2024-01-12T16:30:00Z",
  },
  {
    id: "event-006",
    poolId: "maple-usdc-02",
    type: "deposit",
    amount: 750000,
    walletAddress: "0xabc6...def6",
    txHash: "0x6666...ffff",
    timestamp: "2024-01-15T08:15:00Z",
  },
  {
    id: "event-007",
    poolId: "cfg-real-estate-01",
    type: "loan_originated",
    amount: 2000000,
    walletAddress: "0xabc7...def7",
    txHash: "0x7777...0000",
    timestamp: "2024-01-14T11:00:00Z",
  },
  {
    id: "event-008",
    poolId: "gf-emerging-01",
    type: "loan_repaid",
    amount: 1500000,
    walletAddress: "0xabc8...def8",
    txHash: "0x8888...1111",
    timestamp: "2024-01-13T14:30:00Z",
  },
];

// Mock Loan Events
export const mockLoanEvents: LoanEvent[] = [
  {
    id: "loan-event-001",
    loanId: "loan-maple-001",
    type: "interest_payment",
    amount: 106250,
    txHash: "0xle01...0001",
    timestamp: "2024-01-01T00:00:00Z",
  },
  {
    id: "loan-event-002",
    loanId: "loan-maple-001",
    type: "interest_payment",
    amount: 106250,
    txHash: "0xle02...0002",
    timestamp: "2023-12-01T00:00:00Z",
  },
  {
    id: "loan-event-003",
    loanId: "loan-maple-002",
    type: "interest_payment",
    amount: 136666,
    txHash: "0xle03...0003",
    timestamp: "2024-01-15T00:00:00Z",
  },
  {
    id: "loan-event-004",
    loanId: "loan-gf-001",
    type: "interest_payment",
    amount: 73125,
    txHash: "0xle04...0004",
    timestamp: "2024-01-08T00:00:00Z",
  },
];

// Mock Summary
export const mockSummary: Summary = {
  totalTvl: mockProtocols.reduce((sum, p) => sum + p.tvl, 0),
  totalActiveLoans: mockProtocols.reduce((sum, p) => sum + p.activeLoansCount, 0),
  avgApy:
    mockProtocols.reduce((sum, p) => sum + p.apy, 0) / mockProtocols.length,
  protocols: mockProtocols.map((p) => ({
    id: p.id,
    name: p.name,
    tvl: p.tvl,
    apy: p.apy,
    activePoolsCount: p.activePoolsCount,
  })),
};

// Helper to get protocol with pools
export function getProtocolWithPools(protocolId: string): ProtocolWithPools | null {
  const protocol = mockProtocols.find((p) => p.id === protocolId);
  if (!protocol) return null;

  const pools = mockPools.filter((p) => p.protocolId === protocolId);
  return { ...protocol, pools };
}

// Helper to get pool with loans
export function getPoolWithLoans(poolId: string): PoolWithLoans | null {
  const pool = mockPools.find((p) => p.id === poolId);
  if (!pool) return null;

  const loans = mockLoans.filter((l) => l.poolId === poolId);
  return { ...pool, loans };
}

// Extended pool data with new fields
export const mockPoolsExtended: Record<string, Partial<PoolExtended>> = {
  "maple-usdc-01": {
    address: "0x123456789abcdef",
    asset: { address: "0xa0b8...usdc", symbol: "USDC", decimals: 6 },
    managers: {
      pool_manager: "0xabc...pm1",
      loan_manager: "0xdef...lm1",
      withdrawal_manager: "0x789...wm1",
    },
    loan_summary: { total: 12, active: 8, repaid: 3, defaulted: 1 },
    nav: 84500000,
  },
  "maple-weth-01": {
    address: "0x223456789abcdef",
    asset: { address: "0xa0b8...weth", symbol: "WETH", decimals: 18 },
    managers: {
      pool_manager: "0xabc...pm2",
      loan_manager: "0xdef...lm2",
      withdrawal_manager: "0x789...wm2",
    },
    loan_summary: { total: 8, active: 6, repaid: 2, defaulted: 0 },
    nav: 71800000,
  },
  "maple-usdc-02": {
    address: "0x323456789abcdef",
    asset: { address: "0xa0b8...usdc", symbol: "USDC", decimals: 6 },
    managers: {
      pool_manager: "0xabc...pm3",
      loan_manager: "0xdef...lm3",
      withdrawal_manager: "0x789...wm3",
    },
    loan_summary: { total: 7, active: 5, repaid: 2, defaulted: 0 },
    nav: 57200000,
  },
  "maple-usdc-03": {
    address: "0x423456789abcdef",
    asset: { address: "0xa0b8...usdc", symbol: "USDC", decimals: 6 },
    managers: {
      pool_manager: "0xabc...pm4",
      loan_manager: "0xdef...lm4",
      withdrawal_manager: "0x789...wm4",
    },
    loan_summary: { total: 6, active: 4, repaid: 0, defaulted: 2 },
    nav: 28500000,
  },
  "cfg-real-estate-01": {
    address: "0x523456789abcdef",
    asset: { address: "0xa0b8...usdc", symbol: "USDC", decimals: 6 },
    managers: {
      pool_manager: "0xabc...pm5",
      loan_manager: "0xdef...lm5",
      withdrawal_manager: "0x789...wm5",
    },
    loan_summary: { total: 15, active: 12, repaid: 3, defaulted: 0 },
    nav: 44800000,
  },
  "cfg-trade-finance-01": {
    address: "0x623456789abcdef",
    asset: { address: "0xa0b8...usdc", symbol: "USDC", decimals: 6 },
    managers: {
      pool_manager: "0xabc...pm6",
      loan_manager: "0xdef...lm6",
      withdrawal_manager: "0x789...wm6",
    },
    loan_summary: { total: 20, active: 18, repaid: 2, defaulted: 0 },
    nav: 51500000,
  },
};

// Generate capital flow mock data
export function generateCapitalFlowData(
  poolId: string,
  filters?: CapitalFlowFilters
): CapitalFlowResponse {
  const granularity: CapitalFlowGranularity = filters?.granularity || "daily";
  const limit = filters?.limit || 100;
  
  // Get pool base TVL for realistic numbers
  const pool = mockPools.find((p) => p.id === poolId);
  const baseTvl = pool?.tvl || 50000000;
  
  // Generate data points based on granularity
  const data = [];
  const today = new Date();
  let cumulativePosition = baseTvl;
  
  // Determine number of days based on filters or default
  let endDate = filters?.end_date ? new Date(filters.end_date) : today;
  let startDate: Date;
  
  if (filters?.start_date) {
    startDate = new Date(filters.start_date);
  } else {
    // Default to 90 days
    startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 90);
  }
  
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let stepDays = 1;
  if (granularity === "weekly") stepDays = 7;
  if (granularity === "monthly") stepDays = 30;
  
  const numPoints = Math.min(Math.ceil(daysDiff / stepDays), limit);
  
  // Generate from oldest to newest
  for (let i = numPoints - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i * stepDays);
    
    // Generate realistic flow amounts (0.5% - 3% of TVL per period)
    const depositBase = baseTvl * (0.005 + Math.random() * 0.025);
    const withdrawalBase = baseTvl * (0.003 + Math.random() * 0.02);
    const loanRepaymentBase = baseTvl * (0.002 + Math.random() * 0.015);
    const loanDrawdownBase = baseTvl * (0.004 + Math.random() * 0.02);
    
    const deposits = Math.round(depositBase);
    const loanRepayments = Math.round(loanRepaymentBase);
    const withdrawals = Math.round(withdrawalBase);
    const loanDrawdowns = Math.round(loanDrawdownBase);
    const defaults = Math.random() > 0.95 ? Math.round(baseTvl * 0.005) : 0;
    
    const totalInflows = deposits + loanRepayments;
    const totalOutflows = withdrawals + loanDrawdowns + defaults;
    const netFlow = totalInflows - totalOutflows;
    
    cumulativePosition += netFlow;
    
    data.push({
      date: date.toISOString().split("T")[0],
      inflows: {
        deposits: deposits.toFixed(2),
        loan_repayments: loanRepayments.toFixed(2),
        total: totalInflows.toFixed(2),
      },
      outflows: {
        withdrawals: withdrawals.toFixed(2),
        loan_drawdowns: loanDrawdowns.toFixed(2),
        defaults: defaults.toFixed(2),
        total: totalOutflows.toFixed(2),
      },
      net_flow: netFlow.toFixed(2),
      cumulative_position: cumulativePosition.toFixed(2),
    });
  }
  
  // Calculate summary
  const totalInflows = data.reduce(
    (sum, d) => sum + parseFloat(d.inflows.total),
    0
  );
  const totalOutflows = data.reduce(
    (sum, d) => sum + parseFloat(d.outflows.total),
    0
  );
  
  return {
    pool_id: poolId,
    granularity,
    data,
    summary: {
      period_start: startDate.toISOString().split("T")[0],
      period_end: endDate.toISOString().split("T")[0],
      total_inflows: totalInflows.toFixed(2),
      total_outflows: totalOutflows.toFixed(2),
      net_change: (totalInflows - totalOutflows).toFixed(2),
      current_position: cumulativePosition.toFixed(2),
    },
    pagination: {
      total: data.length,
      limit,
      offset: filters?.offset || 0,
    },
  };
}

// Helper to get extended pool data
export function getPoolExtended(poolId: string): PoolExtended | null {
  const pool = mockPools.find((p) => p.id === poolId);
  if (!pool) return null;

  const extended = mockPoolsExtended[poolId] || {};
  return { ...pool, ...extended };
}

// Generate pool capacity mock data
export function generatePoolCapacityData(
  poolId: string,
  filters?: PoolCapacityFilters
): PoolCapacityResponse {
  const granularity: CapitalFlowGranularity = filters?.granularity || "daily";
  const limit = filters?.limit || 100;

  // Get pool base data for realistic numbers
  const pool = mockPools.find((p) => p.id === poolId);
  const baseTvl = pool?.tvl || 50000000;
  const utilizationRate = pool?.utilizationRate || 70;

  // Set liquidity cap at ~120-150% of TVL
  const liquidityCap = Math.round(baseTvl * (1.2 + Math.random() * 0.3));

  // Determine date range
  const today = new Date();
  let endDate = filters?.end_date ? new Date(filters.end_date) : today;
  let startDate: Date;

  if (filters?.start_date) {
    startDate = new Date(filters.start_date);
  } else {
    startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 90);
  }

  const daysDiff = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let stepDays = 1;
  if (granularity === "weekly") stepDays = 7;
  if (granularity === "monthly") stepDays = 30;

  const numPoints = Math.min(Math.ceil(daysDiff / stepDays), limit);

  const data = [];

  // Start with some base values and evolve them
  let currentOutstanding = baseTvl * (utilizationRate / 100);
  let currentIdleCash = baseTvl - currentOutstanding;

  for (let i = numPoints - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i * stepDays);

    // Add some random variation (±3% per period)
    const outstandingChange = currentOutstanding * (Math.random() * 0.06 - 0.03);
    const idleChange = currentIdleCash * (Math.random() * 0.08 - 0.04);

    currentOutstanding = Math.max(0, currentOutstanding + outstandingChange);
    currentIdleCash = Math.max(0, currentIdleCash + idleChange);

    const tvl = currentOutstanding + currentIdleCash;
    const availableCapacity = liquidityCap - tvl;
    const utilization = currentOutstanding / liquidityCap;

    data.push({
      date: date.toISOString().split("T")[0],
      liquidity_cap: liquidityCap.toFixed(2),
      outstanding_balance: currentOutstanding.toFixed(2),
      idle_cash: currentIdleCash.toFixed(2),
      tvl: tvl.toFixed(2),
      available_capacity: availableCapacity.toFixed(2),
      utilization_rate: parseFloat(utilization.toFixed(4)),
    });
  }

  // Current values from the most recent data point
  const latest = data[data.length - 1];

  return {
    pool_id: poolId,
    pool_name: pool?.name || "Unknown Pool",
    asset_symbol: mockPoolsExtended[poolId]?.asset?.symbol || "USDC",
    data,
    current: {
      liquidity_cap: latest.liquidity_cap,
      outstanding_balance: latest.outstanding_balance,
      idle_cash: latest.idle_cash,
      available_capacity: latest.available_capacity,
      utilization_rate: latest.utilization_rate,
    },
    pagination: {
      total: data.length,
      limit,
      offset: filters?.offset || 0,
    },
  };
}

// Generate pool velocity mock data
export function generatePoolVelocityData(
  poolId: string,
  filters?: PoolVelocityFilters
): PoolVelocityResponse {
  const granularity: CapitalFlowGranularity = filters?.granularity || "weekly";
  const limit = filters?.limit || 52;

  // Get pool base data
  const pool = mockPools.find((p) => p.id === poolId);

  // Determine date range
  const today = new Date();
  const endDate = filters?.end_date ? new Date(filters.end_date) : today;
  let startDate: Date;

  if (filters?.start_date) {
    startDate = new Date(filters.start_date);
  } else {
    startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 90);
  }

  const daysDiff = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let stepDays = 7; // Default to weekly
  if (granularity === "daily") stepDays = 1;
  if (granularity === "monthly") stepDays = 30;

  const numPoints = Math.min(Math.ceil(daysDiff / stepDays), limit);

  const data = [];

  // Summary accumulators
  let totalLoansFunded = 0;
  let totalRedemptionsProcessed = 0;
  let sumDaysToFund = 0;
  let sumDaysToProcess = 0;

  for (let i = numPoints - 1; i >= 0; i--) {
    const periodEnd = new Date(endDate);
    periodEnd.setDate(periodEnd.getDate() - i * stepDays);
    const periodStart = new Date(periodEnd);
    periodStart.setDate(periodStart.getDate() - stepDays);

    // Generate realistic velocity metrics
    // Loan funding typically takes 1-5 days
    const avgDaysToFund = 1 + Math.random() * 4;
    const medianDaysToFund = avgDaysToFund * (0.8 + Math.random() * 0.3);
    const p90DaysToFund = avgDaysToFund * (1.5 + Math.random() * 0.5);
    const loansFunded = Math.floor(Math.random() * 4); // 0-3 loans per period
    const totalPrincipalFunded = loansFunded * (500000 + Math.random() * 2000000);

    // Redemption processing typically takes 7-21 days
    const avgDaysToProcess = 7 + Math.random() * 14;
    const medianDaysToProcess = avgDaysToProcess * (0.9 + Math.random() * 0.2);
    const p90DaysToProcess = avgDaysToProcess * (1.3 + Math.random() * 0.4);
    const redemptionsProcessed = Math.floor(Math.random() * 8); // 0-7 redemptions per period
    const totalAssetsRedeemed = redemptionsProcessed * (50000 + Math.random() * 500000);

    // Accumulate for summary
    totalLoansFunded += loansFunded;
    totalRedemptionsProcessed += redemptionsProcessed;
    if (loansFunded > 0) sumDaysToFund += avgDaysToFund * loansFunded;
    if (redemptionsProcessed > 0) sumDaysToProcess += avgDaysToProcess * redemptionsProcessed;

    data.push({
      period_start: periodStart.toISOString().split("T")[0],
      period_end: periodEnd.toISOString().split("T")[0],
      loan_velocity: {
        avg_days_to_fund: parseFloat(avgDaysToFund.toFixed(1)),
        median_days_to_fund: parseFloat(medianDaysToFund.toFixed(1)),
        p90_days_to_fund: parseFloat(p90DaysToFund.toFixed(1)),
        loans_funded: loansFunded,
        total_principal_funded: totalPrincipalFunded.toFixed(2),
      },
      redemption_velocity: {
        avg_days_to_process: parseFloat(avgDaysToProcess.toFixed(1)),
        median_days_to_process: parseFloat(medianDaysToProcess.toFixed(1)),
        p90_days_to_process: parseFloat(p90DaysToProcess.toFixed(1)),
        redemptions_processed: redemptionsProcessed,
        total_assets_redeemed: totalAssetsRedeemed.toFixed(2),
      },
    });
  }

  // Calculate summary averages
  const avgLoanDays = totalLoansFunded > 0 ? sumDaysToFund / totalLoansFunded : 0;
  const avgRedemptionDays = totalRedemptionsProcessed > 0 ? sumDaysToProcess / totalRedemptionsProcessed : 0;

  return {
    pool_id: poolId,
    pool_name: pool?.name || "Unknown Pool",
    granularity,
    data,
    summary: {
      period_start: startDate.toISOString().split("T")[0],
      period_end: endDate.toISOString().split("T")[0],
      loan_velocity: {
        avg_days_to_fund: parseFloat(avgLoanDays.toFixed(1)),
        median_days_to_fund: parseFloat((avgLoanDays * 0.9).toFixed(1)),
        total_loans_funded: totalLoansFunded,
      },
      redemption_velocity: {
        avg_days_to_process: parseFloat(avgRedemptionDays.toFixed(1)),
        median_days_to_process: parseFloat((avgRedemptionDays * 0.95).toFixed(1)),
        total_redemptions_processed: totalRedemptionsProcessed,
      },
    },
    pagination: {
      total: data.length,
      limit,
      offset: filters?.offset || 0,
    },
  };
}
