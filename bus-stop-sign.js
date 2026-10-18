import * as THREE from './three.module.js';

// Double-faced street pole. Route details describe the game's actual service.
export function createBusStopSign({name,code,line,stations,yaw=0}){
 const root=new THREE.Group();root.name='shanghai-bus-stop-sign';root.rotation.y=yaw+Math.PI/2;
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=1024;const c=canvas.getContext('2d');
 const text=(s,x,y,size,color='#264e45',align='left')=>{c.fillStyle=color;c.font=`600 ${size}px "Microsoft YaHei",sans-serif`;c.textAlign=align;c.fillText(s,x,y);};
 c.fillStyle='#f4f4ec';c.fillRect(0,0,512,1024);c.fillStyle='#24594e';c.fillRect(0,0,512,235);
 // Original bus pictogram, legible without loading any external artwork.
 c.fillStyle='#f5f5e9';c.fillRect(53,44,118,123);c.fillRect(66,163,23,19);c.fillRect(137,163,23,19);
 c.fillStyle='#24594e';c.fillRect(65,64,94,56);c.fillRect(68,139,20,12);c.fillRect(136,139,20,12);
 text('公交',320,123,68,'#fff','center');text('BUS STOP',320,171,26,'#d5e3dc','center');
 text(name,256,301,name.length>6?47:56,'#264e45','center');
 text(name==='南京路步行街'?'NANJING ROAD':name==='滨江候车点'?'RIVERSIDE':'LUJIAZUI',256,344,23,'#687b72','center');
 c.fillStyle='#b43c38';c.fillRect(28,383,143,86);text(code,100,446,52,'#fff','center');
 text(line,195,422,35);text('观光环线',195,458,25,'#66796f');c.fillStyle='#d4dfd6';c.fillRect(28,500,456,2);
 text('本站',38,555,25,'#b43c38');text(name,38,603,40);
 const at=stations.indexOf(name),next=stations.length>1?stations[(Math.max(0,at)+1)%stations.length]:name;
 c.fillStyle='#b43c38';c.fillRect(48,634,5,57);c.fillRect(40,680,21,5);
 text('下一站  ↓',86,668,27,'#677c71');text(next,86,718,36);
 c.fillStyle='#24594e';c.fillRect(0,787,512,237);
 text(stations.length>1?'环线循环停靠':'陆家嘴区内循环',256,838,30,'#fff','center');
 text('请在路边候车',256,891,32,'#fff','center');text('停稳后靠近车门 · V 上车',256,941,26,'#e1e9de','center');text('小岛观光接驳',256,988,21,'#c3d6ca','center');
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const plate=new THREE.MeshBasicMaterial({map:texture}),metal=new THREE.MeshLambertMaterial({color:'#8c9992'}),dark=new THREE.MeshLambertMaterial({color:'#254b42'}),box=new THREE.BoxGeometry(1,1,1);
 const part=(material,x,y,z,sx,sy,sz)=>{const m=new THREE.Mesh(box,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.userData.range=100;root.add(m);};
 part(dark,0,.075,0,.48,.15,.42);part(metal,0,1.8,0,.12,3.6,.12);
 part(dark,0,2.38,0,1.19,2.31,.13);part(metal,0,3.57,0,1.25,.065,.17);
 for(const x of [-.59,.59])part(metal,x,2.38,0,.035,2.31,.17);
 const geometry=new THREE.PlaneGeometry(1.12,2.24);
 for(const side of [-1,1]){const mesh=new THREE.Mesh(geometry,plate);mesh.position.set(0,2.38,side*.077);mesh.rotation.y=side<0?Math.PI:0;mesh.userData.panel=true;mesh.userData.range=100;root.add(mesh);}
 root.userData.busStop={name,code,line,stations:[...stations]};return root;
}
