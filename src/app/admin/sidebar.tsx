"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useMemo, useState } from "react";

import { Brand } from "@/components/brand";
import { HyperList } from "@/components/hyper";
import { Button } from "@/components/ui/button";
import { Icon } from "@/lib/icons";
import { icons } from "@/lib/icons/icons";
import { type IconName } from "@/lib/icons/types";
import { cn } from "@/lib/utils";

export const AdminSidebar = () => {
  const [expandedSections, setExpandedSections] = useState({
    pages: false,
    components: false,
    lists: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => () => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const assets = useMemo(() => {
    return [
      {
        label: "icons",
        name: "icons",
        value: Object.keys(icons).length,
        icon: "px-checkbox",
      },
      {
        label: "images",
        name: "images",
        value: 32,
        icon: "image",
      },
    ] as IListSectionItem[];
  }, []);

  const pages = useMemo(
    () =>
      [
        {
          label: "designs",
          section: "general",
          path: "designs",
        },
      ] as ISubSectionItem[],
    [],
  );

  const lists = useMemo(
    () =>
      [
        {
          label: "categories",
          section: "data",
          path: "categories",
        },
      ] as ISubSectionItem[],
    [],
  );

  return (
    <aside className="rounded-e-2xl md:w-64 w-80 dark:bg-origin/40 bg-chalk h-full md:p-4 py-1 px-2">
      <div className="py-1">
        <Brand label="x-69" dark />
      </div>
      <nav className="space-y-2 md:py-4">
        {/*   == ==  ===  == ==   */}
        {/* General Section Block */}
        {/*   == ==  ===  == ==   */}
        <SectionBlock>
          <SectionHeader label="general" />
          <SectionContainer expanded={expandedSections.pages}>
            <SectionTrigger
              name="pages"
              label="pages"
              icon="px-file"
              expanded={expandedSections.pages}
              fn={toggleSection("pages")}
            />

            <SectionBody expanded={expandedSections.pages}>
              <HyperList
                data={pages}
                component={SubSectionItem}
                disableAnimation
              />
              <Button
                variant="ghost"
                className="flex w-full justify-start group items-end rounded-none dark:hover:bg-background/80 hover:bg-muted-foreground/20 py-2.5 px-1 space-x-0.5 h-auto text-sm"
              >
                <Icon
                  solid
                  name="circle-filled"
                  className={cn(
                    "rotate-135 size-5 group-hover:text-mac-blue text-muted-foreground/40",
                    "dark:group-hover:text-cyan-300 dark:text-muted-foreground/30",
                    "group-hover:translate-x-1.5 group-hover:-rotate-360 group-hover:scale-[60%] transition-all duration-500 ease-in-out",
                  )}
                />

                <span>Animations</span>
              </Button>
            </SectionBody>
          </SectionContainer>
        </SectionBlock>
        {/*  == ==  ==  == ==  */}
        {/* Data Section Block */}
        {/*  == ==  ==  == ==  */}
        <SectionBlock>
          <SectionHeader label="Data" />
          <SectionContainer expanded={expandedSections.lists}>
            {/* Components Section */}
            <div className="">
              <SectionTrigger
                name="lists"
                label="lists"
                icon="px-rows"
                expanded={expandedSections.lists}
                fn={toggleSection("lists")}
              />

              <SectionBody expanded={expandedSections.lists}>
                <HyperList
                  data={lists}
                  disableAnimation
                  component={SubSectionItem}
                />
              </SectionBody>
            </div>
          </SectionContainer>
        </SectionBlock>

        {/* Assets Section */}
        <SectionBlock>
          <SectionHeader label="assets" />
          <SectionContainer expanded={false}>
            <HyperList
              data={assets}
              component={ListSectionItem}
              container="space-y-1.5"
            />
          </SectionContainer>
        </SectionBlock>
      </nav>
    </aside>
  );
};
interface SectionHeaderProps {
  label?: string;
}
const SectionHeader = ({ label }: SectionHeaderProps) => (
  <h2 className="md:text-xs w-48 text-[10px] text-slate-600/70 dark:text-slate-400/70 md:font-semibold font-medium uppercase font-sans md:tracking-widest mb-2 px-2">
    {label}
  </h2>
);

const SectionBlock = ({ children }: { children: ReactNode }) => (
  <div className="pt-4 group/block">{children}</div>
);
interface ISectionBody {
  expanded: boolean;
  children?: ReactNode;
}
const SectionContainer = ({ expanded, children }: ISectionBody) => (
  <div
    className={cn(
      "rounded-lg border border-slate-300 overflow-hidden",
      "dark:bg-origin/30 dark:border-origin",
      {
        "dark:bg-origin/80 hover:bg-mac-gray/20 bg-mac-gray/30": expanded,
      },
    )}
  >
    {children}
  </div>
);

interface ISectionItem {
  name: string;
  label: string;
  expanded: boolean;
  icon: IconName;
  fn: VoidFunction;
}
const SectionTrigger = ({ expanded, label, fn, icon }: ISectionItem) => (
  <Button
    variant="ghost"
    className={cn(
      "flex h-auto w-full justify-between md:ps-2.5 md:pe-1.5 md:py-2.5 ps-3 pe-1.5",
      "transition-colors duration-300",
      "hover:bg-mac-gray/20 dark:bg-origin/50 dark:hover:bg-background/50",
      {
        "dark:bg-origin/50 hover:bg-slate-200 bg-zinc-200": expanded,
      },
    )}
    onClick={fn}
  >
    <div className="flex items-center w-full capitalize gap-2">
      <Icon
        solid
        name={icon}
        className="md:size-5 size-3.5 text-muted-foreground"
      />
      <span className="tracking-tight">{label}</span>
    </div>
    <Icon
      solid
      name="px-chevrons-vertical"
      className={cn("size-5 dark:text-lime-100 text-mac-gray", {
        "text-foreground": expanded,
      })}
    />
  </Button>
);

interface ISubSectionItem {
  path: string;
  label: string;
  section: string;
}
const SubSectionItem = ({ label, section, path }: ISubSectionItem) => {
  const route = useMemo(() => `/admin/${section}/${path}`, [section, path]);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === route;

  const onClick = useCallback(() => {
    router.push(route);
  }, [route, router]);
  //
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "group rounded-none w-full h-auto flex items-end justify-start",
        "md:text-sm text-xs border-t border-slate-400/60 p-2.5",
        "dark:hover:bg-background/80 dark:bg-background/80 bg-[#FFFEF9] hover:bg-[#FFFEF9]",
        {
          "text-foreground dark:text-cyan-200": isActive,
        },
      )}
    >
      <Icon
        solid
        name="circle-filled"
        className={cn(
          "md:size-5 size-4",
          "text-muted-foreground/40 group-hover:text-mac-red",
          "dark:group-hover:text-cyan-300 dark:text-muted-foreground/30",
          "group-hover:translate-x-1 group-hover:-rotate-360 group-hover:scale-[85%]",
          "transition-all duration-500 ease-in-out",
        )}
      />

      <span className="text-sm capitalize tracking-tight">{label}</span>
    </Button>
  );
};

