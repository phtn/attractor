import { Icon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  ChangeEvent,
  memo,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Expandable,
  ExpandableMini,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
} from "@/components/ui/expandable";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/stock/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useGetMeta } from "./use-get-meta";
import { ClassName } from "@/app/types";
import TextAnimate from "@/components/ui/text-animate";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { QuickActions } from "./actions";
import { IconifySvg } from "./iconify";
import { Input } from "@/components/ui/input";

const COLLAPSED_SIZE = Object.freeze({ width: 280, height: 0 });
const EXPANDED_SIZE = Object.freeze({ width: 460, height: 400 });

export const IconSetCard = memo(function ExpandableComponent() {
  const handleExpandStart = useCallback(() => {
    console.log("Expanding meeting card...");
  }, []);
  const handleExpandEnd = useCallback(() => {
    console.log("Meeting card expanded!");
  }, []);

  const {
    metadata,
    icons,
    hasMore,
    loadMore,
    loadAll,
    loadingIcons,
    loadingMeta,
    scrollAreaRef,
  } = useGetMeta();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredIcons = useMemo(
    () =>
      icons.filter((icon) =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [icons, searchTerm],
  );

  const sample_icons = useMemo(() => icons.slice(0, 20), [icons]);

  const onSearchInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [],
  );

  return (
    <Expandable
      expandDirection="both"
      expandBehavior="replace"
      initialDelay={0.2}
      onExpandStart={handleExpandStart}
      onExpandEnd={handleExpandEnd}
    >
      {({ isExpanded }) => (
        <ExpandableTrigger>
          <ExpandableMini
            className="relative"
            collapsedSize={COLLAPSED_SIZE}
            expandedSize={EXPANDED_SIZE}
            hoverToExpand={false}
            expandDelay={200}
            collapseDelay={400}
          >
            <ExpandableCardHeader>
              <div
                className={cn(
                  "flex justify-between items-start w-full text-neutral-600",
                  "mx-auto max-w-[190px] transition-transform duration-300",
                  { " max-w-[540px]": isExpanded },
                )}
              >
                <div className="w-fit">
                  <h3
                    className={cn(
                      "font-semibold w-fit flex items-center space-x-2 font-space text-xl leading-none tracking-tighter",
                    )}
                  >
                    {loadingMeta ? (
                      <Icon
                        name="spinners-dots"
                        className="text-neutral-400 h-5"
                      />
                    ) : (
                      <span>{metadata?.name}</span>
                    )}

                    <ExpandableTrigger>
                      <Link
                        href={`${metadata?.license.url}`}
                        className="uppercase hover:underline underline-offset-2 decoration-dashed decoration-[0.33px] select-none text-neutral-500 text-[0.55em] font-sans font-light tracking-wider"
                      >
                        {metadata?.license.title}
                      </Link>
                    </ExpandableTrigger>
                  </h3>

                  <ExpandableTrigger>
                    <Link
                      href={`${metadata?.author.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-2 decoration-dashed decoration-[0.33px]"
                    >
                      <h4 className="select-none w-fit text-xs px-0.5 space-x-1 text-mac-blue font-jet tracking-normal">
                        <span className="font-satisfy font-normal text-neutral-700 tracking-tighter">
                          by
                        </span>
                        <span className="font-medium">
                          {metadata?.author.name}
                        </span>
                        <span className="select-none text-neutral-600 leading-none text-[0.75em] font-mono font-light">
                          v{metadata?.version}
                        </span>
                      </h4>
                    </Link>
                  </ExpandableTrigger>
                </div>
                <div className="flex items-center md:space-x-8 space-x-4">
                  <StatMini
                    label={loadingIcons ? "loading" : "size"}
                    value={
                      loadingIcons || !icons.length ? (
                        <Icon
                          name="spinners-ring"
                          className="size-5 m-1 shrink-0 text-indigo-400"
                        />
                      ) : (
                        <span>{metadata?.height}</span>
                      )
                    }
                    className={cn("text-teal-600 bg-gray-50 hidden", {
                      flex: isExpanded,
                      "text-indigo-500": loadingIcons,
                    })}
                  />
                  <StatMini
                    label={loadingIcons ? "loading" : "loaded"}
                    value={
                      loadingIcons || !icons.length ? (
                        <Icon
                          name="spinners-ring"
                          className="size-5 m-1 shrink-0 text-indigo-400"
                        />
                      ) : (
                        <TextAnimate
                          text={`${icons.length}`}
                          type={"popIn"}
                          delay={0.5}
                          className="text-lg"
                        />
                      )
                    }
                    className={cn("text-orange-500 bg-gray-50 hidden", {
                      flex: isExpanded,
                      "text-indigo-500": loadingIcons,
                    })}
                  />
                  <StatMini
                    label="icons"
                    value={
                      metadata?.icons.length ?? (
                        <Icon
                          name="spinners-ring"
                          className="size-5 m-1 shrink-0 text-neutral-700"
                        />
                      )
                    }
                  />
                </div>
              </div>
            </ExpandableCardHeader>

            <ExpandableCardContent>
              <div className="flex flex-col items-start justify-between">
                <div
                  className={cn(
                    "flex max-w-[218px] overflow-auto mx-auto items-center text-sm text-gray-600",
                    {
                      hidden: isExpanded,
                    },
                  )}
                >
                  <Carousel plugins={[Autoplay({ delay: 2500 })]} className="">
                    <CarouselContent className="w-[235px] flex justify-start">
                      {sample_icons.map((icon) => (
                        <CarouselItem
                          key={icon.name}
                          className="md:basis-1/5 flex items-center justify-center"
                          title={icon.name}
                        >
                          <div
                            key={icon.name}
                            className={cn(
                              "size-8 text-neutral-800 rounded-sm bg-white shadow-xs flex items-center justify-center hover:bg-zinc-100",
                            )}
                            title={icon.name}
                          >
                            <IconifySvg icon={icon} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>

                <ExpandableContent preset="blur-md">
                  <ScrollArea
                    ref={scrollAreaRef}
                    className={cn("w-full max-h-0 overflow-auto font-space", {
                      " h-[400px] max-h-[400px]": isExpanded,
                    })}
                  >
                    <ExpandableTrigger>
                      <div className="grid grid-cols-8 gap-3">
                        {filteredIcons.map((icon) => (
                          <div
                            key={icon.name}
                            className={cn(
                              "size-12 hover:rounded-xs rounded-sm shadow-xs shadow-stone-200/80 flex items-center justify-center hover:bg-zinc-100",
                            )}
                            title={icon.name}
                          >
                            <QuickActions
                              title={icon.name}
                              icon={icon}
                              iconSet={metadata?.id}
                              iconSize={metadata?.height}
                            >
                              <IconifySvg icon={icon} />
                            </QuickActions>
                          </div>
                        ))}
                        {filteredIcons.length === 0 && !loadingIcons && (
                          <div className="text-xs text-neutral-500 col-span-8">
                            No icons loaded.
                          </div>
                        )}
                      </div>
                    </ExpandableTrigger>
                  </ScrollArea>
                </ExpandableContent>
              </div>
            </ExpandableCardContent>
            <ExpandableContent preset="slide-down" className="mb-2">
              <ExpandableCardFooter>
                <div className="flex items-start justify-between w-full text-sm text-gray-500">
                  <div className="flex items-center font-jet w-full">
                    <ExpandableTrigger>
                      <Input
                        placeholder="search"
                        className="dark:bg-slate-400/20 h-8 w-full"
                        value={searchTerm}
                        onChange={onSearchInputChange}
                      />
                    </ExpandableTrigger>
                  </div>
                  <div className="space-x-2 flex itens-center">
                    <ExpandableTrigger>
                      <Button
                        size="sm"
                        disabled={!hasMore || loadingIcons}
                        onClick={loadMore}
                        variant="outline"
                        className="tracking-tighter font-medium"
                      >
                        {loadingIcons
                          ? "Loading..."
                          : hasMore
                            ? "Load more"
                            : "All loaded"}
                      </Button>
                    </ExpandableTrigger>
                    <ExpandableTrigger>
                      <Button
                        size="sm"
                        disabled={!hasMore || loadingIcons}
                        onClick={loadAll}
                        variant="default"
                        className="tracking-tighter font-medium bg-neutral-300"
                      >
                        {loadingIcons
                          ? "Loading..."
                          : hasMore
                            ? "All"
                            : "All loaded"}
                      </Button>
                    </ExpandableTrigger>
                  </div>
                </div>
              </ExpandableCardFooter>
            </ExpandableContent>
          </ExpandableMini>
        </ExpandableTrigger>
      )}
    </Expandable>
  );
});

interface StatMiniProps {
  value: ReactNode;
  label: string;
  className?: ClassName;
}
const StatMini = ({ value, label, className }: StatMiniProps) => (
  <div
    className={cn(
      "h-6 select-none -space-y-2 flex flex-col items-center",
      "text-neutral-700 font-bold font-space tracking-wide",
      className,
    )}
  >
    <span className="bg-neutral-100/20 py-0.5 px-1.5 rounded-full text-lg">
      {value}
    </span>
    <span className="text-[0.3em] font-space -tracking-widest font-normal">
      {label}
    </span>
  </div>
);
