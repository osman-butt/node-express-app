import {
  getArtists,
  deleteArtist,
  getFavouriteArtists,
  getFavourites,
  getSearchArtists,
  getSearchFavArtists,
  createArtists,
  updateArtist,
} from "./rest-services.js";

import {
  showAllBtn,
  showFavBtn,
  toggleFav,
  toggleFavArtists,
} from "./helpers.js";

async function updateArtistsGrid() {
  // console.log("---updateArtistsGrid---");
  showFavBtn();
  const artists = await getArtists();
  const favourites = await getFavourites();
  // console.log(favourites);
  const favList = favourites[0].favouritesList;
  const listOfArtists = artists.map(a => ({
    ...a,
    isFavourite: favList.includes(a.id),
  }));
  if (document.querySelector("#sort").value === "-name") {
    listOfArtists.sort(sortNameAZ);
  } else if (document.querySelector("#sort").value === "+name") {
    listOfArtists.sort(sortNameZA);
  }
  showArtists(listOfArtists);
}

function sortNameAZ(artist1, artist2) {
  // return new Date(artist1.birthdate) - new Date(artist2.birthdate);
  return artist1.name.localeCompare(artist2.name);
}

function sortNameZA(artist1, artist2) {
  // return new Date(artist2.birthdate) - new Date(artist1.birthdate);
  return artist2.name.localeCompare(artist1.name);
}

function showArtists(listOfArtists) {
  // console.log("---showArtists()---");
  document.querySelector("#grid").innerHTML = "";
  listOfArtists.forEach(showArtist);
}

async function showArtist(artist) {
  // console.log("---showArtist()---");
  const html = /*html*/ `
      <article class="grid-item">
        <img
          class="grid-img"
          src="${artist.image}"
          alt=""
        />
        <p>${artist.name}</p>
        <p class="grid-description">${artist.shortDescription}</p>
        <!--<button class="fav-btn "><i class="far fa-heart" style="color: #1DB954;"></i></button> -->
     </article>
  `;
  document.querySelector("#grid").insertAdjacentHTML("beforeend", html);

  document
    .querySelector("#grid article:last-child img")
    .addEventListener("click", () => showReadDialog(artist));

  const article = document.querySelector("#grid article:last-child");
  // console.log(article);
  if (artist.isFavourite) {
    const btn =
      /*html*/
      `<button class="fav-btn ">
        <i class="fa fa-heart" style="color: #1DB954;"></i>
      </button>`;
    article.insertAdjacentHTML("beforeend", btn);
  } else {
    const btn =
      /*html*/
      `<button class="fav-btn ">
        <i class="far fa-heart" style="color: #1DB954;"></i>
      </button>`;
    article.insertAdjacentHTML("beforeend", btn);
  }
  article.setAttribute("data-id", artist.id);
  article
    .querySelector(".fav-btn")
    .addEventListener("click", () => toggleFav(article));
}

function showReadDialog(artist) {
  console.log("---showReadDialog()---");
  document.querySelector("#artist-name").textContent = artist.name;
  document.querySelector("#artist-image").src = artist.image;
  document.querySelector("#artist-shortDescription").textContent =
    artist.shortDescription;
  document.querySelector("#artist-birthdate").textContent =
    "Date of birth: " + artist.birthdate;
  document.querySelector("#artist-activeSince").textContent =
    "Active since: " + artist.activeSince;
  document.querySelector("#artist-genres").textContent =
    "Genres: " + artist.genres.toString().replace(",", ", ");
  document.querySelector("#artist-labels").textContent =
    "Labels: " + artist.labels.toString().replace(",", ", ");
  document.querySelector("#artist-website").textContent =
    "Website: " + artist.website;
  if (artist.spotifyLink.includes("http")) {
    document.querySelector("#spotify-link").offsetHeight;
    document.querySelector("#spotify-link").classList.remove("hidden");
    document.querySelector("#spotify-link").src = artist.spotifyLink;
  } else {
    document.querySelector("#spotify-link").offsetHeight;
    document.querySelector("#spotify-link").classList.add("hidden");
  }

  document.querySelector("#dialog-read").showModal();

  document.querySelector("#update-artist").setAttribute("data-id", artist.id);
  document.querySelector("#delete-artist").setAttribute("data-id", artist.id);

  document
    .querySelector("#delete-artist")
    .addEventListener("click", deleteArtistDialog);

  document
    .querySelector("#update-artist")
    .addEventListener("click", updateArtistPrompt);

  document.querySelector("#update-name").value = artist.name;
  document.querySelector("#update-dob").value = artist.birthdate;
  document.querySelector("#update-active").value = artist.activeSince;
  document.querySelector("#update-genres").value = artist.genres;
  document.querySelector("#update-labels").value = artist.labels;
  document.querySelector("#update-website").value = artist.website;
  document.querySelector("#update-image").value = artist.image;
  document.querySelector("#update-spotify").value = artist.spotifyLink;
  document.querySelector("#update-description").value = artist.shortDescription;
}

