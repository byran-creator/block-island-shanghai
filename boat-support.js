// Boat geometry and support share local coordinates, including during turns.
export function boatLocal(root,x,z){const dx=x-root.position.x,dz=z-root.position.z,a=root.rotation.y;return {x:dx*Math.cos(a)-dz*Math.sin(a),z:dx*Math.sin(a)+dz*Math.cos(a)};}
export function boatWorld(root,p){const a=root.rotation.y;return {x:root.position.x+p.x*Math.cos(a)+p.z*Math.sin(a),z:root.position.z-p.x*Math.sin(a)+p.z*Math.cos(a)};}
export function boatSurfaces(ferry,boats=[]){return [{root:ferry,top:2.34,rx:2.45,rz:4.5},{root:ferry,top:3.53,rx:2,rz:1.45,z:-2.8},...boats.flatMap(b=>[{root:b.root,top:.7,rx:1.15,rz:2.7},{root:b.root,top:2.01,rx:.95,rz:1.425}])];}
export function boatSupport(surfaces,x,y,z){return surfaces.map(s=>({...s,local:boatLocal(s.root,x,z),y:s.root.position.y+s.top})).filter(s=>Math.abs(s.local.x)<s.rx-.15&&Math.abs(s.local.z-(s.z??0))<s.rz-.15&&y>=s.y-.2).sort((a,b)=>b.y-a.y)[0]??null;}
export function boatSolid(surfaces,x,y,z){return surfaces.some(s=>{const p=boatLocal(s.root,x,z),h=s.root.position.y+s.top;return Math.abs(p.x)<s.rx+.29&&Math.abs(p.z-(s.z??0))<s.rz+.29&&y<h-.002&&y+1.75>h-.2;});}
