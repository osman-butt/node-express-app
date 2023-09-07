import { getFavourites, saveFavourites } from "./routes/helpers.js";
import fsSync from "fs";

async function retrieveCookies(req, res, next) {
  console.log("---retrieveCookies()---");
  const cookies = req.cookies.session;
  const cookieValue = new Date().getTime();
  console.log("COOKIES:", cookies);
  if (cookies === undefined) {
    res.cookie("session", `${cookieValue}`, {
      sameSite: "none",
      secure: true,
    });
    console.log(`Saved cookievalue = ${cookieValue}`);
    await saveCookies(cookieValue);
  }
  console.log("COOKIES:", cookies);
  console.log("res.cookie.session:", res.cookie.session);
  next();
}

async function saveCookies(cookie) {
  console.log("---saveCookies()---");
  const fav = await getFavourites();
  const index = fav.indexOf(f => Number(f.uid) === Number(cookie));

  if (index === -1) {
    const newFavObj = { uid: cookie, favouritesList: [] };
    fav.push(newFavObj);
    // await saveFavourites(fav);
    fsSync.writeFileSync("favourites.json", JSON.stringify(fav));
  }
}

export { retrieveCookies };
