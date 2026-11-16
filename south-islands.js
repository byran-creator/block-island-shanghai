// The fictional islands sit beyond the city. Coordinates are shared by terrain,
// map labels, bridge approaches, parkour and revision-12 save migration.
export const SOUTH_ISLANDS = {
 forest:{x:223,z:362,radius:37,peak:35,noiseOffset:50,dx:-107,dz:103,arrival:{x:224,y:35,z:343,name:'翡翠林岛'}},
 mountain:{x:281,z:368,radius:19,peak:34,noiseOffset:108,dx:-49,dz:308,arrival:{x:281,y:34,z:369,name:'南部山岛'}},
 outer:{x:367,z:378,radius:19,peak:29,noiseOffset:149,dx:17,dz:23,arrival:{x:367,y:30,z:378,name:'远岛'}}
};

const formerIslands = [
 {id:'mountain',x:330,z:60,radius:31},
 {id:'forest',x:330,z:259,radius:37},
 {id:'outer',x:350,z:355,radius:21}
];

export function moveFormerEastIslandPoint(point) {
 if(!point||point.y<25||![point.x,point.y,point.z].every(Number.isFinite))return;
 const from=formerIslands.find(island=>Math.hypot(point.x-island.x,point.z-island.z)<island.radius);
 if(!from)return;
 const {dx,dz}=SOUTH_ISLANDS[from.id];
 const x=point.x+dx,z=point.z+dz;
 // Preserve coordinates for edits whose translated columns would leave the world.
 if(x>=400||z>=400)return;
 point.x=x;
 point.z=z;
}
