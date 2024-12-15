import axiosInstance from "@/config/axiosInstance";
import { Pagination, ResBad, ResOk } from "@/interface/response/Api";
import { print } from "@/utils/helper";
import { Product } from "@/interface/response/Product";
import { ProductParams } from "@/interface/request/Params";
import toast from "@/helper/toast";
import { NextRouter } from "next/router";
import {
  DeletePicturesForm,
  EditProductForm,
  ErrorProductForm,
} from "@/interface/request/Product";

export const getAllProducts = async (params?: ProductParams) => {
  try {
    const { data } = await axiosInstance.get<ResOk<Product[], Pagination>>(
      "/products",
      {
        params,
      }
    );
    return data;
  } catch (error) {
    print.error(error);
  }
};

export const getProductBySlug = async (slug: string, router: NextRouter) => {
  try {
    const { data } = await axiosInstance.get<ResOk<Product>>(
      `/products/${slug}`
    );
    return data;
  } catch (error) {
    router.push("/product");
    print.error(error);
  }
};

export const editProductBySlug = async (
  slug: string,
  form: EditProductForm,
  loading: boolean,
  setLoading: (loading: boolean) => void,
  setErrorForm: (errorForm?: ErrorProductForm) => void,
  afterSuccess?: () => void
) => {
  if (loading) return;
  const errorForm: ErrorProductForm = {} as ErrorProductForm;

  if (!form.name) {
    errorForm.name = "Nama wajib diisi";
  }

  if (!form.buyingPrice || form.buyingPrice < 0) {
    errorForm.buyingPrice = "Harga beli harus diisi bilangan positif";
  }

  if (!form.sellingPrice || form.sellingPrice < 0) {
    errorForm.sellingPrice = "Harga jual harus diisi bilangan positif";
  }

  if (Object.keys(errorForm).length > 0) {
    setErrorForm(errorForm);
    return;
  }

  try {
    setLoading(true);
    const { data } = await axiosInstance.put<ResOk<Product>>(
      `/products/${slug}`,
      form
    );
    toast.success(data?.message || "Produk berhasil diubah!");
    afterSuccess?.();
  } catch (error) {
    const err = error as ResBad;
    toast.error(err?.response?.data?.message);
    print.error(error);
  } finally {
    setLoading(false);
  }
};

export const deleteProductBySlug = async (slug: string) => {
  try {
    const { data } = await axiosInstance.delete<ResOk<Product>>(
      `/products/${slug}`
    );
    toast.success(data?.message || "Produk berhasil dihapus!");
  } catch (error) {
    const err = error as ResBad;
    toast.error(err?.response?.data?.message);
    print.error(error);
  }
};

export const deletePicturesProduct = async (
  form: DeletePicturesForm,
  loading: boolean,
  setLoading: (loading: boolean) => void,
  afterSuccess?: () => void
) => {
  try {
    if (loading) return;
    setLoading(true);
    const { data } = await axiosInstance.delete<ResOk<Product>>(
      `/products/pictures`,
      {
        data: form,
      }
    );
    toast.success(data?.message || "Foto produk berhasil dihapus!");
    afterSuccess?.();
  } catch (error) {
    const err = error as ResBad;
    toast.error(err?.response?.data?.message);
    print.error(error);
  } finally {
    setLoading(false);
  }
};

export const postPicturesProduct = async (
  slug: string,
  pictures: File[],
  loading: boolean,
  setLoading: (loading: boolean) => void,
  afterSuccess?: () => void
) => {
  try {
    if (loading) return;
    setLoading(true);
    const formData = new FormData();
    print.log("pictures length", pictures.length);
    for (let i = 0; i < pictures.length; i++) {
      formData.append("pictures", pictures[i]);
      print.log("appending picture", i, pictures[i]);
    }
    print.log("form data", formData);
    const { data } = await axiosInstance.patch<ResOk<Product>>(
      `/products/${slug}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    afterSuccess?.();
    toast.success(data?.message || "Produk berhasil diubah!");
  } catch (error) {
    const err = error as ResBad;
    toast.error(err?.response?.data?.message);
    print.error(error);
  } finally {
    setLoading(false);
  }
};
