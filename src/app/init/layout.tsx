import { ReactNode } from "react";
import { BreadCrumbs } from "./_c_/breadcrumbs";
import { FootGL } from "./_c_/foot-gl";
import { Header } from "./_c_/header";

export default function InitLayout({ children }: { children: ReactNode }) {
  return (
    <div className="md:h-screen h-fit bg-radial-[at_10%_80%] dark:bg-gradient-to-b from-sky-100 to-cyan-200/10 dark:from-zinc-400 dark:via-zinc-300/60 dark:via-20% dark:to-zinc-600 dark:to-88% flex flex-col w-screen">
      <Header />
      <BreadCrumbs />
      <main className="relative h-[calc(81lvh)]">
        <div className=" z-10 w-full max-w-7xl mx-auto">{children}</div>
      </main>
      <FootGL />
    </div>
  );
}
