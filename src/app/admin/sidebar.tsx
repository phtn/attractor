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
import { Box } from "lucide-react";

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
        icon: "icons",
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
    <aside className="w-64 bg-sidebar dark:bg-card-origin/40 border-r dark:border-zinc-800/60 h-full p-4">
      <div className="py-2">
        <Brand label="admin" />
      </div>
      <nav className="space-y-2 py-4">
        {/* general Section */}
        <SectionHeader label="general" />
        <SectionContainer expanded={expandedSections.pages}>
          <SectionTrigger
            label="pages"
            fn={toggleSection("pages")}
            name="pages"
            expanded={expandedSections.pages}
            icon="tsx-solid"
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
                  "dark:group-hover:text-geist-teal/80 dark:text-muted-foreground/30",
                  "group-hover:translate-x-1.5 group-hover:-rotate-360 group-hover:scale-[60%] transition-all duration-500 ease-in-out",
                )}
              />

              <span>Animations</span>
            </Button>
          </SectionBody>
        </SectionContainer>

        {/* Components Section */}
        <div className="rounded-md">
          <Button
            variant="ghost"
            className="w-full justify-between p-2 h-auto font-medium"
            onClick={toggleSection("components")}
          >
            <div className="flex items-center gap-2">
              <Box className="size-4" />
              Components
            </div>
            <Icon
              solid
              size={16}
              name="chevron-right"
              className={cn("transition-transform duration-300", {
                "rotate-90": expandedSections.components,
              })}
            />
          </Button>
          <div
            className={cn(
              "space-y-1 overflow-hidden transition-all duration-300",
              {
                "max-h-0": !expandedSections.components,
                "max-h-40": expandedSections.components,
              },
            )}
          >
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto text-sm"
            >
              Placeholder
            </Button>
          </div>
        </div>

        {/* == == == == == */}
        {/*  Data Section  */}
        {/* == == == == == */}
        <SectionBlock>
          <SectionHeader label="Data" />
          <SectionContainer expanded={expandedSections.lists}>
            {/* Components Section */}
            <div className="rounded-md">
              <SectionTrigger
                label="lists"
                fn={toggleSection("lists")}
                name="lists"
                expanded={expandedSections.lists}
                icon="tsx-solid"
              />

              <SectionBody expanded={expandedSections.lists}>
                <HyperList
                  data={lists}
                  component={SubSectionItem}
                  disableAnimation
                />
              </SectionBody>
            </div>
          </SectionContainer>
        </SectionBlock>

        {/* Assets Section */}
        <div className="pt-4">
          <SectionHeader label="assets" />
          <HyperList data={assets} component={ListSectionItem} />
        </div>
      </nav>
    </aside>
  );
};
interface SectionHeaderProps {
  label?: string;
}
const SectionHeader = ({ label }: SectionHeaderProps) => (
  <h2 className="text-xs text-slate-400 uppercase font-jet tracking-widest mb-2 px-2">
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
      "rounded-md border border-transparent group-hover/block:border-border",
      {
        "dark:bg-card-origin/60 bg-border": expanded,
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
      "w-full justify-between p-2 h-auto font-medium dark:hover:bg-card-origin/50",
      { "hover:bg-border": expanded },
    )}
    onClick={fn}
  >
    <div className="flex items-center capitalize gap-2">
      <Icon name={icon} size={16} solid />
      {label}
    </div>
    <Icon
      solid
      size={16}
      name="chevron-right"
      className={cn("rotate-0", {
        "-rotate-270 transition-transform duration-300": expanded,
      })}
    />
  </Button>
);

const SectionBody = ({ expanded, children }: ISectionBody) => (
  <div
    className={cn(
      "space-y-1 dark:bg-background/80 bg-background rounded-md overflow-hidden transition-all duration-300",
      {
        "max-h-0": !expanded,
        "max-h-40 shadow-med-t": expanded, // Adjust max-height as needed
      },
    )}
  >
    {children}
  </div>
);

interface ISubSectionItem {
  section: string;
  label: string;
  path: string;
}
const SubSectionItem = ({ label, section, path }: ISubSectionItem) => {
  const route = useMemo(() => `/admin/${section}/${path}`, [section, path]);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === route;

  const onClick = useCallback(() => {
    console.log(route);
    router.push(route);
  }, [route, router]);
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        "flex w-full capitalize justify-start group items-end rounded-none dark:hover:bg-background/80 hover:bg-chalk py-2.5 px-1 space-x-0.5 h-auto text-sm",
        {
          "text-mac-blue dark:text-geist-teal": isActive,
        },
      )}
    >
      <Icon
        solid
        name="circle-filled"
        className={cn(
          "rotate-135 size-5 group-hover:text-mac-blue text-muted-foreground/40",
          "dark:group-hover:text-geist-teal/80 dark:text-muted-foreground/30",
          "group-hover:translate-x-1.5 group-hover:-rotate-360 group-hover:scale-[60%] transition-all duration-500 ease-in-out",
        )}
      />

      <span>{label}</span>
    </Button>
  );
};

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
        "w-full flex justify-start p-2 h-auto font-medium tracking-tight dark:hover:bg-card-origin",
        {
          "text-mac-blue dark:text-geist-teal": isActive,
        },
      )}
    >
      <Icon name={icon} size={16} solid />
      <h3 className="capitalize flex w-full">{label}</h3>
      <div
        className={cn(
          "flex-1 font-jet rounded-md bg-accent text-sm py-px px-1",
        )}
      >
        {value}
      </div>
    </Button>
  );
};
