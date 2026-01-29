"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { notFound } from "next/navigation";
import { CanvasHeader } from "@/components/layout/canvas-header";
import { CanvasSidebarHeader } from "@/components/layout/canvas-sidebar-header";
import { CanvasSidebar } from "@/components/layout/canvas-sidebar";
import { PoolEventsTable } from "@/components/protocol/pool-events-table";
import { LoansTable } from "@/components/protocol/loans-table";
import { CanvasContentSubject } from "@/components/protocol/canvas-content-subject";
import { CapitalFlowChart } from "@/components/protocol/capital-flow-chart";
import { PoolCapacityChart } from "@/components/protocol/pool-capacity-chart";
import { PoolVelocityChart } from "@/components/protocol/pool-velocity-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProtocol, getPoolEvents, getLoans, getPoolCapitalFlows, getPoolExtendedData, getPoolCapacity, getPoolVelocity } from "@/lib/api/services";
import type { BreadcrumbItem } from "@/components/layout/breadcrumb";
import type { CapitalFlowFilters, PoolCapacityFilters, PoolVelocityFilters } from "@/lib/api/types";

export default function ProtocolPage() {
  const params = useParams();
  const protocolId = params.id as string;

  const { data: protocol, isLoading: protocolLoading } = useSWR(
    protocolId ? `protocol-${protocolId}` : null,
    () => getProtocol(protocolId)
  );

  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("performance");

  // Auto-select first pool when protocol loads
  useEffect(() => {
    if (protocol?.pools && protocol.pools.length > 0 && !selectedPoolId) {
      setSelectedPoolId(protocol.pools[0].id);
    }
  }, [protocol, selectedPoolId]);

  const { data: eventsResponse, isLoading: eventsLoading } = useSWR(
    selectedPoolId ? `pool-events-${selectedPoolId}` : null,
    () => getPoolEvents(selectedPoolId!)
  );

  const { data: loansResponse, isLoading: loansLoading } = useSWR(
    selectedPoolId ? `pool-loans-${selectedPoolId}` : null,
    () => getLoans({ poolId: selectedPoolId! })
  );

  const [capitalFlowPeriod, setCapitalFlowPeriod] = useState(90);

  const capitalFlowFilters: CapitalFlowFilters = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - capitalFlowPeriod);
    return {
      granularity: capitalFlowPeriod <= 30 ? "daily" : capitalFlowPeriod <= 90 ? "daily" : "weekly",
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
    };
  }, [capitalFlowPeriod]);

  const { data: capitalFlowsResponse, isLoading: capitalFlowsLoading } = useSWR(
    selectedPoolId ? `pool-capital-flows-${selectedPoolId}-${capitalFlowPeriod}` : null,
    () => getPoolCapitalFlows(selectedPoolId!, capitalFlowFilters)
  );

  const { data: extendedPool } = useSWR(
    selectedPoolId ? `pool-extended-${selectedPoolId}` : null,
    () => getPoolExtendedData(selectedPoolId!)
  );

  const [capacityPeriod, setCapacityPeriod] = useState(90);

  const capacityFilters: PoolCapacityFilters = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - capacityPeriod);
    return {
      granularity: capacityPeriod <= 30 ? "daily" : capacityPeriod <= 90 ? "daily" : "weekly",
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
    };
  }, [capacityPeriod]);

  const { data: capacityResponse, isLoading: capacityLoading } = useSWR(
    selectedPoolId ? `pool-capacity-${selectedPoolId}-${capacityPeriod}` : null,
    () => getPoolCapacity(selectedPoolId!, capacityFilters)
  );

  const [velocityPeriod, setVelocityPeriod] = useState(90);

  const velocityFilters: PoolVelocityFilters = useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - velocityPeriod);
    return {
      granularity: velocityPeriod <= 30 ? "daily" : "weekly",
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
    };
  }, [velocityPeriod]);

  const { data: velocityResponse, isLoading: velocityLoading } = useSWR(
    selectedPoolId ? `pool-velocity-${selectedPoolId}-${velocityPeriod}` : null,
    () => getPoolVelocity(selectedPoolId!, velocityFilters)
  );

  if (protocolLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading protocol...</div>
      </div>
    );
  }

  if (!protocol) {
    notFound();
  }

  const selectedPool = protocol.pools.find((p) => p.id === selectedPoolId);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Protocols", href: "/dashboard" },
    { label: protocol.name },
  ];

  return (
    <div className="flex h-full flex-col">
      <CanvasHeader breadcrumbs={breadcrumbs} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Sidebar - Fixed */}
        <aside className="fixed top-[57px] left-[var(--sidebar-width)] bottom-0 flex w-72 shrink-0 flex-col border-r bg-background z-10">
          <CanvasSidebarHeader
            name={protocol.name}
            tvl={protocol.tvl}
            activePoolsCount={protocol.activePoolsCount}
          />
          <CanvasSidebar
            pools={protocol.pools}
            selectedPoolId={selectedPoolId}
            onPoolSelect={setSelectedPoolId}
            className="flex-1 overflow-auto"
          />
        </aside>

        {/* Main Content - with left margin to account for fixed sidebar */}
        <main className="flex-1 overflow-auto ml-72">
          {selectedPool ? (
            <CanvasContentSubject
              pool={selectedPool}
              extendedPool={extendedPool}
              capitalFlowData={capitalFlowsResponse?.data}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            >
              {activeTab === "performance" && (
                <div className="space-y-6">
                  <CapitalFlowChart
                    data={capitalFlowsResponse?.data || []}
                    isLoading={capitalFlowsLoading}
                    onPeriodChange={setCapitalFlowPeriod}
                  />

                  <PoolCapacityChart
                    data={capacityResponse?.data || []}
                    isLoading={capacityLoading}
                    onPeriodChange={setCapacityPeriod}
                  />

                  <PoolVelocityChart
                    data={velocityResponse?.data || []}
                    isLoading={velocityLoading}
                    onPeriodChange={setVelocityPeriod}
                  />
                </div>
              )}

              {activeTab === "loans" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Loans ({loansResponse?.data.length || 0})</CardTitle>
                      <CardDescription>
                        Current and historical loans for this pool
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <LoansTable
                        loans={loansResponse?.data || []}
                        isLoading={loansLoading}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Events</CardTitle>
                      <CardDescription>
                        Deposits, withdrawals, and other activity for this pool
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PoolEventsTable
                        events={eventsResponse?.data || []}
                        isLoading={eventsLoading}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </CanvasContentSubject>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground p-6">
              Select a pool from the sidebar to view details
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
