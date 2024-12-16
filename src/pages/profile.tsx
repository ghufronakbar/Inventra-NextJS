import Button from "@/components/Button";
import LayoutDashboard from "@/components/LayoutDashboard";
import LoadingCorner from "@/components/LoadingCorner";
import SidebarApp from "@/components/SidebarApp";
import {
  BottomGradient,
  Input,
  LabelInputContainer,
} from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_IMAGE } from "@/constants/image";
import AuthPage from "@/hoc/AuthPage";
import { initRegisterForm, RegisterForm } from "@/interface/request/Auth";
import { initUser, User } from "@/interface/response/User";
import { editPicture, editProfile, getProfile } from "@/services/auth";
import formatDate from "@/utils/format/formatDate";
import { print } from "@/utils/helper";
import Image from "next/image";
// import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsSave } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { ThreeDots } from "react-loader-spinner";

const ProfilePage = () => {
  const [data, setData] = useState<User>(initUser);

  const [form, setForm] = useState<RegisterForm>(initRegisterForm);
  const [errorForm, setErrorForm] = useState<RegisterForm>();
  const [pending, setPending] = useState(false);

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      if (res) {
        setData(res?.data);
        setForm({
          name: res?.data.name,
          email: res?.data.email,
        });
      }
    } catch (error) {
      print.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof RegisterForm
  ) => {
    setForm({ ...form, [type]: e.target.value });
    setErrorForm(undefined);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const afterSuccess = () => {
    setData({ ...data, ...form });
  };

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editingImage, setEditingImage] = useState(false);

  return (
    <SidebarApp>
      <LayoutDashboard title={data.name || "Loading..."}>
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="md:w-2/3 w-full flex flex-col gap-2 custom-box bg-white rounded-lg">
            <div className="relative overflow-x-auto hide-scroll rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-2">
                <tbody>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Nama
                    </th>
                    <td className="px-6 py-4 text-start">{data.name}</td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Email
                    </th>
                    <td className="px-6 py-4 flex flex-row items-center gap-2">
                      {data.email}{" "}
                      <Link href={`mailto:${data.email}`} target="_blank">
                        <MdOutlineEmail />
                      </Link>
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Status
                    </th>
                    <td className="px-6 py-4 text-start">
                      {data.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Dibuat Pada
                    </th>
                    <td className="px-6 py-4 text-start flex flex-row items-center gap-2">
                      {formatDate(data.createdAt)}
                    </td>
                  </tr>
                  <tr className="bg-white border-b">
                    <th className="px-6 py-4 font-bold whitespace-nowrap text-xs uppercase">
                      Terakhir Diperbarui
                    </th>
                    <td className="px-6 py-4 text-start flex flex-row items-center gap-2">
                      {formatDate(data.updatedAt)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="md:w-1/3 w-full flex flex-col gap-2 custom-box bg-white rounded-lg px-4 py-8">
            <h3 className="text-center text-lg font-bold text-gray-700">
              Edit Profil
            </h3>
            <input
              type="file"
              name="picture"
              id="picture"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setSelectedImage(e.target.files?.[0]);
                }
              }}
            />
            <div
              className="w-40 h-40 rounded-full object-cover self-center my-2 flex items-center justify-center overflow-hidden cursor-pointer relative"
              onClick={() => document.getElementById("picture")?.click()}
            >
              {editingImage && (
                <div className="w-full h-full bg-black bg-opacity-30 flex items-center justify-center absolute">
                  <ThreeDots
                    visible={true}
                    height="30"
                    width="30"
                    color="#fff"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass="z-50 absolute"
                  />
                </div>
              )}
              <Image
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : data.picture || DEFAULT_IMAGE
                }
                alt=""
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            {selectedImage && (
              <div className="flex flex-row gap-2 mb-4 self-center">
                <Button status="danger" onClick={() => setSelectedImage(null)}>
                  Batal
                </Button>
                <Button                  
                  onClick={() => {
                    editPicture(
                      selectedImage,
                      editingImage,
                      setEditingImage,
                      () => {
                        setData({
                          ...data,
                          picture: URL.createObjectURL(selectedImage),
                        });
                        setSelectedImage(null);
                      }
                    );
                  }}
                >
                  Simpan
                </Button>
              </div>
            )}
            <form
              className="w-full flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                editProfile(
                  form,
                  pending,
                  setPending,
                  setErrorForm,
                  afterSuccess
                );
              }}
            >
              <LabelInputContainer className="mb-8">
                <Label>Nama</Label>
                <Input
                  placeholder="Nama Lengkap"
                  value={form.name}
                  onChange={(e) => onChange(e, "name")}
                  errorMessage={errorForm?.name}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label>Email</Label>
                <Input
                  placeholder="admin@inventra.com"
                  value={form.email}
                  onChange={(e) => onChange(e, "email")}
                  errorMessage={errorForm?.email}
                />
              </LabelInputContainer>

              <button
                className="bg-gradient-to-br relative group/btn from-black to-neutral-600 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] text-center flex items-center justify-center"
                type="submit"
              >
                {pending ? (
                  <ThreeDots
                    visible={pending}
                    height="20"
                    width="20"
                    color="#fff"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <BsSave className="h-4 w-4" />
                    <span>Simpan</span>
                  </div>
                )}
                <BottomGradient />
              </button>
            </form>
          </div>
        </div>
      </LayoutDashboard>
      <LoadingCorner visible={loading} />
    </SidebarApp>
  );
};

export default AuthPage(ProfilePage, ["ADMIN", "SUPER_ADMIN"]);
