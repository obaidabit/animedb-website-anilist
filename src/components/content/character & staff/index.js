import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCharactersAPI, getStaffAPI } from "../../../config";
import { useSelector, useDispatch } from "react-redux";
import ContentLoading from "../../content loading";

export default function CharacterStaff({ animeId }) {
  const params = useParams();
  const [character, setCharacter] = useState([]);
  const loading = useSelector((state) => state.contentLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    dispatch({ type: "LOADING_CONTENT_TRUE" });
    getCharactersAPI(animeId).then((result) => {
      if (mounted) {
        setCharacter(result.data);
        dispatch({ type: "LOADING_CONTENT_FALSE" });
      } else {
        return;
      }
    });
    return () => (mounted = false);
  }, [animeId, dispatch]);
  return (
    <div className="pt-10">
      {loading ? (
        <ContentLoading></ContentLoading>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-center">Characters</h1>
          <div className="grid grid-cols-3 gap-3 px-0 py-5 md:px-0 justify-items-center lg:grid-cols-5 lg:gap-10 sm:gap-5 md:grid-cols-3 md:gap-7 card-list">
            {character?.length !== 0 ? (
              character?.map((data) => (
                <div
                  key={Math.floor(Math.random() * 1000000)}
                  className="flex justify-between columns-4xl gap-20 overflow-hidden border-4 border-gray-700 lg:flex dark:border-gray-200 rounded-2xl"
                >
                  <div className="flex flex-col self-start text-2xl">
                    <img
                      className="h-40 landscape:h-52 w-64 object-cover "
                      src={data?.character?.images?.jpg?.image_url}
                      alt=""
                    />
                    <div className="py-3 text-center ">
                      <p className="word-break break-all hyphens-auto">
                        {data?.character.name}
                      </p>
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
