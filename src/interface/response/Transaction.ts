export interface Transaction {
  id: string;
  productId: string;
  type: TransactionType;
  amount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionType = "IN" | "OUT";
