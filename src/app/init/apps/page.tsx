import { convex } from "@/lib/convex/client";
import { Content } from "./content";
import { api } from "@@/api";
const Page = async () => {
  const cats = await convex.query(api.cats.get.active);
  return <Content data={cats} />;
};
export default Page;
