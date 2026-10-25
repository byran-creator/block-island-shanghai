import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
const mats=new Map(),box=new THREE.BoxGeometry(1,1,1),ball=new THREE.SphereGeometry(1,12,8),disc=new THREE.CylinderGeometry(1,1,1,20);
const material=c=>{if(!mats.has(c))mats.set(c,new THREE.MeshLambertMaterial({color:c}));return mats.get(c);};
export const SHOP_PRODUCTS={
 mooncake:{name:'鲜肉月饼',food:2},
 bun:{name:'生煎包',food:2},
 gift:{name:'海派明信片礼盒',food:0},
 watch:{name:'老字号怀表时计',food:0},
 jewelry:{name:'传世金玉首饰',food:0},
 pastry:{name:'海派传统名点',food:2},
 delicacy:{name:'经典海派风味',food:2},
 art_scroll:{name:'朵云金石翰墨',food:0},
 silk:{name:'锦绣绫罗绸缎',food:0},
 camera:{name:'老上海光影典藏',food:0},
 herb:{name:'同德堂道地草本',food:1},
 glasses:{name:'复古金丝眼镜',food:0},
 perfume:{name:'经典香氛晶瓶',food:0},
 tea:{name:'经典海派名茶',food:2},
 casket:{name:'传世金漆宝匣',food:0},
 vase:{name:'景德镇御瓷瓶',food:0}
};

export const BRAND_PRODUCTS={
 '永安百货':{product:'perfume',name:'永安香氛晶瓶',food:0,craft:'环球名品 · 始于1918'},
 '先施公司':{product:'gift',name:'先施摩登礼盒',food:0,craft:'摩登百货 · 始于1917'},
 '沈大成':{product:'pastry',name:'沈大成海派名点',food:2,craft:'海派糕团 · 始于1875'},
 '老凤祥':{product:'jewelry',name:'老凤祥传世金玉',food:0,craft:'传世金艺 · 始于1848'},
 '泰康食品':{product:'delicacy',name:'泰康风味礼盒',food:2,craft:'万国风味 · 始于1914'},
 '亨达利钟表':{product:'watch',name:'亨达利怀表时计',food:0,craft:'精密时计 · 始于1864'},
 '朵云轩':{product:'art_scroll',name:'朵云金石翰墨',food:0,craft:'艺苑翰墨 · 始于1900'},
 '和平饭店':{product:'tea',name:'和平饭店经典茶饮',food:2,craft:'爵士名饮 · 始于1929'},
 '第一食品':{product:'delicacy',name:'第一食品风味礼盒',food:2,craft:'海派名产 · 始于1954'},
 '培丽丝绸':{product:'silk',name:'培丽锦绣绫罗',food:0,craft:'锦绣丝绸 · 始于1930'},
 '冠生园':{product:'pastry',name:'冠生园特色甜品',food:2,craft:'海派蜜饯 · 始于1915'},
 '邵万生':{product:'delicacy',name:'邵万生糟醉风味',food:2,craft:'糟醉名产 · 始于1852'},
 '王开照相':{product:'camera',name:'王开光影典藏',food:0,craft:'光影纪实 · 始于1923'},
 '蔡同德堂':{product:'herb',name:'蔡同德堂道地草本',food:1,craft:'道地药材 · 始于1884'},
 '亨得利钟表':{product:'watch',name:'亨得利精密钟表',food:0,craft:'名表典藏 · 始于1915'},
 '茂昌眼镜':{product:'glasses',name:'茂昌复古金丝镜',food:0,craft:'精密验配 · 始于1923'}
};

