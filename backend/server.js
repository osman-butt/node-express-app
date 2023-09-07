import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { artistRouter } from "./routes/artists.js";
import { favouritesRouter } from "./routes/favourites.js";
import { favouriteArtistsRouter } from "./routes/favouriteArtists.js";
import { genreRouter } from "./routes/genres.js";
import { retrieveCookies } from "./cookies.js";
import { getRoute } from "./routes/helpers.js";
import morgan from "morgan";
import fsSync from "fs";

// Globals
const port = 3000;
const host = "http://localhost";

// Initialize server
const app = express();
// Add middleware
app.use(express.json()); // parse incomming JSON
app.use(
  cors({
    origin: ["http://127.0.0.1:8080", "http://127.0.0.1:5500"],
    credentials: true,
  })
); // Using CORS + settings
app.use(cookieParser()); // Using cookies

// create a write stream (in append mode)
const accessLogStream = fsSync.createWriteStream("requests.log", {
  flags: "a",
});

// Define a custom log format that includes cookies
morgan.token("cookies", req => {
  return req.cookies.session;
});

// Create a custom format that logs cookies along with other request information
const customFormat =
  ":remote-addr - :remote-user [:date[clf]] ':method :url HTTP/:http-version' :status :res[content-length] - :response-time ms ':referrer' ':user-agent' Session: :cookies";

// setup the logger
app.use(morgan(customFormat, { stream: accessLogStream }));
// app.use(morgan("combined", { stream: accessLogStream }));
app.use(retrieveCookies); // Set & get cookies
app.use(getRoute);
app.use("/artists", artistRouter);
app.use("/favourites", favouritesRouter);
app.use("/favouriteartists", favouriteArtistsRouter);
app.use("/genres", genreRouter);
app.all("/*", (req, res) => {
  res.status(404).json({ message: "ressource does not exist" });
});

app.get("/", (req, res) => {
  res.send("Welcome to MusicBase API");
});

app.listen(port, (req, res) => {
  console.log(`The server is running on "${host}:${port}"`);
});
