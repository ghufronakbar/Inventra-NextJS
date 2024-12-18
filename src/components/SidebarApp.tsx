"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconTransactionBitcoin,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { BsPeople } from "react-icons/bs";
import { PiRecord } from "react-icons/pi";
import { AiOutlineProduct } from "react-icons/ai";
import { DEFAULT_PROFILE } from "@/constants/image";
import { Decoded, ResOk } from "@/interface/response/Api";
import axios from "axios";
import Cookies from "js-cookie";
import { REFRESH_TOKEN } from "@/constants/key";
import { print } from "@/utils/helper";
import { Package } from "lucide-react";
const iconClassName = "text-neutral-700  h-5 w-5 flex-shrink-0";

const adminLinks: LinksProps[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconBrandTabler className={iconClassName} />,
  },
  {
    label: "Produk",
    href: "/product",
    icon: <AiOutlineProduct className={iconClassName} />,
  },
  {
    label: "Transaksi",
    href: "/transaction",
    icon: <IconTransactionBitcoin className={iconClassName} />,
  },
  {
    label: "Riwayat Perubahan",
    href: "/record",
    icon: <PiRecord className={iconClassName} />,
  },
  {
    label: "Logout",
    href: "/logout",
    icon: <IconArrowLeft className={iconClassName} />,
  },
];

const superAdminLinks: LinksProps[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconBrandTabler className={iconClassName} />,
  },
  {
    label: "Produk",
    href: "/product",
    icon: <AiOutlineProduct className={iconClassName} />,
  },
  {
    label: "Pengguna",
    href: "/user",
    icon: <BsPeople className={iconClassName} />,
  },
  {
    label: "Transaksi",
    href: "/transaction",
    icon: <IconTransactionBitcoin className={iconClassName} />,
  },
  {
    label: "Riwayat Perubahan",
    href: "/record",
    icon: <PiRecord className={iconClassName} />,
  },
  {
    label: "Logout",
    href: "/logout",
    icon: <IconArrowLeft className={iconClassName} />,
  },
];

export default function SidebarApp({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [linkItems, setLinkItems] = useState<LinksProps[]>(adminLinks);
  const [email, setEmail] = useState<string>("");

  const fetchPayload = async () => {
    try {
      const accessToken = Cookies.get(REFRESH_TOKEN);
      const { data } = await axios.get<ResOk<Decoded>>("/api/check-auth", {
        params: {
          auth: accessToken,
        },
      });
      setEmail(data.data.email);
      if (data && data.data.role === "SUPER_ADMIN") {
        setLinkItems(superAdminLinks);
      }
    } catch (err) {
      print.error(err);
    }
  };

  useEffect(() => {
    fetchPayload();
  }, []);

  useEffect(() => {
    const isLinkAdminExist = adminLinks.find(
      (link) => link.label === "Data Admin"
    );
    console.log(isLinkAdminExist);
  }, []);

  return (
    <div className="rounded-md flex flex-col md:flex-row bg-gray-100 w-full flex-1 mx-auto border border-neutral-200 overflow-hidden h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {linkItems.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: email,
                href: "/profile",
                icon: (
                  <Image
                    src={DEFAULT_PROFILE}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Package className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 object-cover text-blue-600" />

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold text-black  whitespace-pre"
      >
        Inventra
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Package className="h-5 w-6   rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 object-cover text-blue-600" />
    </Link>
  );
};

interface LinksProps {
  label: string;
  href: string;
  icon: React.ReactNode;
}
