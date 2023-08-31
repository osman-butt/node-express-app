import express from "express";
import cors from "cors";
import fs from "fs/promises";

// Initiazlize server
const app = express();
// Add middleware
app.use(express.json()); // parse incomming JSON

const port = 3000;
const host = "http://localhost";

// Routes
app.get("/", (req, res) => {
  console.log(req.url);
  res.send("HELLO");
});

app.get("/artists", async (req, res) => {
  console.log(req.url);
  const artists = await getArtists();
  res.json(artists);
});

app.get("/artists/:artistsname", async (req, res) => {
  console.log(req.url);
  const artists = await getArtists();
  const artistName = req.params.artistsname.toLowerCase().replace("_", " ");
  const artist = artists.find(art => art.name.toLowerCase() === artistName);
  res.json(artist);
});

// HELPER FUNCTIONS
async function getArtists() {
  const data = await fs.readFile("artists.json");
  const artists = JSON.parse(data);
  return artists;
}

async function saveArtists(data) {
  await fs.writeFile("artists.json", JSON.stringify(data));
}

app.listen(port, (req, res) => {
  console.log(`The server is running on "${host}:${port}"`);
});
