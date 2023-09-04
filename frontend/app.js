import {
  updateArtistsGrid,
  openCreateDialog,
  updateFavouriteArtistsGrid,
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
    .querySelector("#showall-btn")
    .addEventListener("click", updateArtistsGrid);
  updateArtistsGrid();
}
