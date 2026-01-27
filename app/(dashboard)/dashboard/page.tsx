import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Private credit intelligence and analytics overview
        </p>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Value Locked</CardDescription>
            <CardTitle className="text-3xl font-semibold">$2.4B</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Pools</CardDescription>
            <CardTitle className="text-3xl font-semibold">47</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Across 4 protocols
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. APY</CardDescription>
            <CardTitle className="text-3xl font-semibold">8.2%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Weighted by pool size
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest transactions and pool updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                Activity feed placeholder
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Protocol Distribution</CardTitle>
            <CardDescription>
              TVL breakdown by protocol
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                Chart placeholder
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
