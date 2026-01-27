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
import type { Loan, LoanStatus } from "@/lib/api/types";

interface LoansTableProps {
  loans: Loan[];
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

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

function getLoanStatusVariant(status: LoanStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "current":
      return "default";
    case "late":
      return "secondary";
    case "defaulted":
      return "destructive";
    case "repaid":
      return "outline";
    default:
      return "outline";
  }
}

export function LoansTable({ loans, isLoading }: LoansTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        Loading loans...
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        No loans found for this pool.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Borrower</TableHead>
          <TableHead>Principal</TableHead>
          <TableHead>Outstanding</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Maturity</TableHead>
          <TableHead className="text-right">Next Payment</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => (
          <TableRow key={loan.id}>
            <TableCell className="font-medium">{loan.borrowerName}</TableCell>
            <TableCell className="font-mono">{formatCurrency(loan.principalAmount)}</TableCell>
            <TableCell className="font-mono">{formatCurrency(loan.outstandingAmount)}</TableCell>
            <TableCell className="font-mono">{loan.interestRate.toFixed(1)}%</TableCell>
            <TableCell>
              <Badge variant={getLoanStatusVariant(loan.status)} className="capitalize">
                {loan.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{formatDate(loan.maturityDate)}</TableCell>
            <TableCell className="text-right text-muted-foreground">
              {formatDate(loan.nextPaymentDate)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
