import axiosInstance from "@/config/axiosInstance";
import toast from "@/helper/toast";
import {
  initRegisterForm,
  LoginForm,
  RegisterForm,
} from "@/interface/request/Auth";
import { ResBad, ResOk } from "@/interface/response/Api";
import { Auth } from "@/interface/response/Auth";
import { print } from "@/utils/helper";
import { NextRouter } from "next/router";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/key";
import { User, UserWithAuth } from "@/interface/response/User";

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

    const { data } = await axiosInstance.post<ResOk<Auth>>(
      "/account/login",
      form
    );
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
    const { data } = await axiosInstance.post<ResOk<Auth>>("/account/refresh", {
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

export const getProfile = async () => {
  try {
    const { data } = await axiosInstance.get<ResOk<User>>("/account/profile");
    return data;
  } catch (error) {
    print.error(error);
  }
};

export const editProfile = async (
  form: RegisterForm,
  loading: boolean,
  setLoading: (loading: boolean) => void,
  setErrorForm: (errorForm?: RegisterForm) => void,
  afterSuccess?: () => void
) => {
  if (loading) return;
  const errorForm: RegisterForm = {} as RegisterForm;

  if (!form.name) {
    errorForm.name = "Nama wajib diisi";
  }

  if (!form.email) {
    errorForm.email = "Email wajib diisi";
  }

  if (
    form.email &&
    !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(form.email)
  ) {
    errorForm.email = "Email tidak valid";
  }

  if (Object.keys(errorForm).length > 0) {
    setErrorForm(errorForm);
    return;
  }
  try {
    setLoading(true);
    const { data } = await axiosInstance.put<ResOk<UserWithAuth>>(
      "/account/profile",
      form
    );
    Cookies.set(ACCESS_TOKEN, data?.data?.accessToken);
    Cookies.set(REFRESH_TOKEN, data?.data?.refreshToken);
    toast.success(data?.message);
    afterSuccess?.();
    return data;
  } catch (error) {
    print.error(error);
    const err = error as ResBad;
    toast.error(err?.response?.data?.message);
  } finally {
    setLoading(false);
  }
};

export const editPicture = async (
  picture: File,
  loading: boolean,
  setLoading: (loading: boolean) => void,
  afterSuccess?: () => void
) => {
  try {
    if (loading) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("picture", picture);
    const { data } = await axiosInstance.patch<ResOk<UserWithAuth>>(
      "/account/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    afterSuccess?.();
    toast.success(data?.message);
    return data;
  } catch (error) {
    print.error(error);
    const err = error as ResBad;
    toast.error(err?.response?.data?.message);
  } finally {
    setLoading(false);
  }
};

export const createNewUser = async (
  form: RegisterForm,
  loading: boolean,
  setLoading: (loading: boolean) => void,
  setErrorForm: (errorForm?: RegisterForm) => void,
  setModal: (isOpen: boolean) => void,
  setForm: (form: RegisterForm) => void,
  afterSuccess?: () => void
) => {
  if (loading) return;
  const errorForm: RegisterForm = {} as RegisterForm;

  if (!form.name) {
    errorForm.name = "Nama wajib diisi";
  }

  if (!form.email) {
    errorForm.email = "Email wajib diisi";
  }

  if (
    form.email &&
    !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(form.email)
  ) {
    errorForm.email = "Email tidak valid";
  }

  if (Object.keys(errorForm).length > 0) {
    setErrorForm(errorForm);
    return;
  }

  try {
    setLoading(true);
    setModal(false);
    setForm(initRegisterForm);
    const { data } = await axiosInstance.post<ResOk<User>>(
      `/account/register`,
      form
    );
    toast.success(
      data?.message || "Berhasil menambahkan pengguna baru, tunggu konfirmasi!"
    );
    afterSuccess?.();
  } catch (error) {
    const err = error as ResBad;
    toast.error(err?.response?.data?.message);
    print.error(error);
  } finally {
    setLoading(false);
  }
};