const SectionBody = ({ expanded, children }: ISectionBody) => (
  <div
    className={cn(
      "dark:bg-background/80 bg-background overflow-hidden transition-all duration-300",
      {
        "max-h-0": !expanded,
        "max-h-40 shadow-med-t": expanded, // Adjust max-height as needed
      },
    )}
  >
    {children}
  </div>
);
interface IListSectionItem {
  name: string;
  label: string;
  value?: number;
  icon: IconName;
}
const ListSectionItem = ({
  icon,
  label,
  name,
  value = 0,
}: IListSectionItem) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === `/admin/assets/${name}`;

  const onClick = useCallback(
    () => router.push(`/admin/assets/${name}`),
    [name, router],
  );
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        "w-full flex justify-between md:ps-3 md:py-1 h-10 tracking-tight dark:hover:bg-card-origin",
        "ps-2 pe-1 text-slate-700",
        {
          "text-mac-blue dark:text-cyan-200": isActive,
        },
      )}
    >
      <Icon
        solid
        name={icon}
        className="md:size-5 size-3.5 text-slate-700 dark:text-muted-foreground"
      />
      <h3 className="capitalize flex w-full dark:text-muted-foreground md:font-medium opacity-90">
        {label}
      </h3>
      <div
        className={cn(
          "flex-1 font-jet md:rounded-md rounded-sm dark:text-foreground bg-accent md:text-sm text-xs py-px px-1",
        )}
      >
        {value}
      </div>
    </Button>
  );
};
