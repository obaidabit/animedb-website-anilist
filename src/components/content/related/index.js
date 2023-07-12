import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardLoading from "../../card loading";
import { useSelector, useDispatch } from "react-redux";
import { getFullDetailsAPI, getRelationsAPI } from "../../../config";

export default function Related() {
  const params = useParams();
  const [data, setData] = useState([]);
  const loading = useSelector((state) => state.cardLoading);
  const [subRelated, setSutRelated] = useState([]);
  const dispatch = useDispatch();

  async function viewRelated(anime, isMainRelation) {
    if (isMainRelation) {
      setData((prev) => {
        return prev.map((ani) => {
          if (anime.mal_id === ani.mal_id) {
            ani.visited = !ani.visited;
          }
          return ani;
        });
      });
    } else {
      setSutRelated((prev) => {
        prev.forEach((related) => {
          related.data.forEach((ani) => {
            if (anime.mal_id === ani.mal_id) {
              ani.visited = !ani.visited;
            }
          });
        });
        return prev;
      });
    }

    if (!anime.visited)
      getRelationsAPI(anime.mal_id).then(async (result) => {
        if (!result) return;
        let allFullValues = [];
        for (let rel of result.data) {
          if (rel.relation === "Adaptation") continue;
          for (let i in rel.entry) {
            const value = await new Promise((resolve, reject) => {
              setTimeout(async () => {
                try {
                  const result = await getFullDetailsAPI(rel.entry[i].mal_id);
                  resolve(result);
                } catch (error) {
                  reject();
                }
              }, 500);
            });

            if (!value?.data) continue;
            allFullValues.push({
              ...value.data,
              visited: false,
              relation: rel.relation,
            });
          }
        }
        setSutRelated((prev) => [
          ...prev,
          {
            anime: anime,
            data: allFullValues.sort((a, b) =>
              new Date(a.aired.from) > new Date(b.aired.from) ? 1 : -1
            ),
          },
        ]);
      });
  }

  function deleteSubRelated(id) {
    setSutRelated((prev) => prev.filter((rel) => rel.anime.mal_id !== id));
  }

  function hideSection(related) {
    setSutRelated((prev) => {
      return prev.map((ani) => {
        if (related.mal_id === ani.mal_id) {
          ani.collapse = !ani.collapse;
        }
        return ani;
      });
    });
  }

  function getAnimeFullDataTimeout(results) {
    let counter = 0;
    for (let rel of results.data) {
      if (rel.relation === "Adaptation") continue;
      for (let ent of rel.entry) {
        setTimeout(async () => {
          try {
            const result = await getFullDetailsAPI(ent.mal_id);
            if (result.data)
              setData((prev) =>
                [
                  ...prev,
                  { relation: rel.relation, ...result.data, visited: false },
                ].sort((a, b) =>
                  new Date(a.aired.from) > new Date(b.aired.from) ? 1 : -1
                )
              );
          } catch (error) {
            console.error(error);
          }
        }, 1000 * counter++);
      }
    }
  }

  useEffect(() => {
    let mounted = true;
    dispatch({ type: "LOADING_CARD_TRUE" });
    getRelationsAPI(params.id).then((result) => {
      if (mounted) {
        getAnimeFullDataTimeout(result);
        dispatch({ type: "LOADING_CARD_FALSE" });
      } else {
        return;
      }
    });
    return () => (mounted = false);
  }, [params.id, dispatch]);

  return (
    <div className="pt-2 pb-5">
      {loading === true ? (
        <CardLoading></CardLoading>
      ) : (
        <div className="grid grid-flow-col auto-cols-max overflow-x-scroll gap-3 px-5 py-5 md:px-0 justify-items-center lg:gap-10 sm:gap-5 md:gap-7 card-list">
          {data?.length !== 0 ? (
            data?.map((rel) => {
              if (rel.relation === "Adaptation") return null;
              else
                return (
                  <div
                    key={rel.mal_id}
                    id={rel.mal_id}
                    onClick={() => viewRelated(rel, true)}
                    className="relative w-32 px-1 text-center py-1 overflow-hidden transition-all duration-200 lg:w-64 lg:px-0 lg:py-0 lg:hover:-translate-y-2 lg:hover:px-1 lg:hover:py-1 bg-light_secondary dark:bg-dark_secondary lg:dark:bg-black lg:hover:bg-light_secondary lg:hover:dark:bg-dark_secondary h-fit card rounded-xl "
                    style={
                      rel.visited
                        ? {
                            outline: "6px",
                            outlineColor: "blue",
                            outlineStyle: "solid",
                          }
                        : null
                    }
                    rel="noreferrer"
                  >
                    <img
                      src={rel?.images?.jpg.image_url}
                      alt=""
                      className="object-cover w-full h-52 md:h-52 lg:h-60 xl:h-80 rounded-xl"
                    />
                    <a
                      target="_blank"
                      href={`/details/${rel.mal_id}`}
                      className="text-center mx-auto overflow-hidden w-full text-ellipsis md:max-w-mini lg:whitespace-normal sm:text-black sm:dark:text-white lg:text-white lg:dark:text-black text-sm md:text-lg lg:text-xl font-semibold"
                      rel="noreferrer"
                    >
                      <span className="text-rose-500">{rel?.relation}</span>
                      <br />
                      <span className="text-lg leading-3 md:leading-none">
                        {rel.title}
                      </span>
                    </a>
                  </div>
                );
            })
          ) : (
            <h1 className="text-3xl">Not Available</h1>
          )}
        </div>
      )}
      {subRelated.map((related) => (
        <details open key={Math.floor(Math.random() * 100000)}>
          <summary>{related.anime?.title}</summary>
          <div className="mt-2 flex portrait:flex-col landscape:flex-row rounded-xl bg-amber-300 text-white block">
            <img
              src={related?.anime?.images?.jpg.image_url}
              alt=""
              className="object-cover portrait:w-full w-80 h-32 md:h-32 lg:h-32 xl:h-32 rounded-xl"
            />
            <h2 className="text-center w-full text-3xl flex items-center justify-center">
              <span className="py-3">
                {related.anime?.title}
                <br />
                {related.anime?.aired?.string}
              </span>
            </h2>
          </div>
          <div className="grid grid-flow-col auto-cols-max overflow-x-scroll gap-3 px-5 py-5 md:px-0 justify-items-center lg:gap-10 sm:gap-5 md:gap-7 card-list">
            {related?.data?.length !== 0 ? (
              related?.data?.map((rel) => {
                if (rel.relation === "Adaptation") return null;
                else
                  return (
                    <div
                      key={rel.mal_id}
                      id={rel.mal_id}
                      onClick={() => viewRelated(rel, false)}
                      className="relative w-32 px-1 text-center py-1 overflow-hidden transition-all duration-200 lg:w-64 lg:px-0 lg:py-0 lg:hover:-translate-y-2 lg:hover:px-1 lg:hover:py-1 bg-light_secondary dark:bg-dark_secondary lg:dark:bg-black lg:hover:bg-light_secondary lg:hover:dark:bg-dark_secondary h-fit card rounded-xl "
                      style={
                        rel.visited
                          ? {
                              outline: "6px",
                              outlineColor: "blue",
                              outlineStyle: "solid",
                            }
                          : null
                      }
                      rel="noreferrer"
                    >
                      <img
                        src={rel?.images?.jpg.image_url}
                        alt=""
                        className="object-cover w-full h-52 md:h-52 lg:h-60 xl:h-80 rounded-xl"
                      />
                      <a
                        target="_blank"
                        href={`/details/${rel.mal_id}`}
                        className="text-center mx-auto overflow-hidden w-full text-ellipsis md:max-w-mini lg:whitespace-normal sm:text-black sm:dark:text-white lg:text-white lg:dark:text-black text-sm md:text-lg lg:text-xl font-semibold"
                        rel="noreferrer"
                      >
                        <span className="text-rose-500">{rel?.relation}</span>
                        <br />
                        <span className="text-lg">{rel.title}</span>
                      </a>
                    </div>
                  );
              })
            ) : (
              <h1 className="text-3xl">Not Available</h1>
            )}
          </div>

          <h2 className="text-center text-3xl">
            <button
              onClick={() => deleteSubRelated(related.anime.mal_id)}
              className="py-3 mt-2 px-4 rounded-xl bg-red-500 text-white"
            >
              Close
            </button>
          </h2>
        </details>
      ))}
    </div>
  );
}
