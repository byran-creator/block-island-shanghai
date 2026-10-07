// Original artwork based on Shanghai Metro's 2025 Lujiazui wayfinding photos.
export function metroSignCanvasSize(w,h){const height=Math.min(256,Math.round(4096*h/w));return {width:Math.round(height*w/h),height};}
const WHITE='#f5f5ee',YELLOW='#ffdb43';
export function paintMetroSign(ctx,lines,{width=1024,height=256,line2=true,arrow='',exit=null,pictogram='',sections=null,layout='guide',separatorColor=YELLOW}={}){
 ctx.fillStyle='#171a1b';ctx.fillRect(0,0,width,height);ctx.textAlign='left';ctx.textBaseline='alphabetic';
 const h=height,pad=h*.14;
 function label(text,x,y,size,color,max){ctx.font=`${size}px "Microsoft YaHei",Arial,sans-serif`;const measured=ctx.measureText?.(text).width??text.length*size*.58;if(measured>max)ctx.font=`${size*max/measured}px "Microsoft YaHei",Arial,sans-serif`;ctx.fillStyle=color;ctx.fillText(text,x,y);}
 function direction(a,x,color,scale=1){if(!a)return;ctx.fillStyle=color;const cy=h*.5,r=h*.25*scale,t=h*.09*scale;
  if(typeof ctx.beginPath!=='function'){label(a,x-r,cy+r,r*2,color,r*2);return;}
  const points=a==='←'?[[r,-t],[0,-t],[0,-r],[-r,0],[0,r],[0,t],[r,t]]:a==='→'?[[-r,-t],[0,-t],[0,-r],[r,0],[0,r],[0,t],[-r,t]]:a==='↓'?[[-t,-r],[t,-r],[t,0],[r,0],[0,r],[-r,0],[-t,0]]:[[-t,r],[t,r],[t,0],[r,0],[0,-r],[-r,0],[-t,0]];
  ctx.beginPath();points.forEach(([dx,dy],i)=>(i?ctx.lineTo:ctx.moveTo).call(ctx,x+dx,cy+dy));ctx.closePath();ctx.fill();
 }
 function badge(x){const b=h*.68,y=h*.16;ctx.fillStyle=WHITE;ctx.fillRect(x,y,b,b);ctx.fillStyle='#92c83e';ctx.fillRect(x+h*.012,y+h*.012,b-h*.024,b-h*.024);label('2',x+h*.12,h*.75,h*.61,'#152219',b);return b;}
 if(layout==='entrance'){
  const b=h*.36,x=pad,y=h*.13;ctx.fillStyle=WHITE;ctx.fillRect(x,y,b,b);ctx.fillStyle='#92c83e';ctx.fillRect(x+h*.012,y+h*.012,b-h*.024,b-h*.024);label('2',x+h*.065,h*.435,h*.31,'#152219',b);
  label(lines[0],x+b+h*.1,h*.36,h*.32,WHITE,width-x-b-pad-h*.1);
  label(lines[1],x+b+h*.1,h*.54,h*.14,WHITE,width-x-b-pad-h*.1);
  ctx.fillStyle='#555f5b';ctx.fillRect(pad,h*.65,width-pad*2,h*.014);ctx.textAlign='center';label(lines[2]+'号口  EXIT',width/2,h*.89,h*.2,WHITE,width-pad*2);ctx.textAlign='left';return;
 }
 if(layout==='station'){
  ctx.fillStyle='#f8f9f5';ctx.fillRect(0,0,width,height);ctx.fillStyle='#a3d43e';ctx.fillRect(0,h*.13,width,h*.11);ctx.textAlign='right';label('Line 2',width-pad,h*.225,h*.09,'#fff',h);ctx.textAlign='left';
  if(ctx.arc&&ctx.stroke){const x=pad+h*.05,y=h*.066,r=h*.05;ctx.fillStyle='#b6362b';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=h*.018;ctx.beginPath();ctx.moveTo(x-r*.7,y);ctx.lineTo(x-r*.32,y-r*.3);ctx.lineTo(x,y+r*.08);ctx.lineTo(x+r*.32,y-r*.3);ctx.lineTo(x+r*.7,y);ctx.stroke();}
  label('上海地铁  Shanghai Metro',pad+h*.14,h*.105,h*.075,'#1a2121',width-pad*2-h*.14);
  ctx.textAlign='center';label(lines[0],width/2,h*.63,h*.32,'#11191a',width-pad*2);label(lines[1]??'',width/2,h*.89,h*.17,'#11191a',width-pad*2);ctx.textAlign='left';return;
 }
 if(layout==='arrival'){
  label('下一班 / NEXT TRAIN',pad,h*.33,h*.2,WHITE,width-pad*2);label(lines[1]??'',pad,h*.78,h*.38,YELLOW,width-pad*2);return;
 }
 if(layout==='route'){
  ctx.fillStyle='#fbfcf7';ctx.fillRect(0,0,width,height);const forward=lines[2]!=='-1',names=['人民广场','南京东路','陆家嘴','浦东南路','世纪大道'],english=['People\'s Square','East Nanjing Rd.','Lujiazui','Pudong Rd. (S)' ,'Century Ave.'],green='#90c93d';
  label('2号线  Line 2',pad,h*.17,h*.12,'#152219',width*.15);label(forward?'南京东路 → 陆家嘴':'陆家嘴 → 南京东路',width*.18,h*.17,h*.16,'#152219',width*.42);label('下一站 '+lines[1],width*.64,h*.17,h*.14,'#152219',width*.34);
  const start=width*.1,step=width*.2,cy=h*.52;ctx.fillStyle='#c4c8c6';ctx.fillRect(start,cy-h*.035,step*4,h*.07);ctx.fillStyle=green;ctx.fillRect(start+step,cy-h*.035,step,h*.07);
  names.forEach((name,i)=>{const x=start+i*step,active=name===lines[0]||name===lines[1],color=i===1||i===2?'#17201c':'#737a76';ctx.fillStyle=active&&(i===1||i===2)?green:'#b5bdb8';if(ctx.arc){ctx.beginPath();ctx.arc(x,cy,h*(name===lines[1]?.085:.055),0,Math.PI*2);ctx.fill();ctx.fillStyle='#fbfcf7';ctx.beginPath();ctx.arc(x,cy,h*.033,0,Math.PI*2);ctx.fill();}else ctx.fillRect(x-h*.05,cy-h*.05,h*.1,h*.1);ctx.textAlign='center';const y=i%2?h*.79:h*.32;label(name,x,y,h*.115,color,step*.9);label(english[i],x,y+h*.105,h*.069,color,step*.95);});ctx.textAlign='left';direction(forward?'→':'←',start+step*1.5,green,.25);label('绿色为可乘坐体验区间 · 灰色站暂未开放',pad,h*.98,h*.063,'#68706a',width-pad*2);return;
 }
 const modules=sections??[{zh:lines[0]??'',en:lines[1]??'',line2,arrow,exit,pictogram}],sum=modules.reduce((n,s)=>n+(s.weight??1),0);let left=0;
 modules.forEach((s,i)=>{
  const span=width*(s.weight??1)/sum,right=left+span-pad,color=s.color??(s.exit!==undefined&&s.exit!==null?YELLOW:WHITE);let x=left+pad;
  if(i){ctx.fillStyle=separatorColor;ctx.fillRect(left-h*.013,h*.13,h*.025,h*.74);}
  if(s.arrow){direction(s.arrow,x+h*.26,color);x+=h*.68;}
  if(s.line2){x+=badge(x)+h*.13;}
  if(s.exit!==undefined&&s.exit!==null){const number=String(s.exit),size=h*.61;ctx.font=`${size}px Arial,sans-serif`;const actual=ctx.measureText?.(number).width??number.length*size*.58;label(number,x,h*.75,size,color,right-x-h);x+=Math.min(actual,Math.max(0,right-x-h))+h*.16;label(s.zh||'出口',x,h*.5,h*.32,color,right-x);label(s.en||'EXIT',x,h*.78,h*.19,color,right-x);}
  else {if(s.pictogram){ctx.fillStyle=WHITE;ctx.fillRect(x,h*.23,h*.44,h*.51);ctx.fillStyle='#171a1b';ctx.fillRect(x+h*.07,h*.29,h*.3,h*.36);ctx.fillStyle=WHITE;ctx.fillRect(x+h*.13,h*.15,h*.18,h*.05);x+=h*.61;}
   label(s.zh,x,h*.5,h*.4,color,right-x);label(s.en??'',x,h*.79,h*.22,color,right-x);
  }
  left+=span;
 });
}
