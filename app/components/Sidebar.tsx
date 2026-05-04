import { Badge } from "./ui/Badge";
import { Card, CardContent } from "./ui/Card";

type MenuTab =
  | "Dashboard"
  | "Check Balance"
  | "Deposit"
  | "Withdraw"
  | "Transactions";

const items: Array<{ label: MenuTab; description: string }> = [
  { label: "Dashboard", description: "Overview" },
  { label: "Check Balance", description: "Live lookup" },
  { label: "Deposit", description: "Add funds" },
  { label: "Withdraw", description: "Cash out" },
  { label: "Transactions", description: "History" },
];

export function Sidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: MenuTab;
  onTabChange: (tab: MenuTab) => void;
}) {
  return (
    <Card className="h-fit overflow-hidden">
      <CardContent className="p-5">
        <div className="rounded-2xl bg-slate-950 p-5 text-white">
          <Badge variant="success" className="bg-emerald-400/15 text-emerald-300">
            Mainframe Powered
          </Badge>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Horizon ATM</h1>
          <p className="mt-2 text-sm text-slate-300">
            Modern ATM dashboard for z/OS-backed banking actions.
          </p>
        </div>

        <nav className="mt-6 space-y-2">
          {items.map((item) => {
            const isActive = item.label === activeTab;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onTabChange(item.label)}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.22)]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className={`text-xs ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                    {item.description}
                  </p>
                </div>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-white" : "bg-slate-300"}`}
                />
              </button>
            );
          })}
        </nav>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Runtime Stack
          </p>
          <p className="mt-3 text-sm font-semibold text-slate-900">REXX Execution Layer</p>
          <p className="mt-1 text-sm text-slate-500">Dataset Storage (No DB)</p>
        </div>
      </CardContent>
    </Card>
  );
}