function updateArtistPrompt(event) {
  event.preventDefault();
  document.querySelector("#dialog-update").showModal();
  console.log("UPDATE ARTIST CLICKED");
  const id = document.querySelector("#update-artist").getAttribute("data-id");
  console.log(id);
  document
    .querySelector("#update-artist-btn-cancel")
    .addEventListener("click", closeUpdateDialog);
  document
    .querySelector("#dialog-update")
    .addEventListener("submit", updateArtistClicked);
}

async function updateArtistClicked(event) {
  event.preventDefault();
  const id = document.querySelector("#update-artist").getAttribute("data-id");
  const updatedArtist = {
    id: id,
    name: document.querySelector("#update-name").value,
    birthdate: document.querySelector("#update-dob").value,
    activeSince: document.querySelector("#update-active").value,
    genres: document.querySelector("#update-genres").value.split(","),
    labels: document.querySelector("#update-labels").value.split(","),
    website: document.querySelector("#update-website").value,
    image: document.querySelector("#update-image").value,
    spotifyLink: document.querySelector("#update-spotify").value,
    shortDescription: document.querySelector("#update-description").value,
  };
  console.log(updatedArtist);
  console.log(id);
  await updateArtist(updatedArtist);
  document.querySelector("#dialog-update").close();
  document.querySelector("#dialog-read").close();
  if (document.querySelector("#showall-btn").classList.value === "hidden") {
    updateArtistsGrid();
  } else {
    updateFavouriteArtistsGrid();
  }
}

function closeUpdateDialog() {
  document.querySelector("#dialog-update").close();
}

function deleteArtistDialog(event) {
  document.querySelector("#dialog-delete").showModal();
  document
    .querySelector("#delete-btn-cancel")
    .addEventListener("click", closeDeleteDialog);
  document
    .querySelector("#dialog-delete")
    .addEventListener("submit", deleteArtistClicked);
}
async function deleteArtistClicked(event) {
  event.preventDefault();
  const id = document.querySelector("#update-artist").getAttribute("data-id");
  console.log("DELETE DIALOG=", id);
  await deleteArtist(id);
  document.querySelector("#dialog-read").close();
  document.querySelector("#dialog-delete").close();
  if (document.querySelector("#showall-btn").classList.value === "hidden") {
    updateArtistsGrid();
  } else {
    updateFavouriteArtistsGrid();
  }
}

function closeDeleteDialog() {
  document.querySelector("#dialog-delete").close();
}

function openCreateDialog() {
  console.log("CREATE NEW ARTIST CLICKED");
  // Reset input
  document.querySelector("#create-name").value = "";
  document.querySelector("#create-dob").value = "";
  document.querySelector("#create-active").value = "";
  document.querySelector("#create-genres").value = "";
  document.querySelector("#create-labels").value = "";
  document.querySelector("#create-website").value = "";
  document.querySelector("#create-image").value = "";
  document.querySelector("#create-spotify").value = "";
  document.querySelector("#create-description").value = "";
  // open dialog
  document.getElementById("dialog-create").showModal();
  document
    .querySelector("#create-artist-btn-cancel")
    .addEventListener("click", closeDialog);
  document
    .querySelector("#dialog-create")
    .addEventListener("submit", createArtistsClicked);
}

function closeDialog() {
  document.getElementById("dialog-create").close();
}

async function createArtistsClicked(event) {
  event.preventDefault();
  console.log("createArtistsClicked");
  const newArtist = {
    name: document.querySelector("#create-name").value,
    birthdate: document.querySelector("#create-dob").value,
    activeSince: document.querySelector("#create-active").value,
    genres: document.querySelector("#create-genres").value.split(","),
    labels: document.querySelector("#create-labels").value.split(","),
    website: document.querySelector("#create-website").value,
    image: document.querySelector("#create-image").value,
    shortDescription: document.querySelector("#create-description").value,
    spotifyLink: document.querySelector("#create-spotify").value,
  };
  await createArtists(newArtist);
  document.getElementById("dialog-create").close();
  updateArtistsGrid();
}

