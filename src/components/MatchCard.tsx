import React, { useEffect, useState } from "react"

function mapToStatus(code: string): any {
  const liveCodes = ["1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT", "LIVE"]
  const finishedCodes = ["FT", "AET", "PEN", "CANC", "ABD", "AWD", "WO"]
  const upcomingCodes = ["TBD", "NS", "PST"]
  if (liveCodes.includes(code)) return "live"
  if (finishedCodes.includes(code)) return "finished"
  if (upcomingCodes.includes(code)) return "upcoming"
  return "upcoming"
}

const MatchCard: React.FC<{ match: any, onClick: any }> = ({ match, onClick }) => {
  const status = mapToStatus(match.fixture.status.short)
  const isLive = status === "live"

  const initialStats = {
    position: "NA",
    points: "NA",
    matchesPlayed: "NA",
    streakCompetition: "NA",
    gd: "NA",
    h2h: "NA",
    streakOverall: [] as string[],
  }

  const [homeStats, setHomeStats] = useState(initialStats)
  const [awayStats, setAwayStats] = useState(initialStats)

  useEffect(() => {
    if (match.standings) {
      for (const s of match.standings) {
        for (const st of s.league.standings) {
          for (const standings of st) {
            if (standings.team.id === match.teams.home.id) {
              setHomeStats((prev) => ({
                ...prev,
                position: standings.rank,
                points: standings.points,
                matchesPlayed: standings.all.played,
                streakCompetition: `${standings.all.win}W-${standings.all.draw}D-${standings.all.lose}L`,
                gd: `${standings.all.goals.for}-${standings.all.goals.against}`,
              }))
            }
            if (standings.team.id === match.teams.away.id) {
              setAwayStats((prev) => ({
                ...prev,
                position: standings.rank,
                points: standings.points,
                matchesPlayed: standings.all.played,
                streakCompetition: `${standings.all.win}W-${standings.all.draw}D-${standings.all.lose}L`,
                gd: `${standings.all.goals.for}-${standings.all.goals.against}`,
              }))
            }
          }
        }
      }
    }

    const getMatchResult = (s: any) => {
      if (s === null) return "D"
      if (s === true) return "W"
      return "L"
    }

    if (match[`streak-${match.teams.home.id}`]) {
      const streak = match[`streak-${match.teams.home.id}`].map((m: any) => {
        if (m.teams.home.id === match.teams.home.id)
          return getMatchResult(m.teams.home.winner)
        if (m.teams.away.id === match.teams.home.id)
          return getMatchResult(m.teams.away.winner)
        return "D"
      })
      setHomeStats((prev) => ({ ...prev, streakOverall: streak }))
    }

    if (match[`streak-${match.teams.away.id}`]) {
      const streak = match[`streak-${match.teams.away.id}`].map((m: any) => {
        if (m.teams.home.id === match.teams.away.id)
          return getMatchResult(m.teams.home.winner)
        if (m.teams.away.id === match.teams.away.id)
          return getMatchResult(m.teams.away.winner)
        return "D"
      })
      setAwayStats((prev) => ({ ...prev, streakOverall: streak }))
    }

    // H2H Logic
    if (match.h2h) {
      let homeWin = 0
      let homeDraw = 0
      let homeLose = 0

      for (const h2h of match.h2h) {
        if (h2h.teams.home.id == match.teams.home.id) {
          if (h2h.teams.home.winner === true) {
            homeWin++
          } else if (h2h.teams.home.winner === false) {
            homeLose++
          } else {
            homeDraw++
          }
        }
      }

      setHomeStats((prev) => ({
        ...prev,
        h2h: `${homeWin}W-${homeDraw}D-${homeLose}L`
      }))
      setAwayStats((prev) => ({
        ...prev,
        h2h: `${homeLose}W-${homeDraw}D-${homeWin}L`
      }))
    }
  }, [match])

  const getMatchTime = () => {
    const { short, elapsed } = match.fixture.status
    switch (short) {
      case "NS":
      case "TBD":
        return new Date(match.fixture.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      case "1H":
      case "2H":
      case "ET":
        return `${elapsed}'`
      case "HT":
        return "HT"
      case "FT":
      case "AET":
      case "PEN":
        return "FT"
      default:
        return short
    }
  }

  const renderStreak = (streak: string[]) => (
    <div className="flex gap-1.5">
      {streak
        .slice()
        .reverse()
        .map((s, idx) => (
          <div key={idx} className="relative group">
            <div
              className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full shadow-sm transition-all duration-200 hover:scale-110 
              ${s === "W" ? "bg-green-500 text-white ring-2 ring-green-500/20" : ""}
              ${s === "L" ? "bg-red-500 text-white ring-2 ring-red-500/20" : ""}
              ${s === "D" ? "bg-gray-400 text-white ring-2 ring-gray-400/20" : ""}`}
            >
              {s}
            </div>
            <div className="absolute hidden group-hover:block bg-gray-800 text-xs text-white px-2 py-1 rounded-md shadow-lg -top-9 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
              {s === "W" ? "Win" : s === "L" ? "Loss" : "Draw"}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        ))}
    </div>
  )

  const Pill = ({ label, value, tooltip }: { label: string; value: any; tooltip: string }) => (
    <div className="relative group">
      <div className="px-3 py-1.5 text-xs bg-gray-700 text-gray-200 rounded-full border border-gray-600 shadow-sm hover:bg-gray-600 transition-colors duration-200">
        <span className="font-medium text-gray-300">{label}:</span>{" "}
        <span className="text-white font-semibold">{value}</span>
      </div>
      <div className="absolute hidden group-hover:block bg-gray-800 text-xs text-white px-3 py-2 rounded-md shadow-lg -top-10 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
        {tooltip}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  )

  const renderStats = (stats: any) => (
    <div className="flex flex-wrap gap-2 mt-3">
      <Pill label="Pos" value={stats.position} tooltip="League Position" />
      <Pill label="Pts" value={stats.points} tooltip="Points" />
      <Pill label="MP" value={stats.matchesPlayed} tooltip="Matches Played" />
      <Pill label="GD" value={stats.gd} tooltip="Goal Difference" />
      <Pill label="H2H" value={stats.h2h} tooltip="Head-to-Head" />
      <Pill label="Form" value={stats.streakCompetition} tooltip="Competition Record (W-D-L)" />
    </div>
  )

  return (
    <div
      className={`bg-surface mt-3 cursor-pointer rounded-lg w-full flex flex-col px-6 py-5 shadow-sm hover:shadow-md transition-all duration-200 border-l-4
        ${isLive ? "border-l-yellow-400 bg-yellow-50/5" : "border-l-transparent hover:border-l-blue-400/50"}`}
      onClick={() => onClick()}
    >
      {/* Match header with live indicator */}
      {isLive && (
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-yellow-200/20">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">Live</span>
        </div>
      )}

      {/* Home team */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <img
                src={match.teams.home.logo}
                alt={match.teams.home.name}
                className="w-8 h-8 rounded-full shadow-sm ring-2 ring-white/10"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-text font-semibold text-base">{match.teams.home.name}</span>
              <div className="mt-1">
                {renderStreak(homeStats.streakOverall)}
              </div>
            </div>
          </div>
          {renderStats(homeStats)}
        </div>

        {/* Score section */}
        <div className="flex flex-col items-center justify-center mx-6">
          <div className="flex items-center gap-3 text-3xl font-bold text-text mb-1">
            <span className={`${match.goals.home > match.goals.away ? 'text-green-500' : ''}`}>
              {match.goals.home}
            </span>
            <span className="text-text-muted text-2xl">-</span>
            <span className={`${match.goals.away > match.goals.home ? 'text-green-500' : ''}`}>
              {match.goals.away}
            </span>
          </div>
          <div
            className={`text-sm px-3 py-1 rounded-full font-medium
            ${isLive ? "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20" : "text-text-muted bg-gray-100/10"}`}
          >
            {getMatchTime()}
          </div>
        </div>
      </div>

      {/* Away team */}
      <div className="flex items-start">
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <img
                src={match.teams.away.logo}
                alt={match.teams.away.name}
                className="w-8 h-8 rounded-full shadow-sm ring-2 ring-white/10"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-text font-semibold text-base">{match.teams.away.name}</span>
              <div className="mt-1">
                {renderStreak(awayStats.streakOverall)}
              </div>
            </div>
          </div>
          {renderStats(awayStats)}
        </div>
      </div>
    </div>
  )
}

export default MatchCard