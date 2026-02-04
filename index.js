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

// Color marco según rareza
const rarityColors = {
  "N": "#aaaaaa",
  "R": "#00ccff",
  "SR": "#ff00cc",
};

app.get("/card", async (req, res) => {
  try {
    let { emoji, level = 1, energy = 100, animo = 1, xp = 0 } = req.query;

    if (!emoji) return res.status(400).send("Emoji ID requerido");

    // Extraer solo ID si viene en formato <:name:id>
    const match = emoji.match(/(\d+)/);
    if (match) emoji = match[1];

    // Buscar datos automáticos
    const data = umas[emoji];
    if (!data) return res.status(404).send("Uma no registrada");

    const name = data.name;
    const rarity = data.rarity;

    const nivelInt = parseInt(level);
    const energyInt = Math.min(100, parseInt(energy));
    const animoInt = Math.max(0, Math.min(3, parseInt(animo)));
    const xpInt = Math.max(0, parseInt(xp));

    const moodEmoji = moods[animoInt];

    // XP necesario para subir de nivel
    const xpToNext = Math.max(1, nivelInt * 50); // evitar división por 0
    const xpPercent = Math.min(1, xpInt / xpToNext);

    // Canvas
    const width = 600;
    const height = 800; // carta compacta
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Fondo con degradado sutil
    const gradBg = ctx.createLinearGradient(0, 0, 0, height);
    gradBg.addColorStop(0, "#1e1e1e");
    gradBg.addColorStop(1, "#111111");
    ctx.fillStyle = gradBg;
    ctx.fillRect(0, 0, width, height);

    // Marco según rareza
    ctx.strokeStyle = rarityColors[rarity] || "#ffffff";
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, width - 8, height - 8);

    // Emoji de la Uma
    const emojiURL = `https://cdn.discordapp.com/emojis/${emoji}.png`;
    const emojiImg = await loadImage(emojiURL);
    ctx.drawImage(emojiImg, 150, 50, 300, 300);

    // Texto principal todo blanco
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Sans";
    ctx.fillText(name, 40, 380);
    ctx.font = "26px Sans";
    ctx.fillText(`Rareza: ${rarity}`, 40, 420);
    ctx.fillText(`Nivel: ${nivelInt}`, 40, 460);

    // Separación vertical aumentada 25%
    const spacing = 50;
    let yPos = 490;

    // Barra de ánimo después del nivel
    const barraX = 40;
    const barraWidth = 400;
    const barraHeight = 20;

    ctx.fillText("Ánimo", barraX, yPos - 10);
    ctx.fillStyle = "#555";
    ctx.fillRect(barraX, yPos, barraWidth, barraHeight);
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(barraX, yPos, barraWidth * (animoInt / 3), barraHeight);
    ctx.fillText(moodEmoji, barraX + barraWidth + 10, yPos + barraHeight - 2);

    // Barra de energía
    yPos += spacing;
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Energía", barraX, yPos - 10);
    ctx.fillStyle = "#555";
    ctx.fillRect(barraX, yPos, barraWidth, barraHeight);
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(barraX, yPos, barraWidth * (energyInt / 100), barraHeight);

    // Barra de XP
    yPos += spacing;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`XP: ${xpInt} / ${xpToNext}`, barraX, yPos - 10);
    ctx.fillStyle = "#555";
    ctx.fillRect(barraX, yPos, barraWidth, barraHeight);
    ctx.fillStyle = "#00aaff";
    ctx.fillRect(barraX, yPos, barraWidth * xpPercent, barraHeight);

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