// Individually removable servings. Merge inside each item, never across stock units.
export function createProduct(kind,{meal=false}={}){
 const root=new THREE.Group();root.name='product-'+kind;root.userData.product=kind;
 const part=(geometry,c,x,y,z,w,h,d)=>{const m=new THREE.Mesh(geometry,material(c));m.position.set(x,y,z);m.scale.set(w,h,d);root.add(m);return m;};
 const cube=(...a)=>part(box,...a),round=(...a)=>part(disc,...a),sphere=(...a)=>part(ball,...a);
 const plate=(x=0,z=0,r=.42)=>{round('#f6f0de',x,.035,z,r,.05,r);round('#d8bd81',x,.068,z,r*.91,.015,r*.91);round('#fff9e9',x,.081,z,r*.86,.018,r*.86);};
 if(kind==='gift'){
  cube('#c35759',0,.11,0,.61,.22,.43);cube('#f6e7ca',0,.23,0,.56,.02,.4);
  for(let i=0;i<4;i++){cube(['#3d8792','#d3ac72','#71807d'][i%3],0,.249+i*.013,0,.49,.011,.32);cube('#e6dbc3',-.15+i*.07,.27+i*.013,-.04,.04,.014,.21);}
  cube('#ecdcb8',0,.13,-.223,.28,.09,.01);
 }else if(['mooncake','bun'].includes(kind)){
  plate();sphere(kind==='mooncake'?'#cf9350':'#f1dbb2',0,.18,0,.29,.11,.29);round('#a76b35',0,.1,0,.25,.035,.25);
  if(kind==='mooncake'){for(let i=0;i<9;i++)cube('#e9b16b',(i%3-1)*.12,.27,(Math.floor(i/3)-1)*.12,.085,.016,.025);}else{for(let i=0;i<8;i++){const a=i*Math.PI/4,m=cube('#ded1ab',Math.cos(a)*.12,.275,Math.sin(a)*.12,.15,.017,.024);m.rotation.y=-a;}for(let i=0;i<7;i++)cube(i%2?'#456b35':'#fff0bd',Math.cos(i*2.4)*.2,.27,Math.sin(i*2.4)*.2,.023,.018,.023);}
 }else if(kind==='watch'){
  round('#5e121b',0,.05,0,.34,.08,.34);round('#caa54f',0,.11,0,.25,.04,.25);
  round('#fdfcf7',0,.135,0,.21,.015,.21);cube('#241d17',.02,.15,0,.08,.02,.012);cube('#241d17',0,.15,-.03,.012,.02,.07);
  cube('#caa54f',0,.12,-.27,.05,.03,.05);cube('#2e1f14',.28,.12,-.1,.16,.22,.1);round('#caa54f',.28,.15,-.04,.07,.015,.07);
 }else if(kind==='jewelry'){
  cube('#1d1713',0,.06,0,.58,.08,.42);cube('#7a1a24',0,.11,0,.52,.03,.36);
  cube('#d4af37',-.12,.15,0,.22,.06,.11);cube('#fed156',-.12,.20,0,.18,.05,.09);
  round('#2d8253',.12,.15,0,.11,.03,.11);round('#d4af37',.12,.14,0,.13,.015,.13);
  cube('#a82424',.12,.14,.16,.03,.02,.12);sphere('#f6f0e6',.12,.17,-.08,.035,.035,.035);
 }else if(kind==='pastry'){
  plate(0,0,.44);sphere('#5f8b44',-.14,.15,-.1,.12,.09,.12);sphere('#aa5038',.14,.15,-.1,.12,.09,.12);
  cube('#d69d4d',-.02,.17,.12,.24,.05,.14);cube('#fff6dc',-.02,.20,.12,.20,.015,.10);
 }else if(kind==='delicacy'){
  cube('#851820',-.08,.15,0,.38,.26,.32);cube('#caa54f',-.08,.29,0,.40,.03,.34);
  cube('#fed156',-.08,.15,0,.05,.27,.33);cube('#fed156',-.08,.15,0,.39,.27,.05);
  round('#f4eee0',.18,.12,-.05,.11,.20,.11);round('#961e1e',.18,.23,-.05,.12,.04,.12);
 }else if(kind==='art_scroll'){
  round('#3f5d50',-.1,.08,.08,.06,.44,.06);round('#d6ecd9',-.1,.08,-.15,.07,.03,.07);round('#d6ecd9',-.1,.08,.31,.07,.03,.07);
  cube('#252526',.14,.05,-.06,.22,.06,.26);cube('#0f0f10',.14,.07,-.10,.14,.03,.10);
  cube('#1a1715',.14,.09,.09,.04,.03,.14);cube('#caa54f',.14,.11,.09,.03,.01,.06);
  cube('#3a2616',-.05,.07,-.14,.32,.02,.02);
 }else if(kind==='silk'){
  cube('#341b10',0,.03,0,.58,.04,.44);
  round('#b32434',-.15,.12,0,.08,.40,.08);round('#caa54f',-.15,.12,0,.085,.04,.085);
  round('#25754f',.02,.12,0,.08,.40,.08);round('#caa54f',.02,.12,0,.085,.04,.085);
  round('#224480',.18,.12,0,.08,.40,.08);round('#caa54f',.18,.12,0,.085,.04,.085);
  round('#caa54f',-.06,.24,0,.075,.38,.075);
 }else if(kind==='camera'){
  cube('#1f2123',-.08,.14,0,.28,.18,.16);cube('#121314',-.08,.14,.01,.26,.14,.165);
  cube('#bcc2c6',-.08,.24,0,.28,.04,.16);round('#caa54f',.02,.27,0,.03,.04,.03);
  round('#caa54f',-.08,.14,.11,.07,.09,.07);round('#3f7380',-.08,.14,.16,.05,.02,.05);
  cube('#291a10',.18,.16,-.04,.03,.26,.22);cube('#e4ded0',.16,.16,-.04,.015,.22,.18);
 }else if(kind==='herb'){
  cube('#3c2014',-.08,.16,0,.36,.28,.24);
  for(const dx of [-.09,.09])for(const dy of [.08,.16,.24])cube('#caa54f',-.08+dx,dy,.125,.04,.015,.015);
  round('#7e9d8e',.18,.12,-.05,.10,.20,.10);round('#8c4820',.18,.23,-.05,.09,.04,.09);
  round('#caa54f',.16,.06,.12,.09,.08,.09);cube('#7e6220',.18,.14,.12,.025,.14,.025);
 }else if(kind==='glasses'){
  cube('#18241d',0,.06,0,.46,.08,.36);
  round('#caa54f',-.10,.14,0,.075,.02,.075);round('#d6f0f5',-.10,.14,0,.065,.015,.065);
  round('#caa54f',.10,.14,0,.075,.02,.075);round('#d6f0f5',.10,.14,0,.065,.015,.065);
  cube('#caa54f',0,.15,0,.06,.015,.015);cube('#caa54f',-.18,.13,-.09,.015,.015,.18);cube('#caa54f',.18,.13,-.09,.015,.015,.18);
  cube('#301511',0,.10,-.12,.38,.06,.12);
 }else if(kind==='perfume'){
  cube('#caa54f',0,.04,0,.52,.03,.38);cube('#d4e8ee',0,.055,0,.48,.01,.34);
  cube('#cf8f3b',-.12,.14,0,.13,.16,.13);cube('#caa54f',-.12,.24,0,.05,.05,.05);
  round('#dc919f',.10,.13,.04,.08,.15,.08);sphere('#caa54f',.10,.22,.04,.04,.04,.04);
  cube('#70b7ca',.04,.12,-.08,.09,.13,.09);round('#caa54f',.04,.20,-.08,.04,.03,.04);
 }else if(kind==='noodles'){
  round('#f8f3df',0,.1,0,.45,.18,.45);round('#7d5730',0,.2,0,.39,.025,.39);
  for(let i=0;i<15;i++){const m=cube('#e6c887',(i%5-2)*.13,.23+Math.floor(i/5)*.015,(Math.floor(i/5)-1)*.16,.11,.028,.31);m.rotation.y=Math.sin(i*2)*.45;}
  for(let i=0;i<8;i++)cube('#548241',Math.sin(i*2)*.24,.29,Math.cos(i*2)*.24,.11,.024,.025);
 }else if(kind==='rice'){
  plate(0,0,.48);round('#7b3924',0,.09,0,.37,.035,.37);
  for(let i=0;i<6;i++){const x=(i%3-1)*.2,z=(Math.floor(i/3)-.5)*.23;cube('#78391e',x,.21,z,.17,.22,.18);cube('#ba7b45',x,.255,z,.175,.035,.185);cube('#e2bf8c',x,.2,z,.175,.033,.185);}
  for(const x of [-.4,.4])sphere('#557e39',x,.13,.07,.1,.05,.17);
  round('#f4efda',.72,.12,0,.25,.23,.25);sphere('#fcf5de',.72,.24,0,.23,.085,.23);
 }else if(kind==='tea'){
  plate();for(const x of [-.2,.2]){cube('#dfb07b',x,.15,0,.26,.16,.25);cube('#f5e5bf',x,.19,0,.26,.035,.25);sphere('#a34039',x,.255,0,.07,.035,.08);}
  round('#f4efde',.65,.13,0,.17,.23,.17);round('#946b39',.65,.251,0,.145,.012,.145);round('#f6eedb',.65,.025,0,.24,.03,.24);
 }else if(kind==='casket'){
  cube('#481216',0,.12,0,.54,.24,.38);cube('#caa54f',0,.245,0,.56,.025,.4);
  cube('#caa54f',0,.13,.195,.08,.12,.015);round('#241814',0,.13,.2,.03,.02,.03);
  for(const sx of [-.23,.23])for(const sz of [-.15,.15])cube('#caa54f',sx,.12,sz,.04,.22,.04);
 }else if(kind==='vase'){
  round('#302016',0,.03,0,.32,.06,.32);round('#caa54f',0,.065,0,.3,.02,.3);
  round('#e8f2f4',0,.24,0,.26,.32,.26);round('#22557e',0,.24,0,.265,.04,.265);
  round('#e8f2f4',0,.43,0,.14,.16,.14);round('#caa54f',0,.52,0,.19,.03,.19);
 }
 if(meal){for(const z of [.49,.55])cube('#3c2b22',.1,.035,z,1.03,.024,.025);cube('#eee6d1',-.66,.06,0,.25,.1,.32);}
 batchMeshes(root,staticMeshes(root),'product-detail');return root;
}
