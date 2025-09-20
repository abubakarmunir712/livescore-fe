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

const MatchCard: React.FC<{ match: any; onClick: any }> = ({ match, onClick }) => {
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

    if (match.h2h) {
      let homeWin = 0
      let homeDraw = 0
      let homeLose = 0

      for (const h2h of match.h2h) {
        if (h2h.teams.home.id == match.teams.home.id) {
          if (h2h.teams.home.winner === true) homeWin++
          else if (h2h.teams.home.winner === false) homeLose++
          else homeDraw++
        }
      }

      setHomeStats((prev) => ({ ...prev, h2h: `${homeWin}W-${homeDraw}D-${homeLose}L` }))
      setAwayStats((prev) => ({ ...prev, h2h: `${homeLose}W-${homeDraw}D-${homeWin}L` }))
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
    <div className="flex gap-1 ml-2">
      {streak
        .slice()
        .reverse()
        .map((s, idx) => (
          <div
            key={idx}
            className={`w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full
              ${s === "W" ? "bg-green-500 text-white" : ""}
              ${s === "L" ? "bg-red-500 text-white" : ""}
              ${s === "D" ? "bg-gray-400 text-white" : ""}`}
          >
            {s}
          </div>
        ))}
    </div>
  )

  const Pill = ({ label, value }: { label: string; value: any }) => (
    <div className="px-2 py-0.5 text-[10px] bg-gray-700 text-gray-200 rounded-full border border-gray-600">
      <span className="font-medium">{label}:</span> {value}
    </div>
  )

  const renderStats = (stats: any) => (
    <div className="flex flex-wrap gap-1 mt-1">
      <Pill label="Pos" value={stats.position} />
      <Pill label="Pts" value={stats.points} />
      <Pill label="MP" value={stats.matchesPlayed} />
      <Pill label="GD" value={stats.gd} />
      <Pill label="H2H" value={stats.h2h} />
      <Pill label="Form" value={stats.streakCompetition} />
    </div>
  )

  return (
    <div
      className={`bg-surface mt-2 cursor-pointer rounded-md w-full flex flex-col px-4 py-3 shadow-sm hover:shadow-md border-l-2
        ${isLive ? "border-l-yellow-400 bg-yellow-50/5" : "border-l-transparent hover:border-l-blue-400/50"}`}
      onClick={() => onClick()}
    >
      {/* Top bar: live + time */}
      <div className="flex justify-between items-center mb-2">
        {isLive ? (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 text-[10px] font-semibold uppercase">Live</span>
          </div>
        ) : (
          <span className="text-[10px] text-text-muted uppercase">Match</span>
        )}
        <div className="text-[11px] font-medium text-text-muted">{getMatchTime()}</div>
      </div>

      {/* Home team row */}
      <div className="flex items-start justify-between">
        <div className="flex gap-2 items-center">
          <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-6 h-6 rounded-full" />
          <span className="text-text text-sm font-semibold">{match.teams.home.name}</span>
          {renderStreak(homeStats.streakOverall)}
        </div>
        <div className={`text-sm font-bold ${match.goals.home > match.goals.away ? "text-green-500" : "text-text"}`}>
          {match.goals.home}
        </div>
      </div>
      {renderStats(homeStats)}

      {/* Divider */}
      <div className="border-t border-gray-600 my-2"></div>

      {/* Away team row */}
      <div className="flex items-start justify-between">
        <div className="flex gap-2 items-center">
          <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-6 h-6 rounded-full" />
          <span className="text-text text-sm font-semibold">{match.teams.away.name}</span>
          {renderStreak(awayStats.streakOverall)}
        </div>
        <div className={`text-sm font-bold ${match.goals.away > match.goals.home ? "text-green-500" : "text-text"}`}>
          {match.goals.away}
        </div>
      </div>
      {renderStats(awayStats)}
    </div>
  )
}

export default MatchCard