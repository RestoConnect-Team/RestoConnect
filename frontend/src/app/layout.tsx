import type { Metadata } from "next";
import "../styles/index.css";
import { ClientLayout } from "@/components/layout";

export const metadata: Metadata = {
  title: "RestoConnect",
  description: "RestoConnect app for center management",
  icons: {
    icon: "/logo_restoConnect.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
