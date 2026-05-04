import type { HealthResponse, Transaction } from "./dashboard-types";
import { Badge } from "./ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";

function formatTimestamp(value: string | undefined) {
  if (!value) {
    return "--";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

export function SystemStatusCard({
  health,
  lastTransaction,
  depositCount,
  withdrawCount,
}: {
  health: HealthResponse | null;
  lastTransaction: Transaction | null;
  depositCount: number;
  withdrawCount: number;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em]">
              System Info
            </CardDescription>
            <CardTitle className="mt-2 text-3xl">Mainframe Stack</CardTitle>
          </div>
          <Badge variant="secondary">z/OS Live</Badge>
        </CardHeader>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white">
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">$ health</span>
              <span className="font-semibold text-emerald-300">
                {health?.status === "UP" ? "API Status: UP" : "API Status: DOWN"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">$ backend</span>
              <span className="font-semibold">Node.js (USS)</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">$ execution</span>
              <span className="font-semibold">TSO + REXX</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">$ storage</span>
              <span className="font-semibold">z/OS Datasets</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">$ engine</span>
              <span className="font-semibold">Dataset Storage (No DB)</span>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <InfoRow label="Latest movement" value={lastTransaction?.type ?? "No activity"} />
          <InfoRow
            label="Last timestamp"
            value={formatTimestamp(lastTransaction?.timestamp)}
          />
          <InfoRow label="Deposits" value={String(depositCount)} />
          <InfoRow label="Withdrawals" value={String(withdrawCount)} />
        </div>
      </CardContent>
    </Card>
  );
}
