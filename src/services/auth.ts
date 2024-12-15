import axiosInstance from "@/config/axiosInstance";
import toast from "@/helper/toast";
import { LoginForm } from "@/interface/request/Auth";
import { ResBad, ResOk } from "@/interface/response/Api";
import { Auth } from "@/interface/response/Auth";
import { print } from "@/utils/helper";
import { NextRouter } from "next/router";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/key";

export const login = async (
  form: LoginForm,
  loading: boolean,
  setLoading: (loading: boolean) => void,
  setErrorForm: (errorForm?: LoginForm) => void,
  router: NextRouter
) => {
  if (loading) {
    return;
  }

  const errorForm: LoginForm = {} as LoginForm;

  if (!form.email) {
    errorForm.email = "Email wajib diisi";
  }
  if (!form.password) {
    errorForm.password = "Password wajib diisi";
  }
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (form.email && !regexEmail.test(form.email)) {
    errorForm.email = "Email tidak valid";
  }

  if (Object.keys(errorForm).length > 0) {
    setErrorForm(errorForm);
    return;
  }

  try {
    setLoading(true);

    const { data } = await axiosInstance.post<ResOk<Auth>>("/auth/login", form);
    toast.success(data?.message);
    Cookies.set(ACCESS_TOKEN, data?.data?.accessToken);
    Cookies.set(REFRESH_TOKEN, data?.data?.refreshToken);
    router.push("/dashboard");
  } catch (error) {
    const err = error as ResBad;
    toast.error(err?.response?.data?.message);
    print.error(error);
  } finally {
    setLoading(false);
  }
};

export const refresh = async (): Promise<boolean> => {
  try {
    const curRefreshToken = Cookies.get(REFRESH_TOKEN);
    if (!curRefreshToken) {
      return false;
    }
    const { data } = await axiosInstance.post<ResOk<Auth>>("/auth/refresh", {
      authorization: curRefreshToken,
    });
    Cookies.set(ACCESS_TOKEN, data?.data?.accessToken);
    Cookies.set(REFRESH_TOKEN, data?.data?.refreshToken);
    return true;
  } catch (error) {
    print.error(error);
    return false;
  }
};
