const express = require("express");
const { createCanvas } = require("canvas");

const app = express();

app.get("/leaderboard", (req, res) => {

const width = 1200;
const height = 800;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");


// fondo
ctx.fillStyle = "#0f172a";
ctx.fillRect(0,0,width,height);


// titulo
ctx.fillStyle = "#ffffff";
ctx.font = "bold 60px Arial";
ctx.fillText("RANKED LEADERBOARD", 350, 80);


// lineas
ctx.strokeStyle = "#1e293b";
ctx.lineWidth = 3;

ctx.beginPath();
ctx.moveTo(100,120);
ctx.lineTo(1100,120);
ctx.stroke();


// datos
ctx.font = "28px Arial";

let y = 170;

for(let i=1;i<=10;i++){

const team = req.query["team"+i] || "N/A";
const elo = req.query["elo"+i] || "0";
const rank = req.query["rank"+i] || "";

ctx.fillStyle="#ffffff";
ctx.fillText(`#${i}`,120,y);

ctx.fillText(team,200,y);

ctx.fillStyle="#38bdf8";
ctx.fillText(`ELO ${elo}`,800,y);

ctx.fillStyle="#facc15";
ctx.fillText(rank,950,y);

y += 60;

}

res.set("Content-Type","image/png");
canvas.createPNGStream().pipe(res);

});


app.listen(3000, () => {
console.log("API leaderboard activa");
});