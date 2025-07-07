import { AdminSidebar } from "@/app/admin/sidebar";
import { Header } from "@/app/admin/components/header";
import { type ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex w-full h-screen">
      <AdminSidebar />
      <div className="w-full">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
