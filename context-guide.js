// Device-local, optional tutorials. Gameplay and saved journey state are untouched.
const KEY='block-island-context-guide-v1';
export function createContextGuide({document,storage}){
 let seen={};try{const v=JSON.parse(storage?.getItem(KEY)||'{}');if(v&&typeof v==='object')seen=v;}catch{}let current=null,age=0,sample=0,distance=0,previous=null,playTime=0,cooldown=0;
 const panel=document.createElement('div');panel.className='context-guide';panel.hidden=true;panel.setAttribute('role','status');panel.innerHTML='<strong></strong><span></span><div><button type="button" data-guide-dismiss>知道了</button><button type="button" data-guide-skip>跳过引导</button></div>';document.body.appendChild(panel);
 const title=panel.querySelector('strong'),body=panel.querySelector('span');
 const save=()=>{try{storage?.setItem(KEY,JSON.stringify(seen));}catch{}};
 function close(){if(current?.target)current.target.classList.remove('context-guide-target');document.body.classList.remove('context-guide-map');panel.hidden=true;current=null;age=0;}
 function mark(key){seen[key]=true;save();if(current?.key===key){close();cooldown=20;}}
 panel.querySelector('[data-guide-dismiss]').onclick=()=>{if(current)mark(current.key);};panel.querySelector('[data-guide-skip]').onclick=()=>{seen.skipped=true;save();close();};
 const configs={cursor:['释放鼠标','按一下 Alt 释放鼠标，就能点击“跳过引导”和地图；再按 Alt 或点击画面回到视角控制','cursor-toggle'],map:['地图与方向','蓝色箭头是你，黄色菱形是目标。打开右上角地图','map-button'],photo:['为游客留影','点击相机，切换拍景，把游客拍进画面即可','photo-open'],backpack:['旅行纪念','打开背包，可以查看纪念品和旅行手账','backpack-open'],run:['走得快一点','电脑按住 Shift 跑步；手机推远摇杆快走','touch-run'],fly:['换个视角','创造模式可切换飞行；电脑按 F，手机点击飞行模式','touch-fly'],fireworks:['浦江夜空','试试烟花按钮；电脑也可以按 K','firework-quick']};
 function show(key,touch){if(seen.skipped||seen[key]||current)return;const [heading,text,id]=configs[key];const target=document.getElementById(id);current={key,target};age=0;title.textContent=heading;body.textContent=key==='map'&&!touch?text+'，或按 M。':text+'。';panel.hidden=false;if(key==='map')document.body.classList.add('context-guide-map');target?.classList.add('context-guide-target');}
 function tick(dt,{playing=false,journey=null,pos=null,touch=false,creative=false,night=false,nearBund=false,quiet=false}={}){
  if(!playing||quiet){if(current){panel.hidden=true;document.body.classList.remove('context-guide-map');current.target?.classList.remove('context-guide-target');}return;}
  if(current){panel.hidden=false;current.target?.classList.add('context-guide-target');if(current.key==='map')document.body.classList.add('context-guide-map');age+=Math.max(0,Math.min(dt,.25));if(age>=12)mark(current.key);return;}
  if(seen.skipped)return;const delta=Math.max(0,Math.min(dt,.25));playTime+=delta;cooldown=Math.max(0,cooldown-delta);sample+=delta;if(sample<.25)return;sample=0;
  if(pos){if(previous){const d=Math.hypot(pos.x-previous.x,pos.z-previous.z);if(d<5)distance+=d;}previous={x:pos.x,z:pos.z};}
  if(cooldown>0)return;
  if(!touch&&journey?.phase==='journey'&&journey.index===1&&journey.tracked!==false&&!seen.cursor)show('cursor',touch);
  else if(journey?.phase==='journey'&&journey.index===1&&journey.tracked!==false&&!seen.map)show('map',touch);
  else if(journey?.phase==='journey'&&journey.touristPhoto==='ready'&&!seen.photo)show('photo',touch);
  else if((journey?.complete||journey?.journal?.stamps?.length>0)&&!seen.backpack)show('backpack',touch);
  else if(journey?.phase==='journey'&&journey.index<2&&distance>=18&&!seen.run)show('run',touch);
  else if(journey?.phase==='journey'&&journey.index>=2&&creative&&playTime>=45&&!seen.fly)show('fly',touch);
  else if(night&&nearBund&&playTime>=20&&!seen.fireworks)show('fireworks',touch);
 }
 function used(key){if(configs[key]){mark(key);if(key==='cursor')cooldown=0;}}
 return {tick,used,close,dispose(){close();panel.remove();},get current(){return current?.key??null;}};
}
