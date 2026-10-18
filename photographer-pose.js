// The visitor's face and lens point down local -Z. Positive X shoulder
// rotation lifts hands forward; negative X put both hands behind the body.
export function posePhotographer(person,clock,dt,baseYaw){
 const t=(clock*.75+person.phase)%19,smooth=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);};
 const lift=t<3?0:t<4.4?smooth((t-3)/1.4):t<13?1:1-smooth((t-13)/1.5);
 const left=person.limbs.find(l=>l.side===-1)?.arm,right=person.limbs.find(l=>l.side===1)?.arm;
 for(const [arm,side]of [[left,1],[right,-1]])if(arm){arm.position.y=1.23;arm.rotation.set(.15+lift*1.85,0,side*lift*.4);}
 for(const limb of person.limbs)limb.leg.rotation.x=0;
 if(person.torso){person.torso.position.y=1;person.torso.rotation.x=0;}
 if(person.head){person.head.position.y=1.53;person.head.rotation.set(lift*.035,0,0);}
 person.root.position.y=26;person.root.rotation.y=baseYaw;
 if(person.camera){person.camera.visible=true;person.camera.position.set(.08*(1-lift),1.00+lift*.49,-.24-lift*.17);person.camera.rotation.set(0,0,0);}
 if(person.flash)person.flash.visible=t>8.15&&t<8.23;
 return lift;
}
