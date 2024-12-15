import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import { ACCESS_TOKEN } from "@/constants/key";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import toast from "@/helper/toast";
import { Decoded, ResBad, ResOk, Role } from "@/interface/response/Api";
import { ThreeDots } from "react-loader-spinner";

const AuthPage = (
  WrappedComponent: React.ComponentType,
  verifiedRoles: Role[]
) => {
  const WithAuthComponent = (
    props: React.ComponentProps<typeof WrappedComponent>
  ) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      if (router.isReady) {
        const fetchData = async () => {
          const path = router.asPath;
          const accessToken = Cookie.get(ACCESS_TOKEN);
          if (!accessToken) {
            router.push(`/login?redirect=${path}`);
            toast.error("Login terlebih dahulu!");
            return;
          }
          try {
            const { data } = await axios.get<ResOk<Decoded>>(
              "/api/check-auth",
              {
                params: {
                  auth: accessToken,
                },
              }
            );
            setLoading(false);
            if (!verifiedRoles.some((role) => data.data.role.includes(role))) {
              toast.error("Login terlebih dahulu!");
              router.push(`/login?redirect=${path}`);
            }
          } catch (error) {
            console.log(error);
            const err = error as ResBad;
            toast.error("Login terlebih dahulu!");
            if (err?.status === 401) {
              router.push(`/login?redirect=${path}`);
            }
          }
        };

        fetchData();
      }
    }, [router]);

    if (loading) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-black">
          <ThreeDots
            visible={true}
            height="40"
            width="40"
            color="#000"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      );
    }

    return (
      <>
        <WrappedComponent {...props} />
        <Toaster />
      </>
    );
  };

  return WithAuthComponent;
};

export default AuthPage;
