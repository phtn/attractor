import { Header } from "@/app/init/_c_/header";
import { type ReactNode } from "react";

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <main className="flex-1 flex flex-col">
        <Header />
        {children}
      </main>
    </div>
  );
}
