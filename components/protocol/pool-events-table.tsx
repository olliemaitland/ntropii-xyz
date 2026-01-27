"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { PoolEvent, EventType } from "@/lib/api/types";

interface PoolEventsTableProps {
  events: PoolEvent[];
  isLoading?: boolean;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getEventTypeVariant(type: EventType): "default" | "secondary" | "destructive" | "outline" {
  switch (type) {
    case "deposit":
      return "default";
    case "withdrawal":
      return "secondary";
    case "loan_originated":
      return "outline";
    case "loan_repaid":
      return "default";
    case "interest_payment":
      return "outline";
    case "default":
      return "destructive";
    default:
      return "outline";
  }
}

function formatEventType(type: EventType): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function PoolEventsTable({ events, isLoading }: PoolEventsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        Loading events...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        No events found for this pool.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Wallet</TableHead>
          <TableHead>Tx Hash</TableHead>
          <TableHead className="text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>
              <Badge variant={getEventTypeVariant(event.type)} className="capitalize">
                {formatEventType(event.type)}
              </Badge>
            </TableCell>
            <TableCell className="font-mono">{formatCurrency(event.amount)}</TableCell>
            <TableCell className="font-mono text-muted-foreground">
              {truncateAddress(event.walletAddress)}
            </TableCell>
            <TableCell className="font-mono text-muted-foreground">
              {truncateAddress(event.txHash)}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {formatDate(event.timestamp)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
