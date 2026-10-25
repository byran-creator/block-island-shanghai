// G consumes the life action first; failed targeting must not invent an NPC.
export function runPlayerInteraction({life,companions,pos,camera,follow=false,notify,onFollow=()=>{}}){
 if(!follow&&life?.use())return 'life';
 const n=companions.nearest(pos,camera);
 if(!n){notify(follow?'靠近奶龙后再按 H 跟随。':'没有可互动的目标。靠近并看向家具；钓鱼时站在岸上看向开阔水面。');return 'none';}
 companions.interact(pos,camera,follow);if(follow&&n.follow)onFollow();return 'companion';
}
