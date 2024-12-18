import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/key";
const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(REFRESH_TOKEN);
      router.push("/login");
    }
  }, [router]);
  return null;
};

export default LogoutPage;
