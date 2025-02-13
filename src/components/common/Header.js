"use client";

import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import Image from "next/image";
import { successMsg } from "../toaster/msg";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathName = usePathname();
  const router = useRouter();
  const [loginUser, setLoginUser] = useState("");

  const handleLogout = () => {
    Cookies.remove("accessToken");
    successMsg("Logout");
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

  return (
    <AppBar
      position="sticky"
      className="!bg-transparent mt-4 mb-6 dark-purple-bg"
    >
      <Toolbar className="flex justify-between">
        {/* Left Side - Logo */}
        <Box className="flex items-center">
          <div className="relative">
            <Image
              src="/assets/logo-a.webp"
              alt="Logo"
              width={140}
              height={40}
              className="h-12"
            />
            <p className="logo-text-header theme-color">Sales Portal</p>
          </div>
        </Box>

        {/* Right Side - Email & Logout Button */}
        <Box className="flex items-center gap-4">
          <Typography variant="body2" className="text-center">
            <strong> {loginUser}</strong>
          </Typography>
          <Button className="button-color !text-white" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
