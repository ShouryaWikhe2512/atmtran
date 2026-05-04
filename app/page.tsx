"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ActionPanel } from "./components/ActionPanel";
import { BalanceCard } from "./components/BalanceCard";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { SystemStatusCard } from "./components/SystemStatusCard";
import { TransactionsTable } from "./components/TransactionsTable";
import type {
  BalanceResponse,
  HealthResponse,
  MutationResponse,
  OperationSummary,
  ToastMessage,
  Transaction,
  TransactionsResponse,
} from "./components/dashboard-types";

const BASE_URL = "/api/atm";

type MenuTab =
  | "Dashboard"
  | "Check Balance"
  | "Deposit"
  | "Withdraw"
  | "Transactions";

export default function Home() {
  const [activeTab, setActiveTab] = useState<MenuTab>("Dashboard");
  const [accountId, setAccountId] = useState("1001");
  const [draftAccountId, setDraftAccountId] = useState("1001");
  const [amount, setAmount] = useState("500");
  const [balance, setBalance] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [latestOperation, setLatestOperation] = useState<OperationSummary | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const pushToast = useCallback((message: string, tone: "success" | "error") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, message, tone }]);
  }, []);

  const loadHealth = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      const data: HealthResponse = await response.json();
      setHealth(data);
    } catch {
      setHealth(null);
    }
  }, []);

  const loadAccount = useCallback(async (
    targetAccountId: string,
    options?: { silent?: boolean; announce?: boolean },
  ) => {
    const normalizedAccountId = targetAccountId.trim();
    const silent = options?.silent ?? false;

    if (!normalizedAccountId) {
      setErrorMessage("Please enter a valid account ID.");
      pushToast("Please enter a valid account ID.", "error");
      setIsLoadingAccount(false);
      if (!silent) {
        setIsCheckingBalance(false);
      }
      return;
    }

    if (!silent) {
      setIsCheckingBalance(true);
    }

    setIsLoadingAccount(true);
    setErrorMessage(null);

    try {
      const [balanceResponse, transactionsResponse] = await Promise.all([
        fetch(`${BASE_URL}/balance/${normalizedAccountId}`),
        fetch(`${BASE_URL}/transactions/${normalizedAccountId}`),
      ]);

      const balanceData: BalanceResponse = await balanceResponse.json();
      const transactionsData: TransactionsResponse =
        await transactionsResponse.json();

      if (!balanceData.success) {
        setBalance(null);
        setTransactions([]);
        setErrorMessage(balanceData.error ?? "Unable to fetch account balance.");
        pushToast(balanceData.error ?? "Balance lookup failed.", "error");
        return;
      }

      setBalance(balanceData.balance ?? 0);
      setTransactions(transactionsData.transactions ?? []);
      setLastUpdated(new Date().toISOString());
      setAccountId(normalizedAccountId);

      if (options?.announce) {
        pushToast(`Balance refreshed for account ${normalizedAccountId}.`, "success");
      }
    } catch {
      setBalance(null);
      setTransactions([]);
      setErrorMessage("The ATM service is unreachable right now.");
      pushToast("Connection to the ATM backend failed.", "error");
    } finally {
      setIsLoadingAccount(false);
      if (!silent) {
        setIsCheckingBalance(false);
      }
    }
  }, [pushToast]);

  async function handleMutation(type: "deposit" | "withdraw") {
    const normalizedAccountId = draftAccountId.trim();
    const amountNumber = Number(amount);

    if (!normalizedAccountId || Number.isNaN(amountNumber) || amountNumber <= 0) {
      const message = "Please enter a valid account ID and amount.";
      setErrorMessage(message);
      pushToast(message, "error");
      return;
    }

    setErrorMessage(null);
    setActiveTab(type === "deposit" ? "Deposit" : "Withdraw");

    if (type === "deposit") {
      setIsDepositing(true);
    } else {
      setIsWithdrawing(true);
    }

    try {
      const response = await fetch(`${BASE_URL}/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_id: normalizedAccountId,
          amount: amountNumber,
        }),
      });

      const data: MutationResponse = await response.json();

      if (!data.success) {
        const message = data.error ?? `Unable to ${type} funds.`;
        setErrorMessage(message);
        pushToast(message, "error");
        return;
      }

      setBalance(data.new_balance ?? balance);
      setLastUpdated(data.timestamp ?? new Date().toISOString());
      setAccountId(normalizedAccountId);
      setLatestOperation({
        type: type === "deposit" ? "DEPOSIT" : "WITHDRAW",
        accountId: data.account_id ?? normalizedAccountId,
        amount: data.amount ?? amountNumber,
        oldBalance: data.old_balance ?? 0,
        newBalance: data.new_balance ?? 0,
        timestamp: data.timestamp ?? new Date().toISOString(),
      });
      pushToast(
        `${type === "deposit" ? "Deposit" : "Withdraw"} successful for $${amountNumber}.`,
        "success",
      );
      await loadAccount(normalizedAccountId, { silent: true });
    } catch {
      const message = `The ${type} request could not be completed.`;
      setErrorMessage(message);
      pushToast(message, "error");
    } finally {
      if (type === "deposit") {
        setIsDepositing(false);
      } else {
        setIsWithdrawing(false);
      }
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadHealth();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadHealth]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadAccount("1001", { silent: true });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadAccount]);

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToasts((current) => current.slice(1));
    }, 2800);

    return () => window.clearTimeout(timeout);
  }, [toasts]);

  const accountStats = useMemo(() => {
    const deposits = transactions.filter((item) => item.type === "DEPOSIT").length;
    const withdrawals = transactions.filter((item) => item.type === "WITHDRAW").length;

    return {
      deposits,
      withdrawals,
      latest: transactions[0] ?? null,
    };
  }, [transactions]);

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid max-w-[1520px] gap-6 xl:grid-cols-[250px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:self-start">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="space-y-6">
          <Header accountId={accountId} health={health} />

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_360px]">
            <BalanceCard
              accountId={accountId}
              balance={balance}
              isLoading={isLoadingAccount}
              lastUpdated={lastUpdated}
              transactionCount={transactions.length}
            />
            <SystemStatusCard
              health={health}
              lastTransaction={accountStats.latest}
              depositCount={accountStats.deposits}
              withdrawCount={accountStats.withdrawals}
            />
          </section>

          <section className="grid gap-6 2xl:grid-cols-[430px_minmax(0,1fr)]">
            <ActionPanel
              accountId={draftAccountId}
              amount={amount}
              errorMessage={errorMessage}
              latestOperation={latestOperation}
              isCheckingBalance={isCheckingBalance}
              isDepositing={isDepositing}
              isWithdrawing={isWithdrawing}
              onAccountIdChange={setDraftAccountId}
              onAmountChange={setAmount}
              onCheckBalance={() => {
                setActiveTab("Check Balance");
                void loadAccount(draftAccountId, { announce: true });
              }}
              onDeposit={() => void handleMutation("deposit")}
              onWithdraw={() => void handleMutation("withdraw")}
            />
            <TransactionsTable transactions={transactions} isLoading={isLoadingAccount} />
          </section>
        </div>
      </div>

      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.12)] ${
              toast.tone === "success"
                ? "border-emerald-200 bg-white text-emerald-700"
                : "border-rose-200 bg-white text-rose-700"
            }`}
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              {toast.tone === "success" ? "Success" : "Error"}
            </span>
            <p className="mt-1 text-sm font-semibold">{toast.message}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
