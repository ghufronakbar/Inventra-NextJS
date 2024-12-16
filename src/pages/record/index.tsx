import Button from "@/components/Button";
import FilterData, { Option } from "@/components/FilterData";
import LayoutDashboard from "@/components/LayoutDashboard";
import PaginationButton from "@/components/PaginationButton";
import SidebarApp from "@/components/SidebarApp";
import { initPagination, Pagination } from "@/interface/response/Api";
import formatDate from "@/utils/format/formatDate";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthPage from "@/hoc/AuthPage";
import LoadingCorner from "@/components/LoadingCorner";
import { Toaster } from "@/components/ui/toaster";
import {
  Record,
  RECORD_TYPES_ADMIN,
  RECORD_TYPES_SUPER_ADMIN,
  RecordType,
} from "@/interface/response/Record";
import { RecordParams } from "@/interface/request/Params";
import { getAllRecords } from "@/services/record";
import ModalContent from "@/components/ModalContent";

const RecordPage = () => {
  const router = useRouter();
  const [paging, setPaging] = useState<Pagination>(initPagination);
  const [data, setData] = useState<Record[]>([]);
  const [selected, setSelected] = useState<Record>();
  const [options, setOptions] = useState<Option[]>(
    RECORD_TYPES_ADMIN.map((item) => ({ label: item, value: item }))
  );
  const page = Number(router.query.page) || 1;
  const [loading, setLoading] = useState<boolean>(false);
  const params: RecordParams = {
    search: (router.query.search as string) || "",
    // dateStart: (router.query.dateStart as string) || undefined,
    // dateEnd: (router.query.dateEnd as string) || undefined,
    type: (router.query.option as RecordType) || "",
    page: page,
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllRecords(params);
      if (res) {
        setData(res?.data);
        setPaging(res?.pagination);
        if (res.decoded?.role === "SUPER_ADMIN") {
          setOptions(
            RECORD_TYPES_SUPER_ADMIN.map((item) => ({
              label: item,
              value: item,
            }))
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useDebounce(
    () => {
      fetchData();
    },
    1000,
    [params.search]
  );

  useEffect(() => {
    fetchData();
  }, [params.type, params.page]);

  return (
    <SidebarApp>
      <LayoutDashboard title="Log Perubahan">
        <FilterData options={options} />
        <div className="relative overflow-x-auto hide-scroll rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr className=" border-b-2 border-black">
                <th scope="col" className="px-6 py-5">
                  No
                </th>
                <th scope="col" className="px-6 py-5">
                  Keterangan
                </th>
                <th scope="col" className="px-6 py-5">
                  Tipe
                </th>
                <th scope="col" className="px-6 py-5">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-5"></th>
              </tr>
            </thead>
            {!loading && data.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={8} className="text-center h-40">
                    Tidak ada data
                  </td>
                </tr>
              </tbody>
            )}
            <tbody>
              {data.map((item, index) => (
                <tr className="bg-white border-b" key={item.id}>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {index + 1}
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start">
                      <p className="font-bold">{item.desc}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item?.type}</td>
                  <td className="px-6 py-4">{formatDate(item.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button onClick={() => setSelected(item)}>Detail</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <LoadingCorner visible={loading} />
        <PaginationButton paging={paging} />
        <ModalContent
          isOpen={!!selected}
          onClose={() => setSelected(undefined)}
          title="Detail Log Perubahan"
        >
          <div className="relative overflow-x-auto hide-scroll rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-2">
              <tbody>
                <tr className="bg-white border-b">
                  <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                    Tipe
                  </th>
                  <td className="px-6 py-4 flex flex-row items-center gap-2">
                    {selected?.type}
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                    Keterangan
                  </th>
                  <td className="px-6 py-4 text-start">{selected?.desc}</td>
                </tr>
                <tr className="bg-white border-b">
                  <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                    Dibuat Pada
                  </th>
                  <td className="px-6 py-4 text-start flex flex-row items-center gap-2">
                    {formatDate(selected?.createdAt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ModalContent>
      </LayoutDashboard>
      <Toaster />
    </SidebarApp>
  );
};

export default AuthPage(RecordPage, ["SUPER_ADMIN", "ADMIN"]);
