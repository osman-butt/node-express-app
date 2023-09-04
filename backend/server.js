import express from "express";
import cors from "cors";
import fs from "fs/promises";
import cookieParser from "cookie-parser";

// Initialize server
const app = express();
// Add middleware
app.use(express.json()); // parse incomming JSON
app.use(cookieParser());
app.use(
  cors({
    origin: "http://127.0.0.1:8080",
    credentials: true,
  })
);
app.use(retrieveCookies);

const port = 3000;
const host = "http://localhost";

async function retrieveCookies(req, res, next) {
  const cookies = req.cookies.session;
  const cookieValue = new Date().getTime();
  if (!cookies) {
    res.cookie("session", `${cookieValue}`, {
      sameSite: "none",
      secure: true,
    });
    console.log(`Saved cookievalue = ${cookieValue}`);
    await saveUserSession(cookieValue);
  }
  console.log("---retrieveCookies()---");
  console.log(cookies);
  console.log("---retrieveCookies() END---");
  next();
}

async function saveUserSession(cookie) {
  const fav = await getFavourites();
  const index = fav.indexOf(f => Number(f.uid) === Number(cookie));

  console.log("---saveUserSession---");
  if (index === -1) {
    const newFavObj = { uid: cookie, favouritesList: [] };
    fav.push(newFavObj);
    await saveFavourites(fav);
  }
}

// Routes
app.get("/", (req, res) => {
  res.send("CHANGED");
});

app.get("/artists", async (req, res) => {
  const artists = await getArtists();
  res.json(artists);
});

app.post("/artists", async (req, res) => {
  const newArtist = req.body;
  newArtist.id = new Date().getTime();
  const artists = await getArtists();
  artists.push(newArtist);
  await saveArtists(artists);
  res.json(artists);
});

app.put("/artists/:id", async (req, res) => {
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
  await saveArtists(artists);
  res.json(artists);
});

app.delete("/artists/:id", async (req, res) => {
  const id = Number(req.params.id);
  const artists = await getArtists();
  const updatedArtists = artists.filter(artist => artist.id !== id);
  await saveArtists(updatedArtists);
  res.json(updatedArtists);
});

app.get("/artists/:property/:propertyvalue", async (req, res) => {
  console.log("/artists/:property/:propertyvalue");
  const property = req.params.property;
  const propertyValue = req.params.propertyvalue;
  const artists = await getArtists();
  console.log();
  const filteredArtists = artists.filter(artist =>
    typeof artist[property] === "number"
      ? artist[property] === Number(propertyValue)
      : artist[property].includes(propertyValue)
  );
  res.send(filteredArtists);
});

app.get("/favourites", async (req, res) => {
  const uid = req.cookies.session;
  const data = await getFavourites();
  const favourites = data.filter(f => f.uid === Number(uid));
  console.log(favourites);
  res.json(favourites);
});

app.put("/favourites/:id", async (req, res) => {
  const uid = Number(req.cookies.session);
  const id = Number(req.params.id);
  const data = await getFavourites();
  const favourites = data.filter(f => f.uid === uid);
  console.log(favourites);
  favourites[0].favouritesList.push(id);
  await saveFavourites(data);
  res.send(favourites);
});

app.delete("/favourites/:id", async (req, res) => {
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

app.get("/artists/:id", async (req, res) => {
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

app.get("/favouriteartists", async (req, res) => {
  const uid = req.cookies.session;
  const artists = await getArtists();
  const data = await getFavourites();
  const favourites = data.filter(f => f.uid === Number(uid));
  const favArtists = artists.filter(artist =>
    favourites[0].favouritesList.includes(artist.id)
  );
  console.log(favourites[0].favouritesList);
  res.json(favArtists);
});

// HELPER FUNCTIONS
async function getArtists() {
  const data = await fs.readFile("artists.json");
  const artists = JSON.parse(data);
  return artists;
}

async function getFavourites() {
  const data = await fs.readFile("favourites.json");
  const fav = JSON.parse(data);
  return fav;
}

async function saveFavourites(data) {
  await fs.writeFile("favourites.json", JSON.stringify(data));
}

async function saveArtists(data) {
  await fs.writeFile("artists.json", JSON.stringify(data));
}

app.listen(port, (req, res) => {
  console.log(`The server is running on "${host}:${port}"`);
});
