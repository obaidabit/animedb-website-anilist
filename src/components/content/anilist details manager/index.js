import React, { useEffect, useMemo, useState } from "react";
import Details from "../../../pages/details";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useParams } from "react-router-dom";
import { getFullDetailsAPI, uuid } from "../../../config";
import { getFullAnilistDetailsAPI } from "../../../config/anilist";
import AnilistDetails from "../../../pages/anilist details";

export default function AnilistDetailsManager() {
  const params = useParams();
  const [tabs, setTabs] = useState([]);

  function deleteTab(rel) {
    setTabs((prev) => prev.filter((ent) => ent.id !== rel.id));
  }

  useEffect(() => {
    getFullAnilistDetailsAPI(params.id).then((res) => {
      setTabs((prev) => [
        ...prev,
        { animeId: params.id, id: uuid(), visiable: true, anime: res },
      ]);
    });
  }, []);

  return (
    <>
      <Tabs>
        <TabList
          id="tabs"
          className="overflow-x-auto flex w-full thin-scroll py-2"
        >
          {tabs.map((rel) => (
            <Tab
              key={rel.id}
              className="whitespace-nowrap py-2 px-4 rounded-lg border-r-4 border-r-gray-500 cursor-pointer"
              selectedClassName="bg-amber-200 dark:text-black "
            >
              {rel?.anime?.title?.romaji}
            </Tab>
          ))}
        </TabList>

        {tabs.map((rel) => (
          <TabPanel key={rel.id}>
            <AnilistDetails
              id={rel.id}
              animeId={rel.animeId}
              deleteTab={deleteTab}
              setTabs={setTabs}
            />
          </TabPanel>
        ))}
      </Tabs>
    </>
  );
}
