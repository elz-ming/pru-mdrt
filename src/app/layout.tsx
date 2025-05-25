"use client";

import { usePathname } from "next/navigation";
import HeaderBar from "@/app/components/HeaderBar";
import FooterBar from "@/app/components/FooterBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showLayout = !pathname.startsWith("/settings");

  const getTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/groups") return "Groups";
    if (pathname === "/you") return "You";
    return "";
  };
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {showLayout && <HeaderBar title={getTitle()} />}
        <main className={`min-h-screen ${showLayout ? "pb-16" : ""}`}>
          {children}
        </main>
        {showLayout && <FooterBar />}
      </body>
    </html>
  );
}
