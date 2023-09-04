const endpoint = "http://localhost:3000";

async function getArtists() {
  const response = await fetch(`${endpoint}/artists`, {
    credentials: "include",
  });
  const artists = await response.json();
  return artists;
}

async function getFavouriteArtists() {
  const response = await fetch(`${endpoint}/favouriteartists`, {
    credentials: "include",
  });
  const artists = await response.json();
  return artists;
}

async function getFavourites() {
  const response = await fetch(`${endpoint}/favourites`, {
    credentials: "include",
  });
  const fav = await response.json();
  return fav;
}

async function addToFavourites(id) {
  console.log("Add to fav");
  console.log(id);
  console.log(`${endpoint}/favourites/${id}`);
  const response = await fetch(`${endpoint}/favourites/${id}`, {
    method: "PUT",
    credentials: "include",
  });
}

async function removeFromFavourites(id) {
  console.log("remove from fav");
  console.log(id);
  console.log(`${endpoint}/favourites/${id}`);
  const response = await fetch(`${endpoint}/favourites/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

async function getSearchArtists(searchProperty, searchString) {
  const response = await fetch(
    `${endpoint}/artists/${searchProperty}/${searchString}`,
    {
      credentials: "include",
    }
  );
  const searchedArtists = await response.json();
  return searchedArtists;
}

async function getSearchFavArtists(searchProperty, searchString) {
  const response = await fetch(
    `${endpoint}/favouriteartists/${searchProperty}/${searchString}`,
    {
      credentials: "include",
    }
  );
  const searchedArtists = await response.json();
  return searchedArtists;
}

export {
  getArtists,
  getFavouriteArtists,
  getFavourites,
  addToFavourites,
  removeFromFavourites,
  getSearchArtists,
  getSearchFavArtists,
};
