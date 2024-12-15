import { TransactionType } from "../response/Transaction";

export interface CreateTransactionForm {
  productId: string;
  type: TransactionType;
  amount: number;
}

export const initCreateTransactionForm: CreateTransactionForm = {
  productId: "",
  type: "IN",
  amount: 0,
};

export interface ErrorTransactionForm {
  amount: string;
}
