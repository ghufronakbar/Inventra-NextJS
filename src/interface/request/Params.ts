import { Role } from "../response/Api";
import { RecordType } from "../response/Record";
import { TransactionType } from "../response/Transaction";

export interface Params {
  page?: number;
  search?: string;
}

export interface ProductParams extends Params {
  categoryId?: string;
}

export interface RecordParams extends Params {
  type?: RecordType;
}

export interface TransactionParams extends Params {
  type?: TransactionType;
}

export interface UserParams extends Params {
  type?: Role;
}
