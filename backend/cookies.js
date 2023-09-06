import { getFavourites, saveFavourites } from "./routes/helpers.js";

async function retrieveCookies(req, res, next) {
  console.log("---retrieveCookies()---");
  const cookies = req.cookies.session;
  const cookieValue = new Date().getTime();
  if (!cookies) {
    res.cookie("session", `${cookieValue}`, {
      sameSite: "none",
      secure: true,
    });
    console.log(`Saved cookievalue = ${cookieValue}`);
    await saveCookies(cookieValue);
  }
  // console.log(cookies);
  next();
}

async function saveCookies(cookie) {
  console.log("---saveCookies()---");
  const fav = await getFavourites();
  const index = fav.indexOf(f => Number(f.uid) === Number(cookie));

  if (index === -1) {
    const newFavObj = { uid: cookie, favouritesList: [] };
    fav.push(newFavObj);
    await saveFavourites(fav);
  }
}

export { retrieveCookies };
