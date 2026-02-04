import express from "express";
import fetch from "node-fetch";
import { createCanvas, loadImage } from "canvas";

const app = express();

app.get("/", (req, res) => {
  res.send("UMA CARD API ONLINE");
});

app.get("/card", async (req, res) => {
  try {
    const {
      emoji,
      name = "Unknown",
      rarity = "N",
      mood = "😐",
      energy = 50,
      level = 1
    } = req.query;

    if (!emoji) return res.status(400).send("Emoji ID requerido");

    // 1️⃣ Crear canvas tipo carta
    const width = 600;
    const height = 900;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // 2️⃣ Fondo
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, width, height);

    // 3️⃣ Descargar emoji desde Discord
    const emojiURL = `https://cdn.discordapp.com/emojis/${emoji}.png`;
    const emojiImg = await loadImage(emojiURL);

    // 4️⃣ Dibujar emoji
    ctx.drawImage(emojiImg, 150, 80, 300, 300);

    // 5️⃣ Texto
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Sans";
    ctx.fillText(name, 40, 430);

    ctx.font = "28px Sans";
    ctx.fillText(`Rareza: ${rarity}`, 40, 480);
    ctx.fillText(`Nivel: ${level}`, 40, 520);
    ctx.fillText(`Ánimo: ${mood}`, 40, 560);

    // 6️⃣ Barra de energía
    ctx.fillText("Energía", 40, 610);
    ctx.fillStyle = "#555";
    ctx.fillRect(40, 630, 520, 25);
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(40, 630, 5.2 * Math.min(100, energy), 25);

    // 7️⃣ Enviar imagen
    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generando carta");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API activa en puerto", PORT);
});
