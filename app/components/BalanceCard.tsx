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

function formatTimestamp(value: string | null) {
  if (!value) {
    return "Waiting for refresh";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function BalanceCard({
  accountId,
  balance,
  isLoading,
  lastUpdated,
  transactionCount,
}: {
  accountId: string;
  balance: number | null;
  isLoading: boolean;
  lastUpdated: string | null;
  transactionCount: number;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:p-8">
        <div>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em]">
                  Balance Card
                </CardDescription>
                <CardTitle className="mt-2 text-3xl md:text-4xl">
                  Account {accountId}
                </CardTitle>
              </div>
              <Badge variant="warning">Mainframe Powered</Badge>
            </div>
          </CardHeader>

          <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#0f172a,#1e3a8a_55%,#2563eb)] p-6 text-white shadow-[0_24px_48px_rgba(30,64,175,0.24)]">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-blue-100">
              Current Balance
            </p>
            <p className="mt-4 font-mono text-5xl font-semibold tracking-tight md:text-6xl">
              {isLoading && balance === null ? "..." : formatCurrency(balance ?? 0)}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-blue-100">Last Updated</p>
                <p className="mt-1 text-sm font-semibold">{formatTimestamp(lastUpdated)}</p>
              </div>
              <div className="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-blue-100">Transactions</p>
                <p className="mt-1 text-sm font-semibold">{transactionCount} loaded</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative flex h-44 w-44 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_210deg,_#2563eb_0deg,_#60a5fa_215deg,_#dbeafe_215deg,_#dbeafe_360deg)]" />
            <div className="absolute inset-[18px] rounded-full bg-white shadow-inner" />
            <div className="relative text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                ATM ID
              </p>
              <p className="mt-2 font-mono text-3xl font-semibold text-slate-950">{accountId}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
