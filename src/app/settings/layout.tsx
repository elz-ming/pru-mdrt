"use client";

import { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white p-4 antialiased">{children}</body>
    </html>
  );
}
