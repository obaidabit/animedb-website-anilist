import React, { useEffect, useState, useCallback } from "react";
import { capitalize } from "../../config";
import { useSelector, useDispatch } from "react-redux";

import MoreInfo from "../../components/content/more info";
import DetailsLoading from "../../components/details loading";
import { getFullAnilistDetailsAPI } from "../../config/anilist";
import AniListStats from "../../components/content/anilist stats";
import AnilistRelation from "../../components/content/anilist relation";
import AnilistMobileContentNav from "../../components/mobile/anilist mobilenav content";
import AnilistEpisodes from "../../components/content/Anilist Episodes";
import AnilistCharacterStaff from "../../components/content/anilist character & staff";

export default function AnilistDetails({ animeId, setTabs, deleteTab, id }) {
  const [data, setData] = useState([]);
  const [content, setContent] = useState(0);
  const [contentNav, setContentNav] = useState(true);
  const loading = useSelector((state) => state.detailsLoading);
  const [isVisible, setIsVisible] = useState(true);

  const dispatch = useDispatch();

  const toggleContentNav = () => {
    setContentNav(!contentNav);
    contentNav ? setContent(5) : setContent(1);
  };

  const switchContent = useCallback((index) => {
    setContent(index);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const listenToScroll = () => {
      let heightToShowFrom = 5000;
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (winScroll > heightToShowFrom) {
        // to limit setting state only the first time
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    setIsVisible(false);
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    scrollTop();
    dispatch({ type: "LOADING_DETAILS_TRUE" });
    getFullAnilistDetailsAPI(animeId).then((result) => {
      if (mounted) {
        setData(result);
        switchContent(8);
        dispatch({ type: "LOADING_DETAILS_FALSE" });
      } else {
        return;
      }
    });
    return () => (mounted = false);
  }, [animeId, dispatch, switchContent]);

  function sortTabs() {
    setTabs((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const aDate = getDate(a);
        const bDate = getDate(b);

        if (aDate === Infinity && bDate === Infinity) {
          return 0;
        } else if (aDate === Infinity) {
          return -1;
        } else if (bDate === Infinity) {
          return 1;
        } else {
          return aDate - bDate;
        }
      });

      return sorted;
    });
  }

  function getDate(tab) {
    return tab.anime.startDate.year
      ? new Date(
          tab.anime.startDate.year,
          tab.anime.startDate.month,
          tab.anime.startDate.day
        )
      : Infinity;
  }
  return (
    <div className="w-full min-h-screen text-gray-700 dark:text-gray-200">
      {loading && <DetailsLoading></DetailsLoading>}
      {!loading && (
        <div>
          <div>
            <div className="text-right pr-4 absolute w-full z-50">
              <button
                onClick={() => deleteTab({ id: id })}
                className="py-1 mt-2 px-3 rounded-md bg-red-600 text-white mr-2 absolute right-0"
              >
                Close
              </button>
              <button
                onClick={() => sortTabs({ id: parseInt(id) })}
                className="py-1 mt-2 px-3 rounded-md bg-green-400 text-black ml-2 absolute left-0"
              >
                Sort
              </button>
            </div>
            <div className="absolute w-full transition-all duration-300 h-80 bg-black opacity-20 dark:opacity-40"></div>
            {data?.bannerImage ? (
              <img
                className="object-cover w-full h-80"
                src={data?.bannerImage}
                alt=""
              />
            ) : (
              <div className="w-full transition-all duration-300 h-96 bg-light_secondary dark:bg-dark_secondary"></div>
            )}
          </div>
          <div className="w-full transition-all duration-300 h-fit dark:bg-dark_primary">
            <div className="flex flex-col items-center w-full px-5 md:items-start lg:items-start md:flex-row">
              <div className="md:flex -mt-52 md:flex-col md:items-center md:gap-10">
                <img
                  className="relative portrait:w-52 portrait:h-64 h-96 md:h-full md:max-w-xs rounded-2xl "
                  src={data?.coverImage?.large}
                  alt=""
                />
              </div>
              <div className="w-full px-7">
                <div className="flex flex-col items-start justify-between w-full pt-3 lg:flex-row">
                  <details className="w-full">
                    <summary className="cursor-pointer relative text-2xl font-bold text-center  md:overflow-hidden md:text-ellipsis md:text-3xl md:text-left md:max-w-read lg:max-w-full ">
                      {data?.title?.romaji}
                    </summary>
                    <p
                      dangerouslySetInnerHTML={{ __html: data?.description }}
                      className="pt-3 md:pr-5 lg:max-w-full lg:min-h-[18rem] xl:min-h-[7rem] md:max-w-synopsis lg:pr-0 text-justify mx-auto self-center md:text-left text-md"
                    ></p>
                  </details>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 mt-4">
            <div className="flex gap-7 w-full overflow-x-auto bg-slate-200 dark:bg-slate-500 rounded px-4 py-4 thin-scroll">
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">Format</h5>
                <p>{data?.format}</p>
              </div>
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">Episodes</h5>
                <p>{data?.episodes}</p>
              </div>
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">Episode Duration</h5>
                <p>{data?.duration} mins</p>
              </div>
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">Status</h5>
                <p>{capitalize(data?.status)}</p>
              </div>
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">Start Date</h5>
                {data?.startDate?.year ? (
                  <p>
                    {new Date(
                      data?.startDate.year,
                      data?.startDate.month - 1
                    ).toLocaleString("default", { month: "short" })}
                    /{data?.startDate.day}/{data?.startDate.year}
                  </p>
                ) : null}
              </div>
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">Start End</h5>
                {data?.endDate?.year ? (
                  <p>
                    {new Date(
                      data?.endDate.year,
                      data?.endDate.month - 1
                    ).toLocaleString("default", { month: "short" })}
                    /{data?.endDate.day}/{data?.endDate.year}
                  </p>
                ) : null}
              </div>
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">Season</h5>
                <p>
                  {capitalize(data?.season)} {data?.seasonYear}
                </p>
              </div>
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">Average Score</h5>
                <p>{data?.averageScore}%</p>
              </div>
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">Studios</h5>
                <p>
                  {data?.studios?.nodes && data?.studios?.nodes.length
                    ? capitalize(data?.studios.nodes[0].name)
                    : "Unknown"}
                </p>
              </div>
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">Source</h5>
                <p>{capitalize(data?.source)}</p>
              </div>
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">Romaji</h5>
                <p>{capitalize(data?.title?.romaji)}</p>
              </div>
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">English</h5>
                <p>{capitalize(data?.title?.english)}</p>
              </div>
              <div className="flex-shrink-0">
                <h5 className="font-bold text-lg">Native</h5>
                <p>{data?.title?.native}</p>
              </div>
            </div>
          </div>
          <div className="w-full px-2 md:px-5 pb-10 pt-5 min-h-fit">
            <div className="flex flex-row justify-around w-full mx-auto md:justify-between">
              <button
                onClick={() => switchContent(2)}
                className={`uppercase border-b-4 ${
                  contentNav ? "md:block" : "md:hidden"
                } border-b-transparent hover:border-b-4 lg:block hover:border-b-light_secondary hover:dark:border-b-dark_secondary pb-2 ${
                  content === 2
                    ? "block border-b-4 border-b-light_secondary dark:border-b-dark_secondary"
                    : "hidden border-b-4 border-b-transparent"
                } font-bold text-xl`}
              >
                Watch
              </button>
              <button
                onClick={() => switchContent(8)}
                className={`uppercase self-end border-b-4 ${
                  contentNav ? "md:hidden" : "md:block"
                } lg:block border-b-transparent hover:border-b-4 hover:border-b-light_secondary hover:dark:border-b-dark_secondary  pb-2 ${
                  content === 7
                    ? "block border-b-4 border-b-light_secondary dark:border-b-dark_secondary"
                    : "hidden border-b-4 border-b-transparent"
                } font-bold text-xl`}
              >
                Relations
              </button>
              <button
                onClick={() => switchContent(9)}
                className={`uppercase self-end border-b-4 ${
                  contentNav ? "md:hidden" : "md:block"
                } lg:block border-b-transparent hover:border-b-4 hover:border-b-light_secondary hover:dark:border-b-dark_secondary  pb-2 ${
                  content === 9
                    ? "block border-b-4 border-b-light_secondary dark:border-b-dark_secondary"
                    : "hidden border-b-4 border-b-transparent"
                } font-bold text-xl`}
              >
                Stats
              </button>
              <button className="hidden pb-2 border-b-4 md:block lg:hidden border-b-transparent hover:border-b-light_secondary hover:dark:border-b-dark_secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 "
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  onClick={toggleContentNav}
                >
                  <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                </svg>
              </button>
              <button
                onClick={() => switchContent(6)}
                className={`uppercase border-b-4 ${
                  contentNav ? "md:hidden" : "md:block"
                } lg:block border-b-transparent hover:border-b-4 hover:border-b-light_secondary hover:dark:border-b-dark_secondary  pb-2 ${
                  content === 6
                    ? "block border-b-4 border-b-light_secondary dark:border-b-dark_secondary"
                    : "hidden border-b-4 border-b-transparent"
                } font-bold text-xl`}
              >
                Characters
              </button>
              <AnilistMobileContentNav
                content1={() => switchContent(1)}
                content2={() => switchContent(2)}
                content3={() => switchContent(3)}
                content4={() => switchContent(4)}
                content5={() => switchContent(5)}
                content6={() => switchContent(6)}
                content7={() => switchContent(7)}
                content8={() => switchContent(8)}
                content9={() => switchContent(9)}
              ></AnilistMobileContentNav>
            </div>
            <div className=" flex flex-col mx-auto min-h-[500px]">
              <div>
                {content === 2 && (
                  <AnilistEpisodes
                    episodes={data?.streamingEpisodes}
                  ></AnilistEpisodes>
                )}
              </div>
              <div>
                {content === 6 && (
                  <AnilistCharacterStaff
                    animeId={data?.id}
                  ></AnilistCharacterStaff>
                )}
              </div>
              <div>
                {content === 7 && <MoreInfo animeId={animeId}></MoreInfo>}
              </div>
              <div>
                {content === 8 && (
                  <AnilistRelation
                    relations={data?.relations}
                    setTabs={setTabs}
                  ></AnilistRelation>
                )}
              </div>
              <div>
                {content === 9 && <AniListStats stats={data.rankings} />}
              </div>
              {isVisible && (
                <button
                  onClick={scrollTop}
                  className="fixed left-0 right-0 flex flex-col items-center mx-auto text-center bottom-10 animate-bounce"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>Back To Top ?</p>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
