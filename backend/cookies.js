async function retrieveCookies(req, res, next) {
  const cookies = req.cookies.session;
  const cookieValue = new Date().getTime();
  if (!cookies) {
    res.cookie("session", `${cookieValue}`, {
      sameSite: "none",
      secure: true,
    });
    console.log(`Saved cookievalue = ${cookieValue}`);
    await saveUserSession(cookieValue);
  }
  console.log("---retrieveCookies()---");
  console.log(cookies);
  console.log("---retrieveCookies() END---");
  next();
}

async function saveUserSession(cookie) {
  const fav = await getFavourites();
  const index = fav.indexOf(f => Number(f.uid) === Number(cookie));

  console.log("---saveUserSession---");
  if (index === -1) {
    const newFavObj = { uid: cookie, favouritesList: [] };
    fav.push(newFavObj);
    await saveFavourites(fav);
  }
}

export { retrieveCookies };
