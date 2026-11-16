// Boat geometry and support share local coordinates, including during turns.
export function boatLocal(root,x,z){const dx=x-root.position.x,dz=z-root.position.z,a=root.rotation.y,c=Math.cos(a),s=Math.sin(a);return {x:dx*c-dz*s,z:dx*s+dz*c};}
export function boatWorld(root,p){const a=root.rotation.y;return {x:root.position.x+p.x*Math.cos(a)+p.z*Math.sin(a),z:root.position.z-p.x*Math.sin(a)+p.z*Math.cos(a)};}
export function boatSurfaces(ferry,boats=[]){return [{root:ferry,top:2.34,rx:2.45,rz:4.5},{root:ferry,top:3.53,rx:2,rz:1.45,z:-2.8},...boats.flatMap(b=>b.deckSurfaces?b.deckSurfaces.map(s=>({...s,root:b.root})):[{root:b.root,top:.7,rx:1.15,rz:2.7},{root:b.root,top:2.01,rx:.95,rz:1.425}])];}
function height(s,p){return Math.max(s.minTop??-Infinity,Math.min(s.maxTop??Infinity,s.top+(s.slopeZ??0)*(p.z-(s.z??0))+(s.slopeX??0)*(p.x-(s.x??0))));}
function inHole(s,p){return s.holes?.some(h=>p.x>h.x1&&p.x<h.x2&&p.z>h.z1&&p.z<h.z2);}
function surfaceReach(s,padding){return Math.abs(s.x??0)+Math.abs(s.z??0)+Math.max(0,s.rx+padding)+Math.max(0,s.rz+padding);}
function outside(s,x,z,padding=0){const reach=surfaceReach(s,padding);return Math.abs(x-s.root.position.x)>reach||Math.abs(z-s.root.position.z)>reach;}
export function boatSupport(surfaces,x,y,z){let best=null,root=null,local;for(const s of surfaces){if(s.solidOnly||s.active&&!s.active()||outside(s,x,z,Math.max(0,-(s.edgeInset??.15))))continue;if(root!==s.root){root=s.root;local=boatLocal(root,x,z);}const p=local;if(Math.abs(p.x-(s.x??0))>=s.rx-(s.edgeInset??.15)||Math.abs(p.z-(s.z??0))>=s.rz-(s.edgeInset??.15)||inHole(s,p))continue;const top=height(s,p),h=s.root.position.y+top;if(y>=h-.2&&(!best||h>best.y))best={...s,top,local:p,y:h};}return best;}
export function boatSolid(surfaces,x,y,z){let root=null,local;for(const s of surfaces){if(s.active&&!s.active()||outside(s,x,z,s.padding??.29))continue;if(root!==s.root){root=s.root;local=boatLocal(root,x,z);}const p=local,h=s.root.position.y+height(s,p);if(!inHole(s,p)&&Math.abs(p.x-(s.x??0))<s.rx+(s.padding??.29)&&Math.abs(p.z-(s.z??0))<s.rz+(s.padding??.29)&&y<h-.002&&y+1.75>h-(s.solidHeight??.2))return true;}return false;}

// Owned surface descriptions are static. Read the vessel's live position on
// every query and keep the original door, slope and collision checks nearby.
export function createBoatSurfaceQueries(surfaces){
 const vessels=[];
 for(const s of surfaces){
  let vessel=vessels.at(-1);
  if(vessel?.root!==s.root){vessel={root:s.root,surfaces:[],solidReach:0,supportReach:0};vessels.push(vessel);}
  vessel.surfaces.push(s);
  vessel.solidReach=Math.max(vessel.solidReach,surfaceReach(s,s.padding??.29));
  if(!s.solidOnly)vessel.supportReach=Math.max(vessel.supportReach,surfaceReach(s,Math.max(0,-(s.edgeInset??.15))));
 }
 function close(v,x,z,reach){
  const p=v.root.position;
  return Math.abs(x-p.x)<=reach&&Math.abs(z-p.z)<=reach;
 }
 return {
  support(x,y,z){
   let best=null;
   for(const v of vessels){
    if(!close(v,x,z,v.supportReach))continue;
    const candidate=boatSupport(v.surfaces,x,y,z);
    if(candidate&&(!best||candidate.y>best.y))best=candidate;
   }
   return best;
  },
  solid(x,y,z){
   for(const v of vessels)if(close(v,x,z,v.solidReach)&&boatSolid(v.surfaces,x,y,z))return true;
   return false;
  }
 };
}
