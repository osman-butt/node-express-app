import express from "express";
import { getArtists } from "./helpers.js";

const genreRouter = express.Router();

genreRouter.get("/", async (req, res) => {
  const artists = await getArtists();
  const genres = artists.map(artist => artist.genres).flat();
  const uniqueGenres = genres.filter(getUniqueArray);
  res.json(uniqueGenres);
});

function getUniqueArray(value, index, array) {
  return array.indexOf(value) === index;
}

export { genreRouter };
