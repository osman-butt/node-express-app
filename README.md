# node-express-app
A basic fullstack webapp build with node.js & express.js.

The app allows users to browse and engage with artist information through CRUD operations.

Users have the ability to "like" artists, which results in the artists being saved to a favorites file. This functionality is facilitated by the use of cookies to identify the user, allowing them to see their liked artists.

Additionally, the app incorporates integration with the Spotify iFrame API, enabling users to listen to songs by their favorite artists.

## Installation
Fork the repository and run the following command in the terminal, to install all dependencies

`npm install`


## Running the app
Navigate to `/node-express-app` directory, and run the following command to start the server

`npm start`

Navigate to `/node-express-app/frontend` directory in another session, and use the vscode extension "Live Server", to start the frontend server. Make sure that the frontend runs on port 5500.
