import * as THREE from './three.module.js';

// Align length to the slope while keeping width horizontal. A shortest-arc
// rotation from Z to an inclined X vector also banks the deck across its width.
export function roadSegmentOrientation(direction){
 const forward=direction.clone().normalize(),right=new THREE.Vector3(0,1,0).cross(forward).normalize(),up=forward.clone().cross(right).normalize();
 return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,up,forward));
}
