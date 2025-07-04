import { ConvexHttpClient } from "convex/browser";
import { api } from "@@/api";
import CatsTable from "./cats-table";
import { HyperCard } from "@/components/hyper/card";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string,
);

export default async function CategoriesPage() {
  const cats = await convex.query(api.cats.get.active);

  return (
    <div className="p-4">
      <div className="mt-4 w-full space-x-1 flex">
        <CatsTable data={cats} />
        <HyperCard className="px-4 py-6 w-full flex-1">
          <h2 className="text-2xl capitalize font-bold font-sans tracking-tight">
            new category
          </h2>
          <span></span>
        </HyperCard>
      </div>
    </div>
  );
}
