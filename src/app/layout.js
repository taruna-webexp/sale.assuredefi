import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/common/Header";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false, // Prevents browser fallback causing layout shifts
});
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <Header />
        {children}
      </body>
    </html>
  );
}
