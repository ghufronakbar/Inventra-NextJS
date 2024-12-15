export interface Params {
  page?: number;
  search?: string;
}

export interface ProductParams extends Params {
  categoryId?: string;
}
