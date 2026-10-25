import {migrateWestBankPoint,CITY} from './shanghai-map.js';
const previousCity={jinmao:{x:159.5,z:62.5},swfc:{x:181.5,z:56.5},shanghai:{x:157.5,z:91.5}};
const revision10City={jinmao:{x:171.5,z:78.5},swfc:{x:197.5,z:90.5},shanghai:{x:169.5,z:106.5}};
export function migrateTrioPoint(p,source=previousCity){
 if(!p||p.y<25)return false;
 const room=Object.entries(source).filter(([,q])=>Math.abs(p.x-q.x)<=12&&Math.abs(p.z-q.z)<=13).sort(([,a],[,b])=>Math.hypot(p.x-a.x,p.z-a.z)-Math.hypot(p.x-b.x,p.z-b.z))[0];
 if(!room)return false;const [id,q]=room;p.x+=CITY[id].x-q.x;p.z+=CITY[id].z-q.z;return true;
}
export function migrateTowerPoint(p){
 if(!p||p.y<25)return false;
 if(Math.abs(p.x-165)<=4.5&&Math.abs(p.z-101)<=3.5){p.x+=5;p.z+=3;return true;}
 if(Math.abs(p.x-152.5)<=12&&Math.abs(p.z-85.5)<=13){p.x+=5;p.z+=6;return true;}
 return false;
}
// Clone first: loading an old save never changes the stored snapshot in place.
export function migrateWestBankSave(data){
 if(![5,6,7,8,9,10].includes(data?.mapRevision))return data;
 const copy=structuredClone(data);
 const move=p=>{if(data.mapRevision===10){if(p&&p.y>=25){const podium=[[146,79,4,5,0],[218,102,5,5,-3]].find(([x,z,rx,rz])=>Math.abs(p.x-x)<=rx&&Math.abs(p.z-z)<=rz);if(podium){p.x+=20;p.z+=podium[4];return;}}migrateTrioPoint(p,revision10City);return;}if([6,7].includes(data.mapRevision))migrateWestBankPoint(p);if(data.mapRevision<9)migrateTowerPoint(p);migrateTrioPoint(p);};
 move(copy.pos);
 copy.edits=copy.edits.map(([key,id])=>{if(typeof key!=='string')return [key,id];const [x,y,z]=key.split(',').map(Number),p={x,y,z};move(p);return [`${p.x},${p.y},${p.z}`,id];});
 if(copy.life){for(const f of copy.life.furniture??[])move(f);move(copy.life.home);}
 return copy;
}
