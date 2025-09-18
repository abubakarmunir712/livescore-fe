import { PlayCircle, Clock, CheckCircle, Package } from "lucide-react";
import { useFilterStore } from "../store/useFilterStore";

export const FilterContainer = () => {
  const { statusFilter, setStatusFilter, toggleGroup, groupToggle, dateFilter } =
    useFilterStore();

  // normalize dates (ignore time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(dateFilter);
  selected.setHours(0, 0, 0, 0);

  const isPast = selected.getTime() < today.getTime();
  const isFuture = selected.getTime() > today.getTime();

  return (
    <div className="w-full flex items-center justify-between gap-3 py-2 rounded-md">
      {/* Left buttons */}
      <div className="flex gap-2">
        {/* Live */}
        <button
          onClick={() => setStatusFilter("live")}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm
            ${statusFilter === "live"
              ? "bg-accent text-background"
              : "bg-surface text-text border border-border hover:bg-border"}
          `}
        >
          <PlayCircle className="w-4 h-4" />
          <span className="sm:block hidden">Live</span>
        </button>

        {/* Upcoming */}
        <button
          onClick={() => setStatusFilter("upcoming")}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm
            ${statusFilter === "upcoming"
              ? "bg-accent text-background"
              : "bg-surface text-text border border-border hover:bg-border"}
            ${isPast ? "hidden" : ""}
          `}
        >
          <Clock className="w-4 h-4" />
          <span className="sm:block hidden">Upcoming</span>
        </button>

        {/* Finished */}
        <button
          onClick={() => setStatusFilter("finished")}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm
            ${statusFilter === "finished"
              ? "bg-accent text-background"
              : "bg-surface text-text border border-border hover:bg-border"}
            ${isFuture ? "hidden" : ""}
          `}
        >
          <CheckCircle className="w-4 h-4" />
          <span className="sm:block hidden">Finished</span>
        </button>
      </div>

      {/* Right filter toggle */}
      <div>
        <button
          onClick={toggleGroup}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${groupToggle
            ? "bg-accent text-background"
            : "bg-surface text-text border border-border hover:bg-border"
            }`}
        >
          <Package className="w-4 h-4" />
          <span className="sm:block hidden">Group</span>
        </button>
      </div>
    </div>
  );
};
