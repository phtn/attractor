"use client";

import { JSX, useState } from "react";
import { trpc } from "@/trpc/react";

export const RepoSelect = (): JSX.Element => {
  const [selectedRepo, setSelectedRepo] = useState<string>("");

  const { data: events, isLoading } = trpc.getEventsByRepository.useQuery(
    { repository: selectedRepo },
    { enabled: !!selectedRepo },
  );

  const { data: allEvents } = trpc.getEvents.useQuery({ limit: 50 });

  // Get unique repositories
  const repositories = Array.from(
    new Set(allEvents?.map((event) => event.repository) || []),
  );

  return (
    <div className="bg-card/40 border-xy border-[0.33px] rounded-md px-4 py-3">
      <select
        value={selectedRepo}
        onChange={(e) => setSelectedRepo(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">Events by Repository</option>
        {repositories.map((repo) => (
          <option key={repo} value={repo}>
            {repo}
          </option>
        ))}
      </select>

      {isLoading && selectedRepo && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
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
