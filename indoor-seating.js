// Shared indoor seats keep the player on the supported floor; only the camera lowers.
export function createIndoorSeating({seats,getPos,place,lookAt,clear,notify=()=>{}}){
 let current=null;
 const nearest=()=>{const p=getPos();return seats.filter(s=>Math.abs(p.y-s.y)<1&&Math.hypot(p.x-s.x,p.z-s.z)<2).sort((a,b)=>Math.hypot(p.x-a.x,p.z-a.z)-Math.hypot(p.x-b.x,p.z-b.z))[0];};
 function standUp(){if(!current)return false;const p=current.exits.find(clear);if(!p){notify('起身位置被挡住了，请先清理长椅旁的空间。');return false;}current=null;place({...p});return true;}
 return {nearest,isSeated:()=>!!current,leaveSeat(){current=null;},standUp,use(){if(current){standUp();return true;}const s=nearest();if(!s)return false;current=s;place({x:s.x,y:s.y,z:s.z});lookAt(s.target);notify(s.name+' · V 或移动键起身');return true;},safeSavePoint:()=>current?{...(current.exits.find(clear)??current.exits[0])}:null,cameraPose(yaw,pitch){if(!current)return null;const p=getPos(),position={x:p.x,y:p.y+1.08,z:p.z};return {position,focus:{x:p.x-Math.sin(yaw)*Math.cos(pitch),y:position.y+Math.sin(pitch),z:p.z-Math.cos(yaw)*Math.cos(pitch)}};}};
}
