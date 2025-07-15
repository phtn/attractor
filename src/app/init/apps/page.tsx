import { api } from "@@/api";
import { Content } from "./content";
import { preloadQuery } from "convex/nextjs";

export default async function CategoriesPage() {
  const preloaded = await preloadQuery(api.cats.get.active);

  return (
    <div className="lg:px-0 px-8">
      <Content preloaded={preloaded} />
    </div>
  );
}
