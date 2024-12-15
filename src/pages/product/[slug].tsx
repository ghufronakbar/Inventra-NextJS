import Button from "@/components/Button";
import LayoutDashboard from "@/components/LayoutDashboard";
import ModalConfirmation from "@/components/ModalConfirmation";
import SidebarApp from "@/components/SidebarApp";
import { DEFAULT_IMAGE } from "@/constants/image";
import AuthPage from "@/hoc/AuthPage";
import { Decoded } from "@/interface/response/Api";
import { Product } from "@/interface/response/Product";
import {
  deletePicturesProduct,
  deleteProductBySlug,
  editProductBySlug,
  getProductBySlug,
  postPicturesProduct,
} from "@/services/product";
import formatDate from "@/utils/format/formatDate";
import formatRupiah from "@/utils/format/formatRupiah";
import { print } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoLinkExternal } from "react-icons/go";
import { GiExpense, GiProfit } from "react-icons/gi";
import LoadingCorner from "@/components/LoadingCorner";
import { Toaster } from "@/components/ui/toaster";
import ModalAction from "@/components/ModalAction";
import { Input, LabelInputContainer, TextArea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EditProductForm,
  initProductEditProductForm,
  ErrorProductForm,
} from "@/interface/request/Product";
import { getAllCategories } from "@/services/category";
import {
  CreateTransactionForm,
  ErrorTransactionForm,
  initCreateTransactionForm,
} from "@/interface/request/Transaction";
import { createTransactions } from "@/services/transactions";
import { FileUpload } from "@/components/ui/file-upload";
import ImageOverlay from "@/components/ImageOverlay";
import LoadingScreen from "@/components/LoadingScreen";

