"use client";

import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import Image from "next/image";
import { successMsg } from "../toaster/msg";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const pathName = usePathname();
  const router = useRouter();
  const [loginUser, setLoginUser] = useState("");
  const assuredefyVerificationEmail = process.env.NEXT_PUBLIC_ADMINEMAIL;

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("userDetail");
    successMsg("You have successfully logged out.");
    router.push("/auth/login");
  };

  useEffect(() => {
    const user = Cookies.get("userDetail");
    if (user) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(user));
        setLoginUser(parsedUser?.email);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  if (pathName === "/auth/login") return null;
  if (pathName === "/auth/resetpassword") return null;

  return (
    <AppBar
      position="sticky"
      className="!bg-transparent mt-4 mb-6 dark-purple-bg"
    >
      <Toolbar className="flex justify-between sales-header">
        {/* Left Side - Logo */}
        <Box className="flex items-center header-left">
          <div className="relative">
            <Link href="/" className="text-2xl font-bold text-white">
              <Image
                src="/assets/logo-a.webp"
                alt="Logo"
                width={140}
                height={40}
                className="h-12"
              />
              <p className="logo-text-header theme-color whitespace-nowrap">
                Sales Portal
              </p>
            </Link>
          </div>
        </Box>

        <Box className="flex items-center gap-4 header-right">
          <Typography variant="body2" className="text-center">
            <strong> {loginUser}</strong>
          </Typography>
          {loginUser === assuredefyVerificationEmail && (
            <Link href="/auth/registration">
              <Typography variant="body2" className=" theme-color text-center">
                <strong> Add New User</strong>
              </Typography>
            </Link>
          )}

          <Button className="button-color !text-white" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
