import {Box3,Group} from './three.module.js';

// Keep entrances/escalators visible. Only below-ground objects are omitted when
// the player cannot see a station through one of its nearby street openings.
export function createMetroVisuals(root,{getPos,exits,radius=45,canCull=()=>true}){
 const interior=new Group();interior.name='occluded-metro-interior';const box=new Box3();
 root.updateWorldMatrix(true,true);
 for(const child of [...root.children]){box.setFromObject(child);if(!box.isEmpty()&&box.max.y<24)interior.add(child);}
 root.add(interior);
 // Rendering cannot use hidden descendants. Keep simulation running and let
 // explicit getWorldPosition/updateWorldMatrix queries work as usual; rebuild
 // the complete branch on its first visible render after any hidden motion.
 const updateMatrices=interior.updateMatrixWorld;let skipped=false;
 interior.updateMatrixWorld=function(force){if(!this.visible){skipped=true;return;}updateMatrices.call(this,force||skipped);skipped=false;};
 // Street feet are y=26; the actual eye is above ground. Below y=25 the
 // player is on an entrance slope or underground and must see all interiors.
 function update(){const p=getPos();interior.visible=!canCull()||p.y<25||exits.some(e=>(p.x-e.x)**2+(p.z-e.z)**2<radius*radius);}
 update();return {interior,update};
}
