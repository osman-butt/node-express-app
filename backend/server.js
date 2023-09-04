import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { artistRouter } from "./routes/artists.js";
import { favouritesRouter } from "./routes/favourites.js";
import { favouriteArtistsRouter } from "./routes/favouriteArtists.js";
import { retrieveCookies } from "./cookies.js";

// Globals
const port = 3000;
const host = "http://localhost";

// Initialize server
const app = express();
// Add middleware
app.use(express.json()); // parse incomming JSON
app.use(cors({ origin: "http://127.0.0.1:8080", credentials: true })); // Using CORS + settings
app.use(cookieParser()); // Using cookies
app.use(retrieveCookies); // Set & get cookies
app.use("/artists", artistRouter);
app.use("/favourites", favouritesRouter);
app.use("/favouriteartists", favouriteArtistsRouter);

app.get("/", (req, res) => {
  res.send("Welcome to MusicBase API");
});

app.listen(port, (req, res) => {
  console.log(`The server is running on "${host}:${port}"`);
});
