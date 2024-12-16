export interface Record {
  id: string;
  desc: string;
  type: RecordType;
  createdAt: Date;
  updatedAt: Date;
}

export type RecordType =
  | "IN_TRANSACTION"
  | "OUT_TRANSACTION"
  | "CREATE_PRODUCT"
  | "EDIT_PRODUCT"
  | "DELETE_PRODUCT"
  | "REGISTER"
  | "ACCOUNT_CONFIRMED"
  | "ACCOUNT_RESTORED"
  | "ACCOUNT_BANNED";

export const RECORD_TYPES_ADMIN: RecordType[] = [
  "IN_TRANSACTION",
  "OUT_TRANSACTION",
  "CREATE_PRODUCT",
  "EDIT_PRODUCT",
  "DELETE_PRODUCT",
  "REGISTER",
];

export const RECORD_TYPES_SUPER_ADMIN: RecordType[] = [
  ...RECORD_TYPES_ADMIN,
  "ACCOUNT_CONFIRMED",
  "ACCOUNT_RESTORED",
  "ACCOUNT_BANNED",
];
