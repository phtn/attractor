import { RefObject } from "react";
import { MultiParser } from "./new-entry";
import { CardXL } from "@/components/hyper/card-xl";
import { CardXS } from "@/components/hyper/card-xs";

interface ReviewContentProps {
  contentRef: RefObject<HTMLDivElement | null>;
  entry: string;
}
export const ReviewContent = ({ contentRef, entry }: ReviewContentProps) => {
  return (
    <div className="dark:bg-origin/10 dark:backdrop-blur-xl rounded-xs">
      <div className="flex-1 h-screen overflow-scroll pb-44">
        <div ref={contentRef} className="p-0.5 max-w-none">
          <div className="p-6 gap-x-3 flex items-start justify-center">
            <CardXL
              href=""
              grp="Overview"
              name="Project Attractor"
              label="Attractor"
              subitems={[]}
              idx={0}
              value={90}
            />
            <CardXS
              href=""
              grp="Overview"
              name="Project Attractor"
              label="Attractor"
              subitems={[]}
              idx={0}
              value={90}
            />
          </div>
          <MultiParser markdown={entry} />
          {/* <AssistantEntry message={exampleMarkdown} /> */}
        </div>
      </div>
    </div>
  );
};
