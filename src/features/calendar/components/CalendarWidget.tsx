import React from "react";
import { SectionLabel } from "@features/home/components/atoms/SectionLabel";
import { EventRow } from "@features/home/components/molecules/EventRow";
import { useCalendarEvents } from "../hooks/useCalendarEvents";

export const CalendarWidget: React.FC = () => {
  const { events, loading } = useCalendarEvents();

  if (loading) {
    return (
      <>
        <SectionLabel>Fechas importantes</SectionLabel>
        <div className="flex flex-col space-y-3 overflow-y-scroll p-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between space-x-4 animate-pulse p-2 rounded bg-itex-box"
              aria-hidden
            >
              <div className="flex-1">
                <div className="h-4 bg-itec-gray rounded w-3/4 mb-2" />
                <div className="h-3 bg-itec-gray rounded w-1/2" />
              </div>
              <div className="w-20 h-4 bg-itec-gray rounded ml-4" />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <SectionLabel>Fechas importantes</SectionLabel>
      <div className=" overflow-y-scroll">
        <div className="flex flex-col">
          {events.map((ev,i) => (
            <EventRow
              key={ev.id}
              title={ev.title}
              description={ev.description}
              date={ev.date}
              isUrgent={i == 0}
            />
          ))}
        </div>
      </div>
    </>
  );
};
