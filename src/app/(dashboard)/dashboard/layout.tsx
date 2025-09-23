"use client";

import Sidebar from "@/components/shared/Sidebar/Sidebar";
import Topbar from "@/components/shared/Topbar/Topbar";
import { Poppins } from "next/font/google";
import "../../globals.css";

const PoppinsFont = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${PoppinsFont.variable} font-sans min-h-screen bg-gray-100`}
    >
      {/* <PrivateRoute> */}
      <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-md z-10">
        <Sidebar />
      </div>

      <div className="fixed top-0 left-72 right-0 h-16 bg-white shadow-sm z-20 ">
        <Topbar />
      </div>

      {/* Main Content */}
      <main className="ml-72 pt-20 min-h-screen p-6">{children}</main>
      {/* </PrivateRoute> */}
    </div>
  );
}
