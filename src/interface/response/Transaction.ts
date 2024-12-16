import { Product } from "./Product";

export interface Transaction {
  id: string;
  productId: string;
  type: TransactionType;
  amount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

export type TransactionType = "IN" | "OUT";
