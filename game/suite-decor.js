// Original block furnishings inspired by Fairmont's photographed Sassoon Suite.
// Keep the central arrival, lift and balcony aisles free of new furniture.
export function decorateSuite(s,i,cube){
 const oak=i?'#8a7765':'#493022',trim=i?'#bdac89':'#a98a57',cream='#eee1c6',plum=i?'#728d91':'#614052',back=-s.view*(s.rx-.68);
 const part=(c,x,y,z,w,h,d,solid=false)=>cube(s,c,x,y,z,w,h,d,solid);
 const frame=(x,y,z,w,h,wall)=>{const inward=z>0?-1:1;part(trim,x,y,z,w,h,.06);part(oak,x,y,z+inward*.045,w-.12,h-.12,.055);if(wall){part('#baa684',x,y,z+inward*.08,w-.3,h-.3,.025);}};
 // Oak panels, narrow mouldings and cornices on the solid walls.
 for(let z=-s.rz+1.1;z<s.rz-.7;z+=1.15){part(oak,back,1.85,z,.075,3.65,1.08);part(trim,back+s.view*.045,1.85,z,.035,2.7,.96);part(oak,back+s.view*.07,1.85,z,.04,2.57,.83);}
 for(const side of [-1,1]){const z=side*(s.rz-.68);for(let x=-s.rx+1.2;x<s.rx-.6;x+=1.3){if(side===-1&&Math.abs(x)<1.8)continue;frame(x,1.9,z,1.18,2.9,false);}part(trim,0,3.56,z,s.rx*2-1,.15,.12);part(oak,0,.12,z,s.rx*2-1,.22,.1);}
 // Coffered ceiling and warm cove edges, rather than an empty slab.
 part(cream,0,3.72,0,s.rx*2-1,.035,s.rz*2-1);
 for(const x of [-s.rx+1.1,0,s.rx-1.1])part(oak,x,3.64,0,.2,.18,s.rz*2-1);
 for(const z of [-s.rz+1.1,0,s.rz-1.1]){part(oak,0,3.64,z,s.rx*2-1,.18,.2);part('#ffe4a4',0,3.52,z,s.rx*2-1.4,.035,.045);}
 for(let x=-s.rx+1;x<s.rx;x+=.65)part(i?'#bcab92':'#977855',x,.029,0,.022,.015,s.rz*2-1);
 // Floral/geometric carpet motifs and a border, all merged with the static room.
 for(const x of [-1.33,1.33])part(trim,x,.064,.5,.06,.012,3.5);
 for(const z of [-1.18,2.18])part(trim,0,.064,z,2.65,.012,.06);
 for(let x=-.9;x<=.9;x+=.6)for(let z=-.7;z<=1.8;z+=.6){const m=part('#c7b694',x,.068,z,.16,.01,.16);m.rotation.y=Math.PI/4;for(const dx of [-.16,.16])part('#8e6770',x+dx,.068,z,.1,.01,.1);}
 // Pleated drapes are gathered at the edges so the skyline stays visible.
 for(const side of [-1,1]){const z=side*(s.rz-1.1);for(let n=0;n<5;n++)part(n%2?plum:'#89736e',s.view*(s.rx-.5),1.8,z+(n-2)*.14,.22,3.45,.13);part(trim,s.view*(s.rx-.64),1.4,z,.07,.1,.68);part(trim,s.view*(s.rx-.5),3.59,z,.3,.1,.8);}
 const bedX=-s.view*(s.rx-1.7),bedZ=-s.rz+2;
 // Upholstered headboard, bedside cabinets, shades and a padded bench.
 for(let x=-.85;x<=.85;x+=.42)for(const y of [1.1,1.48]){part('#b8a17c',bedX+x,y,bedZ-1.06,.39,.34,.09);part(trim,bedX+x,y,bedZ-.995,.025,.025,.02);}
 for(const side of [-1,1]){const x=bedX+side*1.65;part(oak,x,.48,bedZ-.75,.62,.85,.65,true);part(trim,x,.55,bedZ-.405,.16,.04,.035);part(trim,x,1.12,bedZ-.75,.07,.5,.07);part('#ffedbe',x,1.47,bedZ-.75,.48,.4,.45);}
 part(plum,bedX,.48,bedZ+1.7,2.15,.28,.5,true);for(const dx of [-.82,.82])part(oak,bedX+dx,.2,bedZ+1.7,.08,.36,.35);
 for(const dx of [-.65,.65])part(plum,bedX+dx,1.07,bedZ-.66,.35,.23,.16);
 // Window-side reading chairs, cushions and the sofa's carved base.
 const sx=s.view*(s.rx-2),sz=s.rz-2.7;
 part(oak,sx,.14,sz,1.3,.17,2.08);for(const dz of [-.55,.55])part(plum,sx,.84,sz+dz,.63,.32,.47);
 const chairX=s.view*(s.rx-1.6),chairZ=-.9;part(cream,chairX,.48,chairZ,.8,.7,.8,true);part(plum,chairX,.85,chairZ-.35,.8,.6,.14);for(const dx of [-.4,.4])part(oak,chairX+dx,.62,chairZ,.12,.4,.86);
 // A small tea tray and flowers on the existing coffee table.
 const tx=sx-s.view*1.45;part('#243d43',tx,.66,sz,.58,.05,.7);for(const dz of [-.19,.19]){part('#f5edda',tx,.78,sz+dz,.14,.18,.14);part('#724b31',tx,.875,sz+dz,.09,.014,.09);}part('#315c76',tx,.94,sz+.32,.17,.48,.17);for(const dx of [-.18,0,.18]){part('#648263',tx+dx,1.17,sz+.32,.035,.38,.035);part('#eaccc0',tx+dx,1.38,sz+.32,.18,.13,.18);}
 // Cabinet, books, a framed landscape and bathroom mirror/vanity details.
 const desk=-s.view*(s.rx-1.2);for(let n=0;n<5;n++)part(['#586b66','#95695e','#d3b689'][n%3],desk+(n-2)*.14,1.32,1.88,.11,.24+(n%2)*.08,.22);
 frame(s.view*2.7,2.35,s.rz-.86,2.25,1.2,true);part('#536d75',s.view*2.7,2.35,s.rz-.97,1.86,.81,.026);part('#9dbaa9',s.view*2.7,2.12,s.rz-.99,1.86,.23,.015);
 const bathX=-s.view*(s.rx-1.7),bathZ=s.rz-1.6;for(const dz of [-.58,.58])part(cream,bathX,.87,bathZ+dz,2.3,.12,.19);for(const dx of [-1.03,1.03])part(cream,bathX+dx,.87,bathZ,.19,.12,1.2);
 part(trim,back+s.view*.12,2.4,bathZ,.06,1.2,1.3);part('#a6c0c2',back+s.view*.16,2.4,bathZ,.035,1.05,1.12);part('#ffe6b3',back+s.view*.2,3.13,bathZ,.11,.13,1.35);
 // Tiered crystal chandelier; lowest pieces remain above walking headroom.
 for(const width of [1.65,1.05]){const y=width>1.2?2.91:2.57;for(const side of [-1,1]){part(trim,side*width/2,y,0,.07,.07,width);part(trim,0,y,side*width/2,width,.07,.07);}for(const x of [-width/2,0,width/2])for(const z of [-width/2,width/2])part('#f5ecd7',x,y-.19,z,.09,.32,.09);}
}
