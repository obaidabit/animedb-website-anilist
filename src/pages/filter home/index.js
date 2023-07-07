import React, { useEffect, useState } from "react";
import CardList from "../../components/card list";
import { getAnimeGenreAPI, getSearchAPI } from "../../config";
import { useDispatch } from "react-redux";
import Pagination from "../../components/pagination";

export default function Home() {
  const [data, setData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [sort, setSort] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [genre, setGenre] = useState("");
  const [animeType, setAnimeType] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [keywords, setKeywords] = useState("");
  const [nextPage, setNextPage] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const dispatch = useDispatch();

  function submitSearch() {
    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    getSearchAPI(
      keywords,
      currentPage,
      orderBy,
      sort,
      animeType,
      status,
      rating,
      genre,
      startDate
        ? formatter.format(new Date(startDate)).split("/").reverse().join("-")
        : false,
      endDate
        ? formatter.format(new Date(endDate)).split("/").reverse().join("-")
        : false
    ).then((result) => {
      setNextPage(result.pagination.has_next_page);
      setTotalPages(result.pagination.last_visible_page);
      setData(result.data);
      dispatch({ type: "LOADING_CARD_FALSE" });
    });
  }

  function resetFilter() {
    setOrderBy("");
    setGenre("");
    setAnimeType("");
    setStatus("");
    setRating("");
    setKeywords("");
    setSort("asc");
    setCurrentPage(1);
  }

  useEffect(() => {
    getSearchAPI().then((result) => {
      setNextPage(result.pagination.last_visible_page);
      setTotalPages(result.pagination.last_visible_page);
      setData(result.data);
      dispatch({ type: "LOADING_CARD_FALSE" });
    });
    getAnimeGenreAPI().then((result) => setGenres(result.data));
  }, []);

  useEffect(() => {
    if (!orderBy && !genre && !animeType && !status && !rating && !keywords) {
      submitSearch();
    }
  }, [orderBy, genre, animeType, status, rating]);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    submitSearch();
  }, [currentPage]);

  return (
    <div className="Home pt-5">
      <div className="container flex flex-col items-center justify-center gap-5 px-10 mx-auto md:px-5">
        <div className="flex flex-col items-center gap-5 md:flex-row ">
          <div className="flex flex-row gap-5 flex-wrap">
            <div className="relative inline-flex">
              <svg
                className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 412 232"
              >
                <path
                  d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                  fill="#648299"
                  fillRule="nonzero"
                />
              </svg>

              <select
                value={orderBy}
                onChange={(e) =>
                  e.target.value ? setOrderBy(e.target.value) : null
                }
                className="h-10 pl-5 pr-10 transition-all duration-300 outline-none appearance-none rounded-xl focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary focus:outline-none active:outline-none"
              >
                <option value={""}>Order By</option>
                <option value={"title"}>title</option>
                <option value={"type"}>type</option>
                <option value={"rating"}>rating</option>
                <option value={"start_date"}>start date</option>
                <option value={"end_date"}>end date</option>
                <option value={"episodes"}>episodes</option>
                <option value={"score"}>score</option>
                <option value={"scored_by"}>scored by</option>
                <option value={"rank"}>rank</option>
                <option value={"popularity"}>popularity</option>
                <option value={"members"}>members</option>
                <option value={"favorites"}>favorites</option>
              </select>
            </div>
            <div className="relative inline-flex">
              <svg
                className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 412 232"
              >
                <path
                  d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                  fill="#648299"
                  fillRule="nonzero"
                />
              </svg>

              <select
                value={genre}
                onChange={(e) =>
                  e.target.value ? setGenre(e.target.value) : null
                }
                className="h-10 pl-5 pr-10 transition-all duration-300 outline-none appearance-none rounded-xl focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary focus:outline-none active:outline-none"
              >
                <option value={""}>Genres</option>
                {genres.map((genre) => (
                  <option key={genre.mal_id} value={genre?.mal_id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative inline-flex">
              <svg
                className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 412 232"
              >
                <path
                  d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                  fill="#648299"
                  fillRule="nonzero"
                />
              </svg>

              <select
                value={animeType}
                onChange={(e) =>
                  e.target.value ? setAnimeType(e.target.value) : null
                }
                className="h-10 pl-5 pr-10 transition-all duration-300 outline-none appearance-none rounded-xl focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary focus:outline-none active:outline-none"
              >
                <option value={""}>Type</option>
                <option value={"tv"}>tv</option>
                <option value={"movie"}>movie</option>
                <option value={"ova"}>ova</option>
                <option value={"special"}>special</option>
                <option value={"ona"}>ona</option>
                <option value={"music"}>music</option>
              </select>
            </div>
          </div>
          <div className="flex flex-row gap-5 ">
            <div className="relative inline-flex">
              <svg
                className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 412 232"
              >
                <path
                  d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                  fill="#648299"
                  fillRule="nonzero"
                />
              </svg>

              <select
                value={status}
                onChange={(e) =>
                  e.target.value ? setStatus(e.target.value) : null
                }
                className="h-10 pl-5 pr-10 transition-all duration-300 outline-none appearance-none rounded-xl focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary focus:outline-none active:outline-none"
              >
                <option value={""}>Status</option>
                <option value={"airing"}>airing</option>
                <option value={"complete"}>complete</option>
                <option value={"upcoming"}>upcoming</option>
              </select>
            </div>
            <div className="relative inline-flex">
              <svg
                className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 412 232"
              >
                <path
                  d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                  fill="#648299"
                  fillRule="nonzero"
                />
              </svg>

              <select
                value={rating}
                onChange={(e) =>
                  e.target.value ? setRating(e.target.value) : null
                }
                className="h-10 pl-5 pr-10 transition-all duration-300 outline-none appearance-none rounded-xl focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary focus:outline-none active:outline-none"
              >
                <option value={""}>Rating</option>
                <option value={"G"}>G - All Ages</option>
                <option value={"pg"}>PG - Children</option>
                <option value={"pg13"}>PG-13 - Teens</option>
                <option value={"r17"}>R - 17+ Adults</option>
              </select>
            </div>
          </div>

          <div className="relative inline-flex">
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

            <button
              onClick={() =>
                setSort((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="h-10 pl-5 pr-10 transition-all duration-300 appearance-none rounded-xl focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary"
            >
              Sort
            </button>
          </div>
          <div className="relative inline-flex">
            <input
              type="text"
              placeholder="Search Anime"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="border-cyan-500 border w-full md:w-32 px-4 py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 rounded-full focus:outline-none transition-colors duration-300"
            />
          </div>
        </div>
        <div className="gap-3 flex">
          <button
            onClick={submitSearch}
            className="px-5 py-2 text-lg transition-all duration-300 rounded-xl focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary"
          >
            Apply
          </button>

          <button
            onClick={resetFilter}
            className="px-5 py-2 text-lg transition-all duration-300 rounded-xl focus:ring-4 focus:ring-light_primary focus:dark:ring-dark_primary bg-light_secondary dark:bg-dark_secondary"
          >
            Reset
          </button>
        </div>

        <div className="gap-5 flex justify-center align-center flex-wrap">
          <div className="border-2 py-1 px-3 rounded-lg gap-3 border-cyan-500 flex">
            <label htmlFor="start-date">Start Date:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setstartDate(e.target.value)}
            />
          </div>
          <div className="border-2 py-1 px-3 rounded-lg gap-3 border-cyan-500 flex">
            <label htmlFor="end-date">End Date:</label>
            <input
              type="date"
              id="end-date"
              className="rounded border-1"
              value={endDate}
              onChange={(e) => setendDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between min-h-screen">
        <CardList
          data={data}
          haveData={true}
          all={true}
          firstCard={true}
        ></CardList>

        <div className="flex justify-center gap-3 align-center">
          <button
            disabled={currentPage === 1 ? "disabled" : null}
            onClick={() => {
              setCurrentPage((prev) => (prev <= 0 ? 0 : prev - 1));
            }}
            className="py-2 px-4 disabled:bg-gray-300 text-white bg-blue-400 rounded-xl"
          >
            Prev
          </button>
          <input
            className="text-center  rounded-lg"
            type="text"
            disabled
            value={`${currentPage} / ${totalPages}`}
          />
          <button
            disabled={nextPage ? null : "disabled"}
            onClick={() => {
              setCurrentPage((prev) => prev + 1);
            }}
            className="py-2 px-4 disabled:bg-gray-300  text-white bg-blue-400 rounded-xl"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
