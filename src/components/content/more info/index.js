import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMoreInfoAPI } from "../../../config";

export default function MoreInfo({ animeId }) {
  const params = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    getMoreInfoAPI(animeId).then((result) => {
      if (mounted) {
        setData(result.data);
      } else {
        return;
      }
    });
    return () => (mounted = false);
  }, [animeId]);
  return (
    <div className="pt-10">
      {data?.moreinfo ? (
        <p className="text-xl">{data?.moreinfo}</p>
      ) : (
        <h1 className="text-3xl">Not Available</h1>
      )}
    </div>
  );
}
