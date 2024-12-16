import axiosInstance from "@/config/axiosInstance";
import { Pagination, ResBad, ResOk } from "@/interface/response/Api";
import { print } from "@/utils/helper";
import { UserParams } from "@/interface/request/Params";
import { User } from "@/interface/response/User";
import toast from "@/helper/toast";

export const getAllUsers = async (params?: UserParams) => {
  try {
    const { data } = await axiosInstance.get<ResOk<User[], Pagination>>(
      "/users",
      {
        params,
      }
    );
    return data;
  } catch (error) {
    print.error(error);
  }
};

export const setActiveStatusUser = async (
  id: string,
  pending: boolean,
  setPending: (pending: boolean) => void,
  afterSuccess?: () => void
) => {
  try {
    if (pending) return;
    setPending(true);
    const { data } = await axiosInstance.patch<ResOk<User>>(`/users/${id}`);
    toast.success(data?.message || "Pengguna berhasil diedit!");
    afterSuccess?.();
  } catch (error) {
    const err = error as ResBad;
    toast.error(err?.response?.data?.message);
    print.error(error);
  } finally {
    setPending(false);
  }
};
