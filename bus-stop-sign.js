import * as THREE from './three.module.js';

// Original, legible route artwork. Names describe the game's actual stops;
// the visual hierarchy follows Shanghai's white/red/green printed stop plates.
export function createBusStopSign({name,code,line,stations,yaw=0}){
 const root=new THREE.Group();root.name='shanghai-bus-stop-sign';root.rotation.y=yaw+Math.PI/2;
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=768;const c=canvas.getContext('2d');
 const text=(s,x,y,size,color='#294e40',align='left')=>{c.fillStyle=color;c.font=`600 ${size}px "Microsoft YaHei",sans-serif`;c.textAlign=align;c.fillText(s,x,y);};
 c.fillStyle='#f4f1e9';c.fillRect(0,0,1024,768);c.fillStyle='#b13332';c.fillRect(25,25,205,163);text(code,127,142,100,'#fff','center');
 text(line,267,87,58);text('SHANGHAI · CITY LOOP',268,139,25);text(name,38,268,67,'#a53832');
 c.fillStyle='#315940';c.fillRect(25,305,974,307);text('停 靠 站 序',55,350,26,'#e8e9d5');
 const spacing=800/Math.max(2,stations.length),start=512-spacing*(stations.length-1)/2;
 stations.forEach((station,i)=>{const x=start+i*spacing,current=station===name;if(current){c.fillStyle='#e6c771';c.fillRect(x-5,377,10,10);}Array.from(station).forEach((ch,j)=>text(ch,x,416+j*36,32,current?'#ffe9a5':'#f4f1df','center'));});
 text('行驶方向',42,668,29,'#a53832');c.fillStyle='#ac3935';c.fillRect(220,650,725,8);for(let i=0;i<28;i++)c.fillRect(918+i,626+i,2,56-i*2);
 text('环线循环 · 请候车停稳后上车',42,725,32);text('小岛观光接驳',980,725,23,'#697b6e','right');
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.generateMipmaps=true;
 const plate=new THREE.MeshBasicMaterial({map:texture}),metal=new THREE.MeshLambertMaterial({color:'#85918d'}),dark=new THREE.MeshLambertMaterial({color:'#35453f'}),box=new THREE.BoxGeometry(1,1,1);
 const part=(material,x,y,z,sx,sy,sz)=>{const m=new THREE.Mesh(box,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.userData.range=100;root.add(m);};
 for(const x of [-1.16,1.16]){part(metal,x,1.8,0,.075,3.6,.075);part(dark,x,.045,0,.28,.09,.24);}
 part(dark,0,2.48,0,2.29,1.78,.10);for(const y of [1.57,3.39])part(metal,0,y,0,2.42,.065,.14);
 for(const x of [-1.17,1.17])part(metal,x,2.48,0,.055,1.85,.14);
 const geometry=new THREE.PlaneGeometry(2.22,1.67);
 for(const side of [-1,1]){const mesh=new THREE.Mesh(geometry,plate);mesh.position.set(0,2.48,side*.061);mesh.rotation.y=side<0?Math.PI:0;mesh.userData.panel=true;mesh.userData.range=100;root.add(mesh);}
 root.userData.busStop={name,code,line,stations:[...stations]};return root;
}
