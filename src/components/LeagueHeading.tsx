import React from "react";

interface LeagueHeadingProps {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    season: number;
    round: string;
  };
  onClick?: () => void;
}

const LeagueHeading: React.FC<LeagueHeadingProps> = ({ league }) => {
  return (
    <div className="w-full flex items-center justify-between mt-2 py-3">
      <div className="flex items-center gap-3  cursor-pointer">
        <img
          src={league.logo}
          alt={league.name}
          className="w-8 h-8 object-contain"
          loading="lazy"
        />
        <div className="flex flex-col">
          <span className="text-text font-semibold">{league.name}</span>
          <span className="text-text-muted text-sm">{league.country}</span>
        </div>
      </div>

      <div className="text-right">
        <span className="block text-text-muted text-sm">{league.round}</span>
      </div>
    </div>
  );
};


export default LeagueHeading;
