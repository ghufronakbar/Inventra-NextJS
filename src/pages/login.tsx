import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { BottomGradient, Input, LabelInputContainer } from "@/components/ui/input";
import Link from "next/link";
import { MdLogin, MdPassword } from "react-icons/md";
import { initLoginForm, type LoginForm } from "@/interface/request/Auth";
import { login } from "@/services/auth";
import { ThreeDots } from "react-loader-spinner";
import { useRouter } from "next/router";

const LoginForm = () => {
  const [form, setForm] = useState<LoginForm>(initLoginForm);
  const [errorForm, setErrorForm] = useState<LoginForm>();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof LoginForm
  ) => {
    setForm({ ...form, [type]: e.target.value });
    setErrorForm(undefined);
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white">
      <h2 className="font-bold text-xl text-neutral-800">Inventra Login</h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 ">
        Track, Manage, Optimize — All in One Place.
      </p>

      <form
        className="my-8"
        onSubmit={(e) => {
          e.preventDefault();
          login(form, pending, setPending, setErrorForm, router);
        }}
      >
        <LabelInputContainer className="mb-4">
          <Label>Email</Label>
          <Input
            placeholder="admin@inventra.com"            
            value={form.email}
            onChange={(e) => onChange(e, "email")}
            errorMessage={errorForm?.email}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label>Kata Sandi</Label>
          <Input
            placeholder="••••••••"
            type="password"
            value={form.password}
            onChange={(e) => onChange(e, "password")}
            errorMessage={errorForm?.password}
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
              <MdLogin className="h-4 w-4" />
              <span>Masuk</span>
            </div>
          )}
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <Link
            className="relative group/btn flex space-x-2 items-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 justify-center"
            href="/register"
          >
            <MdPassword className="h-4 w-4 text-neutral-800 " />
            <span className="text-neutral-700 text-sm">Lupa Password</span>
            <BottomGradient />
          </Link>
        </div>
      </form>
    </div>
  );
};


const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 py-20">
      <LoginForm />
    </div>
  );
};
export default LoginPage;