async function updateFavouriteArtistsGrid() {
  showAllBtn();
  const artists = await getFavouriteArtists();
  const favouriteArtists = artists.map(artist => ({
    ...artist,
    isFavourite: true,
  }));
  showFavArtists(favouriteArtists);
}

function showFavArtists(listOfArtists) {
  console.log("---showArtists()---");
  document.querySelector("#grid").innerHTML = ""; // reset the content of section#posts
  listOfArtists.forEach(showFavArtist);
}

async function showFavArtist(artist) {
  console.log("---showArtist()---");
  const html = /*html*/ `
      <article class="grid-item">
        <img
          class="grid-img"
          src="${artist.image}"
          alt=""
        />
        <p>${artist.name}</p>
        <p class="grid-description">${artist.shortDescription}</p>
        <!--<button class="fav-btn "><i class="far fa-heart" style="color: #1DB954;"></i></button> -->
     </article>
  `;
  document.querySelector("#grid").insertAdjacentHTML("beforeend", html);

  const article = document.querySelector("#grid article:last-child");
  console.log(article);
  if (artist.isFavourite) {
    const btn =
      /*html*/
      `<button class="fav-btn ">
        <i class="fa fa-heart" style="color: #1DB954;"></i>
      </button>`;
    article.insertAdjacentHTML("beforeend", btn);
  } else {
    const btn =
      /*html*/
      `<button class="fav-btn ">
        <i class="far fa-heart" style="color: #1DB954;"></i>
      </button>`;
    article.insertAdjacentHTML("beforeend", btn);
  }
  document
    .querySelector("#grid article:last-child img")
    .addEventListener("click", () => showReadDialog(artist));
  article.setAttribute("data-id", artist.id);
  article
    .querySelector(".fav-btn")
    .addEventListener("click", () => toggleFavArtists(article));
}

// async function searchArtists() {
//   const isShowAll =
//     document.querySelector("#showall-btn").classList.toString() === "hidden";
//   const searchString = document.querySelector("#input-search").value;
//   const searchProperty = document.querySelector("#search-prop").value;
//   document.querySelector("#input-search").value = "";
//   if (isShowAll) {
//     if (searchString !== "") {
//       const searchArtists = await getSearchArtists(
//         searchProperty,
//         searchString
//       );
//       const favourites = await getFavourites();
//       console.log(favourites);
//       const favList = favourites[0].favouritesList;
//       const listOfArtists = searchArtists.map(a => ({
//         ...a,
//         isFavourite: favList.includes(a.id),
//       }));
//       showArtists(listOfArtists);
//     } else {
//       updateArtistsGrid();
//     }
//   } else {
//     if (searchString !== "") {
//       const searchArtists = await getSearchFavArtists(
//         searchProperty,
//         searchString
//       );

//       const listOfArtists = searchArtists.map(a => ({
//         ...a,
//         isFavourite: true,
//       }));
//       showFavArtists(listOfArtists);
//     } else {
//       updateFavouriteArtistsGrid();
//     }
//   }
// }

function getViewType() {
  if (
    document.querySelector("#showall-btn").classList.toString() === "hidden"
  ) {
    return;
  }
}

async function searchArtistsClicked(event) {
  event.preventDefault();

  const searchQuery = {
    sort: document.querySelector("#sort").value,
    searchText: document.querySelector("#input-search").value,
    searchProp: document.querySelector("#search-prop").value,
  };
  console.log(searchQuery);

  if (
    document.querySelector("#showall-btn").classList.toString() === "hidden"
  ) {
    const artists = await getSearchArtists(searchQuery);
    const favourites = await getFavourites();
    // console.log(favourites);
    const favList = favourites[0].favouritesList;
    const listOfArtists = artists.map(a => ({
      ...a,
      isFavourite: favList.includes(a.id),
    }));
    sortArtists(listOfArtists);
    console.log(listOfArtists);
    showArtists(listOfArtists);
  } else {
    const artists = await getSearchFavArtists(searchQuery);
    const favouriteArtists = artists.map(artist => ({
      ...artist,
      isFavourite: true,
    }));
    sortArtists(favouriteArtists);
    console.log(favouriteArtists);
    showFavArtists(favouriteArtists);
  }
}

function sortArtists(artists) {
  if (document.querySelector("#sort").value === "-name") {
    artists.sort(sortNameAZ);
  } else if (document.querySelector("#sort").value === "+name") {
    artists.sort(sortNameZA);
  }
  return artists;
}

export {
  updateArtistsGrid,
  openCreateDialog,
  updateFavouriteArtistsGrid,
  // searchArtists,
  searchArtistsClicked,
};
