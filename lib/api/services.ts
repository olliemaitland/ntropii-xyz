import type {
  Summary,
  Protocol,
  ProtocolWithPools,
  Pool,
  PoolWithLoans,
  Loan,
  PoolEvent,
  LoanEvent,
  PoolFilters,
  LoanFilters,
  EventFilters,
  PaginatedResponse,
  CapitalFlowResponse,
  CapitalFlowFilters,
  PoolExtended,
} from "./types";
import {
  mockSummary,
  mockProtocols,
  mockPools,
  mockLoans,
  mockPoolEvents,
  mockLoanEvents,
  getProtocolWithPools,
  getPoolWithLoans,
  generateCapitalFlowData,
  getPoolExtended,
} from "./mocks";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Summary
export async function getSummary(): Promise<Summary> {
  await delay(100);
  return mockSummary;
}

// Protocols
export async function getProtocols(): Promise<Protocol[]> {
  await delay(100);
  return mockProtocols;
}

export async function getProtocol(id: string): Promise<ProtocolWithPools | null> {
  await delay(100);
  return getProtocolWithPools(id);
}

// Pools
export async function getPools(filters?: PoolFilters): Promise<PaginatedResponse<Pool>> {
  await delay(100);

  let filteredPools = [...mockPools];

  if (filters?.protocolId) {
    filteredPools = filteredPools.filter((p) => p.protocolId === filters.protocolId);
  }
  if (filters?.status) {
    filteredPools = filteredPools.filter((p) => p.status === filters.status);
  }
  if (filters?.assetClass) {
    filteredPools = filteredPools.filter((p) => p.assetClass === filters.assetClass);
  }

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const totalItems = filteredPools.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedPools = filteredPools.slice(startIndex, startIndex + pageSize);

  return {
    data: paginatedPools,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}

export async function getPool(id: string): Promise<PoolWithLoans | null> {
  await delay(100);
  return getPoolWithLoans(id);
}

// Pool Events
export async function getPoolEvents(
  poolId: string,
  filters?: EventFilters
): Promise<PaginatedResponse<PoolEvent>> {
  await delay(100);

  let filteredEvents = mockPoolEvents.filter((e) => e.poolId === poolId);

  if (filters?.type) {
    filteredEvents = filteredEvents.filter((e) => e.type === filters.type);
  }
  if (filters?.startDate) {
    filteredEvents = filteredEvents.filter(
      (e) => new Date(e.timestamp) >= new Date(filters.startDate!)
    );
  }
  if (filters?.endDate) {
    filteredEvents = filteredEvents.filter(
      (e) => new Date(e.timestamp) <= new Date(filters.endDate!)
    );
  }

  // Sort by timestamp descending
  filteredEvents.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + pageSize);

  return {
    data: paginatedEvents,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}

// Loans
export async function getLoans(filters?: LoanFilters): Promise<PaginatedResponse<Loan>> {
  await delay(100);

  let filteredLoans = [...mockLoans];

  if (filters?.poolId) {
    filteredLoans = filteredLoans.filter((l) => l.poolId === filters.poolId);
  }
  if (filters?.status) {
    filteredLoans = filteredLoans.filter((l) => l.status === filters.status);
  }

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const totalItems = filteredLoans.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedLoans = filteredLoans.slice(startIndex, startIndex + pageSize);

  return {
    data: paginatedLoans,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}

export async function getLoan(id: string): Promise<Loan | null> {
  await delay(100);
  return mockLoans.find((l) => l.id === id) || null;
}

// Loan Events
export async function getLoanEvents(
  loanId: string,
  filters?: EventFilters
): Promise<PaginatedResponse<LoanEvent>> {
  await delay(100);

  let filteredEvents = mockLoanEvents.filter((e) => e.loanId === loanId);

  if (filters?.type) {
    filteredEvents = filteredEvents.filter((e) => e.type === filters.type);
  }

  // Sort by timestamp descending
  filteredEvents.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const totalItems = filteredEvents.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + pageSize);

  return {
    data: paginatedEvents,
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
}

// Capital Flows
export async function getPoolCapitalFlows(
  poolId: string,
  filters?: CapitalFlowFilters
): Promise<CapitalFlowResponse> {
  await delay(100);
  return generateCapitalFlowData(poolId, filters);
}

// Extended Pool Data
export async function getPoolExtendedData(poolId: string): Promise<PoolExtended | null> {
  await delay(100);
  return getPoolExtended(poolId);
}
