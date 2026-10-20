import {BLOCKS} from './world.js';
import {SHOP_PRODUCTS} from './city-products.js';

// Original small vector illustrations; no extra WebGL textures or frame work.
const art={
 food:'<path fill="#efc381" d="M10 34q0-20 22-20t22 20v14H10z"/><path d="m20 25 4 10m7-13 4 12m7-8 3 9"/>',
 raw:'<path fill="#dc9690" d="M12 32Q26 8 49 25L39 42Q20 51 12 32Z"/><path fill="#f8dccc" d="m49 25 9-7v27l-15-7"/><circle cx="23" cy="29" r="2"/>',
 wool:'<path fill="#f1e8d2" d="M12 42Q1 28 15 23q-1-17 17-11 17-6 20 12 15 6 2 21Q33 55 12 42Z"/><path d="M20 25q-5 10 7 12m9-15q14 3 7 15"/>',
 pearls:'<circle cx="32" cy="30" r="19" fill="#dddde6"/><circle cx="26" cy="24" r="9" fill="#fff8e7"/><path d="m12 53 20-6 20 6"/>',
 woodpick:'<path fill="#b07944" d="m16 53 8 3 21-37-7-4Z"/><path fill="#c79561" d="M9 20Q31 1 55 17l-4 8q-23-12-37 2Z"/>',
 stonepick:'<path fill="#a97848" d="m16 53 8 3 21-37-7-4Z"/><path fill="#b9c4c3" d="M9 20Q31 1 55 17l-4 8q-23-12-37 2Z"/>',
 fishingrod:'<path d="m13 54 24-42q19 3 13 31"/><path stroke="#e6d7b8" stroke-width="2" d="m50 21 1 23q0 12-7 8"/><path stroke="#bc8c54" stroke-width="6" d="m13 54 9-15"/>',
 sword:'<path fill="#bdcdd0" d="m18 42 26-33h10v10L27 47Z"/><path stroke="#dcb875" stroke-width="5" d="m13 36 20 17m-17 2 7-12"/>',
 dive:'<rect x="7" y="20" width="50" height="23" rx="8" fill="#59adbb"/><path d="M31 21v18m-18-9h12m14 0h12m-9 20q17 10 15-8V12"/>',
 glider:'<path fill="#66a9a8" d="M5 24Q32-2 59 24L32 39Z"/><path d="m5 24 27 29 27-29M20 15l12 38 12-38"/>',
 bed:'<path fill="#b47652" d="M8 15v40m48-24v24M8 46h48"/><path fill="#78b2ad" d="M10 28h44v16H10Z"/><path fill="#f4e7c9" d="M11 26h14v13H11Z"/>',
 chair:'<path fill="#be925e" d="M16 10h29v25H16Z"/><path d="M12 39h37M16 33v24m29-24v24M22 16v13m14-13v13"/>',
 table:'<path fill="#b88d5c" d="m8 22 31-9 18 14-31 10Z"/><path d="M10 24v27m44-24v24M26 37v21"/>',
 lamp:'<path fill="#c1e5b6" d="m15 29 8-20h18l8 20Z"/><path d="M32 30v24M20 55h24"/>',
 chest:'<path fill="#b48751" d="M9 19h46v34H9Z"/><path d="M9 31h46M17 19v34m30-34v34"/><path fill="#e5c275" d="M28 27h8v12h-8Z"/>',
 campfire:'<path fill="#dcd4bd" d="m7 50 9-8 10 4 9-3 16 1 7 8-25 5Z"/><path fill="#e7a052" d="M20 39Q8 29 31 8q-3 13 12 12 16 24-10 25Z"/><path fill="#f7d485" d="M29 41q-10-8 5-17 11 15-5 17Z"/>',
 bookshelf:'<path fill="#b48959" d="M10 9h44v47H10Z"/><path d="M12 31h40M20 14v13m8-13v13m11-13 5 13m-24 9v15m8-15v15m10-15v15"/>',
 planter:'<path fill="#a17a4e" d="M8 38h48l-5 16H13Z"/><path stroke="#83b978" d="M22 39V21m20 18V17"/><path fill="#83b978" d="M22 29Q5 26 12 15q13 0 10 14m19-4Q27 20 31 10q13 1 10 15m0 7q16-16 17-2-7 8-17 2"/>',
 gift:'<rect fill="#b65b65" x="8" y="22" width="48" height="33" rx="2"/><path fill="#ead9b3" d="M6 18h52v10H6Z"/><path d="M32 18v37m0-37Q8-5 13 12q5 9 19 6 23-22 20-6-3 9-20 6"/>',
 watch:'<circle fill="#d9b675" cx="32" cy="36" r="21"/><circle fill="#f4ead2" cx="32" cy="36" r="16"/><path d="M32 24v13l9 4m-14-27V8h10v6"/>',
 jewelry:'<path d="M12 15q0 35 20 37 20-2 20-37"/><path fill="#84b3a3" d="m32 31 10 10-10 13-10-13Z"/>',
 pastry:'<rect fill="#b65b65" x="5" y="34" width="54" height="21" rx="3"/><path fill="#eed0a0" d="M10 34V23q7-13 15 0v11m4 0V23q7-13 15 0v11m2 0V23q7-13 12 0v11"/>',
 art_scroll:'<path fill="#f3e4c8" d="M16 12h32v40H16Z"/><path d="M12 12h40M12 53h40m-28-8 8-20 10 20m-19-6 9-7 10 8"/>',
 silk:'<path fill="#9a7396" d="M11 12h41v32q-20 21-41 4Z"/><path stroke="#efd4aa" d="m18 20 6 6-6 6-6-6m26-9 6 6-6 6-6-6m-5 12 6 6-6 6-6-6"/>',
 camera:'<rect fill="#537277" x="7" y="21" width="50" height="33" rx="4"/><circle fill="#97c5c3" cx="33" cy="37" r="12"/><path d="M17 21v-7h15v7m14 7h5"/>',
 herb:'<path fill="#c6aa79" d="M14 28h36l4 26H10Z"/><path stroke="#77a875" d="M33 38V12"/><path fill="#77a875" d="M32 24Q11 18 20 9q15 0 12 15m1 7Q53 26 49 15q-16 0-16 16"/>',
 glasses:'<circle cx="17" cy="36" r="12" fill="#74a6ac"/><circle cx="47" cy="36" r="12" fill="#74a6ac"/><path d="M29 35h6M5 33l5-18h8m41 18-5-18h-8"/>',
 perfume:'<rect fill="#9cbbc5" x="16" y="25" width="32" height="30" rx="5"/><path fill="#ddc29a" d="M23 7h18v12H23Zm3 12h12v6H26Z"/><path fill="#f4e5c9" d="M22 35h20v12H22Z"/>',
 tea:'<path fill="#b9d2c3" d="M10 27h36v10q0 17-18 17T10 37Z"/><path d="M46 30q23-2 5 15M13 58h36M24 19q-7-5 0-12m10 12q-7-5 0-12"/>',
 casket:'<path fill="#ab5559" d="m9 22 24-11 22 10v30H9Z"/><path d="M9 30h46m-34-8h23M32 33v10"/>',
 vase:'<path fill="#b6d1d5" d="M24 8h16l-3 15q26 24 9 32H18Q1 47 27 23Z"/><path stroke="#537e9b" d="M19 38q13-12 26 1M18 47h28M25 14h14"/>',
 mooncake:'<circle fill="#d3a16a" cx="32" cy="34" r="23"/><circle cx="32" cy="34" r="17"/><path d="M22 24h20v20H22Zm10-5v30M17 34h30"/>',
 bun:'<path fill="#f1ddba" d="M7 38Q9 26 25 20l7-8 7 8q18 7 18 18 0 18-25 18T7 38Z"/><path d="m17 29 13-8m3 1v15m3-15 11 11"/>',
 souvenir:'<path fill="#e8dab8" d="M5 12h54v42H5Z"/><path fill="#678d89" d="M10 47V34l8-7 7 7v13m3 0V29l7-9 6 9v18m3 0V35l10-6v18"/><circle cx="16" cy="22" r="4" fill="#dcaa72"/><path d="M9 49h46"/>',
};
art.delicacy=art.pastry;
art.coin='<circle fill="#b9a16b" cx="32" cy="32" r="24"/><path fill="#435951" d="M25 25h14v14H25Z"/><path d="M17 21h6m19 0h5M14 33h5m26 0h5M20 45h5m15 0h5"/>';
art.jade='<ellipse cx="32" cy="33" rx="22" ry="24" fill="#85b2a0"/><ellipse cx="32" cy="31" rx="12" ry="15" fill="#264a48"/><path stroke="#c2dbc3" d="M16 29q-1-12 9-15"/>';
art.dragon='<path stroke="#dcaf61" stroke-width="7" d="M13 51q-9-17 13-19 25-1 16-15l-10-2 2-8m8 12 13-8m-14 6 13 8M22 34l-9-11m20 9 4 15m-12-6-4 13"/><circle fill="#f7e4bc" cx="43" cy="16" r="2"/>';
const urls=new Map(),blockIcons=new Map();
export function registerBlockIcon(id,src){if(BLOCKS[id]&&typeof src==='string'&&src.startsWith('data:image/png'))blockIcons.set(Number(id),src);}
export function itemIcon(key){
 if(key.startsWith('block:')&&blockIcons.has(Number(key.slice(6))))return blockIcons.get(Number(key.slice(6)));
 if(!urls.has(key)){const color=key.startsWith('block:')?BLOCKS[Number(key.slice(6))]?.color:null,shape=color?`<path fill="${color}" d="m9 18 23-9 23 9v29l-23 9-23-9Z"/><path d="m9 18 23 10 23-10M32 28v28"/>`:art[key]??art.gift;urls.set(key,'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g stroke="#5b5041" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" fill="none">${shape}</g></svg>`));}return urls.get(key);
}
const blockNotes=['适合铺设草坪。','常见的基础土料。','可制作石制工具与篝火。','可加工成木板，也用于工具和篝火。','为庭院补充绿意。','浅色地面与岸边装饰。','建造、家具和工具常用的木材。','用于墙面与铺装。','适合明亮的建筑饰面。','为建筑加入玫红色点缀。','带蓝色的玻璃建材。','带荧光色泽的装饰材料。'];
const resources={food:['熟食 / 浆果','恢复6点饥饿与2点生命，已满时不会消耗。','采摘浆果、购买餐点，或用篝火烤熟生鱼与生肉。','Z 食用'],raw:['生肉 / 生鱼','放入篝火烤熟后再吃；不会按 Z 直接食用。','生活岛动物与水边钓鱼。','篝火旁 G 放入，等30秒后 G 领取'],wool:['羊毛','制作床和滑翔伞的资源。','生活岛剪取羊毛，或领取委托奖励。','C 查看配方'],pearls:['海珍珠','制作晶石落地灯，也可以留作海底探索的纪念。','海底探索与部分城市委托。','C 查看配方']};
const gear={woodpick:'降低采集所需时间，共可使用32次。',stonepick:'更快地采集硬质方块，共可使用96次。',fishingrod:'站在水岸看向水面抛线，等咬钩后收竿。',sword:'生存夜间看向近处夜影反击。',dive:'穿戴后氧气上限提高到180秒。',glider:'在空中展开，延缓下落并滑翔。'};
const controls={woodpick:'看向可挖掘方块，按住 Q',stonepick:'看向可挖掘方块，按住 Q',fishingrod:'水岸 G 抛线 / 收竿',sword:'看向夜影 Q',dive:'L 穿戴 / 脱下',glider:'P 展开 / 收起'};
const furniture={bed:['设置重生点，夜间可以睡觉。','放好后靠近 G'],chair:['放在喜欢的风景前休息。','放好后靠近 G'],table:['为住处增添一张餐桌。','装饰家具'],lamp:['点亮自己搭建的小屋。','装饰照明'],chest:['分别存入或取回已有方块。','放好后靠近 G'],campfire:['将生肉或生鱼烤成食物，需要30秒。','放好后 G 放入 / 领取'],bookshelf:['把书香留在自己的小屋。','装饰家具'],planter:['种植后等待60秒，收获食物。','放好后靠近 G 收获']};
export function collectibleKey(name){return name==='沪上初游 · 旅行纪念卡'?'souvenir':({'吹糖金龙':'dragon','康熙通宝铜钱':'coin','老坑古玉扳指':'jade','江南茶具套装':'tea'})[name]??(SHOP_PRODUCTS[name]?name:Object.keys(SHOP_PRODUCTS).find(id=>SHOP_PRODUCTS[id].name===name)??'gift');}
export function itemDetails(item){
 const key=item.key??(item.id?'block:'+item.id:collectibleKey(item.name));
 if(key.startsWith('block:')){const id=Number(key.slice(6));return {key,name:item.name,description:blockNotes[id-1]??'建造材料。',source:'可在未受保护的自然区域采集，部分材料可制作或领取委托奖励；创造模式无限使用。',controls:'选择为手持后，E 放置；Q 挖掘。城市保护区域不能拆改。'};}
 if(resources[key]){const [name,description,source,controls]=resources[key];return {key,name,description,source,controls};}
 if(gear[key])return {key,name:item.name,description:gear[key],source:'C 制作菜单查看材料配方。',controls:controls[key]};
 if(furniture[key])return {key,name:item.name,description:furniture[key][0],source:'C 制作；也可在制作菜单取出已有家具。',controls:'C 取出，E 放置；'+furniture[key][1]};
 if(key==='souvenir')return {key,name:'沪上初游 · 旅行纪念卡',description:'属于这一趟初到上海的旅程，记下你选择的江风、灯火或茶香。每份存档只领取一次。',source:'完成十章上海旅程，在湖心亭旁向沈伯领取。',controls:'查看旅程结算；N 手账回看短片与重游章节。'};
 return {key,name:SHOP_PRODUCTS[item.name]?.name??item.name,description:SHOP_PRODUCTS[item.name]?.food?'街头购得的一份上海风味。购买时补入的食物可按 Z 使用，收藏数量保留作旅途记录。':'从上海街头带走的一份纪念收藏，可在背包和旅行手账查看。',source:'南京路或豫园附近的商铺，靠近柜台按 V 购买。',controls:'收藏展示；N 翻阅旅行手账。'};
}
export function itemImage(key){const img=document.createElement('img');img.src=itemIcon(key);img.alt='';img.className='item-art'+(key.startsWith('block:')?' pixel-art':'');img.width=64;img.height=64;return img;}
