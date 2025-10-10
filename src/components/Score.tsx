import React, { useEffect, useState, useCallback } from "react"
import DateSelecter from "./DateSelecter"
import { FilterContainer } from "./FilterContainer"
import { useSearchStore } from "../store/useSearchStore"
import { usePageStore } from "../store/usePageStore"
import { useFilterStore } from "../store/useFilterStore"
import { useMatchStore } from "../store/useMatchStore"
import Loading from "./Loading"
import MatchCard from "./MatchCard"
import LeagueHeading from "./LeagueHeading"
import Events from "./Events"
import { Statistics } from "./Statistics"
import { AdSlot } from "./AdSpace"

const Score = () => {
    const { setTeams } = useSearchStore()
    const { pageType, setPageType } = usePageStore()
    const { search, statusFilter, dateFilter, groupToggle } = useFilterStore()
    const { data, isLoading, error, fetchMatches, setIsLoading, total } = useMatchStore()

    const [activeTab, setActiveTab] = useState<"events" | "statistics">("events")
    const [events, setEvents] = useState([])
    const [statistics, setStatistics] = useState([])
    const [dataToDisplay, setDataToDisplay] = useState<any>([])

    const [start, setStart] = useState(0)
    const [loadingMore, setLoadingMore] = useState(false)
    const limit = 20

    // Responsive ad configuration
    const [adConfig, setAdConfig] = useState({
        key: '',
        script: '',
        width: 0,
        height: 0
    })

    // Update ad config based on window size
    useEffect(() => {
        const updateAdConfig = () => {
            const width = window.innerWidth
            
            if (width >= 728) {
                // Desktop: 728x90
                setAdConfig({
                    key: '64f4a081926456b280531e5e25b029ae',
                    script: '//www.highperformanceformat.com/64f4a081926456b280531e5e25b029ae/invoke.js',
                    width: 728,
                    height: 90
                })
            } else if (width >= 468) {
                // Tablet: 468x60
                setAdConfig({
                    key: 'a9007880b503d652e1548995b0f00b95',
                    script: '//www.highperformanceformat.com/a9007880b503d652e1548995b0f00b95/invoke.js',
                    width: 468,
                    height: 60
                })
            } else {
                // Mobile: 320x50
                setAdConfig({
                    key: 'b22aa3e75232c531a0def5fcf889c955',
                    script: '//www.highperformanceformat.com/b22aa3e75232c531a0def5fcf889c955/invoke.js',
                    width: 320,
                    height: 50
                })
            }
        }

        updateAdConfig()
        window.addEventListener('resize', updateAdConfig)
        return () => window.removeEventListener('resize', updateAdConfig)
    }, [])

    const isSameDate = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()

    // --- core fetch helper ---
    const loadMatches = useCallback(
        async (offset: number, append: boolean, loading: boolean) => {
            setIsLoading(loading)
            try {
                await fetchMatches(
                    dateFilter,
                    statusFilter,
                    offset,
                    search.query,
                    groupToggle,
                    append
                )
            } finally {
                setIsLoading(false)
            }
        },
        [dateFilter, statusFilter, search.query, fetchMatches, setIsLoading, setTeams, groupToggle]
    )

    // --- initial + filter/date/search change ---
    useEffect(() => {
        setStart(0)
        loadMatches(0, false, true)

        if (!isSameDate(dateFilter, new Date())) {
            setTeams([]) // clear for non-live days
            return
        }

        // live refresh every 60s
        const interval = setInterval(() => {
            loadMatches(0, false, false)
            setStart(0)
        }, 60000)

        return () => clearInterval(interval)
    }, [dateFilter, statusFilter, search.query, loadMatches, setTeams])

    // --- infinite scroll ---
    useEffect(() => {
        const handleScroll = async () => {
            if (loadingMore || isLoading) return
            console.log(data.length, total)
            if (total !== null && start >= total) {
                console.log(data.length, total)
                return
            }

            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                setLoadingMore(true)
                await loadMatches(start + limit, true, false)
                setStart((prev) => prev + limit)
                setLoadingMore(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [loadingMore, isLoading, total, data.length, start, loadMatches])


    useEffect(() => {
        setDataToDisplay(data)
    }, [data, groupToggle])

    const onClickMatch = (match: any) => {
        setPageType("match")
        setActiveTab("events")
        setStatistics(match.statistics)
        setEvents(match.events)
    }

    const onBack = () => setPageType("home")

    // --- UI ---
    if (isLoading && start === 0) {
        return (
            <section className="flex-3 lg:max-w-[60%] border-border border flex items-center text-text max-w-full p-3 mb-4 flex-col min-h-[80dvh]">
                <DateSelecter />
                <FilterContainer />
                <Loading />
            </section>
        )
    }
    if (error) {
        return (
            <section className="flex-3 lg:max-w-[60%] border-border border flex items-center text-text max-w-full p-3 mb-4 flex-col min-h-[80dvh]">
                <DateSelecter />
                <FilterContainer />
                <div className="w-full h-full flex items-center justify-center">{error}</div>
            </section>
        )
    }

    if (!isLoading && dataToDisplay?.length == 0) {
        return (
            <section className="flex-3 lg:max-w-[60%] border-border border flex items-center text-text max-w-full p-3 mb-4 flex-col min-h-[80dvh]">
                <DateSelecter />
                <FilterContainer />
                <div className="w-full h-full flex items-center justify-center">Match not found</div>
            </section>
        )
    }

    return (
        <section className="flex-3 lg:max-w-[60%] border-border border flex items-center text-text max-w-full p-3 mb-4 flex-col min-h-[80dvh]">
            <DateSelecter />
            <FilterContainer />

            {pageType === "home" && (
                <>
                    {dataToDisplay?.map((match: any, i: number, arr: any[]) => {
                        const showHeading = i === 0 || arr[i - 1].league.id !== match.league.id
                        return (
                            <React.Fragment key={i}>
                                {showHeading && (
                                    <AdSlot 
                                        id={i.toString()}
                                        script={adConfig.script}
                                        options={{
                                            'key': adConfig.key,
                                            'format': 'iframe',
                                            'height': adConfig.height,
                                            'width': adConfig.width,
                                            'params': {}
                                        }} 
                                    />
                                )}
                                {showHeading && <LeagueHeading league={match.league} />}
                                <MatchCard match={match} onClick={() => onClickMatch(match)} />
                            </React.Fragment>
                        )
                    })}
                    {(isLoading || loadingMore) && <Loading />}
                </>
            )}

            {pageType === "match" && (
                <div className="w-full flex flex-col h-full">
                    <div className="flex border-b border-border mb-4">
                        {["events", "statistics"].map((tab) => (
                            <button
                                key={tab}
                                className={`flex-1 text-center px-4 py-2 transition-colors 
                  ${activeTab === tab
                                        ? "font-semibold border-b-2 border-primary text-primary"
                                        : "text-muted hover:text-text"}`}
                                onClick={() => setActiveTab(tab as "events" | "statistics")}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2 w-full h-full">
                        {activeTab === "events" && <Events events={events} onBack={onBack} />}
                        {activeTab === "statistics" && (
                            <Statistics statistics={statistics} onBack={onBack} />
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}

export default Score