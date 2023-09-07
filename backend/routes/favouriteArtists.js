import express from "express";
import { getArtists, getFavourites, checkQuery } from "./helpers.js";

const favouriteArtistsRouter = express.Router();

favouriteArtistsRouter.get("/", async (req, res) => {
  const uid = req.cookies.session;
  const queryObj = req.query;
  const queryKeys = Object.keys(req.query);
  const artists = await getArtists();
  const data = await getFavourites();
  const favourites = data.filter(f => f.uid === Number(uid));
  if (favourites.length > 0) {
    const favArtists = artists.filter(artist =>
      favourites[0].favouritesList.includes(artist.id)
    );
    console.log(favourites[0].favouritesList);
    if (queryKeys.length === 0) {
      res.json(favArtists);
    } else {
      const filteredArtists = checkQuery(favArtists, queryObj);
      res.send(filteredArtists);
    }
  } else {
    res.status(404).json({ message: "No favourites saved" });
  }
});

// favouriteArtistsRouter.get("/:property/:propertyvalue", async (req, res) => {
//   console.log("/artists/:property/:propertyvalue");
//   const uid = req.cookies.session;
//   const property = req.params.property;
//   const propertyValue = req.params.propertyvalue;
//   console.log(property);
//   console.log(propertyValue);
//   const artists = await getArtists();
//   const data = await getFavourites();
//   const favourites = data.filter(f => f.uid === Number(uid));
//   const favArtists = artists.filter(artist =>
//     favourites[0].favouritesList.includes(artist.id)
//   );
//   const filteredArtists = favArtists.filter(artist =>
//     typeof artist[property] === "number"
//       ? artist[property] === Number(propertyValue)
//       : artist[property].includes(propertyValue)
//   );
//   res.send(filteredArtists);
// });

favouriteArtistsRouter.all("/", (req, res) => {
  res.status(404).json({ message: "You can only use HTTP GET method" });
});

export { favouriteArtistsRouter };
