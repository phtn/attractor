"use client";

import { Brand } from "@/components/brand";
import GestureSwitch from "@/components/gesture/switch";
import { IconButton } from "@/components/icon-button";
import { Input } from "@/components/ui/input";
import { onSuccess } from "@/ctx/toast-ctx";
import { useSFX } from "@/hooks/use-sfx";
import { handleAsync } from "@/utils/async-handler";
import { opts } from "@/utils/helpers";
import { useAuthActions, useAuthToken } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  const { signIn, signOut } = useAuthActions();
  const token = useAuthToken();

  const onSignin = useCallback(async () => {
    setLoading(true);
    const { data, error } = await handleAsync(signIn)("github", {
      redirectTo: "/admin",
    });

    if (data) {
      console.log("TOKEN", token);
      console.log(data);
    }

    if (!!data?.signingIn) {
      console.log(data);
      if (!data.signingIn) {
        setLoading(false);
        console.log(data);
        onSuccess("You're signed in!");
      }
    }

    if (error) {
      console.error(error);
    }
  }, [signIn, token]);

  useEffect(() => {
    if (token) {
      console.log("TOKEN", token);
    }
  }, [token]);

  const fx = useCallback(
    (playbackRate: number) => () => sfx({ playbackRate }),
    [sfx],
  );

  const SignOptions = useCallback(() => {
    const options = opts(
      <IconButton
        icon="px-arrow-up"
        iconStyle="rotate-90"
        onHover={fx(4)}
        fn={signOut}
      />,
      <IconButton icon="dollar-lite" onHover={fx(4.5)} fn={onSignin} />,
    );
    return <>{options.get(token !== null)}</>;
  }, [token, fx, onSignin, signOut]);

  const AdminOptions = useCallback(() => {
    const options = opts(
      <IconButton icon="slashes" onHover={fx(4)} fn={handleRoute("/admin")} />,
      null,
    );
    return <>{options.get(token !== null)}</>;
  }, [token, fx, handleRoute]);

  return (
    <header className="px-2 md:px-0 md:py-4 py-1 w-full">
      <div className="flex items-center justify-between max-w-7xl mx-auto ">
        <div className="flex items-center">
          <Brand label="Web Technologies | Research & Development" />
          <div className="flex items-center"></div>
        </div>

        <div className="flex items-center gap-3">
          <AdminOptions />
          <IconButton
            icon="asterisk"
            onHover={fx(2)}
            fn={handleRoute("/reviewer")}
          />
          <IconButton
            className="hidden"
            icon="px-chevrons-vertical"
            loading={loading}
            fn={fx(4)}
          />

          {/* <IconButton solid icon="px-code" onHover={fx(2)} fn={fx(2)} /> */}
          <IconButton icon="theme-switch" onHover={fx(3)} fn={fx(3)} />
          <SignOptions />
          <GestureSwitch />
        </div>
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
