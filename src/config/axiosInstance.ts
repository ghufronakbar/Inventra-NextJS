import { NEXT_PUBLIC_API } from "@/constants";
import { ACCESS_TOKEN } from "@/constants/key";
import toast from "@/helper/toast";
import { refresh } from "@/services/auth";
import { print } from "@/utils/helper";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import Router from "next/router";

const axiosInstance = axios.create({
  baseURL: `${NEXT_PUBLIC_API}/api`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error?.response && error?.response?.status === 401) {
      try {
        await refresh();
      } catch (error) {
        print.error(error);
        toast.error("Session anda telah habis, silahkan login kembali");
        Router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
