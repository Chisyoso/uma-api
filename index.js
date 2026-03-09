const express=require("express");const{createCanvas}=require("canvas");const app=express();

function parseRank(rank){
if(!rank)return "Rookie";
if(rank.includes("1445504641931546634"))return "Bronze";
if(rank.includes("1445504694653812767"))return "Silver";
if(rank.includes("1445504758172487841"))return "Gold";
if(rank.includes("1445504812849303603"))return "Diamond";
return "Unranked";
}

app.get("/leaderboard",(req,res)=>{

const width=1600;
const height=900;

const canvas=createCanvas(width,height);
const ctx=canvas.getContext("2d");

const grad=ctx.createLinearGradient(0,0,0,height);
grad.addColorStop(0,"#0f172a");
grad.addColorStop(1,"#020617");

ctx.fillStyle=grad;
ctx.fillRect(0,0,width,height);

ctx.fillStyle="#38bdf8";
ctx.font="bold 70px Arial";
ctx.textAlign="center";
ctx.fillText("RANKED TEAM LEADERBOARD",width/2,90);

ctx.textAlign="left";

let y=170;

for(let i=1;i<=10;i++){

const team=req.query["team"+i]||"Unknown";
const elo=parseInt(req.query["elo"+i]||0);
const rank=parseRank(req.query["rank"+i]);

let bg="#111827";
let border="#1f2937";

if(i===1){bg="#3b2f00";border="#facc15";}
if(i===2){bg="#1e293b";border="#94a3b8";}
if(i===3){bg="#3b1d0a";border="#fb923c";}

ctx.fillStyle=bg;
ctx.fillRect(200,y-40,1200,65);

ctx.strokeStyle=border;
ctx.lineWidth=3;
ctx.strokeRect(200,y-40,1200,65);

ctx.fillStyle="#ffffff";
ctx.font="bold 32px Arial";
ctx.fillText("#"+i,230,y);

ctx.font="bold 30px Arial";
ctx.fillText(team,320,y);

ctx.fillStyle="#38bdf8";
ctx.font="28px Arial";
ctx.fillText("ELO "+elo,900,y);

ctx.fillStyle="#facc15";
ctx.fillText(rank,1150,y);

const barWidth=elo*2;
ctx.fillStyle="#22c55e";
ctx.fillRect(320,y+10,Math.min(barWidth,450),6);

y+=70;
}

ctx.fillStyle="#64748b";
ctx.font="20px Arial";
ctx.textAlign="center";
ctx.fillText("Competitive Ranked System",width/2,850);

res.set("Content-Type","image/png");
canvas.createPNGStream().pipe(res);

});

app.listen(3000,()=>console.log("Ranked API running"));