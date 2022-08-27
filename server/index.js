const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const path = require("path");

app.use(
  "/home",
  express.static(path.join(__dirname, "../personal-website/build"))
);
app.use(
  "/jomaker",
  express.static(path.join(__dirname, "../jomaker/build"))
);

app.get("home/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../personal-website/build/index.html"));
});

app.get("/jomaker/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../jomaker/build/index.html"));
});

app.get("/test", (req, res) => {
  res.send("you've reached the testing page!");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
