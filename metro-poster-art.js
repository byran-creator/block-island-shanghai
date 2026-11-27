// Public Shanghai city & public-service lightbox poster image; friends edition uses external JPEG asset.
export const METRO_POSTER_ASPECT=0.75;
export const PUBLIC_METRO_POSTER_URL='./assets/public-metro-poster.jpg';
export const FRIENDS_METRO_POSTER_URL='./assets/friends-metro-poster.jpg';

export function createShanghaiCityPosterCanvas(){
 if(typeof document==='undefined'||typeof document.createElement!=='function')return null;
 const canvas=document.createElement('canvas');
 canvas.width=512;canvas.height=680;
 const ctx=canvas.getContext?.('2d');
 if(!ctx)return null;
 const w=512,h=680;
 const sky=ctx.createLinearGradient?.(0,0,0,h);
 sky?.addColorStop?.(0,'#0c2238');
 sky?.addColorStop?.(.52,'#14425a');
 sky?.addColorStop?.(.82,'#1f5c63');
 sky?.addColorStop?.(1,'#0e2636');
 ctx.fillStyle=sky||'#14425a';ctx.fillRect(0,0,w,h);

 // Soft warm halo behind skyline
 const halo=ctx.createRadialGradient?.(w*.5,h*.44,18,w*.5,h*.44,230);
 if(halo){
  halo.addColorStop?.(0,'rgba(246,204,118,.38)');
  halo.addColorStop?.(.6,'rgba(92,196,204,.12)');
  halo.addColorStop?.(1,'rgba(12,34,56,0)');
  ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
 }

 // Outer Art Deco double gold frame
 ctx.strokeStyle='#e8c474';ctx.lineWidth=3;ctx.strokeRect(18,18,w-36,h-36);
 ctx.strokeStyle='rgba(232,196,116,.55)';ctx.lineWidth=1.2;ctx.strokeRect(26,26,w-52,h-52);

 // Top badge
 ctx.fillStyle='rgba(232,196,116,.16)';
 ctx.fillRect(156,52,200,32);
 ctx.strokeStyle='#e8c474';ctx.lineWidth=1;ctx.strokeRect(156,52,200,32);
 ctx.fillStyle='#f8e3a8';ctx.textAlign='center';ctx.font='bold 15px "Microsoft YaHei",sans-serif';
 ctx.fillText('BLOCK ISLAND · 公益城市灯箱',w/2,73);

 // Main title
 ctx.fillStyle='#ffffff';ctx.font='bold 54px "STKaiti","KaiTi","Microsoft YaHei",serif';
 ctx.fillText('漫游申城',w/2,148);
 ctx.fillStyle='#ebd28f';ctx.font='bold 18px "Microsoft YaHei",sans-serif';
 ctx.fillText('SHANGHAI SKYLINE · 城市印象',w/2,184);

 // Subtle divider with white magnolia blossom accent
 ctx.strokeStyle='rgba(235,210,143,.55)';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.moveTo(96,210);ctx.lineTo(234,210);ctx.moveTo(278,210);ctx.lineTo(416,210);ctx.stroke();
 ctx.save();ctx.translate(256,210);ctx.fillStyle='#fff9eb';
 for(let i=0;i<6;i++){ctx.rotate(Math.PI/3);ctx.beginPath();ctx.ellipse(0,-8,3.6,7.5,0,0,Math.PI*2);ctx.fill();}
 ctx.fillStyle='#f2c65e';ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill();
 ctx.restore();

 // Iconic Lujiazui & Oriental Pearl golden-teal silhouette
 ctx.fillStyle='#0a1b2a';
 ctx.fillRect(58,390,34,110);
 ctx.fillRect(98,358,42,142);
 ctx.fillRect(148,376,36,124);
 // Oriental Pearl spire & spheres
 ctx.fillStyle='#133046';
 ctx.fillRect(200,318,12,182);
 ctx.fillRect(204,246,4,72);
 ctx.fillStyle='#f0b97a';
 ctx.beginPath();ctx.arc(206,336,15,0,Math.PI*2);ctx.fill();
 ctx.beginPath();ctx.arc(206,396,21,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#ffe6a8';
 ctx.beginPath();ctx.arc(206,282,7,0,Math.PI*2);ctx.fill();
 // Jin Mao, SWFC & Shanghai Tower silhouettes
 ctx.fillStyle='#0d2538';
 ctx.fillRect(256,314,34,186);
 ctx.fillRect(268,284,10,30);
 ctx.fillRect(306,292,42,208);
 ctx.fillStyle='#194a5e';ctx.fillRect(318,308,18,18);
 ctx.fillStyle='#0a1f30';
 ctx.beginPath();ctx.moveTo(364,500);ctx.lineTo(372,258);ctx.lineTo(408,274);ctx.lineTo(418,500);ctx.closePath();ctx.fill();
 ctx.fillRect(426,374,34,126);

 // Lit tower window stipples
 ctx.fillStyle='rgba(255,228,150,.75)';
 for(let y=326;y<486;y+=16){
  ctx.fillRect(264,y,6,6);ctx.fillRect(276,y,6,6);
  ctx.fillRect(316,y,8,6);ctx.fillRect(332,y,8,6);
  if(y>288)ctx.fillRect(382,y,6,8);
 }

 // Huangpu River wave bands
 const waveGrad=ctx.createLinearGradient?.(0,500,0,564);
 waveGrad?.addColorStop?.(0,'#1d6c7a');waveGrad?.addColorStop?.(1,'#0d3242');
 ctx.fillStyle=waveGrad||'#165363';ctx.fillRect(36,500,w-72,64);
 ctx.strokeStyle='rgba(255,232,168,.45)';ctx.lineWidth=2;
 for(let row=0;row<3;row++){
  const yy=516+row*16;ctx.beginPath();
  for(let x=46;x<=w-46;x+=12){const dy=Math.sin(x*.06+row)*3;if(x===46)ctx.moveTo(x,yy+dy);else ctx.lineTo(x,yy+dy);}
  ctx.stroke();
 }

 // Bottom public-service caption
 ctx.fillStyle='#f9eab9';ctx.font='bold 21px "Microsoft YaHei",sans-serif';
 ctx.fillText('南京路 · 外滩 · 陆家嘴 · 豫园',w/2,602);
 ctx.fillStyle='#9ad8de';ctx.font='16px "Microsoft YaHei",sans-serif';
 ctx.fillText('绿色出行 文明游览 · 发现水岸与老城厢之美',w/2,634);
 return canvas;
}
