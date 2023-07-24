import React, { useEffect, useState } from "react";
import CardList from "../../components/card list";
import { useDispatch } from "react-redux";
import { getFullAnilistDetailsAPI, getSearchAPI } from "../../config/anilist";
import { uuid } from "../../config";

export default function Anilist() {
  const [data, setData] = useState([]);
  const [firstRender, setFirstRender] = useState(true);
  const [keywords, setKeywords] = useState("");
  const [genres, setGenres] = useState([
    "action",
    "ecchi",
    "fantasy",
    "drama",
    "comedy",
    "adventure",
    "mahou Shoujo",
    "mecha",
    "music",
    "mystery",
    "psychological",
    "horror",
    "romance",
    "sci-Fi",
    "thriller",
    "supernatural",
    "slice of Life",
    "sports",
  ]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [year, setYear] = useState("");
  const [season, setSeason] = useState("");
  const [format, setFormat] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [episodeMin, setEpisodeMin] = useState("");
  const [episodeMax, setEpisodeMax] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [durationMax, setDurationMax] = useState("");
  const [hideFilters, setHideFilters] = useState(true);
  const [sort, setSort] = useState("");
  const dispatch = useDispatch();

  function submitSearch() {
    getSearchAPI(
      keywords,
      format,
      null,
      status,
      source,
      selectedGenre,
      year,
      endDate,
      startDate,
      season,
      episodeMin,
      episodeMax,
      durationMin,
      durationMax
    ).then((res) => {
      setData(res);
      console.log(res);
    });
  }
  useEffect(() => {
    // if (firstRender) {
    //   setFirstRender(false);
    //   return;
    // }
    submitSearch();
  }, []);

  return (
    <div className="Home pt-5">
      <div className="container flex flex-col items-center justify-center gap-5 px-5 mx-auto md:px-5">
        <div className="flex flex-col items-center gap-5 md:flex-row ">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 items-center">
            <div className="relative flex items-center border shadow-lg pl-3 rounded-md col-span-full md:col-span-1">
              <label htmlFor="anilist-search">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </label>

              <input
                id="anilist-search"
                type="text"
                placeholder="Anime"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full h-9 px-2 py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 focus:outline-none transition-colors duration-300"
              />
            </div>
            <div className="relative flex items-center border shadow-lg px-4 rounded-md">
              <select
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="h-9 w-full transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none"
              >
                <option value={""}>Genres</option>
                {genres.map((genre) => (
                  <option className="capitalize" key={uuid()} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex items-center border shadow-lg px-4 rounded-md">
              <select className="h-9 w-full transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none">
                <option value={""}>Year</option>
                {Array.from(
                  { length: new Date().getFullYear() - 1941 },
                  (_, index) => new Date().getFullYear() - index
                ).map((year) => (
                  <option key={uuid()} value={""}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex items-center border shadow-lg px-4 rounded-md">
              <select className="h-9 w-full transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none">
                <option value={""}>Sort</option>
                <option value={"TITLE_ROMAJI"}>Title</option>
                <option value={"POPULARITY"}>Popularity</option>
                <option value={"SCORE"}>Score</option>
                <option value={"TRENDING"}>Trending</option>
                <option value={"FAVOURITES"}>Favorites</option>
                <option value={"ID"}>Date</option>
                <option value={"START_DATE"}>Release Date</option>
              </select>

              <button
                className="w-10 h-9"
                onClick={() =>
                  setSort((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                {sort === "asc" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 absolute top-0 right-0 mx-4 my-2 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 absolute top-0 right-0 mx-4 my-2 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="relative flex items-center border shadow-lg px-4 rounded-md">
              <select
                onChange={(e) => setFormat(e.target.value)}
                className="h-9 w-full transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none"
              >
                <option value={""}>Format</option>
                <option value={"tv show"}>TV Show</option>
                <option value={"movie"}>Movie</option>
                <option value={"tv short"}>TV Short</option>
                <option value={"special"}>Special</option>
                <option value={"ova"}>OVA</option>
                <option value={"ona"}>ONA</option>
                <option value={"music"}>Music</option>
              </select>
            </div>
            <div className="relative flex items-center border shadow-lg px-4 rounded-md">
              <select
                onChange={(e) => setSource(e.target.value)}
                className="h-9 w-full transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none"
              >
                <option value={""}>Source</option>
                <option className="capitalize" value={"ORIGINAL"}>
                  ORIGINAL
                </option>
                <option className="capitalize" value={"MANGA"}>
                  MANGA
                </option>
                <option className="capitalize" value={"LIGHT_NOVEL"}>
                  LIGHT NOVEL
                </option>
                <option className="capitalize" value={"WEB_NOVEL"}>
                  WEB NOVEL
                </option>
                <option className="capitalize" value={"NOVEL"}>
                  NOVEL
                </option>
                <option className="capitalize" value={"ANIME"}>
                  ANIME
                </option>
                <option className="capitalize" value={"VISUAL_NOVEL"}>
                  VISUAL NOVEL
                </option>
                <option className="capitalize" value={"VIDEO_GAME"}>
                  VIDEO GAME
                </option>
                <option className="capitalize" value={"DOUJINSHI"}>
                  DOUJINSHI
                </option>
                <option className="capitalize" value={"COMIC"}>
                  COMIC
                </option>
                <option className="capitalize" value={"LIVE_ACTION"}>
                  LIVE ACTION
                </option>
                <option className="capitalize" value={"GAME"}>
                  GAME
                </option>
                <option className="capitalize" value={"MULTIMEDIA_PROJECT"}>
                  MULTIMEDIA PROJECT
                </option>
                <option className="capitalize" value={"PICTURE_BOOK"}>
                  PICTURE BOOK
                </option>
                <option className="capitalize" value={"OTHER"}>
                  OTHER
                </option>
              </select>
            </div>
            <div className="relative flex items-center border shadow-lg px-4 rounded-md">
              <select
                onChange={(e) => setYear(e.target.value)}
                className="h-9 w-full transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none"
              >
                <option value={""}>Season</option>
                <option value={"winter"}>Winter</option>
                <option value={"spring"}>Spring</option>
                <option value={"summer"}>Summer</option>
                <option value={"fall"}>Fall</option>
              </select>
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex relative items-center border shadow-lg px-4 rounded-md"
                  : "relative flex items-center border shadow-lg px-4 rounded-md"
              }
            >
              <select
                onChange={(e) => setStatus(e.target.value)}
                className="h-9 w-full transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none"
              >
                <option value={""}>Airing Status</option>
                <option value={"airing"}>Airing</option>
                <option value={"finished"}>Finished</option>
                <option value={"not yet aired"}>Not Yet Aired</option>
                <option value={"cancelled"}>Cancelled</option>
              </select>
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex relative items-center border shadow-lg px-4 rounded-md"
                  : "relative flex items-center border shadow-lg px-4 rounded-md"
              }
            >
              <input
                id="anilist-search"
                type="number"
                min={1917}
                max={new Date().getFullYear()}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
                className="w-full h-9  py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 focus:outline-none transition-colors duration-300"
              />
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex relative items-center border shadow-lg px-4 rounded-md"
                  : "relative flex items-center border shadow-lg px-4 rounded-md"
              }
            >
              <input
                id="anilist-search"
                type="number"
                min={1917}
                max={new Date().getFullYear()}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
                className="w-full h-9  py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 focus:outline-none transition-colors duration-300"
              />
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex relative items-center border shadow-lg px-4 rounded-md"
                  : "relative flex items-center border shadow-lg px-4 rounded-md"
              }
            >
              <input
                id="anilist-search"
                type="number"
                min={1}
                value={episodeMin}
                onChange={(e) => setEpisodeMin(e.target.value)}
                placeholder="Episode Min"
                className="w-full h-9  py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 focus:outline-none transition-colors duration-300"
              />
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex relative items-center border shadow-lg px-4 rounded-md"
                  : "relative flex items-center border shadow-lg px-4 rounded-md"
              }
            >
              <input
                id="anilist-search"
                type="number"
                min={1}
                value={episodeMax}
                onChange={(e) => setEpisodeMax(e.target.value)}
                placeholder="Episode Max"
                className="w-full h-9  py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 focus:outline-none transition-colors duration-300"
              />
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex relative items-center border shadow-lg px-4 rounded-md"
                  : "relative flex items-center border shadow-lg px-4 rounded-md"
              }
            >
              <input
                id="anilist-search"
                type="number"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
                placeholder="Duration Min"
                className="w-full h-9  py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 focus:outline-none transition-colors duration-300"
              />
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex relative items-center border shadow-lg px-4 rounded-md"
                  : "relative flex items-center border shadow-lg px-4 rounded-md"
              }
            >
              <input
                id="anilist-search"
                type="number"
                value={durationMax}
                onChange={(e) => setDurationMax(e.target.value)}
                placeholder="Duration Max"
                className="w-full h-9  py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 focus:outline-none transition-colors duration-300"
              />
            </div>
            <div className="flex justify-between items-center col-span-full md:col-span-1">
              <button
                onClick={() => submitSearch()}
                className="px-5 py-2 transition-all duration-300 rounded-md focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary"
              >
                Search
              </button>
              <button
                onClick={() => setHideFilters(!hideFilters)}
                className=" md:hidden px-5 py-2 transition-all duration-300 rounded-md focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary"
              >
                Show
              </button>
              <button className="px-5 py-2 transition-all duration-300 rounded-md focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary">
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className="gap-5 flex justify-center items-center flex-wrap"></div>
      </div>
      <div className="flex flex-col justify-between min-h-screen">
        {data.length ? (
          <CardList
            data={data}
            haveData={true}
            all={true}
            firstCard={true}
          ></CardList>
        ) : null}
      </div>
    </div>
  );
}
