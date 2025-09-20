import React, { useEffect, useState } from "react"
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

const Score = () => {

    const { setCountries, setTeams, setLeagues } = useSearchStore()
    const { pageType, setPageType } = usePageStore()
    const { search, statusFilter, groupToggle, dateFilter } = useFilterStore()
    const { data, isLoading, error, fetchMatches, setIsLoading } = useMatchStore()
    const [dataToDisplay, setDataToDisplay] = useState<any>([])
    const [activeTab, setActiveTab] = useState<"events" | "statistics">("events")
    const [visibleCount, setVisibleCount] = useState(20);
    const batchSize = 15;
    const delayMs = 1000;

    function isSameDate(d1: Date, d2: Date) {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    }


    useEffect(() => {
        if (dataToDisplay && visibleCount < dataToDisplay.length) {
            const handleScroll = () => {
                if (
                    window.innerHeight + window.scrollY >=
                    document.body.offsetHeight - 100
                ) {
                    window.removeEventListener("scroll", handleScroll);

                    setTimeout(() => {
                        setVisibleCount((prev) =>
                            Math.min(prev + batchSize, dataToDisplay.length)
                        );
                        window.addEventListener("scroll", handleScroll);
                    }, delayMs);
                }
            };

            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [visibleCount, dataToDisplay?.length]);

    useEffect(() => {
        if (isSameDate(dateFilter, new Date())) {
            const interval = setInterval(async () => {
                await fetchMatches(new Date(), statusFilter);
            }, 60000);
            setIsLoading(true)
            fetchMatches(new Date(), statusFilter)
            return () => clearInterval(interval);
        }
        else {
            setIsLoading(true)
            fetchMatches(dateFilter, statusFilter)
            setTeams([])
        }
    }, [dateFilter, statusFilter, fetchMatches]);

    const filterData = () => {
        let filteredMatches: any[] = data
        if (search.query) {
            filteredMatches = data?.filter((m: any) => {
                if (search.tab === "countries") {
                    return m.league.country == search.query;
                } else if (search.tab === "teams") {
                    return (
                        m.teams.home.name == search.query ||
                        m.teams.away.name == search.query
                    );
                } else {
                    return m.league.name == search.query;
                }
            });
        }
        let result = filteredMatches;

        if (filteredMatches?.length) {
            if (groupToggle) {
                result = [...filteredMatches].sort(
                    (a, b) => a.league.id - b.league.id
                );
            }
        }
        setDataToDisplay(result)
    }

    useEffect(() => {
        let countriesSet: Set<string> = new Set()
        let leaguesSet: Set<string> = new Set()
        let teamsSet: Set<string> = new Set()

        if (!data) {
            return
        }

        data.forEach((m: any) => {
            countriesSet.add(m.league.country)
            leaguesSet.add(m.league.name)
            teamsSet.add(m.teams.home.name)
            teamsSet.add(m.teams.away.name)
        })
        setCountries(Array.from(countriesSet))
        setTeams(Array.from(teamsSet))
        setLeagues(Array.from(leaguesSet))
    }, [data])

    useEffect(() => {
        filterData()
    }, [data, search.query, groupToggle])

    const [events, setEvents] = useState([])
    const [statistics, setStatistics] = useState([])

    const onClickMatch = (match: any) => {
        if (match) {
            setPageType("match")   // new type for match view
            setActiveTab("events") // default to events tab
            setStatistics(match.statistics)
            setEvents(match.events)
        }

        console.log("Statistics", match?.statistics)
        console.log("Events", match)
    }

    const onBack = () => {
        setPageType("home")
    }

    if (isLoading) {
        return (<section className="flex-3 lg:max-w-[60%] border-border border flex items-center text-text max-w-full p-3 mb-4 flex-col min-h-[80dvh]">
            <DateSelecter />
            <FilterContainer />
            <Loading />
        </section>)
    }
    else if (error) {
        return (<section className="flex-3 lg:max-w-[60%] border-border border flex items-center text-text max-w-full p-3 mb-4 flex-col min-h-[80dvh]">
            <DateSelecter />
            <FilterContainer />
            <div className="w-full h-full flex items-center justify-center">
                {error}
            </div>
        </section>)
    }
    return (

        <section className="flex-3 lg:max-w-[60%] border-border border flex items-center text-text max-w-full p-3 mb-4 flex-col min-h-[80dvh]">
            <DateSelecter />
            <FilterContainer />
            {pageType == "home" && (<>
                {
                    dataToDisplay && dataToDisplay?.slice(0, visibleCount).map((match: any, i: number, arr: any[]) => {
                        const showHeading = i === 0 || arr[i - 1].league.id !== match.league.id;

                        return (
                            <React.Fragment key={i}>
                                {showHeading && <LeagueHeading league={match.league} />}
                                <MatchCard match={match} onClick={() => onClickMatch(match)} />
                            </React.Fragment>
                        );
                    })
                }
                {dataToDisplay && (visibleCount < dataToDisplay?.length) && <Loading />}
            </>)}

            {pageType == "match" && (
                <div className="w-full flex flex-col h-full">
                    {/* Tabs */}
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

                    {/* Tab content */}
                    <div className="mt-2 w-full h-full">
                        {activeTab === "events" && <Events events={events} onBack={onBack} />}
                        {activeTab === "statistics" && <Statistics statistics={statistics} onBack={onBack} />}
                    </div>
                </div>
            )}

        </section>
    )
}

export default Score
