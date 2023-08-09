import { createContext, useContext, useState } from "react";

const AnilistFilterContext = createContext();
const AnilistTabsContext = createContext();

export function AnilistTabsProvider({ children }) {
  const [tabs, setTabs] = useState([]);
  return (
    <AnilistTabsContext.Provider value={{ tabs, setTabs }}>
      {children}
    </AnilistTabsContext.Provider>
  );
}

export function AnilistFilterProvider({ children }) {
  const [sort, setSort] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [status, setStatus] = useState("");
  const [keywords, setKeywords] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [year, setYear] = useState();
  const [season, setSeason] = useState("");
  const [format, setFormat] = useState("");
  const [source, setSource] = useState("");
  const [episodeMin, setEpisodeMin] = useState("");
  const [episodeMax, setEpisodeMax] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [durationMax, setDurationMax] = useState("");

  const value = {
    sort,
    setSort,
    selectedGenre,
    setSelectedGenre,
    status,
    setStatus,
    keywords,
    setKeywords,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    year,
    setYear,
    season,
    setSeason,
    format,
    setFormat,
    source,
    setSource,
    episodeMin,
    setEpisodeMin,
    episodeMax,
    setEpisodeMax,
    durationMin,
    setDurationMin,
    durationMax,
    setDurationMax,
  };

  return (
    <AnilistFilterContext.Provider value={value}>
      {children}
    </AnilistFilterContext.Provider>
  );
}

export function useAnilistFilter() {
  return useContext(AnilistFilterContext);
}

export function useAnilistTabs() {
  return useContext(AnilistTabsContext);
}
