"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconArrowLeft, IconBrandTabler } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { BsPeople } from "react-icons/bs";

import {
  RiAccountPinBoxLine,  
  RiFileHistoryLine,
} from "react-icons/ri";

import { PiBird } from "react-icons/pi";
import { VscRequestChanges } from "react-icons/vsc";
import { AiOutlineQuestionCircle } from "react-icons/ai";


// import { DEFAULT_PROFILE, LOGO } from "@/constants/image";
import { BiAward, BiCommentError } from "react-icons/bi";

const iconClassName = "text-neutral-700  h-5 w-5 flex-shrink-0";

const links: LinksProps[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <IconBrandTabler className={iconClassName} />,
  },
  {
    label: "Satwa",
    href: "/admin/animal",
    icon: <PiBird className={iconClassName} />,
  },

  {
    label: "Pengguna",
    href: "/admin/user",
    icon: <BsPeople className={iconClassName} />,
  },
  {
    label: "Top Kontributor",
    href: "/admin/top-contributor",
    icon: <BiAward className={iconClassName} />,
  },
  {
    label: "Permintaan Data Satwa",
    href: "/admin/request-data",
    icon: <VscRequestChanges className={iconClassName} />,
  },
  {
    label: "Permintaan Pembuatan Akun",
    href: "/admin/request-account",
    icon: <RiAccountPinBoxLine className={iconClassName} />,
  },
  {
    label: "Riwayat Kirim Data",
    href: "/admin/history",
    icon: <RiFileHistoryLine className={iconClassName} />,
  },
  {
    label: "Data Saran Input",
    href: "/admin/suggestion",
    icon: <AiOutlineQuestionCircle className={iconClassName} />,
  },
  {
    label: "Laporan Pengguna",
    href: "/admin/report",
    icon: <BiCommentError className={iconClassName} />,
  },
  {
    label: "Logout",
    href: "/",
    icon: <IconArrowLeft className={iconClassName} />,
  },
];

export default function SidebarApp({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const [open, setOpen] = useState<boolean>(false);
  

  const fetchPayload = async () => {
    try {
  
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPayload();
  }, []);

  useEffect(() => {
    const isLinkAdminExist = links.find((link) => link.label === "Data Admin");
    console.log(isLinkAdminExist);
  }, []);

  const handleLogout = () => {
    console.log("Logout");
    
  };

  return (
    <div className="rounded-md flex flex-col md:flex-row bg-gray-100 w-full flex-1 mx-auto border border-neutral-200 overflow-hidden h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={
                    link.href === "/" ? () => handleLogout() : () => null
                  }
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Email",
                href: "/admin/profile",
                icon: (
                  <Image
                    src={"/profile.png"}
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
      href="/admin/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src={"/logo.png"}
        width={50}
        height={50}
        alt="Avatar"
        className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 object-cover"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black  whitespace-pre"
      >
        Lestari
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/admin/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src={"/logo.png"}
        width={50}
        height={50}
        alt="Avatar"
        className="h-5 w-6   rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0 object-cover"
      />
    </Link>
  );
};

interface LinksProps {
  label: string;
  href: string;
  icon: React.ReactNode;
}
