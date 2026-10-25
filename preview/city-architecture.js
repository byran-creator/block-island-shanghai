// Reference-guided massing, separate from plot coordinates and save data.
import {riverCenter,BUND_SHIFT} from './shanghai-map.js';
// Stable per plot: rebuilding or reloading never randomizes the city.
function plotSeed(id){let seed=2166136261;for(const c of id)seed=Math.imul(seed^c.charCodeAt(0),16777619);return seed>>>0;}
const historicForms=['lane','warehouse','terrace','courtyard','deco'];
const modernForms=['slab','setback','chamfer','split','lantern','slope'];
const glassColors=['#497c94','#83a6b8','#527b80','#a3b1be','#546c86','#b7c3ca'];
const stoneColors=['#d5d3c9','#adb3b9','#a59787','#e3daca','#b5b0aa','#b97f68'];
const namedForms={'ifc-north':'chamfer','ifc-south':'chamfer','boc-pudong':'slope','aurora':'slab','shangrila-river':'terrace','shangrila-grand':'setback','bank-shanghai':'lantern','stock':'split'};
const namedColors={'ifc-north':'#82a4b3','ifc-south':'#82a4b3','boc-pudong':'#557e89','shangrila-river':'#c4c9c9','shangrila-grand':'#b5bdc2','magnolia':'#acc2cf'};
export function buildingStyle(b){
 const seed=plotSeed(b.id),generic=/back|infill|front/.test(b.id),westBlock=b.bank==='west'&&generic,depth=riverCenter(b.z)-BUND_SHIFT-b.x;
 // Inland blocks mix older mid-rise buildings with occasional modern offices on both sides.
 const modern=westBlock?depth>145&&seed%5<2:b.bank==='east'&&!['convention','mall'].includes(b.kind)||b.kind==='glass';
 const forms=westBlock&&depth>100?['terrace','courtyard','deco']:historicForms;
 const form=b.form??namedForms[b.id]??(generic?(modern?modernForms[seed%modernForms.length]:forms[seed%forms.length]):modern?modernForms[seed%modernForms.length]:'landmark');
 const northForeground=b.bank==='east'&&generic&&b.x<213&&b.z<70;
 const massHeight=b.district==='historic-block'?b.h:westBlock?(depth<100?8+seed%8:depth<145?14+seed%12:modern?28+seed%15:17+seed%14):northForeground?Math.min(b.h,34+seed%5):b.h;
 const height=form==='lane'?Math.min(massHeight,7+seed%4):form==='warehouse'?Math.min(massHeight,10+seed%5):massHeight;
 return {seed,form,modern,height,wall:modern?(b.kind==='hotel'?9:11):form==='warehouse'||form==='lane'?8:[9,3,6][seed%3],
  trim:modern&&seed%3===0?3:9,roof:form==='lane'?4:form==='warehouse'?8:3,
  color:namedColors[b.id]??(b.kind==='gold'?'#b59c54':modern?glassColors[(seed>>>8)%glassColors.length]:stoneColors[seed%stoneColors.length]),
  floor:modern?4+(seed>>>6)%3:3,spacing:form==='warehouse'?4:modern?2+(seed>>>2)%2:3};
}
// Cross sections stay within the old footprint; the ground-floor lobby stays accessible.
export function buildingSection(b,s,level){
 let rx=b.rx,rz=b.rz,cut=0,notch=false;const t=level/s.height;
 if(level>=5){
  if(s.form==='slab'){if(s.seed%2)rx=Math.max(2,rx-2);else rz=Math.max(2,rz-2);}
  if(s.form==='setback'||s.form==='deco'||s.form==='terrace'){const inset=t>.82?2:t>.58?1:0;rx=Math.max(2,rx-inset);rz=Math.max(2,rz-inset);}
  if(s.form==='chamfer'||s.form==='lantern')cut=Math.min(2,rx-1,rz-1);
  if(s.form==='split')notch=true;
  if(s.form==='slope'&&t>.68)rx=Math.max(2,rx-Math.floor((t-.68)*10));
 }
 return {rx,rz,cut,notch};
}
export function sectionContains(q,dx,dz){
 return Math.abs(dx)<=q.rx&&Math.abs(dz)<=q.rz&&Math.abs(dx)+Math.abs(dz)<=q.rx+q.rz-q.cut&&!(q.notch&&Math.abs(dx)<=1&&dz>=q.rz-1);
}
// Merge voxel boundary cells into flat facade runs, including cut corners and recesses.
export function facadeRuns(q){
 const edges=new Map(),runs=[];
 for(let dx=-q.rx;dx<=q.rx;dx++)for(let dz=-q.rz;dz<=q.rz;dz++)if(sectionContains(q,dx,dz)){
  for(const [a,c]of [[1,0],[-1,0],[0,1],[0,-1]])if(!sectionContains(q,dx+a,dz+c)){
   const axis=a?'x':'z',side=a||c,at=a?dx:dz,key=`${axis}:${side}:${at}`;
   if(!edges.has(key))edges.set(key,{axis,side,at,values:[]});edges.get(key).values.push(a?dz:dx);
  }
 }
 for(const {axis,side,at,values}of edges.values()){
  values.sort((a,b)=>a-b);let start=values[0],end=start;
  const emit=()=>runs.push({axis,side,at,from:start,to:end,width:end-start+1,xx:axis==='x'?at+side*.515:(start+end)/2,zz:axis==='z'?at+side*.515:(start+end)/2,angle:axis==='x'?side*Math.PI/2:side>0?0:Math.PI});
  for(const value of values.slice(1)){if(value>end+1){emit();start=value;}end=value;}emit();
 }
 return runs;
}
export function buildArchitecture(w,b,s){
 const {x,z}=b;
 for(let level=0;level<s.height;level++){
  const q=buildingSection(b,s,level),next=buildingSection(b,s,level+1),y=26+level;
  for(let dx=-q.rx;dx<=q.rx;dx++)for(let dz=-q.rz;dz<=q.rz;dz++){
   if(!sectionContains(q,dx,dz))continue;
   const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,c])=>!sectionContains(q,dx+a,dz+c));
   if(!edge){if(!sectionContains(next,dx,dz))w.set(x+dx,y,z+dz,s.trim);continue;}
   const along=Math.abs(dx)===q.rx?dz:dx,window=level%s.floor>=1&&level%s.floor<=2&&(along+s.seed)%s.spacing===0;
   const pier=along%4===0,band=level%s.floor===0;
   w.set(x+dx,y,z+dz,s.modern?(level<5||pier||band?s.trim:s.wall):window?11:band&&s.form!=='lane'?s.trim:s.wall);
  }
 }
 const q=buildingSection(b,s,s.height-1),top=26+s.height;
 for(let dx=-q.rx;dx<=q.rx;dx++)for(let dz=-q.rz;dz<=q.rz;dz++)if(sectionContains(q,dx,dz))w.set(x+dx,top,z+dz,s.roof);
 if(s.form==='lane'||s.form==='warehouse'){
  const ridgeAlongX=s.seed%2===0,half=ridgeAlongX?q.rz:q.rx;
  for(let step=0;step<=half;step++)for(let dx=-q.rx;dx<=q.rx;dx++)for(let dz=-q.rz;dz<=q.rz;dz++)
   if(Math.abs(ridgeAlongX?dz:dx)<=half-step)w.set(x+dx,top+step,z+dz,s.roof);
  w.fill(x+q.rx-1,top+1,z-q.rz+1,x+q.rx-1,top+4,z-q.rz+1,8);
 }else if(s.form==='deco'||s.form==='lantern'){
  w.fill(x-1,top+1,z-1,x+1,top+4,z+1,s.trim);w.set(x,top+5,z,9);
 }else{
  w.fill(x-1,top+1,z-1,x+1,top+2,z+1,3);
  if(s.form==='terrace'||s.form==='courtyard')for(const dx of [-q.rx+1,q.rx-1])w.fill(x+dx,top+1,z-q.rz+1,x+dx,top+1,z+q.rz-1,5);
 }
 if(s.form==='courtyard'&&q.rx>=4&&q.rz>=4)w.fill(x-1,top,z-1,x+1,top+1,z+1,11);
}
