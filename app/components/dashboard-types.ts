export type HealthResponse = {
  status: string;
  zid: string;
};

export type BalanceResponse = {
  success: boolean;
  account_id?: string;
  balance?: number;
  error?: string;
};

export type MutationResponse = {
  success: boolean;
  account_id?: string;
  old_balance?: number;
  new_balance?: number;
  amount?: number;
  timestamp?: string;
  error?: string;
};

export type Transaction = {
  account_id: string;
  type: string;
  amount: number;
  timestamp: string;
};

export type TransactionsResponse = {
  success: boolean;
  account_id?: string;
  count?: number;
  transactions?: Transaction[];
  error?: string;
};

export type ToastMessage = {
  id: string;
  message: string;
  tone: "success" | "error";
};

export type OperationSummary = {
  type: "DEPOSIT" | "WITHDRAW";
  accountId: string;
  amount: number;
  oldBalance: number;
  newBalance: number;
  timestamp: string;
};
