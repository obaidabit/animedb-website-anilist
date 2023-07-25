import { anilist } from "anilist";

function getFullInfo(filter) {
  return anilist
    .pageQuery({ perPage: 30 })
    .withPageInfo((pageInfo) =>
      pageInfo
        .withTotal()
        .hasNextPage()
        .withCurrentPage()
        .withLastPage()
        .withPerPage()
    )

    .withMedia((media) =>
      media
        .arguments(filter)
        .withTitles()
        .withDescription()
        .withCoverImage()
        .withBannerImage()
        .withDuration()
        .withStartDate()
        .withEndDate()
        .withEpisodes()
        .withAverageScore()
        .withCharacters()
        .withExternalLinks()
        .withFormat()
        .withFavourites()
        .withMalId()
        .withMediaListEntries()
        .withNextAiringEpisode()
        .withRankings()
        .withRelations()
        .withSeason()
        .withSource()
        .withStatus()
        .withStreamingEpisodes()
        .withStudios()
        .withTags()
        .withTrending()
        .withType()
    )
    .fetch();
}

export const getFullAnilistDetailsAPI = (id) => {
  return getFullInfo({ id });
};

export const getSearchAPI = (
  keyword,
  format,
  sort,
  status,
  source,
  genre,
  seasonYear,
  endDate,
  startDate,
  season,
  episodes_greater,
  episodes_lesser,
  duration_greater,
  duration_lesser
) => {
  const args = {};
  args.type = "ANIME";
  if (keyword) args.search = keyword;
  if (seasonYear) args.seasonYear = seasonYear;
  if (season) args.season = season;
  if (format) args.format = format;
  if (status) args.status = status;
  if (sort) args.sort = sort;
  if (source) args.source = source;
  if (startDate) args.startDate = startDate;
  if (endDate) args.endDate = endDate;
  if (episodes_greater) args.episodes_greater = episodes_greater;
  if (episodes_lesser) args.episodes_lesser = episodes_lesser;
  if (duration_greater) args.duration_greater = duration_greater;
  if (duration_lesser) args.duration_lesser = duration_lesser;
  if (genre) args.genre = genre;

  return getFullInfo(args);
};
