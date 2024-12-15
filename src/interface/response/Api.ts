import { AxiosError, AxiosResponse } from "axios";

export interface Pagination {
  currentPage: number;
  totalPage: number;
  currentData: number;
  totalData: number;
  cursor: {
    isNextPage: boolean;
    isPrevPage: boolean;
  };
}

export const initPagination: Pagination = {
  currentPage: 1,
  totalPage: 1,
  currentData: 0,
  totalData: 0,
  cursor: {
    isNextPage: false,
    isPrevPage: false,
  },
};

export interface APIRes {
  status: number;
  message: string;
  decoded?: Decoded;
}

export interface Decoded {
  id: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

export type Role = "SUPER_ADMIN" | "ADMIN";

export interface ResOk<T = undefined, P = undefined> extends APIRes {
  data: T;
  pagination: P;
}

export interface ResBad extends AxiosError {
  response?: AxiosResponse<APIRes>;
}
