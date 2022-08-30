const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const path = require("path");
const mongoose = require("mongoose");

const User = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  memberList: {
    type: [
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
  },
});

const model = mongoose.model("UserData", User);

mongoose.connect(
  "mongodb+srv://admin:Itrinity3@craftinpark.nrllh0g.mongodb.net/?retryWrites=true&w=majority"
);

app.use(
  "/home",
  express.static(path.join(__dirname, "../dist/personal-website-build"))
);
app.use(
  "/jomaker",
  express.static(path.join(__dirname, "../dist/jomaker-build"))
);

// personal website

app.get("home/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/../dist/personal-website-build/index.html")
  );
});

// jomaker

app.get("/jomaker/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../dist/jomaker-build/index.html"));
});

app.post("/jomaker/register", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "duplicate email" });
  }
});

app.post("/jomaker/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (user) {
    res.json({ status: "ok" });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.get("/test", (req, res) => {
  res.send("you've reached the testing page!");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
