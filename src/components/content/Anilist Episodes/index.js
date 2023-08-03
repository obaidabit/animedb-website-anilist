import React, { useEffect } from "react";
import { uuid } from "../../../config";
import { useSelector, useDispatch } from "react-redux";
import ContentLoading from "../../content loading";

export default function Episodes({ episodes }) {
  const loading = useSelector((state) => state.contentLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "LOADING_CONTENT_TRUE" });
    dispatch({ type: "LOADING_CONTENT_FALSE" });
  }, [dispatch]);
  return (
    <div className="flex flex-col items-start w-full pt-10 gap-7 md:gap-5">
      {loading ? (
        <ContentLoading></ContentLoading>
      ) : episodes?.length !== 0 ? (
        episodes?.map((data) => (
          <div key={uuid()} className="text-2xl py-2">
            <span>Title : </span>
            <p className="">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-1"
                href={data?.url}
              >
                {data?.title}
              </a>
            </p>
          </div>
        ))
      ) : (
        <h1 className="text-3xl">Not Available</h1>
      )}
    </div>
  );
}
