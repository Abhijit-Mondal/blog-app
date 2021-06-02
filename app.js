import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash";
import messages from "express-messages";
import passport from "passport";
import config from "./config/database"
import passportConfig from "./config/passport"

// Database connection
mongoose.connect(config.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>console.log("Connection to MongoDB instance successful."))
.catch((err)=>{throw err;});
const db = mongoose.connection;
// Checking for errors
db.on("error", err => {throw err});

// Init app
const app = express();

// Setting view engine
app.set("views", "./views");
app.set("view engine", "pug");

// Setting static folder
app.use(express.static("public"))

// Middlewares
// Time logging 
import timeLogger from "./middleware/time_logger";
app.use(timeLogger);
// for parsing requests containing JSON
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// express session middleware
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// express messages middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = messages(req, res);
  next();
});


// Passport Config
passportConfig(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next)=>{
  res.locals.user = req.user || null;
  next();
});

// Home Route
import home from "./routes/home";
app.use("/", home);

// Article routes
import article from "./routes/article";
app.use("/articles", article);

// User routes
import user from "./routes/user";
app.use("/users", user);


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server listening on port: ${PORT}...`));

