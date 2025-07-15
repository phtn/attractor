"use client";

import { Brand } from "@/components/brand";
import GestureSwitch from "@/components/gesture/switch";
import { IconButton } from "@/components/icon-button";
import { Input } from "@/components/ui/input";
import { onSuccess } from "@/ctx/toast-ctx";
import { useSFX } from "@/hooks/use-sfx";
import { handleAsync } from "@/utils/async-handler";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function Header() {
  const [loading, setLoading] = useState(false);
  const { sfxDarbuka: sfx } = useSFX({ interrupt: true });
  const router = useRouter();
  const handleRoute = useCallback(
    (path: string) => () => {
      router.push(path);
    },
    [router],
  );
  const { signIn } = useAuthActions();
  const onSignin = useCallback(async () => {
    setLoading(true);
    const { data, error } = await handleAsync(signIn)("github", {
      redirectTo: "/init",
    });

    if (!!data?.signingIn) {
      if (!data.signingIn) {
        setLoading(false);
        console.log(data);
        onSuccess("You're signed in!");
      }
    }

    if (error) {
      console.error(error);
    }
  }, [signIn]);

  const fx = useCallback(
    (playbackRate: number) => () => sfx({ playbackRate }),
    [sfx],
  );

  return (
    <header className="flex items-center justify-between md:py-4 py-2 w-full max-w-7xl mx-auto">
      <div className="flex items-center">
        <Brand label="Secure Servers" />
        <div className="flex items-center"></div>
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          solid
          icon="slashes"
          iconStyle="size-5 text-slate-500"
          fn={handleRoute("/admin")}
        />
        <IconButton
          solid
          icon="asterisk"
          iconStyle="size-5 text-slate-500"
          fn={fx(0.5)}
          // fn={handleRoute("/reviewer")}
        />
        <IconButton
          solid
          icon="github"
          loading={loading}
          iconStyle="size-5 text-slate-500"
          fn={onSignin}
        />

        <IconButton
          solid
          icon="px-code"
          iconStyle="size-6 text-slate-500"
          onHover={fx(2)}
          fn={fx(2)}
        />
        <IconButton
          solid
          icon="px-file"
          iconStyle="size-4 text-slate-500"
          onHover={fx(3)}
          fn={fx(3)}
        />
        <IconButton
          solid
          icon="dollar-lite"
          iconStyle="size-5 text-slate-500"
          onHover={fx(4.5)}
          fn={fx(4)}
          // fn={setSfxState}
        />
        <GestureSwitch />
      </div>
    </header>
  );
}

export const Search = () => (
  <div className="relative">
    {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> */}
    <Input
      placeholder="Search designs..."
      className="pl-10 w-80 h-9 bg-gray-50 border-gray-200"
    />
    <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs bg-gray-200 rounded">
      ⌘ K
    </kbd>
  </div>
);
