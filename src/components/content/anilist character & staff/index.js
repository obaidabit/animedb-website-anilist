import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ContentLoading from "../../content loading";
import { uuid } from "../../../config";
import { getAnilistCharacter } from "../../../config/anilist";

export default function Anilistdatataff({ animeId }) {
  const loading = useSelector((state) => state.contentLoading);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  async function getAllCharacters() {
    let page = 1;
    let allCharacters = [];

    let result = await getAnilistCharacter(animeId, page);
    if (!result && !result?.characters) return;
    allCharacters.push(result.characters.edges);
    while (result?.characters?.pageInfo?.hasNextPage) {
      result = await getAnilistCharacter(animeId, ++page);
      allCharacters.push(result.characters.edges);
    }

    setData(allCharacters.flat());
    dispatch({ type: "LOADING_CONTENT_FALSE" });
  }
  useEffect(() => {
    dispatch({ type: "LOADING_CONTENT_TRUE" });
    getAllCharacters();
  }, [dispatch]);

  return (
    <div className="pt-10">
      {loading ? (
        <ContentLoading></ContentLoading>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-center">Characters</h1>
          <div className="grid grid-cols-3 gap-3 px-0 py-5 md:px-0 justify-items-center lg:grid-cols-5 lg:gap-10 sm:gap-5 md:grid-cols-3 md:gap-7 card-list">
            {data?.length !== 0 ? (
              data?.map((data) => (
                <div
                  key={uuid()}
                  className="flex justify-between columns-4xl gap-20 overflow-hidden border border-gray-700 lg:flex dark:border-gray-200 rounded-2xl"
                >
                  <div className="flex flex-col self-start text-sm md:text-2xl">
                    <img
                      className="h-40 landscape:h-52 w-64 object-cover "
                      src={data?.node?.image?.large}
                      alt=""
                    />
                    <div className="py-3 text-center ">
                      <p>{data?.node?.name?.full}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1 className="text-3xl ">Not Available Charaters</h1>
            )}
          </div>
        </>
      )}
    </div>
  );
}
