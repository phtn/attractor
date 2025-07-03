"use client";

import { Icon } from "@/lib/icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Content = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/init");
  }, [router]);
  return (
    <main className="h-screen w-full flex items-center justify-center">
      <div className="size-96 flex items-start justify-center">
        <div className="size-16 flex items-center justify-center relative">
          <Icon size={24} name="spinners-3-dots-move" className="absolute" />
        </div>
      </div>
    </main>
  );
};
