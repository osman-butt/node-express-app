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

function getRoute(req, res, next) {
  console.log(req.method, ":", req.originalUrl);
  next();
}

function checkQuery(artistsObj, queryObj) {
  // NOTE THIS FUNCTION ASSUMES THAT PROPERTIES IN BOTH INPUT OBJECTS,
  // DOES NOT CONTAIN ANY NUMBER!!!

  // INPUT:
  // artistsObj: Full artists list
  // queryObj: result from req.query

  // OUTPUT:
  // All artists that meets the query constraints. See example

  // EXAMPLE 1:
  // query artists?genres=Rock,Soul&labels=Columbia
  // queryObj = {genres: 'Rock,Soul', labels: 'Columbia'}
  // OUTPUT: Should be all artists with genres Rock or Soul and label = Columbia

  // EXAMPLE 2:
  // query artists?genres=Rock,Soul&name=Eminem
  // queryObj = {genres: 'Rap,Soul', name: 'Eminem'}
  // OUTPUT: Should be all artists with genres Rap or Soul and name = Eminem

  // (*)
  // Query: artists?genres=Rap&genres=Soul&labels=Columbia need to be handled.
  // So we convert {genres: ['Rap','Soul'], labels: 'Columbia'} to
  // {labels: 'Columbia', genres0: 'Rap', genres1: 'Soul'}

  // This loop creates (*)
  for (const key in queryObj) {
    // If it's an array we flatten the object, and append a number
    if (typeof queryObj[key] === "object") {
      // console.log(queryObj[key].length);
      for (let i = 0; i < queryObj[key].length; i++) {
        queryObj[key + i] = queryObj[key][i];
      }
      delete queryObj[key];
    }
  }

  // Each entry is a list of artists that satisfies each query, ie
  // a list artists where AND is replaced with OR in the query.
  const unionFilteredArtists = [];
  for (const query in queryObj) {
    const cleanedQuery = query.replace(/[0-9]/g, "");
    if (typeof artistsObj[0][cleanedQuery] === "object") {
      // Remove appended number
      const listOfArtists = artistsObj.filter(artist =>
        artist[cleanedQuery].some(artistQuery =>
          queryObj[query].split(",").includes(artistQuery)
        )
      );
      unionFilteredArtists.push(listOfArtists);
    } else {
      const listOfArtists = artistsObj.filter(artist =>
        queryObj[query].split(",").includes(artist[cleanedQuery])
      );
      unionFilteredArtists.push(listOfArtists);
    }
  }
  // We get the intersection of all artists arrays, ie. this is the & (AND) in the query
  const intersectionFilteredArtists = unionFilteredArtists.reduce((a, b) =>
    a.filter(c => b.includes(c))
  );
  return intersectionFilteredArtists;
}

export {
  getArtists,
  saveArtists,
  getFavourites,
  saveFavourites,
  getRoute,
  checkQuery,
};
