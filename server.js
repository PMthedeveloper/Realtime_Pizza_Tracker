require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const PORT = process.env.PORT || 8000;
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongodb-session")(session);

// Database connection
const MONGO_CONNECTION_URL = "mongodb://localhost/pizzas";
mongoose.connect(MONGO_CONNECTION_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("Database connected...");
  })
  .catch((err) => {
    console.log("Connection failed...");
  });

// Session Store
var mongoStore = new MongoDbStore({
  uri: MONGO_CONNECTION_URL,
  collection: "sessions",
});
// Session Config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 hr
  })
);

app.use(flash());

// Assets
app.use(express.static("public"));
app.use(express.json());

// Global middleware
app.use((req,res,next) => {
  res.locals.session = req.session;
  next();
})

// set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

require("./routes/web")(app);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
