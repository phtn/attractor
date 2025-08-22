import { ReactNode } from "react";
import { FootGL } from "./_components/foot-gl";
import { Header } from "./_components/header";
import { cn } from "@/lib/utils";

export default function InitLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "md:h-screen flex flex-col w-screen",
        "bg-radial-[at_10%_80%] from-sky-100 to-cyan-200/10",
        " dark:bg-gradient-to-b dark:from-slate-500/80 dark:via-zinc-300 dark:via-0% dark:to-zinc-600 dark:to-70%",
      )}
    >
      <Header />
      {/*<div className="h-32" />*/}
      <main className="relative h-[calc(64lvh)]">
        <div className=" z-10 w-full max-w-7xl mx-auto">{children}</div>
      </main>

      <FootGL />
    </div>
  );
}
