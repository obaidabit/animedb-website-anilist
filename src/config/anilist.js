import { anilist } from "anilist";

function getFullInfo(filter, page) {
  return anilist
    .pageQuery({ page: page, perPage: 30 })
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
        .withId()
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
  return anilist
    .mediaQuery({ id: parseInt(id) })
    .withSeasonYear()
    .withId()
    .withTitles("english", "native", "romaji")
    .withDescription()
    .withCoverImage()
    .withBannerImage()
    .withDuration()
    .withStartDate()
    .withEndDate()
    .withEpisodes()
    .withAverageScore()
    .withCharacters()
    .withExternalLinks("url", "id", "site")
    .withFormat()
    .withFavourites()
    .withMalId()
    .withMediaListEntries()
    .withNextAiringEpisode()
    .withRankings("id", "allTime", "rank", "year", "context", "format")
    .withRelations()
    .withSeason()
    .withSource()
    .withStatus()
    .withStreamingEpisodes()
    .withStudios()
    .withTags()
    .withTrending()
    .withType()
    .withSynonyms()
    .fetch();
};

export const getSearchAPI = (
  keyword,
  format,
  sort,
  status,
  source,
  genre,
  startDate_like,
  startDate_lesser,
  startDate_greater,
  season,
  episodes_greater,
  episodes_lesser,
  duration_greater,
  duration_lesser,
  page = 1
) => {
  const args = {};
  args.type = "ANIME";
  if (keyword) args.search = keyword;
  if (startDate_like) args.startDate_like = startDate_like;
  if (season) args.season = season;
  if (format) args.format = format;
  if (status) args.status = status;
  if (sort) args.sort = sort;
  if (source) args.source = source;
  if (startDate_greater) args.startDate_greater = startDate_greater;
  if (startDate_lesser) args.startDate_lesser = startDate_lesser;
  if (episodes_greater) args.episodes_greater = episodes_greater;
  if (episodes_lesser) args.episodes_lesser = episodes_lesser;
  if (duration_greater) args.duration_greater = duration_greater;
  if (duration_lesser) args.duration_lesser = duration_lesser;
  if (genre) args.genre = genre;
  args.isAdult = false;

  return getFullInfo(args, page);
};
