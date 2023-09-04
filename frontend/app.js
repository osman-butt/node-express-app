window.addEventListener("load", initApp);

const endpoint = "http://localhost:3000";

async function initApp() {
  console.log("initApp: app.js is running 🎉");
  document
    .querySelector("#newartist-btn")
    .addEventListener("click", openCreateDialog);
  document
    .querySelector("#showfav-btn")
    .addEventListener("click", showFavouritesClicked);
  document
    .querySelector("#showall-btn")
    .addEventListener("click", updateArtistsGrid);
  updateArtistsGrid();
}

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

async function showFavouritesClicked() {
  showAllBtn();
  const artists = await getFavouriteArtists();
  const favouriteArtists = artists.map(artist => ({
    ...artist,
    isFavourite: true,
  }));
  showArtists(favouriteArtists);
}

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
