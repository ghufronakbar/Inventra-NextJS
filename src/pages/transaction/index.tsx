import Button from "@/components/Button";
import FilterData, { Option } from "@/components/FilterData";
import LayoutDashboard from "@/components/LayoutDashboard";
import PaginationButton from "@/components/PaginationButton";
import SidebarApp from "@/components/SidebarApp";
import { Decoded, initPagination, Pagination } from "@/interface/response/Api";
import formatDate from "@/utils/format/formatDate";
import formatRupiah from "@/utils/format/formatRupiah";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthPage from "@/hoc/AuthPage";
import LoadingCorner from "@/components/LoadingCorner";
import { Toaster } from "@/components/ui/toaster";
import { TransactionParams } from "@/interface/request/Params";
import { Transaction, TransactionType } from "@/interface/response/Transaction";
import { getAllTransasctions } from "@/services/transactions";
import ModalContent from "@/components/ModalContent";
import { LuExternalLink } from "react-icons/lu";

const TransactionPage = () => {
  const router = useRouter();
  const [paging, setPaging] = useState<Pagination>(initPagination);
  const [data, setData] = useState<Transaction[]>([]);
  const [selected, setSelected] = useState<Transaction>();
  const options: Option[] = [
    {
      label: "Transaksi Pemasukan",
      value: "IN",
    },
    {
      label: "Transaksi Pengeluaran",
      value: "OUT",
    },
  ];
  const page = Number(router.query.page) || 1;
  const [loading, setLoading] = useState<boolean>(false);
  const [decoded, setDecoded] = useState<Decoded>();
  const params: TransactionParams = {
    search: (router.query.search as string) || "",
    // dateStart: (router.query.dateStart as string) || undefined,
    // dateEnd: (router.query.dateEnd as string) || undefined,
    type: (router.query.option as TransactionType) || "",
    page: page,
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllTransasctions(params);
      if (res) {
        setData(res?.data);
        setPaging(res?.pagination);
        setDecoded(res?.decoded);
        if (router.query.id) {
          setSelected(res?.data.find((item) => item.id === router.query.id));
          router.replace({
            pathname: router.pathname,
            query: {
              ...router.query,
              id: undefined,
            },
          });
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
      <LayoutDashboard
        title="Transaksi"
        childrenHeader={
          decoded?.role !== "ADMIN" && <Button>Tambah Transaksi</Button>
        }
      >
        <FilterData options={options} />
        <div className="relative overflow-x-auto hide-scroll rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr className=" border-b-2 border-black">
                <th scope="col" className="px-6 py-5">
                  No
                </th>
                <th scope="col" className="px-6 py-5">
                  Barang
                </th>
                <th scope="col" className="px-6 py-5">
                  Kuantitas
                </th>
                <th scope="col" className="px-6 py-5">
                  Jumlah
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
                  <td colSpan={7} className="text-center h-40">
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
                  <td className="px-6 py-4">{item?.product?.name}</td>
                  <td className="px-6 py-4">{item?.amount}</td>
                  <td className="px-6 py-4 font-semibold">
                    <div
                      className={`${
                        item?.type === "IN" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item?.type === "IN" ? "+" : "-"}{" "}
                      {formatRupiah(item.total)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item?.type === "IN" ? "Pemasukan" : "Pengeluaran"}
                  </td>
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
          onClose={() => {
            setSelected(undefined);
            router.push({
              pathname: "/transaction",
              query: {
                ...router.query,
                id: undefined,
              },
            });
          }}
          title="Detail Riwayat"
        >
          <div className="relative overflow-x-auto hide-scroll rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-2">
              <tbody>
                <tr className="bg-white border-b">
                  <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                    ID Transaksi
                  </th>
                  <td className="px-6 py-4 flex flex-row items-center gap-2">
                    {selected?.id}
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                    Barang
                  </th>
                  <td className="px-6 py-4 flex flex-row items-center gap-2">
                    {selected?.product.name}
                    <LuExternalLink
                      className="w-4 h-4 cursor-pointer"
                      onClick={() =>
                        router.push(`/product/${selected?.product.slug}`)
                      }
                    />
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                    Tipe
                  </th>
                  <td className="px-6 py-4 flex flex-row items-center gap-2">
                    {selected?.type === "IN" ? "Pemasukan" : "Pengeluaran"}
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                    Kuantitas
                  </th>
                  <td className="px-6 py-4 flex flex-row items-center gap-2">
                    {selected?.amount}
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                    Jumlah
                  </th>
                  <td
                    className={`font-semibold px-6 py-4 flex flex-row items-center gap-2 ${
                      selected?.type === "IN"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selected?.type === "IN" ? "+" : "-"}{" "}
                    {formatRupiah(selected?.total)}
                  </td>
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

export default AuthPage(TransactionPage, ["SUPER_ADMIN", "ADMIN"]);
