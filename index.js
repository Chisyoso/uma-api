const express=require("express");const{createCanvas,loadImage}=require("canvas");const app=express();

function getEmojiURL(rank){
if(!rank)return null;
const match=rank.match(/:(\d+)>/);
if(!match)return null;
return `https://cdn.discordapp.com/emojis/${match[1]}.png`;
}

async function drawCircleImage(ctx,img,x,y,size){
ctx.save();
ctx.beginPath();
ctx.arc(x+size/2,y+size/2,size/2,0,Math.PI*2);
ctx.closePath();
ctx.clip();
ctx.drawImage(img,x,y,size,size);
ctx.restore();
}

app.get("/leaderboard",async(req,res)=>{

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
ctx.fillText("RANKED E.M",width/2,90);

ctx.textAlign="left";

let y=170;

for(let i=1;i<=10;i++){

const team=req.query["team"+i]||"Unknown";
const elo=req.query["elo"+i]||"0";
const rank=req.query["rank"+i]||"";
const avatar=req.query["avatar"+i];

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

if(avatar){
try{
const img=await loadImage(avatar);
await drawCircleImage(ctx,img,290,y-30,50);
}catch{}
}

ctx.font="bold 30px Arial";
ctx.fillText(team,360,y);

ctx.fillStyle="#38bdf8";
ctx.font="28px Arial";
ctx.fillText("ELO "+elo,900,y);

const emojiURL=getEmojiURL(rank);

if(emojiURL){
try{
const emoji=await loadImage(emojiURL);
ctx.drawImage(emoji,1150,y-28,40,40);
}catch{}
}

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