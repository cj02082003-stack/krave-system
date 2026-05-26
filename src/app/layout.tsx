import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Krave Kitchen | Southeast Asian Cuisine",
  description: "Savor the flavor of authentic Asian cuisine, from savory Chinese dumplings to vibrant Thai noodles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} bg-stone-50 text-stone-900 antialiased selection:bg-[#e4e7dd] selection:text-[#596643]`}
      >
        {children}
      </body>
    </html>
  );
}