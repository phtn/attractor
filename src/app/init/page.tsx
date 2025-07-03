"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InitPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/init/apps");
  }, [router]);

  return null;
}
