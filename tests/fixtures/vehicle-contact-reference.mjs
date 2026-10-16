// Frozen pre-optimization narrow-phase oracle (main 65d92aa).
export function referencePenetration(v,x,y,z,a,o){
 const p=o.root.position;if(o.person&&o.root.visible===false)return 0;if(o.root===v.root||y>=p.y+(o.height??1.85)||y+1.7<=p.y)return 0;
 const dx=p.x-x,dz=p.z-z,c=Math.cos(a),s=Math.sin(a),side=dx*c-dz*s,front=dx*s+dz*c;
 if(o.person){const ex=Math.max(0,Math.abs(side)-v.halfWidth),ez=Math.max(0,Math.abs(front)-v.halfLength);return ex||ez?Math.max(0,.36-Math.hypot(ex,ez)):Math.min(v.halfWidth+.36-Math.abs(side),v.halfLength+.36-Math.abs(front));}
 const b=o.root.rotation.y,bc=Math.cos(b),bs=Math.sin(b),w=o.halfWidth??.88,l=o.halfLength??1.55;
 const radius=Math.hypot(v.halfWidth,v.halfLength)+Math.hypot(w,l)+.1;if(dx*dx+dz*dz>radius*radius)return 0;
 let depth=Infinity;for(const [nx,nz]of [[c,-s],[s,c],[bc,-bs],[bs,bc]]){const separation=Math.abs(dx*nx+dz*nz),reach=v.halfWidth*Math.abs(c*nx-s*nz)+v.halfLength*Math.abs(s*nx+c*nz)+w*Math.abs(bc*nx-bs*nz)+l*Math.abs(bs*nx+bc*nz);if(separation>=reach+.05)return 0;depth=Math.min(depth,reach+.05-separation);}return depth;
}
