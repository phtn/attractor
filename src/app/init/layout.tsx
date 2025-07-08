import { ReactNode } from "react";
import { BreadCrumbs } from "./_c_/breadcrumbs";
import { FootGL } from "./_c_/foot-gl";
import { Header } from "./_c_/header";

export default function InitLayout({ children }: { children: ReactNode }) {
  return (
    <div className="md:h-screen h-fit bg-radial-[at_30%_30%] from-chalk to-emerald-50/80 dark:from-foreground/70 dark:to-origin/30 flex flex-col w-screen">
      <Header />
      <BreadCrumbs />
      <main className="relative z-10 w-full max-w-7xl mx-auto">{children}</main>
      <FootGL />
    </div>
  );
}
