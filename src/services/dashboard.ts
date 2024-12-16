import axiosInstance from "@/config/axiosInstance";
import { ResOk } from "@/interface/response/Api";
import { print } from "@/utils/helper";
import { Dashboard } from "@/interface/response/Dashboard";

export const getDashboardData = async () => {
  try {
    const { data } = await axiosInstance.get<ResOk<Dashboard>>("/dashboard");
    return data;
  } catch (error) {
    print.error(error);
  }
};
