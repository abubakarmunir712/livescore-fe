export const Statistics = ({
  statistics,
  onBack,
}: {
  statistics: any[];
  onBack: () => void;
}) => {
  if (!statistics || statistics.length != 2) {
    return (
      <div className="p-4">
        <button
          onClick={onBack}
          className="mb-4 px-3 py-1 rounded bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <p className="text-sm text-text-muted">No statistics available</p>
      </div>
    );
  }

  let teamA: any;
  let teamB: any;
  let allTypes: any;
  [teamA, teamB] = Array.isArray(statistics) ? statistics : [[], []];
  // Collect all unique stat types (sometimes one team may have missing values)
  allTypes = Array.from(
    new Set([
      ...teamA?.statistics?.map((s: any) => s.type),
      ...teamB?.statistics?.map((s: any) => s.type),
    ])
  );



  return (
    <div className="p-4 bg-surface rounded shadow">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-4 px-3 py-1 rounded bg-primary text-white text-sm hover:bg-primary/80"
      >
        ← Back
      </button>

      {/* Team Headers */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col items-center">
          <img
            src={teamA.team.logo}
            alt={teamA.team.name}
            className="w-10 h-10"
          />
          <p className="text-sm font-semibold">{teamA.team.name}</p>
        </div>
        <span className="text-xs text-text-muted">vs</span>
        <div className="flex flex-col items-center">
          <img
            src={teamB.team.logo}
            alt={teamB.team.name}
            className="w-10 h-10"
          />
          <p className="text-sm font-semibold">{teamB.team.name}</p>
        </div>
      </div>

      {/* Stats Table */}
      <div className="space-y-2">
        {allTypes && allTypes.map((type: any) => {
          const statA =
            teamA.statistics.find((s: any) => s.type === type)?.value ?? "-";
          const statB =
            teamB.statistics.find((s: any) => s.type === type)?.value ?? "-";

          return (
            <div
              key={type}
              className="grid grid-cols-3 gap-2 items-center text-sm py-1 border-b border-border"
            >
              <span className="text-right font-medium text-text">
                {statA}
              </span>
              <span className="text-center text-xs text-text-muted">
                {type}
              </span>
              <span className="text-left font-medium text-text">{statB}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
