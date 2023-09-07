import express from "express";
import { getArtists, saveArtists, checkQuery } from "./helpers.js";

const artistRouter = express.Router();
artistRouter.get("/", async (req, res) => {
  const queryObj = req.query;
  const queryKeys = Object.keys(req.query);
  // console.log("query:", queryObj);
  const artists = await getArtists();
  if (queryKeys.length === 0) {
    res.json(artists);
  } else {
    const filteredArtists = checkQuery(artists, queryObj);
    res.send(filteredArtists);
  }
});

artistRouter.post("/", async (req, res) => {
  console.log("ARTISTS POST");
  const newArtist = req.body;
  console.log(newArtist);
  newArtist.id = new Date().getTime();
  console.log(newArtist);
  const artists = await getArtists();
  artists.push(newArtist);
  await saveArtists(artists);
  res.json(artists);
});

artistRouter.put("/:id", async (req, res) => {
  const updatedArtist = req.body;
  const id = Number(req.params.id);
  const artists = await getArtists();
  const artistToBeUpdated = artists.find(artist => artist.id === id);

  artistToBeUpdated.name = updatedArtist.name;
  artistToBeUpdated.birthdate = updatedArtist.birthdate;
  artistToBeUpdated.activeSince = updatedArtist.activeSince;
  artistToBeUpdated.genres = updatedArtist.genres;
  artistToBeUpdated.labels = updatedArtist.labels;
  artistToBeUpdated.website = updatedArtist.website;
  artistToBeUpdated.image = updatedArtist.image;
  artistToBeUpdated.shortDescription = updatedArtist.shortDescription;
  artistToBeUpdated.spotifyLink = updatedArtist.spotifyLink;
  await saveArtists(artists);
  res.json(artists);
});

artistRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  const artists = await getArtists();
  const updatedArtists = artists.filter(artist => artist.id !== Number(id));
  await saveArtists(updatedArtists);
  res.json(updatedArtists);
});

// artistRouter.get("/:property/:propertyvalue", async (req, res) => {
//   const property = req.params.property;
//   const propertyValue = req.params.propertyvalue;
//   const artists = await getArtists();
//   console.log();
//   const filteredArtists = artists.filter(artist =>
//     typeof artist[property] === "number"
//       ? artist[property] === Number(propertyValue)
//       : artist[property].includes(propertyValue)
//   );
//   res.send(filteredArtists);
// });

artistRouter.get("/:id", async (req, res) => {
  console.log(req.url);
  const artists = await getArtists();
  const id = req.params.id;
  const artist = artists.find(art => art.id === Number(id));
  if (artist === undefined) {
    res.status(404).json({ message: "ressource does not exist" });
  } else {
    res.json(artist);
  }
});

export { artistRouter };
