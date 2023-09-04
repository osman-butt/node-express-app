import {
  getArtists,
  getFavouriteArtists,
  getFavourites,
} from "./rest-services.js";
import { addToFavourites, removeFromFavourites } from "./rest-services.js";

import {
  showAllBtn,
  showFavBtn,
  toggleFav,
  toggleFavArtists,
} from "./helpers.js";

async function updateArtistsGrid() {
  console.log("---updateArtistsGrid---");
  showFavBtn();
  const artists = await getArtists();
  const favourites = await getFavourites();
  console.log(favourites);
  const favList = favourites[0].favouritesList;
  const listOfArtists = artists.map(a => ({
    ...a,
    isFavourite: favList.includes(a.id),
  }));
  showArtists(listOfArtists);
}

function showArtists(listOfArtists) {
  console.log("---showArtists()---");
  document.querySelector("#grid").innerHTML = ""; // reset the content of section#posts
  listOfArtists.forEach(showArtist);
}

async function showArtist(artist) {
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
  article.setAttribute("data-id", artist.id);
  article
    .querySelector(".fav-btn")
    .addEventListener("click", () => toggleFav(article));
}

function openCreateDialog() {
  console.log("CREATE NEW ARTIST CLICKED");
  // Reset input
  document.querySelector("#create-question").value = "";
  document.querySelector("#create-answer").value = "";
  document.querySelector("#create-language").value = "";
  document.querySelector("#create-topic").value = "";
  document.querySelector("#create-difficulty").value = "";
  document.querySelector("#create-image").value = "";
  document.querySelector("#create-link").value = "";
  document.querySelector("#create-code-snippet").value = "";
  // open dialog
  document.getElementById("dialog-create").showModal();
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
  article.setAttribute("data-id", artist.id);
  article
    .querySelector(".fav-btn")
    .addEventListener("click", () => toggleFavArtists(article));
}

export { updateArtistsGrid, openCreateDialog, updateFavouriteArtistsGrid };
