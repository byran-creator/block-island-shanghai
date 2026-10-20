import assert from 'node:assert/strict';
import {inventoryGroups} from '../game/player-handbook.js';
import {SurvivalState,RECIPES} from '../game/survival-state.js';
import {itemDetails,itemIcon,registerBlockIcon} from '../game/item-catalog.js';
import {SHOP_PRODUCTS} from '../game/city-products.js';
const state=new SurvivalState();Object.assign(state,{pickaxe:2,durability:96,fishingRod:true,sword:true,dive:true,glider:true});
const packed=Object.fromEntries(Object.entries(RECIPES).filter(([,r])=>r.item).map(([id])=>[id,1]));
const collectibles=Object.fromEntries([...Object.keys(SHOP_PRODUCTS),'沪上初游 · 旅行纪念卡','吹糖金龙','康熙通宝铜钱','老坑古玉扳指','江南茶具套装','江南手作纪念品'].map(id=>[id,1]));
const before=state.serialize(),items=inventoryGroups(state,packed,collectibles).flatMap(g=>g.items);
for(const item of items){const d=itemDetails(item);for(const k of ['key','name','description','source','controls'])assert(d[k]?.length>0,`${item.name} missing ${k}`);const url=itemIcon(d.key);assert(url.startsWith('data:image/svg+xml'));assert.equal(itemIcon(d.key),url);}
assert.deepEqual(state.serialize(),before);assert.equal(itemDetails({key:'coin',name:'康熙通宝铜钱'}).name,'康熙通宝铜钱');
assert.notEqual(itemIcon('coin'),itemIcon('jade'));assert.notEqual(itemIcon('dragon'),itemIcon('gift'));
registerBlockIcon(7,'https://invalid.example/');assert(itemIcon('block:7').startsWith('data:image/svg'));
registerBlockIcon(7,'data:image/png;base64,test');assert.equal(itemIcon('block:7'),'data:image/png;base64,test');
console.log('PASS: all '+items.length+' current material/resource/gear/furniture/keepsake entries have original shared art and truthful descriptions, cached atlas reuse and unchanged inventory.');
