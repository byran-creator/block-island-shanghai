// Display-only bearings. Targets still come from the real station/garden routes.
export function routeBearing(goal,pos,yaw=0){
 if(!goal||!pos)return {angle:0,text:''};
 const dx=goal.x-pos.x,dz=goal.z-pos.z,distance=Math.hypot(dx,dz),height=goal.y-pos.y;
 const angle=((Math.atan2(dx,-dz)+yaw+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
 const ahead=Math.abs(angle)<Math.PI/6,behind=Math.abs(angle)>Math.PI*5/6;
 const direction=ahead?'前方':behind?'身后，转身看看':angle<0?'左侧，转动视角':'右侧，转动视角';
 const text=distance<3?Math.abs(height)>3?(height>0?'目标在上层 · 沿楼梯 / 扶梯上行':'目标在下层 · 沿楼梯 / 扶梯下行'):'已到附近':direction+' · '+Math.round(distance)+'格';
 return {angle:angle*180/Math.PI,text,near:distance<(goal.arriveRadius??0)&&Math.abs(height)<2};
}
export function controlInstruction(text,touch){
 if(!touch||!text)return text;
 return text.replaceAll('WASD','左下角摇杆').replaceAll('鼠标环顾','右侧滑动环顾').replaceAll('按 V','点「互动 V」').replaceAll('按 I','点任务标题').replaceAll('M 地图','右上角地图');
}
