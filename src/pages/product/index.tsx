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
import {
  createProduct,
  deleteProductBySlug,
  getAllProducts,
} from "@/services/product";
import { Product } from "@/interface/response/Product";
import { getAllCategories } from "@/services/category";
import { ProductParams } from "@/interface/request/Params";
import LoadingCorner from "@/components/LoadingCorner";
import ModalConfirmation from "@/components/ModalConfirmation";
import Image from "next/image";
import { DEFAULT_IMAGE } from "@/constants/image";
import { Toaster } from "@/components/ui/toaster";
import ModalAction from "@/components/ModalAction";
import { Input, LabelInputContainer, TextArea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreateProductForm,
  ErrorCreateProductForm,
  initCreateProductForm,
} from "@/interface/request/Product";

const ProductPage = () => {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string>();
  const [paging, setPaging] = useState<Pagination>(initPagination);
  const [data, setData] = useState<Product[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const page = Number(router.query.page) || 1;
  const [loading, setLoading] = useState<boolean>(false);
  const [decoded, setDecoded] = useState<Decoded>();
  const params: ProductParams = {
    search: (router.query.search as string) || "",
    // dateStart: (router.query.dateStart as string) || undefined,
    // dateEnd: (router.query.dateEnd as string) || undefined,
    categoryId: (router.query.option as string) || "",
    page: page,
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts(params);
      if (res) {
        setData(res?.data);
        setPaging(res?.pagination);
        setDecoded(res?.decoded);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [form, setForm] = useState<CreateProductForm>(initCreateProductForm);
  const [errorForm, setErrorForm] = useState<ErrorCreateProductForm>();
  const [addModal, setAddModal] = useState<boolean>(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: keyof CreateProductForm
  ) => {
    setForm({ ...form, [type]: e.target.value });
    setErrorForm(undefined);
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      if (res) {
        const newOpt = res.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setOptions(newOpt);
      }
    } catch (error) {
      console.log(error);
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
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, params.categoryId, params.page]);

  const handleDelete = async () => {
    try {
      setData(data.filter((item) => item.slug !== selectedSlug));
      if (selectedSlug) {
        deleteProductBySlug(selectedSlug);
      }
      setSelectedSlug(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = (slug: string) => {
    setSelectedSlug(slug);
  };

  const filteredCategories = options.filter((option) =>
    option.label.toLowerCase().includes(form.category.toLowerCase())
  );

  return (
    <SidebarApp>
      <LayoutDashboard
        title="Produk"
        childrenHeader={
          decoded?.role !== "ADMIN" && (
            <Button onClick={() => setAddModal(true)}>Tambah Produk</Button>
          )
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
                <th scope="col" className="px-6 py-5"></th>
                <th scope="col" className="px-6 py-5">
                  Nama
                </th>
                <th scope="col" className="px-6 py-5">
                  Stok
                </th>
                <th scope="col" className="px-6 py-5">
                  Transaksi
                </th>
                <th scope="col" className="px-6 py-5">
                  Pemasukan (RP)
                </th>
                <th scope="col" className="px-6 py-5">
                  Pengeluaran (RP)
                </th>
                <th scope="col" className="px-6 py-5">
                  Terakhir Perubahan
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
                    <Image
                      src={item?.pictures?.[0]?.url || DEFAULT_IMAGE}
                      alt=""
                      width={200}
                      height={200}
                      className="min-w-12 min-h-12 w-12 h-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start">
                      <p className="font-bold">{item.name}</p>
                      <p className="">{item.category.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{item?.currentStock}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start">
                      <p className="font-bold">
                        {item?.totalProductOut} Barang Keluar
                      </p>
                      <p className="">{item?.totalProductIn} Barang Masuk</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{formatRupiah(item.income)}</td>
                  <td className="px-6 py-4">{formatRupiah(item.outcome)}</td>
                  <td className="px-6 py-4">{formatDate(item.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => router.push(`/product/${item.slug}`)}
                      >
                        Detail
                      </Button>
                      {decoded?.role === "SUPER_ADMIN" && (
                        <Button
                          status="danger"
                          onClick={() => handleDeleteClick(item.slug)}
                        >
                          Hapus
                        </Button>
                      )}
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
          isOpen={!!selectedSlug}
          onClose={() => setSelectedSlug(undefined)}
          onConfirm={handleDelete}
        />
      </LayoutDashboard>
      <ModalAction
        isOpen={addModal}
        onClose={() => {
          setErrorForm(undefined);
          setAddModal(false);
        }}
        title="Tambah Produk"
        confirmText="Simpan"
        onConfirm={() => {
          createProduct(
            form,
            loading,
            setLoading,
            setErrorForm,
            setAddModal,
            setForm,
            () => {
              fetchData();
              fetchCategories();
            }
          );
        }}
      >
        <LabelInputContainer className="mb-4">
          <Label>Nama</Label>
          <Input
            placeholder="Nama Produk"
            value={form.name}
            onChange={(e) => onChange(e, "name")}
            errorMessage={errorForm?.name}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label>Kategori</Label>
          <Input
            placeholder="Kategori Produk"
            value={form.category}
            onChange={(e) => onChange(e, "category")}
            errorMessage={errorForm?.category}
          />
        </LabelInputContainer>
        <div className="flex flex-row w-full overflow-x-auto gap-2 mb-2 h-auto">
          {filteredCategories.map((item, index) => (
            <div
              key={index}
              className="relative group/btn flex space-x-2 items-center text-black rounded-md h-6 font-medium shadow-input bg-gray-50 justify-center text-xs px-2 py-1 w-fit mb-2 cursor-pointer hover:bg-gray-100"
              onClick={() => setForm({ ...form, category: item.label })}
            >
              {item.label}
            </div>
          ))}
        </div>
        <LabelInputContainer className="mb-4">
          <Label>Deskripsi</Label>
          <TextArea
            placeholder="Deskripsi Produk"
            value={form.desc || ""}
            errorMessage={errorForm?.desc}
            onChange={(e) => onChange(e, "desc")}
            rows={4}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label>Stok Awal</Label>
          <Input
            placeholder="Stok Awal"
            value={form.initialStock}
            onChange={(e) => onChange(e, "initialStock")}
            errorMessage={errorForm?.initialStock}
            type="number"
            inputMode="numeric"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label>Harga Beli</Label>
          <Input
            placeholder="Harga Beli (RP)"
            value={form.buyingPrice}
            onChange={(e) => onChange(e, "buyingPrice")}
            errorMessage={errorForm?.buyingPrice}
            type="number"
            inputMode="numeric"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label>Harga Jual</Label>
          <Input
            placeholder="Harga Jual (RP)"
            value={form.sellingPrice}
            onChange={(e) => onChange(e, "sellingPrice")}
            errorMessage={errorForm?.sellingPrice}
            type="number"
            inputMode="numeric"
          />
        </LabelInputContainer>
      </ModalAction>
      <Toaster />
    </SidebarApp>
  );
};

export default AuthPage(ProductPage, ["SUPER_ADMIN", "ADMIN"]);