const DetailProductPage = () => {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [transModal, setTransModal] = useState<boolean>(false);
  const [data, setData] = useState<Product>();
  const [loading, setLoading] = useState(false);
  const { slug } = router.query;
  const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_IMAGE);
  const [decoded, setDecoded] = useState<Decoded>();
  const [form, setForm] = useState<EditProductForm>(initProductEditProductForm);
  const [formTrans, setFormTrans] = useState<CreateTransactionForm>(
    initCreateTransactionForm
  );
  const [errorForm, setErrorForm] = useState<ErrorProductForm>();
  const [errorTrans, setErrorTrans] = useState<ErrorTransactionForm>();
  const [categories, setCategories] = useState<string[]>([]);
  const filteredCategories = categories.filter((item) =>
    item.toLowerCase().includes(form.category.toLowerCase())
  );

  const [imagePickeds, setImagePickeds] = useState<File[]>([]);
  const [isEditImage, setIsEditImage] = useState<boolean>(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [img, setImg] = useState<string>();

  const [pictureModal, setPictureModal] = useState<boolean>(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: keyof EditProductForm
  ) => {
    setForm({ ...form, [type]: e.target.value });
    setErrorForm(undefined);
  };

  const onChangeTrans = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof CreateTransactionForm
  ) => {
    setFormTrans({ ...formTrans, [type]: e.target.value });
    setErrorTrans(undefined);
  };

  const onOpenEditModal = () => {
    setForm({
      name: data?.name || "",
      buyingPrice: data?.buyingPrice || 0,
      sellingPrice: data?.sellingPrice || 0,
      desc: data?.desc || "",
      category: data?.category?.name || "",
    });
    setEditModal(true);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getProductBySlug(slug as string, router);
      setData(res?.data);
      if (res && res?.data?.pictures?.length > 0) {
        setSelectedImage(res?.data.pictures[0].url);
      }
      setDecoded(res?.decoded);
    } catch (error) {
      print.error(error);
      router.push("/product");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      if (res) {
        setCategories(res.map((item) => item.name));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setDeleteModal(false);
      await deleteProductBySlug(slug as string);
      router.push("/product");
    } catch (error) {
      print.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const HeaderButton = () => {
    return (
      <div className="flex flex-row gap-2">
        <Button
          status="gray"
          onClick={() => {
            setDeleteModal(true);
          }}
        >
          Unduh Laporan
        </Button>
        {decoded?.role === "SUPER_ADMIN" && (
          <>
            <Button onClick={onOpenEditModal}>Edit</Button>
            <Button
              status="success"
              onClick={() => {
                setTransModal(true);
              }}
            >
              Transaksi
            </Button>
            <Button
              status={"danger"}
              onClick={() => {
                setDeleteModal(true);
              }}
            >
              Hapus
            </Button>
          </>
        )}
      </div>
    );
  };

  const afterSuccess = () => {
    if (data) {
      setData({
        ...data,
        buyingPrice: form.buyingPrice,
        sellingPrice: form.sellingPrice,
        name: form.name,
        desc: form.desc,
        category: {
          ...data.category,
          name: form.category,
        },
      });
    }
    fetchData();
  };

  const onToggleEditImage = () => {
    setIsEditImage(!isEditImage);
    setImagePickeds([]);
    setSelectedIds([]);
  };

  const handleFileUpload = (files: File[]) => {
    setImagePickeds(files);
  };

  const afterPictureDeleted = () => {
    setSelectedIds([]);
    if (data) {
      setData({
        ...data,
        pictures: data.pictures.filter(
          (item) => !selectedIds.includes(item.id)
        ),
      });
    }
  };

  if (!data) return <LoadingScreen />;

  return (
    <SidebarApp>
      <LayoutDashboard title="Detail Produk" childrenHeader={<HeaderButton />}>
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="md:w-2/3 w-full flex flex-col gap-2 custom-box">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-col gap-2 w-full lg:w-1/2">
                <div
                  className="h-96 w-full rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setImg(selectedImage)}
                >
                  <Image
                    src={selectedImage}
                    alt={data?.name || ""}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
                {data?.pictures.length === 0 ? (
                  <div className="my-4 w-full flex flex-row text-xs text-gray-700 items-center justify-center">
                    Belum ada gambar produk
                  </div>
                ) : (
                  <div className="h-24 w-full my-2 flex flex-row space-x-2 overflow-x-auto overflow-y-hidden self-center">
                    {data?.pictures.map((pic) => (
                      <div
                        key={pic.url}
                        className="min-h-20 min-w-20 h-20 w-20 rounded-md overflow-hidden relative cursor-pointer"
                        onClick={() => {
                          if (isEditImage) {
                            if (selectedIds.some((id) => pic.id.includes(id))) {
                              setSelectedIds(
                                selectedIds.filter((id) => !pic.id.includes(id))
                              );
                            } else {
                              setSelectedIds([...selectedIds, pic.id]);
                            }
                          } else {
                            setSelectedImage(pic.url);
                          }
                        }}
                      >
                        {isEditImage && (
                          <div>
                            {selectedIds.some((id) => pic.id.includes(id)) ? (
                              <div className="w-full h-full bg-red-500 absolute bg-opacity-75 text-white font-bold flex items-center justify-center">
                                Hapus
                              </div>
                            ) : (
                              <div className="w-full h-full bg-black absolute bg-opacity-25 text-white font-bold flex items-center justify-center">
                                Hapus
                              </div>
                            )}
                          </div>
                        )}

                        <Image
                          src={pic.url || DEFAULT_IMAGE}
                          alt={data?.name || ""}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {isEditImage && <FileUpload onChange={handleFileUpload} />}
                <div className="flex flex-row gap-2">
                  <Button
                    onClick={onToggleEditImage}
                    status={isEditImage ? "gray" : "info"}
                  >
                    {isEditImage ? "Batal" : "Edit Gambar"}
                  </Button>
                  {selectedIds.length > 0 && (
                    <Button
                      status="danger"
                      onClick={() => setPictureModal(true)}
                    >
                      Hapus
                    </Button>
                  )}
                  {imagePickeds.length > 0 && (
                    <Button
                      onClick={() => {
                        postPicturesProduct(
                          slug as string,
                          imagePickeds,
                          loading,
                          setLoading,
                          fetchData
                        );
                        setImagePickeds([]);
                        setIsEditImage(false);
                      }}
                    >
                      Unggah
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full lg:w-1/2">
                <h2 className="text-2xl font-semibold">
                  {data?.name || "Loading..."}
                </h2>
                <p className="text-lg font-semibold text-gray-800">
                  {data?.category?.name}
                </p>
                <p className="text-sm">{data?.desc}</p>
              </div>
            </div>
            <div className="relative overflow-x-auto hide-scroll rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-2">
                <tbody>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Stok Tersisa
                    </th>
                    <td className="px-6 py-4 flex flex-row items-center gap-2">
                      {data?.currentStock}
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Harga Beli
                    </th>
                    <td className="px-6 py-4 text-start">
                      {formatRupiah(data?.buyingPrice)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Harga Jual
                    </th>
                    <td className="px-6 py-4 text-start">
                      {formatRupiah(data?.sellingPrice)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Dibuat Pada
                    </th>
                    <td className="px-6 py-4 text-start flex flex-row items-center gap-2">
                      {formatDate(data?.createdAt)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Terakhir Diperbarui
                    </th>
                    <td className="px-6 py-4 text-start flex flex-row items-center gap-2">
                      {formatDate(data?.updatedAt)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="relative overflow-x-auto hide-scroll rounded-lg mt-4">
              <h2 className="font-bold text-xl text-neutral-800">
                Ringkasan Keuangan
              </h2>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-2">
                <tbody>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Total Pendapatan
                    </th>
                    <td className="px-6 py-4 text-start text-green-500">
                      + {formatRupiah(data?.income)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Total Pengeluaran
                    </th>
                    <td className="px-6 py-4 flex flex-row items-center text-red-500">
                      - {formatRupiah(data?.outcome)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Total Barang Keluar
                    </th>
                    <td className="px-6 py-4 flex flex-row items-center gap-2">
                      {data?.totalProductOut}
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Total Barang Masuk
                    </th>
                    <td className="px-6 py-4 text-start">
                      {data?.totalProductIn}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="md:w-1/3 w-full flex flex-col gap-2 custom-box">
            <h3 className="text-center text-lg font-bold text-gray-700 my-4">
              Riwayat Transaksi
            </h3>
            <div className="flex flex-row gap-2 self-center items-center justify-center">
              <div className="flex flex-row gap-1 text-green-500 items-center justify-center font-semibold text-sm">
                <GiProfit />
                {data?.totalTransactionIn || 0} Transaksi Masuk
              </div>
              <div className="flex flex-row gap-1 text-red-500 items-center justify-center font-semibold text-sm">
                <GiExpense />
                {data?.totalTransactionOut || 0} Transaksi Keluar
              </div>
            </div>
            <div className="overflow-x-auto hide-scroll rounded-lg">
              <table className="w-full text-sm text-center rtl:text-right text-gray-500 mt-2">
                <tbody className="w-full">
                  <div className="max-h-screen overflow-y-auto w-full flex flex-col">
                    {data?.transactions.map((item) => (
                      <tr className="bg-white border-b w-full" key={item.id}>
                        <td className="px-6 py-4 font-bold whitespace-nowrap text-xs flex flex-row items-center justify-between w-full">
                          <div className="flex flex-row items-center gap-4 w-[90%] overflow-hidden">
                            <div className="flex flex-col items-start">
                              <p className="text-sm">
                                <span className="">
                                  {item.type === "IN"
                                    ? "Transaksi Masuk"
                                    : "Transaksi Keluar"}{" "}
                                </span>
                                <span
                                  className={`font-bold italic text-xs ${
                                    item.type === "IN"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {item.type === "IN" ? "+" : "-"}
                                  {formatRupiah(item.total)}
                                </span>
                              </p>
                              <p className="font-normal text-xs">
                                {formatDate(item.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="w-[10%] flex justify-end">
                            <Link
                              href={`/transaction/${item.id}`}
                              prefetch={false}
                            >
                              <GoLinkExternal className="w-full self-end" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </div>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </LayoutDashboard>
      <LoadingCorner visible={loading} />
      <ModalConfirmation
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
      />
      <ModalConfirmation
        isOpen={pictureModal}
        onClose={() => setPictureModal(false)}
        onConfirm={() => {
          deletePicturesProduct(
            { ids: selectedIds },
            loading,
            setLoading,
            fetchData
          );
          afterPictureDeleted();
          setImagePickeds([]);
          setIsEditImage(false);
          setPictureModal(false);
          if (data?.pictures.length === selectedIds.length) {
            setSelectedImage(DEFAULT_IMAGE);
          }
        }}
      />
      <ModalAction
        isOpen={editModal}
        onClose={() => {
          setErrorForm(undefined);
          setEditModal(false);
        }}
        title="Edit Produk"
        confirmText="Simpan"
        onConfirm={() => {
          setEditModal(false);
          editProductBySlug(
            slug as string,
            form,
            loading,
            setLoading,
            setErrorForm,
            afterSuccess
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
              onClick={() => setForm({ ...form, category: item })}
            >
              {item}
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
      <ModalAction
        isOpen={transModal}
        onClose={() => {
          setErrorTrans(undefined);
          setTransModal(false);
        }}
        title="Buat Transaksi Baru"
        confirmText="Simpan"
        onConfirm={() => {
          setTransModal(false);
          if (data) {
            createTransactions(
              { ...formTrans, productId: data?.id },
              loading,
              setLoading,
              setErrorTrans,
              data.currentStock,
              fetchData
            );
          }
        }}
      >
        <LabelInputContainer className="mb-4">
          <Label>Jenis Transaksi</Label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                value="IN"
                checked={formTrans.type === "IN"}
                onChange={(e) => onChangeTrans(e, "type")}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm font-medium text-gray-700">
                Transaksi Masuk (Jual)
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                value="OUT"
                checked={formTrans.type === "OUT"}
                onChange={(e) => onChangeTrans(e, "type")}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm font-medium text-gray-700">
                Transaksi Keluar (Beli)
              </label>
            </div>
          </div>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label>Kuantitas</Label>
          <Input
            placeholder="Jumlah"
            value={formTrans.amount}
            onChange={(e) => onChangeTrans(e, "amount")}
            errorMessage={errorTrans?.amount}
            type="number"
            inputMode="numeric"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label>Jumlah</Label>
          <div
            className={`${
              formTrans.type === "IN" ? "text-green-600" : "text-red-600"
            }`}
          >
            {data &&
              formatRupiah(
                formTrans.amount *
                  (formTrans.type === "IN"
                    ? data?.sellingPrice
                    : data?.buyingPrice)
              )}
          </div>
        </LabelInputContainer>
      </ModalAction>
      <ImageOverlay src={img} setSrc={setImg} />
      <Toaster />
    </SidebarApp>
  );
};

export default AuthPage(DetailProductPage, ["SUPER_ADMIN", "ADMIN"]);
