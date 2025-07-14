"use client";

import { Brand } from "@/components/brand";
import GestureSwitch from "@/components/gesture/switch";
import { IconButton } from "@/components/icon-button";
import { Input } from "@/components/ui/input";
import { useSFXCtx } from "@/ctx/sfx-ctx";
import { onSuccess } from "@/ctx/toast-ctx";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { handleAsync } from "@/utils/async-handler";
import { useSFX } from "@/hooks/use-sfx";

export function Header() {
  const [loading, setLoading] = useState(false);
  const { setSfxState } = useSFXCtx();
  const { sfxTech: sfx } = useSFX({});
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

  const fx = useCallback(() => sfx({ playbackRate: 2 }), [sfx]);

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
          iconStyle="size-4"
          fn={handleRoute("/admin")}
        />
        <IconButton
          solid
          icon="asterisk"
          iconStyle="size-4"
          fn={handleRoute("/reviewer")}
        />
        <IconButton
          solid
          icon="github"
          loading={loading}
          iconStyle="size-4"
          fn={onSignin}
        />
        <IconButton
          solid
          icon="voice-message"
          iconStyle="size-6"
          fn={setSfxState}
        />
        <IconButton
          solid
          icon="code-one"
          iconStyle="size-5 text-sky-400"
          fn={fx}
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
