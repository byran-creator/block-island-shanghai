import * as THREE from './three.module.js';

// Twelve of the 44 private cars change appearance. Route, speed and the
// existing .72 x 1.32 collision half-extents remain entirely traffic-owned.
export function cityCarAppearance(route,index){
 const selected={bund:{1:'lime',4:'gt-red',6:'champagne'},lujiazui:{0:'fastback-silver',3:'orange'},pudong:{1:'gt-wine',4:'executive'},bridge:{2:'fastback-white',7:'formal'},'north-bund':{2:'cyan',5:'fastback-blue'},'north-pudong':{4:'pearl'}};
 return selected[route]?.[index]??null;
}
const colors={lime:'#a5d72f',orange:'#f78b31',cyan:'#36b7c8',pearl:'#deded6',executive:'#253340',champagne:'#c7b99a',formal:'#161e28','gt-red':'#c92e39','gt-wine':'#842738','fastback-silver':'#aebec9','fastback-white':'#eee9d8','fastback-blue':'#427bb6'},models=new Map(),lampGeometries=new Map();
let atlas,bodyMaterial,lampMaterial;

// Original 256x64 pixel atlas: paint, Y/round/bar lamps, engine slats,
// side intakes, alloy wheels, grille and plate. Shared by every special car;
// no downloaded photography, per-car canvases, transparent layers or lights.
function materials(){
 if(bodyMaterial)return;
 const data=new Uint8Array(256*64*4),put=(x,y,c)=>{const i=(y*256+x)*4;data.set([...c,255],i);};
 for(let tile=0;tile<16;tile++)for(let y=0;y<32;y++)for(let x=0;x<32;x++){
  let c=[255,255,255];
  if(tile===1){c=[20,30,36];if(x>3&&x<29&&(Math.abs(y-16)<2&&x<17||Math.abs(y-(16-(x-16)*.65))<2&&x>=15||Math.abs(y-(16+(x-16)*.65))<2&&x>=15))c=[255,245,203];}
  if(tile===2){c=[27,34,39];if(y>11&&y<19&&x>2&&x<30)c=[219,54,52];}
  if(tile===3)c=y%6<2?[87,101,109]:[25,35,42];
  if(tile===4)c=x>4&&x<27&&y>4&&y<28&&x+y>15&&y-x<21?[17,29,35]:[73,91,97];
  if(tile===5){const dx=x-15.5,dy=y-15.5,r=Math.hypot(dx,dy),spoke=Math.abs(Math.sin(Math.atan2(dy,dx)*5));c=r<13&&(r>10||r<4||spoke<.23)?[185,201,207]:[33,43,49];}
  if(tile===6)c=y%5<1&&x%5<3?[78,94,100]:[22,32,39];
  if(tile===7)c=y>8&&y<24&&x>2&&x<30?(y>13&&y<19&&x%5<2?[215,232,240]:[35,83,137]):[20,28,34];
  if(tile===8){const r=Math.hypot(x-15.5,y-15.5);c=r<13?(r>10?[197,216,222]:[253,245,211]):[27,37,44];}
  if(tile===9)c=y>11&&y<21&&x>2&&x<30?[255,244,211]:[24,34,41];
  if(tile===10)c=x%5<2?[192,203,204]:[20,29,36];
  if(tile===11)c=y>12&&y<18?[255,240,209]:[26,34,40];
  put(tile%8*32+x,Math.floor(tile/8)*32+y,c);
 }
 atlas=new THREE.DataTexture(data,256,64);atlas.colorSpace=THREE.SRGBColorSpace;atlas.magFilter=THREE.NearestFilter;atlas.minFilter=THREE.NearestFilter;atlas.generateMipmaps=false;atlas.needsUpdate=true;
 bodyMaterial=new THREE.MeshLambertMaterial({map:atlas,vertexColors:true});
 lampMaterial=new THREE.MeshBasicMaterial({map:atlas,vertexColors:true});
}
function geometryBuilder(){
 const positions=[],uvs=[],colors=[];
 function quad(points,color='#ffffff',tile=0,frontUV=false){
  const c=new THREE.Color(color),u=(tile%8*32+.5)/256,v=(Math.floor(tile/8)*32+.5)/64,w=31/256,h=31/64,uv=frontUV?[[u,v],[u,v+h],[u+w,v+h],[u+w,v]]:[[u,v],[u+w,v],[u+w,v+h],[u,v+h]];
  for(const i of [0,1,2,0,2,3]){positions.push(...points[i]);uvs.push(...uv[i]);colors.push(c.r,c.g,c.b);}
 }
 function box(x,y,z,w,h,d,color,tile=0){
  const a=x-w/2,b=x+w/2,l=y-h/2,t=y+h/2,f=z-d/2,r=z+d/2;
  quad([[a,l,f],[a,t,f],[b,t,f],[b,l,f]],color,tile,true);quad([[a,l,r],[b,l,r],[b,t,r],[a,t,r]],color,tile);
  quad([[a,l,f],[a,l,r],[a,t,r],[a,t,f]],color,tile);quad([[b,l,f],[b,t,f],[b,t,r],[b,l,r]],color,tile);
  quad([[a,t,f],[a,t,r],[b,t,r],[b,t,f]],color,tile);quad([[a,l,f],[b,l,f],[b,l,r],[a,l,r]],color,tile);
 }
 function finish(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeVertexNormals();g.computeBoundingBox();return g;}
 return {quad,box,finish};
}
function model(style){
 const g=geometryBuilder(),paint=colors[style],formal=style==='formal',executive=formal||['executive','champagne'].includes(style),fastback=style.startsWith('fastback-'),gt=style.startsWith('gt-'),wedge=!executive&&!fastback&&!gt,roof=executive?1.19:fastback?1.12:1.04,glass='#6f9eaf';
 g.box(0,.33,0,1.3,.24,2.5,'#25333a');
 // Faceted low bonnet and rear deck, retaining the city's block silhouette.
 const sections=executive?[[-1.25,.59,.69],[-.88,.65,.72],[.55,.65,.73],[1.25,.59,.68]]:fastback?[[-1.25,.52,.51],[-.88,.63,.7],[.55,.65,.67],[1.25,.52,.55]]:gt?[[-1.25,.53,.48],[-.88,.63,.66],[.55,.65,.64],[1.25,.54,.53]]:[[-1.25,.57,.47],[-.88,.65,.64],[.55,.65,.66],[1.25,.59,.57]];
 for(let i=1;i<sections.length;i++){
  const [z0,w0,h0]=sections[i-1],[z1,w1,h1]=sections[i];
  g.quad([[-w0,h0,z0],[-w0,.4,z0],[-w1,.4,z1],[-w1,h1,z1]],paint);
  g.quad([[w0,.4,z0],[w0,h0,z0],[w1,h1,z1],[w1,.4,z1]],paint);
  g.quad([[-w0,h0,z0],[-w1,h1,z1],[w1,h1,z1],[w0,h0,z0]],paint);
 }
 g.box(0,executive?.55:.47,-1.252,1.05,executive?.29:.19,.016,paint);g.box(0,.47,1.252,1.08,.22,.016,paint);
 g.box(0,.34,-1.27,1.24,.08,.04,'#25333a');g.box(0,.34,1.27,1.24,.08,.04,'#25333a');
 const front=gt?-.47:executive?-.61:-.68,rear=fastback?1.05:.85,rf=formal?-.37:executive?-.28:gt?.04:-.15,rr=formal?.56:executive?.49:fastback?.35:.38,belt=executive?.74:.66;
 g.quad([[-.52,belt,front],[-.44,roof,rf],[.44,roof,rf],[.52,belt,front]],glass);
 g.quad([[-.52,belt,rear],[.52,belt,rear],[.44,roof,rr],[-.44,roof,rr]],glass);
 g.quad([[-.44,roof,rf],[-.44,roof,rr],[.44,roof,rr],[.44,roof,rf]],paint);
 for(const side of [-1,1]){
  const points=[[side*.52,belt,front],[side*.52,belt,rear],[side*.44,roof,rr],[side*.44,roof,rf]];
  g.quad(side<0?points:points.toReversed(),glass);
  g.box(side*.485,(roof+belt)/2,.16,.045,roof-belt,.045,paint);
  g.box(side*.64,.4,.02,.05,.08,1.5,paint);
  if(wedge)g.box(side*.65,.54,.44,.018,.19,.42,'#ffffff',4);
  else {g.box(side*.655,.62,.05,.012,.025,1.72,executive?'#c5cbca':paint);g.box(side*.658,.66,.29,.015,.03,.17,'#c4cecf');}
  g.box(side*.56,.72,-.36,.17,.07,.14,paint);
  for(const z of [-.79,.8]){g.box(side*.62,.25,z,.18,.48,.48,'#263137');g.box(side*.714,.25,z,.008,.32,.32,'#ffffff',5);}
  g.box(side*.4,fastback?.63:executive?.62:.49,-1.266,fastback?.25:.35,fastback?.25:.13,.012,wedge?'#b9c6cb':'#ffffff',fastback?8:executive?9:gt?11:1);
  g.box(side*.4,.54,1.266,.36,.13,.012,'#ffffff',2);
 }
 g.box(0,.4,1.275,.28,.14,.012,'#ffffff',7);
 if(executive){g.box(0,.55,-1.276,formal?.4:.45,formal?.33:.21,.018,'#bfc9ce');g.box(0,.55,-1.288,formal?.34:.39,formal?.28:.16,.008,'#ffffff',formal?10:6);if(formal)g.box(0,.74,-.99,.51,.035,.48,'#84919c');}
 else if(wedge){g.box(0,.68,.94,.7,.025,.4,'#ffffff',3);g.box(0,.74,1.09,1.09,.06,.14,'#25333a');}
 else if(fastback){g.box(0,.59,1.27,1.03,.04,.014,'#b73a43');g.box(0,.69,1,.73,.022,.15,'#ffffff',3);}
 else g.box(0,.39,-1.276,.61,.12,.014,'#ffffff',6);
 const tile=fastback?8:executive?9:gt?11:1;
 if(!lampGeometries.has(tile)){const lamps=geometryBuilder();lamps.box(0,0,0,fastback?.25:.35,fastback?.25:.13,.012,'#ffffff',tile);lampGeometries.set(tile,lamps.finish());}
 return {body:g.finish(),lamps:lampGeometries.get(tile),lampY:fastback?.63:executive?.62:.49};
}
export function createCitySpecialCar(style){
 if(!Object.hasOwn(colors,style))throw new Error('Unknown city car appearance: '+style);
 materials();if(!models.has(style))models.set(style,model(style));const cached=models.get(style),root=new THREE.Group(),lights=[];
 root.name='city-car-'+style;root.userData.appearance=style;
 const body=new THREE.Mesh(cached.body,bodyMaterial);body.userData.range=285;body.userData.rgbColors=true;root.add(body);
 for(const side of [-1,1]){const lamp=new THREE.Mesh(cached.lamps,lampMaterial);lamp.position.set(side*.4,cached.lampY,-1.279);lamp.userData.range=285;root.add(lamp);lights.push(lamp);}
 return {root,lights};
}
