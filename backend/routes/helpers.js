import fs from "fs/promises";

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

export { getArtists, saveArtists, getFavourites, saveFavourites };
