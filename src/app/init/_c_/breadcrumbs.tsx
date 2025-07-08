import { Breadcrumb } from "@/components/breadcrumb";

export const BreadCrumbs = () => (
  <div className="relative max-w-7xl mx-auto w-full">
    <div className="h-20 absolute z-2 flex w-full bg-zinc-300/0">
      <div className="px-4 flex items-center h-10 bg-zinc-300/20 w-full">
        <Breadcrumb root="/" />
      </div>
    </div>
  </div>
);
