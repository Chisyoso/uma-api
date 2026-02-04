import express from "express";
import { createCanvas, loadImage } from "canvas";

const app = express();

// 📌 Mapeo de tus Umas
const umas = {
  "1460741484428132507": { name: "Winnigticket", rarity: "SR" },
  "1460740598935064789": { name: "Vodka", rarity: "R" },
  "1460739067456258048": { name: "Tokaiteio", rarity: "N" },
  "1460741054142746725": { name: "Taikishuttle", rarity: "R" },
  "1460741713780805652": { name: "Symbolirudolf", rarity: "SR" },
  "1460738823372673203": { name: "Special Week", rarity: "SR" },
  "1460738974422270073": { name: "Silence Suzuka", rarity: "SR" },
  "1460741834140684459": { name: "Rice Shower", rarity: "SR" },
  "1460741170706776246": { name: "Narita Brian", rarity: "SR" },
  "1460739270032494642": { name: "Mejiro McQueen", rarity: "SR" },
  "1460742253952766044": { name: "Haro Urara", rarity: "R" },
  "1460740807207157760": { name: "Grass Wonder", rarity: "N" },
  "1460740687342473306": { name: "Daiwa Scarlet", rarity: "SR" },
  "1460740986756923495": { name: "El Condor Pasa", rarity: "R" },
  "1460742180904767519": { name: "Daitaku Helios", rarity: "N" },
  "1460742007256252538": { name: "Matikanetannhausermambo", rarity: "R" },
  "1460742088173031580": { name: "Satono Diamond", rarity: "SR" },
  "1460742939591442739": { name: "Agnes Tachyon", rarity: "R" },
  "1460741381155721216": { name: "Air Groove", rarity: "N" },
};

// Mapeo ánimo
const moods = ["😢", "😐", "😊", "😆"]; // 0,1,2,3

app.get("/card", async (req, res) => {
  try {
    let { emoji, level = 1, energy = 100, animo = 1 } = req.query;

    if (!emoji) return res.status(400).send("Emoji ID requerido");

    // Extraer solo ID si viene en formato <:name:id>
    const match = emoji.match(/(\d+)/);
    if (match) emoji = match[1];

    // Buscar datos automáticos
    const data = umas[emoji];
    if (!data) return res.status(404).send("Uma no registrada");

    const name = data.name;
    const rarity = data.rarity;
    const moodEmoji = moods[Math.max(0, Math.min(3, parseInt(animo)))]; // automático

    // Canvas
    const width = 600;
    const height = 900;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Fondo
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, width, height);

    // Emoji de la Uma
    const emojiURL = `https://cdn.discordapp.com/emojis/${emoji}.png`;
    const emojiImg = await loadImage(emojiURL);
    ctx.drawImage(emojiImg, 150, 80, 300, 300);

    // Texto
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Sans";
    ctx.fillText(name, 40, 430);
    ctx.font = "28px Sans";
    ctx.fillText(`Rareza: ${rarity}`, 40, 480);
    ctx.fillText(`Nivel: ${level}`, 40, 520);
    ctx.fillText(`Ánimo: ${moodEmoji}`, 40, 560);

    // Barra de energía
    ctx.fillText("Energía", 40, 610);
    ctx.fillStyle = "#555";
    ctx.fillRect(40, 630, 520, 25);
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(40, 630, 5.2 * Math.min(100, energy), 25);

    // Enviar imagen
    res.set("Content-Type", "image/png");
    res.send(canvas.toBuffer());

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generando carta");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API activa en puerto", PORT));
