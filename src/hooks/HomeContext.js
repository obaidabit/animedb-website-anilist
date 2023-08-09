import { createContext, useContext, useState } from "react";

const HomeFilterContext = createContext();
const HomeTabsContext = createContext();

export function HomeTabsProvider({ children }) {
  const [tabs, setTabs] = useState([]);

  const value = {
    tabs,
    setTabs,
  };

  return (
    <HomeTabsContext.Provider value={value}>
      {children}
    </HomeTabsContext.Provider>
  );
}

export function HomeFilterProvider({ children }) {
  const [sort, setSort] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [genre, setGenre] = useState("");
  const [animeType, setAnimeType] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [keywords, setKeywords] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const value = {
    sort,
    setSort,
    orderBy,
    setOrderBy,
    genre,
    setGenre,
    animeType,
    setAnimeType,
    status,
    setStatus,
    rating,
    setRating,
    keywords,
    setKeywords,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };

  return (
    <HomeFilterContext.Provider value={value}>
      {children}
    </HomeFilterContext.Provider>
  );
}

export function useHomeFilter() {
  return useContext(HomeFilterContext);
}

export function useHomeTabs() {
  return useContext(HomeTabsContext);
}
