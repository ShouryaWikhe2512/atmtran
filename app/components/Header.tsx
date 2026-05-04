import type { HealthResponse } from "./dashboard-types";
import { Badge } from "./ui/Badge";
import { Card, CardContent } from "./ui/Card";

export function Header({
  accountId,
  health,
}: {
  accountId: string;
  health: HealthResponse | null;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Banking ATM Simulator
          </p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            Welcome, User
          </h2>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <Badge variant="outline" className="px-4 py-2 text-sm">
            <span className="text-slate-400">Account ID</span>
            <span className="font-mono text-slate-950">{accountId}</span>
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            {health?.status === "UP" ? "Connected to z/OS" : "Checking z/OS status"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
