"use client";

import { usePathname } from "next/navigation";
import HeaderBar from "@/app/components/HeaderBar";
import FooterBar from "@/app/components/FooterBar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const excludedPaths = ["/settings", "/search", "/user", "/admin"];
  const showLayout = !excludedPaths.some((path) => pathname.startsWith(path));

  const getTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/groups") return "Groups";
    if (pathname === "/todolist") return "To-Do List";
    return "";
  };
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {showLayout && <HeaderBar title={getTitle()} />}
        <main
          className={`min-h-screen  flex flex-col relative bg-gray-200 text-black ${
            showLayout ? "pb-16 pt-16" : ""
          }`}
        >
          {children}
        </main>
        {showLayout && <FooterBar />}
      </body>
    </html>
  );
}
