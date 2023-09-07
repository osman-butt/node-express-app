import {
  updateArtistsGrid,
  openCreateDialog,
  updateFavouriteArtistsGrid,
  searchArtists,
} from "./views.js";

window.addEventListener("load", initApp);

async function initApp() {
  console.log("initApp: app.js is running 🎉");
  document
    .querySelector("#newartist-btn")
    .addEventListener("click", openCreateDialog);
  document
    .querySelector("#showfav-btn")
    .addEventListener("click", updateFavouriteArtistsGrid);
  document
    .querySelector("#search-btn")
    .addEventListener("click", searchArtists);
  document
    .querySelector("#showall-btn")
    .addEventListener("click", updateArtistsGrid);
  document.querySelector("#sort").addEventListener("change", updateArtistsGrid);
  updateArtistsGrid();
}
