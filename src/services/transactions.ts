import axiosInstance from "@/config/axiosInstance";
import { ResBad, ResOk } from "@/interface/response/Api";
import { print } from "@/utils/helper";
import toast from "@/helper/toast";
import {
  CreateTransactionForm,
  ErrorTransactionForm,
} from "@/interface/request/Transaction";
import { Transaction } from "@/interface/response/Transaction";

export const createTransactions = async (
  form: CreateTransactionForm,
  loading: boolean,
  setLoading: (loading: boolean) => void,
  setErrorForm: (errorForm?: ErrorTransactionForm) => void,
  currentStock: number,
  afterSuccess?: () => void
) => {
  if (loading) return;
  const errorForm: ErrorTransactionForm = {} as ErrorTransactionForm;

  if (!form.amount || form.amount < 0) {
    errorForm.amount = "Total harus diisi bilangan positif";
  }

  if (form.amount > currentStock && form.type === "IN") {
    errorForm.amount = `Stok tidak mencukupi (maximal ${currentStock})`;
  }

  if (Object.keys(errorForm).length > 0) {
    setErrorForm(errorForm);
    return;
  }

  try {
    setLoading(true);
    const { data } = await axiosInstance.post<ResOk<Transaction>>(
      `/transactions`,
      {
        ...form,
        amount: Number(form.amount),
      }
    );
    toast.success(data?.message || "Berhasil menambahkan transaksi!");
    afterSuccess?.();
  } catch (error) {
    const err = error as ResBad;
    toast.error(err?.response?.data?.message);
    print.error(error);
  } finally {
    setLoading(false);
  }
};
