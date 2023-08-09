import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSearchAPI } from "../../config/anilist";
import { uuid } from "../../config";
import CardListAnilist from "../../components/card list anilist";
import { useAnilistFilter } from "../../hooks/AnilistContext";

export default function Anilist() {
  const [data, setData] = useState([]);
  const [firstRender, setFirstRender] = useState(true);
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

  const [hideFilters, setHideFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(false);

  const {
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
  } = useAnilistFilter();
  const dispatch = useDispatch();

  function submitSearch() {
    dispatch({ type: "LOADING_CARD_TRUE" });

    const start = parseInt(startDate) - 1;
    const end = parseInt(endDate) + 1;
    getSearchAPI(
      keywords,
      format,
      sort ? [sort] : null,
      status,
      source,
      selectedGenre,
      year ? year + "%" : "",
      endDate ? parseInt(end + "0000") : "",
      startDate ? parseInt(start + "9999") : "",
      parseInt(season),
      parseInt(episodeMin),
      parseInt(episodeMax),
      parseInt(durationMin),
      parseInt(durationMax),
      currentPage
    ).then((res) => {
      setData(res.media);
      setNextPage(res.pageInfo.hasNextPage);
      setTotalPages(res.pageInfo.lastPage);
      setCurrentPage(res.pageInfo.currentPage);
      dispatch({ type: "LOADING_CARD_FALSE" });
      setFirstRender(false);
      console.log(res);
    });
  }
  function resetSearch() {
    setKeywords("");
    setSeason("");
    setFormat("");
    setStatus("");
    setSource("");
    setSelectedGenre("");
    setYear("");
    setEndDate("");
    setStartDate("");
    setEpisodeMin("");
    setEpisodeMax("");
    setEpisodeMax("");
    setDurationMin("");
    setDurationMax("");
    setSort("");
    setCurrentPage(1);
  }
  useEffect(() => {
    submitSearch();
  }, []);

  useEffect(() => {
    if (firstRender) {
      return;
    }
    submitSearch();
  }, [currentPage]);

  return (
    <div className="Home pt-5">
      <div className="container flex flex-col items-center justify-center gap-5 px-5 mx-auto md:px-5">
        <div className="flex flex-col items-center gap-5 md:flex-row mb-2">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 items-center">
            <div className="relative dark:bg-gray-500 flex items-center border-cyan-500 border shadow-lg pl-3 rounded-md col-span-full md:col-span-1 transition-all duration-300">
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
                onKeyUp={(e) => {
                  if (e.key === "Enter") submitSearch();
                }}
                className="w-full h-9 px-2 py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 focus:outline-none transition-colors transition-all border-0 rounded-md duration-300"
              />
            </div>
            <div className="relative focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary flex items-center border shadow-lg px-4 rounded-md transition-all duration-300">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="h-9 w-full transition-all duration-300 focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none"
              >
                <option value={""}>Genres</option>
                {genres.map((genre) => (
                  <option className="capitalize" key={uuid()} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary flex items-center border shadow-lg px-4 rounded-md transition-all duration-300">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-9 w-full focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none"
              >
                <option value={""}>Year</option>
                {Array.from(
                  { length: new Date().getFullYear() - 1941 },
                  (_, index) => new Date().getFullYear() - index
                ).map((year) => (
                  <option key={uuid()} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary flex items-center border shadow-lg px-4 rounded-md transition-all duration-300">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 w-full focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none"
              >
                <option value={""}>Sort</option>
                <option value={"TITLE_ROMAJI"}>Title</option>
                <option value={"POPULARITY_DESC"}>Popularity</option>
                <option value={"SCORE_DESC"}>Score</option>
                <option value={"TRENDING_DESC"}>Trending</option>
                <option value={"FAVOURITES_DESC"}>Favorites</option>
                <option value={"ID_DESC"}>Date</option>
                <option value={"START_DATE_DESC"}>Release Date</option>
              </select>

              <button
                className="w-10 h-9"
                onClick={() =>
                  setSort((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              ></button>
            </div>
            <div className="relative focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary flex items-center border shadow-lg px-4 rounded-md transition-all duration-300">
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="h-9 w-full focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none"
              >
                <option value={""}>Format</option>
                <option value={"TV"}>TV Show</option>
                <option value={"MOVIE"}>Movie</option>
                <option value={"TV_SHORT"}>TV Short</option>
                <option value={"SPECIAL"}>Special</option>
                <option value={"OVA"}>OVA</option>
                <option value={"ONA"}>ONA</option>
                <option value={"MUSIC"}>Music</option>
                <option value={"ONE_SHOT"}>One Shot</option>
              </select>
            </div>
            <div className="relative focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary flex items-center border shadow-lg px-4 rounded-md transition-all duration-300">
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="h-9 w-full focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none"
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
            <div className="relative focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary flex items-center border shadow-lg px-4 rounded-md transition-all duration-300">
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="h-9 w-full focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none"
              >
                <option value={""}>Season</option>
                <option value={"WINTER"}>Winter</option>
                <option value={"SPRING"}>Spring</option>
                <option value={"SUMMER"}>Summer</option>
                <option value={"FALL"}>Fall</option>
              </select>
            </div>

            <div
              className={
                hideFilters
                  ? "hidden md:flex relative col-span-full md:col-span-1 focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary items-center border shadow-lg px-4 rounded-md transition-all duration-300"
                  : "relative focus:ring-4  col-span-full md:col-span-1 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary flex items-center border shadow-lg px-4 rounded-md transition-all duration-300"
              }
            >
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-9 w-full focus:ring-4 text-center md:text-left focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary transition-all duration-300  outline-none appearance-none focus:ring-0 focus:ring-0 focus:dark:ring-0 focus:outline-none active:outline-none"
              >
                <option value={""}>Airing Status</option>
                <option value={"RELEASING"}>Airing</option>
                <option value={"FINISHED"}>Finished</option>
                <option value={"NOT_YET_RELEASED"}>Not Yet Aired</option>
                <option value={"CANCELLED"}>Cancelled</option>
                <option value={"HIATUS"}>Paused</option>
              </select>
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex rounded-md relative items-center shadow-lg"
                  : "relative flex items-center rounded-md shadow-lg "
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
                className="border-cyan-500 border w-full px-4 py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 rounded-md focus:outline-none transition-colors duration-300"
              />
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex rounded-md relative items-center shadow-lg"
                  : "relative flex items-center rounded-md shadow-lg "
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
                className="border-cyan-500 border w-full px-4 py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 rounded-md focus:outline-none transition-colors duration-300"
              />
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex rounded-md relative items-center shadow-lg"
                  : "relative flex items-center rounded-md shadow-lg "
              }
            >
              <input
                id="anilist-search"
                type="number"
                min={1}
                value={episodeMin}
                onChange={(e) => setEpisodeMin(e.target.value)}
                placeholder="Episode Min"
                className="border-cyan-500 border w-full px-4 py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 rounded-md focus:outline-none transition-colors duration-300"
              />
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex rounded-md relative items-center shadow-lg"
                  : "relative flex items-center rounded-md shadow-lg "
              }
            >
              <input
                id="anilist-search"
                type="number"
                min={1}
                value={episodeMax}
                onChange={(e) => setEpisodeMax(e.target.value)}
                placeholder="Episode Max"
                className="border-cyan-500 border w-full px-4 py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 rounded-md focus:outline-none transition-colors duration-300"
              />
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex rounded-md relative items-center shadow-lg"
                  : "relative flex items-center rounded-md shadow-lg "
              }
            >
              <input
                id="anilist-search"
                type="number"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
                placeholder="Duration Min"
                className="border-cyan-500 border w-full px-4 py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 rounded-md focus:outline-none transition-colors duration-300"
              />
            </div>
            <div
              className={
                hideFilters
                  ? "hidden md:flex rounded-md relative items-center shadow-lg"
                  : "relative flex items-center rounded-md shadow-lg "
              }
            >
              <input
                id="anilist-search"
                type="number"
                value={durationMax}
                onChange={(e) => setDurationMax(e.target.value)}
                placeholder="Duration Max"
                className="border-cyan-500 border w-full px-4 py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 rounded-md focus:outline-none transition-colors duration-300"
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
                {hideFilters ? "Show" : "Hide"}
              </button>
              <button
                onClick={() => resetSearch()}
                className="px-5 py-2 transition-all duration-300 rounded-md focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between min-h-screen">
        {data.length ? (
          <CardListAnilist
            data={data}
            haveData={true}
            all={true}
            firstCard={true}
          ></CardListAnilist>
        ) : null}
      </div>
      <div className="flex justify-center gap-3 align-center">
        <button
          disabled={currentPage === 1 ? "disabled" : null}
          onClick={() => {
            setCurrentPage((prev) => (prev <= 0 ? 0 : prev - 1));
          }}
          className="disabled:bg-gray-300 disabled:dark:bg-gray-700 px-5 py-2 text-lg transition-all duration-300 rounded-xl focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary"
        >
          Prev
        </button>
        <input
          className="text-center w-16 rounded-lg"
          type="text"
          disabled
          value={`${currentPage} `}
        />
        <button
          disabled={nextPage ? null : "disabled"}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
          className="px-5 py-2 text-lg disabled:bg-gray-300 disabled:dark:bg-gray-700 transition-all duration-300 rounded-xl focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
}
