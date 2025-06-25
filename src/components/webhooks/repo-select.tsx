import { ConnectionStatus, WebhookEvent } from "@/app/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GetEventStats } from "@/ctx/events-ctx";
import { Icon } from "@/lib/icons";
import { JSX, useId } from "react";

interface RepoSelectProps {
  onSelectRepo: (v: string) => void;
  selectedRepo: string;
  repositories: string[];
  events: WebhookEvent[];
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
  eventStats: GetEventStats;
}
export const RepoSelect = (props: RepoSelectProps): JSX.Element => {
  const { events, isLoading, selectedRepo } = props;
  return (
    <div className="">
      <SelectRepository {...props} />

      {isLoading && selectedRepo && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full size-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      )}

      {events && events.length > 0 && (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-3 rounded border ${
                event.isValid
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`font-medium ${
                      event.isValid ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {event.eventType.toUpperCase()}
                  </span>
                  <span className="text-gray-600 ml-2">by {event.sender}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              {event.error && (
                <p className="text-sm text-red-600 mt-1">{event.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {events && events.length === 0 && selectedRepo && (
        <p className="text-gray-500 text-center py-4">
          No events found for this repository
        </p>
      )}
    </div>
  );
};

interface SelectRepoProps {
  // onSelectRepo: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSelectRepo: (v: string) => void;
  repositories: string[];
  selectedRepo: string;
}
export const SelectRepository = ({
  onSelectRepo,
  repositories,
}: SelectRepoProps) => {
  const id = useId();
  return (
    <div className="_*:not-first:mt-2 w-full space-y-4">
      <div className="hidden select-none items-center justify-start space-x-2 px-2">
        <Icon solid name="repo" size={12} className="text-muted-foreground" />
        <h2
          className={`text-xs font-semibold uppercase font-sans tracking-[0.20em] dark:text-cream text-foreground`}
        >
          Activity
        </h2>
      </div>
      <Select defaultValue="1" onValueChange={onSelectRepo}>
        <SelectTrigger
          id={id}
          className="[&>span_svg]:text-foreground [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 w-full"
        >
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent
          sideOffset={0}
          align="center"
          side="bottom"
          className="[&_*[role=option]>span>svg]:text-muted-foreground [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0"
        >
          {repositories.map((repo) => (
            <SelectItem key={repo} value={repo}>
              <Icon name="re-up.ph" size={16} aria-hidden="true" />
              <span className="truncate">{repo}</span>
            </SelectItem>
          ))}
          {/* EXAMPLE ITEM */}
          <SelectItem value="1">
            <Icon name="re-up.ph" size={16} aria-hidden="true" />
            <span className="truncate">re-up.ph</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
