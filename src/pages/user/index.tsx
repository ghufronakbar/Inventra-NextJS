import Button from "@/components/Button";
import FilterData, { Option } from "@/components/FilterData";
import LayoutDashboard from "@/components/LayoutDashboard";
import PaginationButton from "@/components/PaginationButton";
import SidebarApp from "@/components/SidebarApp";
import { initPagination, Pagination, Role } from "@/interface/response/Api";
import formatDate from "@/utils/format/formatDate";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthPage from "@/hoc/AuthPage";

import LoadingCorner from "@/components/LoadingCorner";
import ModalConfirmation from "@/components/ModalConfirmation";
import Image from "next/image";
import { DEFAULT_PROFILE } from "@/constants/image";
import { Toaster } from "@/components/ui/toaster";
import { User } from "@/interface/response/User";
import { UserParams } from "@/interface/request/Params";
import {
  getAllUsers,
  setActiveStatusUser as setActiveStatusUser,
} from "@/services/user";

const UserPage = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<User>();
  const [paging, setPaging] = useState<Pagination>(initPagination);
  const [data, setData] = useState<User[]>([]);
  const options: Option[] = [
    {
      label: "Super Admin",
      value: "SUPER_ADMIN",
    },
    {
      label: "Admin",
      value: "ADMIN",
    },
  ];
  const page = Number(router.query.page) || 1;
  const [loading, setLoading] = useState<boolean>(false);
  const params: UserParams = {
    search: (router.query.search as string) || "",
    // dateStart: (router.query.dateStart as string) || undefined,
    // dateEnd: (router.query.dateEnd as string) || undefined,
    page: page,
    type: (router.query.option as Role) || "",
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers(params);
      if (res) {
        setData(res?.data);
        setPaging(res?.pagination);
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
  }, [params.page, params.type]);

  const [pending, setPending] = useState(false);

  const handleSetInActive = async () => {
    try {
      if (selected) {
        const findUser = data.find((item) => item.id === selected?.id);
        if (findUser) {
          findUser.isActived = !findUser.isActived;
          const tempData = data.filter((item) => item.id !== selected?.id);
          const newData = [...tempData, findUser].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setData(newData);
        }
        setActiveStatusUser(selected?.id, pending, setPending, fetchData);
        setSelected(undefined);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetClick = (user: User) => {
    setSelected(user);
  };

  return (
    <SidebarApp>
      <LayoutDashboard title="Pengguna">
        <FilterData options={options} />
        <div className="relative overflow-x-auto hide-scroll rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr className=" border-b-2 border-black">
                <th scope="col" className="px-6 py-5">
                  No
                </th>
                <th scope="col" className="px-6 py-5"></th>
                <th scope="col" className="px-6 py-5">
                  Nama
                </th>
                <th scope="col" className="px-6 py-5">
                  Role
                </th>
                <th scope="col" className="px-6 py-5">
                  Status
                </th>
                <th scope="col" className="px-6 py-5">
                  Terakhir Diubah
                </th>
                <th scope="col" className="px-6 py-5"></th>
              </tr>
            </thead>
            {!loading && data.length === 0 && (
              <tbody>
                <tr>
                  <td colSpan={6} className="text-center h-40">
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
                    <Image
                      src={item?.picture || DEFAULT_PROFILE}
                      alt=""
                      width={200}
                      height={200}
                      className="min-w-12 min-h-12 w-12 h-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start">
                      <p className="font-bold">{item.name}</p>
                      <p className="">{item.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item?.role}</td>
                  <td className="px-6 py-4">
                    <div
                      className={`${
                        !item.isConfirmed
                          ? "bg-gray-500"
                          : item.isActived
                          ? "bg-green-500"
                          : "bg-red-500"
                      } px-2 py-1 text-white w-fit rounded-lg text-sm font-semibold`}
                    >
                      {!item.isConfirmed
                        ? "Menunggu Konfirmasi"
                        : item.isActived
                        ? "Aktif"
                        : "Tidak Aktif"}
                    </div>
                  </td>
                  <td className="px-6 py-4">{formatDate(item.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2 items-center justify-center">
                      {item.isConfirmed && item.role !== "SUPER_ADMIN" && (
                        <Button
                          status={item.isActived ? "danger" : "success"}
                          onClick={() => handleSetClick(item)}
                        >
                          {item.isActived ? "Tangguhkan" : "Aktifkan"}
                        </Button>
                      )}
                      <Button onClick={() => {}}>Detail</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <LoadingCorner visible={loading} />
        <PaginationButton paging={paging} />
        <ModalConfirmation
          isOpen={!!selected}
          onClose={() => setSelected(undefined)}
          onConfirm={handleSetInActive}
          title={selected?.isActived ? "Tangguhkan" : "Aktifkan"}
          message={
            selected?.isActived
              ? "Apakah anda yakin ingin menangguhkan pengguna ini?"
              : "Apakah anda yakin ingin mengaktifkan pengguna ini?"
          }
          confirmText="Ya"
        />
      </LayoutDashboard>
      <Toaster />
    </SidebarApp>
  );
};

export default AuthPage(UserPage, ["SUPER_ADMIN"]);
