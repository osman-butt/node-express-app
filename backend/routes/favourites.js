import express from "express";
import fs from "fs/promises";
import { getFavourites, saveFavourites } from "./helpers.js";

const favouritesRouter = express.Router();

favouritesRouter.get("/", async (req, res) => {
  const uid = req.cookies.session;
  const data = await getFavourites();
  const favourites = data.filter(f => f.uid === Number(uid));
  console.log(favourites);
  res.json(favourites);
});

favouritesRouter.put("/:id", async (req, res) => {
  const uid = Number(req.cookies.session);
  const id = Number(req.params.id);
  const data = await getFavourites();
  const favourites = data.filter(f => f.uid === uid);
  console.log(favourites);
  favourites[0].favouritesList.push(id);
  await saveFavourites(data);
  res.send(favourites);
});

favouritesRouter.delete("/:id", async (req, res) => {
  const uid = Number(req.cookies.session);
  const id = Number(req.params.id);
  console.log(`DELETING ID = ${typeof id}`);
  const data = await getFavourites();
  const favourites = data.filter(f => f.uid === uid);
  console.log(favourites);
  const delIndex = favourites[0].favouritesList.indexOf(id);
  favourites[0].favouritesList.splice(delIndex, 1);
  await saveFavourites(data);
  res.send(favourites);
});

export { favouritesRouter };
