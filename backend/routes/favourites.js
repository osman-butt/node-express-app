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

favouritesRouter.get("/:id", async (req, res) => {
  res.status(404).json({ message: "Ressource not found" });
});

favouritesRouter.put("/:id", async (req, res) => {
  const uid = Number(req.cookies.session);
  console.log(uid);
  console.log("UID:", uid !== undefined && !isNaN(uid));
  console.log("UID:", uid);
  console.log("ID:", req.params.id);
  if (uid !== undefined && !isNaN(uid)) {
    const id = Number(req.params.id);
    const data = await getFavourites();
    const favourites = data.filter(f => f.uid === uid);
    favourites[0].favouritesList.push(id);
    await saveFavourites(data);
    res.send(favourites);
  } else {
    res.status(404).json({ message: "No favourites saved" });
  }
});

favouritesRouter.delete("/:id", async (req, res) => {
  const uid = Number(req.cookies.session);
  const id = Number(req.params.id);
  console.log(`DELETING ID = ${typeof id}`);
  const data = await getFavourites();
  const favourites = data.filter(f => f.uid === uid);
  console.log(favourites);
  if (favourites.length > 0) {
    const delIndex = favourites[0].favouritesList.indexOf(id);
    console.log("delIndex:", delIndex);
    if (delIndex === -1) {
      res.status(404).json({ message: "Favourite not found" });
    } else {
      favourites[0].favouritesList.splice(delIndex, 1);
      await saveFavourites(data);
      res.send(favourites);
    }
  } else {
    res.status(404).json({ message: "Favourite not found" });
  }
});

favouritesRouter.all("/", (req, res) => {
  res.status(404).json({
    message:
      "You can only use HTTP GET,PUT,DELETE method. For PUT and DELETE please pass in an id",
  });
});

favouritesRouter.all("/:id", (req, res) => {
  res.status(404).json({
    message:
      "You can only use HTTP GET,PUT,DELETE method. For PUT and DELETE please pass in an id",
  });
});

export { favouritesRouter };
