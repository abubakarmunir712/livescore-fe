import { useEffect, useRef, useState } from "react";
import { useFilterStore } from "../store/useFilterStore";

const DateSelecter = () => {
  const [dates, setDates] = useState<Date[]>();
  const noOfPrevDays = 3;
  const noOfNextDays = 3;
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const { setDateFilter, dateFilter } = useFilterStore();

  const generateDates = () => {
    const tempDates: Date[] = [];
    for (let i = noOfPrevDays; i >= 0; i--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      tempDates.push(date);
    }
    for (let i = 1; i <= noOfNextDays; i++) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + i);
      tempDates.push(date);
    }
    setDates(tempDates);
  };

  const dateToString = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
  };

  useEffect(() => {
    generateDates();
  }, []);

  // 🔥 scroll to the active date whenever `dateFilter` changes
  useEffect(() => {
    if (!dates) return;
    const idx = dates.findIndex(
      (d) => d.toDateString() === dateFilter.toDateString()
    );
    if (idx !== -1 && buttonsRef.current[idx]) {
      setTimeout(() => {
        buttonsRef.current[idx]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 200);
    }
  }, [dateFilter, dates]);

  return (
    <div className="w-full py-3 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2">
        {dates?.map((date: Date, i: number) => {
          const isActive = date.toDateString() === dateFilter.toDateString();

          return (
            <button
              key={i}
              onClick={() => setDateFilter(date)}
              ref={(el) => {
                buttonsRef.current[i] = el;
              }}
              className={`
                flex items-center justify-center 
                min-w-[65px] px-2 py-1 rounded-md text-sm font-medium cursor-pointer outline-none transition
                ${
                  isActive
                    ? "bg-accent text-background"
                    : "bg-surface text-text border border-border hover:bg-border"
                }
              `}
            >
              {dateToString(date)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelecter;
