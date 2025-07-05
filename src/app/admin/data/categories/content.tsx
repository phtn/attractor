"use client";

import { opts } from "@/utils/helpers";
import { useCallback, useState } from "react";
import { Cat } from "vx/cats/d";
import CatsTable from "./cats-table";
import { CreateCat } from "./create-cat";

interface ContentProps {
  data: Cat[];
}
export const Content = ({ data }: ContentProps) => {
  const [showForm, setShowForm] = useState(false);
  const toogleForm = useCallback(() => {
    setShowForm((prev) => !prev);
  }, []);

  const CatForm = useCallback(() => {
    const options = opts(
      <CreateCat show={showForm} toggleFn={toogleForm} />,
      null,
    );
    return <>{options.get(showForm)}</>;
  }, [showForm, toogleForm]);
  return (
    <main className="mt-4 w-full space-x-3 flex">
      <CatsTable data={data} create={showForm} toogleForm={toogleForm} />
      <CatForm />
    </main>
  );
};
