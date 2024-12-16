export interface EditProductForm {
  name: string;
  desc: string | null;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
}

export interface ErrorEditProductForm {
  name: string;
  desc: string;
  category: string;
  buyingPrice: string;
  sellingPrice: string;
}

export const initProductEditProductForm: EditProductForm = {
  name: "",
  desc: "",
  category: "",
  buyingPrice: 0,
  sellingPrice: 0,
};

export interface CreateProductForm extends EditProductForm {
  initialStock: number;
}

export const initCreateProductForm: CreateProductForm = {
  ...initProductEditProductForm,
  initialStock: 0,
};

export interface ErrorCreateProductForm extends ErrorEditProductForm {
  initialStock: string;
}

export interface DeletePicturesForm {
  ids: string[];
}
