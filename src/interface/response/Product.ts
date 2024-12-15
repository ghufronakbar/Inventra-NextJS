import { Category } from "./Category";
import { Picture } from "./Picture";
import { Transaction } from "./Transaction";

export interface Product {
  id: string;
  slug: string;
  name: string;
  desc: string | null;
  categoryId: string;
  initialStock: number;
  buyingPrice: number;
  sellingPrice: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  pictures: Picture[];
  transactions: Transaction[];
  currentStock: number;
  income: number;
  outcome: number;
  totalProductIn: number;
  totalProductOut: number;
  totalTransactionIn: number;
  totalTransactionOut: number;
}
