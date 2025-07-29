import { RefObject } from "react";
import { MultiParser } from "./new-entry";
import { Card2XL } from "@/components/hyper/card-2xl";

interface ReviewContentProps {
  contentRef: RefObject<HTMLDivElement | null>;
  entry: string;
}
export const ReviewContent = ({ contentRef, entry }: ReviewContentProps) => {
  return (
    <div className="bg-gradient-to-r dark:from-background/80 dark:to-axion dark:backdrop-blur-xl rounded-xs">
      <div className="absolute z-0 pointer-events-none -left-1/3 top-10 rounded-full -rotate-90 w-3xl blur-xl opacity-10 size-80 select-none bg-gradient-to-b dark:from-cream/40 dark:via-creamy/40 dark:to-origin"></div>
      <div className="relative z-10 flex-1 h-[calc(94vh)] overflow-scroll pb-40">
        <div ref={contentRef} className="p-0.5 max-w-none">
          <div className="p-6 gap-x-3 flex items-start justify-center">
            <Card2XL
              href=""
              grp="Overview"
              name="Project Attractor"
              label="Attractor"
              subitems={[]}
              idx={0}
              value={90}
            />
            {/* <CardXS
              href=""
              grp="Overview"
              name="Project Attractor"
              label="Attractor"
              subitems={[]}
              idx={0}
              value={90}
            /> */}
          </div>
          <MultiParser markdown={entry} />
          {/* <AssistantEntry message={exampleMarkdown} /> */}
        </div>
      </div>
    </div>
  );
};
