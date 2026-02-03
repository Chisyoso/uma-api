const express = require("express");
const path = require("path");
const app = express();

app.get("/", (req, res) => {
  res.send("UMA API ONLINE");
});

app.get("/uma/:name", (req, res) => {
  const { mood = "normal", energy = "high" } = req.query;
  const file = `${mood}_${energy}.png`;

  const imgPath = path.join(__dirname, "images", req.params.name, file);

  res.sendFile(imgPath, err => {
    if (err) {
      res.status(404).send("Imagen no encontrada");
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API activa en puerto", PORT);
});
