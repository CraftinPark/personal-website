const express = require("express");
const app = express();
const port = process.env.PORT || 80;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/test", (req, res) => {
  res.send("you've reached the testing page!");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
