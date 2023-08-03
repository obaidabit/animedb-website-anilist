import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import "react-tabs/style/react-tabs.css";
import CardLoading from "../../card loading";
import { capitalize, uuid } from "../../../config";

export default function AnilistRelation({ relations, setTabs }) {
  const loading = useSelector((state) => state.cardLoading);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "LOADING_CARD_TRUE" });
    setData({
      edges: relations.edges.sort((a, b) => {
        if (a.node.id > b.node.id) return 1;
        else return -1;
      }),
    });
    dispatch({ type: "LOADING_CARD_FALSE" });
  }, [dispatch, relations]);

  function showSubRelated(rel) {
    setTabs((prev) => [
      ...prev,
      {
        animeId: rel.node.id,
        id: uuid(),
        visiable: false,
        anime: rel.node,
      },
    ]);
  }

  if (loading) return <CardLoading />;
  return (
    <div className="pt-2 pb-5">
      <div className="grid grid-flow-col auto-cols-max overflow-x-scroll gap-3 px-5 pt-5 pb-10 md:px-0 justify-items-center lg:gap-10 sm:gap-5 md:gap-7 card-list">
        {data && data?.edges.length !== 0 ? (
          data?.edges.map((rel) => {
            if (rel?.node?.type === "MANGA") return null;
            return (
              <div
                key={rel?.node?.id}
                id={rel?.node?.id}
                onClick={() => showSubRelated(rel)}
                className="relative w-32 px-1 text-center py-1 overflow-hidden transition-all duration-200 lg:w-64 lg:px-0 lg:py-0 lg:hover:-translate-y-2 lg:hover:px-1 lg:hover:py-1 bg-light_secondary dark:bg-dark_secondary lg:dark:bg-black lg:hover:bg-light_secondary lg:hover:dark:bg-dark_secondary h-fit card rounded-xl "
                rel="noreferrer"
              >
                <img
                  src={rel?.node?.coverImage?.large}
                  alt=""
                  className="object-cover w-full h-52 md:h-52 lg:h-60 xl:h-80 rounded-xl"
                />
                <a
                  href={`/anilist/details/${rel?.node?.id}`}
                  className="text-center mx-auto overflow-hidden w-full text-ellipsis md:max-w-mini lg:whitespace-normal sm:text-black sm:dark:text-white lg:text-white lg:dark:text-black text-sm md:text-lg lg:text-xl font-semibold"
                  rel="noreferrer"
                >
                  <span className="text-rose-500">
                    {capitalize(rel?.relationType)}
                  </span>
                  <br />
                  <span className="text-lg leading-3 md:leading-none px-1">
                    {rel?.node?.title?.romaji}
                  </span>
                </a>
              </div>
            );
          })
        ) : (
          <h1 className="text-3xl">Not Available</h1>
        )}
      </div>
    </div>
  );
}
