"use client";

import { AppBar, Toolbar, Button, Box } from "@mui/material";
import Image from "next/image";
import { successMsg } from "../toaster/msg";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathName = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    successMsg("Logout");

    router.push("/auth/login");
  };

  if (pathName == "/auth/login") return null; // Prevent rendering if not logged in

  return (
    <AppBar position="sticky" className="!bg-transparent">
      <Toolbar className="flex justify-between">
        {/* Left Side - Logo */}
        <Box className="flex items-center">
          <Image
            src="/assets/logo-a.webp"
            alt="Logo"
            width={140}
            height={40}
            className="h-12"
          />
        </Box>

        {/* Right Side - Logout Button */}
        <Button className="button-color !text-white" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
