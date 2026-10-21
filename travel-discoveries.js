// Optional journal pages: checked only on a photograph or a completed conversation.
export const TRAVEL_DISCOVERIES=[
 {id:'rain-garden',name:'雨天的园林',art:'gallery',place:'豫园内园 · 水上长廊',hint:'下雨时到水上长廊，打开相机切换拍景，拍下一张雨中的园林。不要求构图；留言自动入册，相片可另存。',note:'雨把远处的楼藏起来，廊檐下的水声却更近了。原来同一座园子，也可以再认识一次。'},
 {id:'river-night',name:'夜晚的浦江',art:'bund',place:'外滩 · 临江观景步道',hint:'夜晚回到外滩，站在临江步道朝陆家嘴拍景。把这次回望留给自己；相片可手动收入手账。',note:'第一次望向对岸，只觉得高。再回来时，已经知道某一扇窗下，有人工作，也有人第一次旅行。'},
 {id:'stranger-story',name:'一位陌生人的上海故事',art:'lujiazui',place:'陆家嘴 · 职员的工牌委托',hint:'第4章交还工牌后，听完职员的经历。已通关也可在“纪念与重游”重游第4章，原进度与纪念卡保留。',note:'他初来上海时，有陌生人陪他找到站口。今天，你替他找回了工牌。城市很大，一份好意却可以这样传下去。'}
];
export const discoveryById=id=>TRAVEL_DISCOVERIES.find(d=>d.id===id);
export function photographedDiscoveries(photo,ctx){
 if(photo?.selfie!==false)return [];
 const p=photo.pos;if(!p||p.y<25.5||p.y>29)return [];
 const ids=[];
 if(ctx.rain>=.45&&p.x>=-71&&p.x<=-40&&p.z>=280&&p.z<=306)ids.push('rain-garden');
 if(ctx.dayClock>=120&&ctx.dayClock<240&&p.x>=35&&p.x<=60&&p.z>=-20&&p.z<=180&&photo.direction?.x>.25)ids.push('river-night');
 return ids;
}
