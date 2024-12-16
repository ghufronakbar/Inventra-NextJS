import axiosInstance from "@/config/axiosInstance";
import { Pagination, ResOk } from "@/interface/response/Api";
import { print } from "@/utils/helper";
import { Record } from "@/interface/response/Record";
import { RecordParams } from "@/interface/request/Params";

export const getAllRecords = async (params?: RecordParams) => {
  try {
    const { data } = await axiosInstance.get<ResOk<Record[], Pagination>>(
      "/records",
      {
        params,
      }
    );
    return data;
  } catch (error) {
    print.error(error);
  }
};
