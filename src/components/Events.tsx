const Events = ({ events, onBack }: { events: any[]; onBack: () => void }) => {
 
  
  return (
    <div className="p-4 bg-surface rounded shadow w-full h-full">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 rounded bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors cursor-pointer"
      >
        ← Back
      </button>

      {/* Events List */}
      <div className="space-y-3">
        {events==null || events?.length === 0 ? (
          <div className="text-text-muted text-sm w-full h-full flex items-center justify-center"><span>No events available</span></div>
        ) : (
          events.map((ev, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 border rounded bg-surface-hover"
            >
              {/* Team Logo */}
              <img
                src={ev.team.logo}
                alt={ev.team.name}
                className="w-8 h-8 rounded-full"
              />

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-semibold">{ev.team.name}</p>
                <p className="text-xs text-text-muted">
                  {ev.player?.name || "Unknown Player"}{" "}
                  {ev.assist?.name ? `(Assist: ${ev.assist.name})` : ""}
                </p>
                <p className="text-xs text-text-muted">{ev.detail}</p>
              </div>

              {/* Time */}
              <span className="text-xs font-medium text-text">
                {ev.time?.elapsed}'
                {ev.time?.extra ? `+${ev.time?.extra}` : ""}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
