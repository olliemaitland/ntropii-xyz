"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { notFound } from "next/navigation";
import { CanvasHeader } from "@/components/layout/canvas-header";
import { CanvasSidebarHeader } from "@/components/layout/canvas-sidebar-header";
import { CanvasSidebar } from "@/components/layout/canvas-sidebar";
import { PoolEventsTable } from "@/components/protocol/pool-events-table";
import { LoansTable } from "@/components/protocol/loans-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProtocol, getPoolEvents, getLoans } from "@/lib/api/services";
import type { BreadcrumbItem } from "@/components/layout/breadcrumb";

export default function ProtocolPage() {
  const params = useParams();
  const protocolId = params.id as string;

  const { data: protocol, isLoading: protocolLoading } = useSWR(
    protocolId ? `protocol-${protocolId}` : null,
    () => getProtocol(protocolId)
  );

  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);

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
        {/* Canvas Sidebar */}
        <aside className="flex w-72 shrink-0 flex-col border-r bg-background">
          <CanvasSidebarHeader
            name={protocol.name}
            status={protocol.status}
            tvl={protocol.tvl}
            apy={protocol.apy}
            activePoolsCount={protocol.activePoolsCount}
          />
          <CanvasSidebar
            pools={protocol.pools}
            selectedPoolId={selectedPoolId}
            onPoolSelect={setSelectedPoolId}
            className="flex-1"
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {selectedPool ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">{selectedPool.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedPool.assetClass.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} | 
                  Min deposit: ${selectedPool.minDeposit.toLocaleString()} | 
                  Lockup: {selectedPool.lockupPeriodDays > 0 ? `${selectedPool.lockupPeriodDays} days` : "None"}
                </p>
              </div>

              <Tabs defaultValue="events" className="w-full">
                <TabsList>
                  <TabsTrigger value="events">Pool Events</TabsTrigger>
                  <TabsTrigger value="loans">Loans ({loansResponse?.data.length || 0})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="events" className="mt-4">
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
                </TabsContent>

                <TabsContent value="loans" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Loans</CardTitle>
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
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select a pool from the sidebar to view details
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
