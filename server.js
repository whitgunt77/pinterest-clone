require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

const User = require("./models/User");
const Pin = require("./models/Pin");

const app = express();

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware Setup
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Passport GitHub Strategy Configuration
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName || profile.username,
            avatarUrl:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : "",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// --- Routes ---

// 1. Home / Explore All Pins (Unauthenticated & Authenticated)
app.get("/", async (req, res) => {
  try {
    // Explicitly call .sort() with a proper mongoose sort object or use Mongoose sort method safely
    const pins = await Pin.find({})
      .populate("owner")
      .sort({ createdAt: -1 })
      .exec();
    res.render("index", { pins, user: req.user, profileUser: null });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// 2. GitHub Auth Routes
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  },
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// 3. Add a Pin (Linked Image)
app.post("/pins", async (req, res) => {
  if (!req.user) return res.redirect("/auth/github");
  try {
    const { title, imageUrl } = req.body;
    if (title && imageUrl) {
      await Pin.create({ title, imageUrl, owner: req.user._id });
    }
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// Render Create Pin Form
app.get("/pins/new", (req, res) => {
  if (!req.user) return res.redirect("/auth/github");
  res.render("new-pin", { user: req.user });
});

// View Individual Pin Details Page
app.get("/pin/:id", async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id).populate("owner");
    if (!pin) return res.redirect("/");
    res.render("pin-detail", { pin, user: req.user });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// 4. Delete a Pin
app.post("/pins/delete/:id", async (req, res) => {
  if (!req.user) return res.redirect("/auth/github");
  try {
    const pin = await Pin.findById(req.params.id);
    if (pin && pin.owner.toString() === req.user._id.toString()) {
      await Pin.findByIdAndDelete(req.params.id);
    }
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// 5. View Specific User's Wall
app.get("/user/:username", async (req, res) => {
  try {
    const profileUser = await User.findOne({ username: req.params.username });
    if (!profileUser) return res.redirect("/");

    const pins = await Pin.find({ owner: profileUser._id })
      .populate("owner")
      .sort({ createdAt: -1 })
      .exec();
    res.render("profile", { pins, user: req.user, profileUser });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Pinterest clone running on http://localhost:3000`);
});
