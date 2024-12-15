import axiosInstance from "@/config/axiosInstance";
import { ResOk } from "@/interface/response/Api";
import { print } from "@/utils/helper";
import { Category } from "@/interface/response/Category";
import Cookies from "js-cookie";
import { CACHE_KEY } from "@/constants/cache";

export const getAllCategories = async () => {
  try {
    const check = Cookies.get(CACHE_KEY.CATEGORIES);
    if (check) {
      const parsedCategories = JSON.parse(check) as Category[];
      return parsedCategories;
    }
    const { data } = await axiosInstance.get<ResOk<Category[]>>("/categories");
    if (data.data) {
      Cookies.set(CACHE_KEY.CATEGORIES, JSON.stringify(data?.data));
    }
    return data.data;
  } catch (error) {
    print.error(error);
    return [] as Category[];
  }
};
