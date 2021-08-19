const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const override = require("method-override");
const session = require("express-session");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const handlebars = require("handlebars");
const flash = require("connect-flash");
const passport = require("passport");

//initializations
require("dotenv").config();
const app = express();
require("./database");
require("./config/passport");

//settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layaouts"),
    partialsDir: path.join(app.get("views"), "components"),
    handlebars: allowInsecurePrototypeAccess(handlebars),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//midlewares
app.use(express.urlencoded({ extended: false }));
app.use(override("_method"));
app.use(
  session({
    secret: "SECRET",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// variables Globales
app.use((req, res, next) => {
  res.locals.successMessage = req.flash("successMessage");
  res.locals.errorMessage = req.flash("errorMessage");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
//routes

app.use(require("./routes/index"));
app.use(require("./routes/notes"));
app.use("/user", require("./routes/users"));

//statics
app.use(express.static(path.join(__dirname, "public")));
//Start server
app.listen(app.get("port"), () => {
  console.log("server on port:", app.get("port"));
});
