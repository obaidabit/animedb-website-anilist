import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ContentLoading from "../../content loading";

export default function AniListStats({ stats }) {
  const loading = useSelector((state) => state.contentLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "LOADING_CONTENT_TRUE" });
    dispatch({ type: "LOADING_CONTENT_FALSE" });
  }, [dispatch]);
  return (
    <div className="pt-10">
      {loading ? (
        <ContentLoading></ContentLoading>
      ) : stats?.length !== 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats?.map((stat) => (
            <div
              className="text-center shadow rounded p-2 bg-slate-200 dark:bg-slate-500"
              key={stat.id}
            >
              <span className="font-bold mr-1">#{stat.rank}</span>
              {stat.context}
            </div>
          ))}
        </div>
      ) : (
        <h1 className="text-3xl">Not Available</h1>
      )}
    </div>
  );
}
