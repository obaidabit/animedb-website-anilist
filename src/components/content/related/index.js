import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardLoading from "../../card loading";
import { useSelector, useDispatch } from "react-redux";
import {
  getFullDetailsAPI,
  getPicturesAPI,
  getRelationsAPI,
} from "../../../config";

export default function Related() {
  const params = useParams();
  const [data, setData] = useState([]);
  const loading = useSelector((state) => state.cardLoading);
  const [subRelated, setSutRelated] = useState([]);
  const dispatch = useDispatch();
  const [images, setImages] = useState(new Map());

  async function viewRelated(anime, isMainRelation) {
    if (anime.visited) {
      if (isMainRelation)
        setData((prev) => {
          prev.forEach((related) => {
            related.entry.forEach((ani) => {
              if (anime.mal_id === ani.mal_id) {
                ani.visited = !ani.visited;
              }
            });
          });
          return prev;
        });
      else
        setSutRelated((prev) => {
          prev.forEach((related) => {
            related.data.forEach((sub) => {
              sub.entry.forEach((ani) => {
                if (anime.mal_id === ani.mal_id) {
                  ani.visited = !ani.visited;
                }
              });
            });
          });
          return prev;
        });

      deleteSubRelated(anime.mal_id);
      return;
    } else {
      if (isMainRelation)
        setData((prev) => {
          prev.forEach((related) => {
            related.entry.forEach((ani) => {
              if (anime.mal_id === ani.mal_id) {
                ani.visited = !ani.visited;
              }
            });
          });
          return prev;
        });
      else
        setSutRelated((prev) => {
          prev.forEach((related) => {
            related.data.forEach((sub) => {
              sub.entry.forEach((ani) => {
                if (anime.mal_id === ani.mal_id) {
                  ani.visited = !ani.visited;
                }
              });
            });
          });
          return prev;
        });
    }

    const fullAnimeDate = await getFullDetailsAPI(anime.mal_id);

    getRelationsAPI(anime.mal_id).then((result) => {
      result.data.forEach((rel) =>
        rel.entry.forEach((ani) => (ani.visited = false))
      );
      setSutRelated((prev) => [
        ...prev,
        { anime: fullAnimeDate.data, data: result.data },
      ]);
      getImages(
        result.data.flatMap((anime) => {
          if (anime.relation === "Adaptation") return [];
          else return anime.entry;
        })
      );
    });
  }

  function deleteSubRelated(id) {
    setSutRelated((prev) => prev.filter((rel) => rel.anime.mal_id !== id));
  }
  function getImages(items) {
    let count = 0;

    const interval = setInterval(async () => {
      for (let i = 0; i < 2; i++) {
        if (count < items.length) {
          const item = items[count];
          if (images.get(item.mal_id)) {
            count++;
            continue;
          }
          const image = await getPicturesAPI(item.mal_id);
          if (image.data && image.data.length !== 0) {
            const m = new Map();
            m.set(item.mal_id, image);
            setImages((prev) => new Map([...prev, ...m]));
          }
          count++;
        } else {
          clearInterval(interval);
          break;
        }
      }
    }, 1500);
  }

  useEffect(() => {
    let mounted = true;
    dispatch({ type: "LOADING_CARD_TRUE" });
    getRelationsAPI(params.id).then((result) => {
      if (mounted) {
        setData(
          result.data.map((related) => {
            related.entry.forEach((anime) => (anime.visited = false));
            return related;
          })
        );
        getImages(
          result.data.flatMap((anime) => {
            if (anime.relation === "Adaptation") return [];
            else return anime.entry;
          })
        );
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
            data?.map((data) => {
              if (data.relation === "Adaptation") return null;
              return data?.entry.map((anime) => (
                <div
                  key={anime.mal_id}
                  id={anime.mal_id}
                  onClick={() => viewRelated(anime, true)}
                  className="relative w-48 px-1 text-center py-1 overflow-hidden transition-all duration-200 lg:w-64 lg:px-0 lg:py-0 lg:hover:-translate-y-2 lg:hover:px-1 lg:hover:py-1 bg-light_secondary dark:bg-dark_secondary lg:dark:bg-black lg:hover:bg-light_secondary lg:hover:dark:bg-dark_secondary h-fit card rounded-xl "
                  style={
                    anime.visited
                      ? {
                          outline: "6px",
                          outlineColor: "blue",
                          outlineStyle: "solid",
                        }
                      : null
                  }
                  rel="noreferrer"
                >
                  {images ? (
                    <img
                      src={images.get(anime.mal_id)?.data[0].jpg.image_url}
                      alt=""
                      className="object-cover w-full h-80 md:h-80 lg:h-60 xl:h-80 rounded-xl"
                    />
                  ) : (
                    <img
                      alt=""
                      className="object-cover w-full h-80 md:h-80 lg:h-60 xl:h-80 rounded-xl"
                    />
                  )}
                  <a
                    target="_blank"
                    href={`/details/${anime.mal_id}`}
                    className="text-center mx-auto overflow-hidden w-full text-ellipsis md:max-w-mini lg:whitespace-normal sm:text-black sm:dark:text-white lg:text-white lg:dark:text-black text-sm md:text-lg lg:text-xl font-semibold"
                    rel="noreferrer"
                  >
                    <span className="text-rose-500">{data?.relation}</span>
                    <br />
                    <span className="text-2xl">{anime.name}</span>
                  </a>
                </div>
              ));
            })
          ) : (
            <h1 className="text-3xl">Not Available</h1>
          )}
        </div>
      )}
      {subRelated.map((related) => (
        <div key={Math.floor(Math.random() * 100000)}>
          <h2 className="text-center text-3xl">
            <span className="py-3 mt-2  rounded-xl bg-amber-300 text-white block">
              {related.anime?.title}
              <br />
              {related.anime?.aired?.string}
            </span>
          </h2>
          <div className="grid grid-flow-col auto-cols-max overflow-x-scroll gap-3 px-5 py-5 md:px-0 justify-items-center lg:gap-10 sm:gap-5 md:gap-7 card-list">
            {related?.data.map((relation) => {
              if (relation.relation === "Adaptation") return null;
              else
                return relation?.entry?.map((anime) => (
                  <div
                    key={anime.mal_id}
                    onClick={() => viewRelated(anime, false)}
                    id={anime.mal_id}
                    style={
                      anime.visited
                        ? {
                            outline: "6px",
                            outlineColor: "blue",
                            outlineStyle: "solid",
                          }
                        : null
                    }
                    className="relative w-48 px-1 text-center  py-1 overflow-hidden transition-all duration-200 lg:w-64 lg:px-0 lg:py-0 lg:hover:-translate-y-2 lg:hover:px-1 lg:hover:py-1 bg-light_secondary dark:bg-dark_secondary lg:dark:bg-black lg:hover:bg-light_secondary lg:hover:dark:bg-dark_secondary h-fit card rounded-xl "
                    rel="noreferrer"
                  >
                    {images ? (
                      <img
                        src={images.get(anime.mal_id)?.data[0].jpg.image_url}
                        alt=""
                        className="object-cover w-full h-80 md:h-80 lg:h-60 xl:h-80 rounded-xl"
                      />
                    ) : (
                      <img
                        alt=""
                        className="object-cover w-full h-80 md:h-80 lg:h-60 xl:h-80 rounded-xl"
                      />
                    )}
                    <a
                      target="_blank"
                      href={`/details/${anime.mal_id}`}
                      className="text-center mx-auto overflow-hidden w-full text-ellipsis md:max-w-mini lg:whitespace-normal sm:text-black sm:dark:text-white lg:text-white lg:dark:text-black text-sm md:text-lg lg:text-xl font-semibold"
                      rel="noreferrer"
                    >
                      <span className="text-rose-500">
                        {relation?.relation}
                      </span>
                      <br />
                      <span className="text-2xl">{anime.name}</span>
                    </a>
                  </div>
                ));
            })}
          </div>

          <h2 className="text-center text-3xl">
            <button
              onClick={() => deleteSubRelated(related.anime.mal_id)}
              className="py-3 mt-2 px-4 rounded-xl bg-red-500 text-white"
            >
              Close
            </button>
          </h2>
        </div>
      ))}
    </div>
  );
}
