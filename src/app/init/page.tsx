import { convex } from "@/lib/convex/client";
import { Content } from "./content";
import { api } from "@@/api";
import { Cat } from "vx/cats/d";
const Page = async () => {
  const cats = (await convex.query(api.cats.get.active)) as Cat[];
  return <Content data={cats} />;
};
export default Page;
