import type { Transaction } from "./dashboard-types";
import { Badge } from "./ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function TransactionsTable({
  transactions,
  isLoading,
}: {
  transactions: Transaction[];
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em]">
              Transaction History
            </CardDescription>
            <CardTitle className="mt-2 text-3xl">Recent Activity</CardTitle>
          </div>
          <Badge variant="outline">Scrollable feed</Badge>
        </CardHeader>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid grid-cols-[0.9fr_0.8fr_1.2fr] gap-3 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 md:grid-cols-[0.9fr_0.8fr_1.4fr]">
            <span>Type</span>
            <span>Amount</span>
            <span>Timestamp</span>
          </div>

          <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-100">
            {isLoading ? (
              <div className="px-5 py-12 text-center font-mono text-sm font-semibold text-slate-600">
                Pulling transactions from z/OS datasets...
              </div>
            ) : transactions.length === 0 ? (
              <div className="px-5 py-12 text-center font-mono text-sm font-semibold text-slate-600">
                No transaction history available for this account.
              </div>
            ) : (
              transactions.map((transaction, index) => (
                <div
                  key={`${transaction.timestamp}-${index}`}
                  className="grid grid-cols-[0.9fr_0.8fr_1.2fr] gap-3 px-5 py-4 text-sm md:grid-cols-[0.9fr_0.8fr_1.4fr]"
                >
                  <div>
                    <Badge variant={transaction.type === "DEPOSIT" ? "success" : "warning"}>
                      {transaction.type === "DEPOSIT" ? "Deposit" : "Withdraw"}
                    </Badge>
                  </div>
                  <div className="font-mono font-semibold text-slate-900">
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="font-mono text-slate-500">
                    {formatTimestamp(transaction.timestamp)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
