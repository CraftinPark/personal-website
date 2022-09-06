const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const User = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  memberList: [
    {
      id: String,
      name: String,
      kName: String,
      year: Number,
      sex: String,
      leader: Boolean,
      active: Boolean,
    },
  ],
  previousJos: [
    [
      {
        id: String,
        name: String,
        kName: String,
        year: Number,
        sex: String,
        leader: Boolean,
        active: Boolean,
      },
    ],
  ],
  settings: {
    numberOfJos: { type: Number, default: 3 },
    useDiversifierAlgorithm: { type: Boolean, default: true },
    inclusionList: { type: String, default: "" },
    exclusionList: { type: String, default: "" },
  },
});

const model = mongoose.model("UserData", User);

mongoose.connect(
  "mongodb+srv://admin:Itrinity3@craftinpark.nrllh0g.mongodb.net/?retryWrites=true&w=majority"
);

mongoose.connection.on("open", function (ref) {
  console.log("Connected to mongo server.");
});

app.use(cors());
app.use(express.json());

app.use(
  "/home",
  express.static(path.join(__dirname, "../dist/personal-website-build"))
);
app.use(
  "/jomaker",
  express.static(path.join(__dirname, "../dist/jomaker-build"))
);

// personal website

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("home/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/../dist/personal-website-build/index.html")
  );
});

// jomaker

app.get("/jomaker/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../dist/jomaker-build/index.html"));
});

app.post("/api/jomaker/register", async (req, res) => {
  try {
    await model.create({
      username: req.body.username,
      password: req.body.password,
      memberList: [],
      previousJos: [],
      settings: {},
    });
    res.json({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", message: "Username already exists." });
  }
});

app.post("/api/jomaker/login", async (req, res) => {
  const user = await model.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (user) {
    res.json({ status: "ok", user: user });
  } else {
    res.json({ status: "error", message: "Incorrect username or password." });
  }
});

app.post("/api/jomaker/update-user", async (req, res) => {
  console.log(req.body.id);
  const user = await model
    .findOneAndUpdate(
      {
        username: req.body.username,
      },
      {
        memberList: req.body.memberList,
        previousJos: req.body.previousJos,
        settings: {
          inclusionList: req.body.inclusionList,
          exclusionList: req.body.exclusionList,
        },
      }
    )
    .then(() => {
      res.json({ status: "ok" });
    })
    .catch(() => {
      res.json({ status: "error" });
    });
});

app.get("/api/jomaker/users", async (req, res) => {
  const users = await model.find({});
  res.send(users);
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
