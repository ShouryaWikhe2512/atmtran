import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Input } from "./ui/Input";

const quickAmounts = [100, 250, 500, 1000];

export function ActionPanel({
  accountId,
  amount,
  errorMessage,
  isCheckingBalance,
  isDepositing,
  isWithdrawing,
  onAccountIdChange,
  onAmountChange,
  onCheckBalance,
  onDeposit,
  onWithdraw,
}: {
  accountId: string;
  amount: string;
  errorMessage: string | null;
  isCheckingBalance: boolean;
  isDepositing: boolean;
  isWithdrawing: boolean;
  onAccountIdChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onCheckBalance: () => void;
  onDeposit: () => void;
  onWithdraw: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.24em]">
              ATM Controls
            </CardDescription>
            <CardTitle className="mt-2 text-3xl">Action Panel</CardTitle>
          </div>
          <Badge variant="secondary">TSO + REXX</Badge>
        </CardHeader>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Account ID</span>
            <Input
              value={accountId}
              onChange={(event) => onAccountIdChange(event.target.value)}
              placeholder="1001"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Amount</span>
            <Input
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              placeholder="500"
              inputMode="numeric"
            />
          </label>

          <div className="flex flex-wrap gap-2.5">
            {quickAmounts.map((value) => (
              <Button
                key={value}
                type="button"
                variant="outline"
                className="h-10 rounded-full px-4 py-0 font-mono text-xs"
                onClick={() => onAmountChange(String(value))}
              >
                ${value}
              </Button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Button type="button" variant="secondary" onClick={onCheckBalance} disabled={isCheckingBalance}>
              {isCheckingBalance ? "Checking..." : "Check Balance"}
            </Button>
            <Button type="button" variant="success" onClick={onDeposit} disabled={isDepositing}>
              {isDepositing ? "Depositing..." : "Deposit"}
            </Button>
            <Button type="button" variant="destructive" onClick={onWithdraw} disabled={isWithdrawing}>
              {isWithdrawing ? "Withdrawing..." : "Withdraw"}
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">
              ATM Runtime
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Node.js on USS invokes TSO-hosted REXX scripts and updates flat datasets through
              EXECIO for a real mainframe transaction flow.
            </p>
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
