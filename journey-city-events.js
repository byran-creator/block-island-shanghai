// Small errands use the existing forecourt and people, without new crowds/lights.
export const CITY_WORK_BADGE={x:194.5,y:26,z:54.5};
export const cityMeetingPending=(state,kind)=>state.edition>=3
 ?(kind==='office-walk'?state.officeErrand!=='done':state.touristPhoto!=='done')
 :!state.encounters.some(p=>p.kind===kind);

export function cityMeetingGoal(state,ctx){
 const kind=cityMeetingPending(state,'office-walk')?'office-walk':cityMeetingPending(state,'tower-visitor')?'tower-visitor':null;
 if(!kind)return null;
 if(state.edition>=3&&kind==='office-walk'&&state.officeErrand==='search')return {...CITY_WORK_BADGE,label:'陆家嘴绿地边 · 掉落的工牌',instruction:'沿黄色方向到铺装广场，靠近地上的蓝白工牌按 V 捡起；然后交还职员。'};
 const p=(ctx.people??[]).find(p=>p.district==='lujiazui'&&p.kind===kind&&p.guide);
 if(!p)return null;
 const name=p.npcRole??(kind==='office-walk'?'职员':'游客');
 let action=state.edition>=3?(kind==='office-walk'?(state.officeErrand==='return'?'交还工牌':'帮忙找工牌'):(state.touristPhoto==='ready'?'为游客拍照':'接下拍照请求')):'聊聊上海';
 const instruction=p.root.visible===false?'人物正在从楼里出来。跟随黄色目标到门旁稍候，靠近按 V。':state.edition<3?'靠近按 V，选一个话题并读完；留言会收入旅行手账。':kind==='office-walk'?(state.officeErrand==='return'?'走近职员按 V 交还工牌，读完最后一句即完成。':'靠近职员按 V，听听他需要什么帮助。'):state.touristPhoto==='ready'?'点右上角相机，切换拍景，让游客入镜后拍摄即可；不评价构图，也不用另外存入手账。':'走近游客按 V，接下拍照请求；随后相机拍摄有人物的照片即可。';
 return {...p.root.position,label:`${name} · ${action}`,instruction,npcTarget:true};
}
