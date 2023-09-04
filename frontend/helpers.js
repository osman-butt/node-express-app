import { addToFavourites, removeFromFavourites } from "./rest-services.js";
import { updateFavouriteArtistsGrid } from "./views.js";

function showAllBtn() {
  document.querySelector("#showfav-btn").offsetHeight;
  document.querySelector("#showfav-btn").classList.add("hidden");
  document.querySelector("#showall-btn").offsetHeight;
  document.querySelector("#showall-btn").classList.remove("hidden");
}

function showFavBtn() {
  document.querySelector("#showfav-btn").offsetHeight;
  document.querySelector("#showfav-btn").classList.remove("hidden");
  document.querySelector("#showall-btn").offsetHeight;
  document.querySelector("#showall-btn").classList.add("hidden");
}

async function toggleFav(article) {
  const id = article.getAttribute("data-id");
  if (article.querySelector(".fa-heart").classList.contains("far")) {
    article.querySelector(".fa-heart").classList.remove("far");
    article.querySelector(".fa-heart").classList.add("fa");
    article.querySelector(".fa-heart").offsetHeight;
    await addToFavourites(id);
  } else {
    // article.querySelector(".fa").classList.toggle("far");
    article.querySelector(".fa-heart").classList.remove("fa");
    article.querySelector(".fa-heart").classList.add("far");
    article.querySelector(".fa-heart").offsetHeight;
    await removeFromFavourites(id);
  }
}

async function toggleFavArtists(article) {
  const id = article.getAttribute("data-id");
  if (article.querySelector(".fa-heart").classList.contains("far")) {
    article.querySelector(".fa-heart").classList.remove("far");
    article.querySelector(".fa-heart").classList.add("fa");
    article.querySelector(".fa-heart").offsetHeight;
    await addToFavourites(id);
    updateFavouriteArtistsGrid();
  } else {
    // article.querySelector(".fa").classList.toggle("far");
    article.querySelector(".fa-heart").classList.remove("fa");
    article.querySelector(".fa-heart").classList.add("far");
    article.querySelector(".fa-heart").offsetHeight;
    await removeFromFavourites(id);
    updateFavouriteArtistsGrid();
  }
}

export { showAllBtn, showFavBtn, toggleFav, toggleFavArtists };
