// Original single-stroke glyphs. Fixed paths avoid missing CJK fonts on mobile.
const CHINESE=[
 // 欢
 [[[2,6],[10,6],[8,14],[2,22]],[[3,10],[10,21]],[[15,3],[12,10]],[[14,6],[23,6],[21,10]],[[18,8],[18,15],[14,22]],[[18,15],[24,22]]],
 // 迎
 [[[3,3],[7,6]],[[2,11],[6,11],[6,19],[3,23]],[[6,19],[10,22],[24,22]],[[11,5],[11,18],[15,16]],[[11,5],[15,3]],[[17,4],[22,4],[22,15],[20,16]],[[17,4],[17,20]]],
 // 来
 [[[12,2],[12,23]],[[3,6],[21,6]],[[5,9],[7,12]],[[19,9],[17,12]],[[2,14],[22,14]],[[12,14],[8,19],[3,23]],[[12,14],[16,19],[22,23]]],
 // 到
 [[[2,4],[13,4]],[[8,4],[4,11],[12,11]],[[10,8],[13,12]],[[3,15],[13,15]],[[8,12],[8,20]],[[2,21],[14,18]],[[16,5],[16,18]],[[21,3],[21,21],[18,23]]],
 // 上
 [[[12,2],[12,21]],[[12,9],[21,9]],[[2,22],[23,22]]],
 // 海
 [[[2,4],[5,6]],[[2,10],[5,12]],[[5,15],[2,23]],[[10,3],[7,9]],[[10,5],[23,5]],[[10,9],[22,9],[21,21],[19,23]],[[9,10],[8,19],[22,19]],[[7,14],[23,14]],[[13,10],[14,12]],[[16,15],[17,17]]]
];
const ENGLISH=[
 [[[1,2],[4,22],[9,10],[14,22],[17,2]]], // W
 [[[16,2],[3,2],[3,22],[16,22]],[[3,12],[13,12]]], // E
 [[[3,2],[3,22],[16,22]]], // L
 [[[17,4],[13,2],[6,2],[2,6],[2,18],[6,22],[13,22],[17,20]]], // C
 [[[6,2],[13,2],[17,6],[17,18],[13,22],[6,22],[2,18],[2,6],[6,2]]], // O
 [[[2,22],[2,2],[9,13],[16,2],[16,22]]], // M
 [[[16,2],[3,2],[3,22],[16,22]],[[3,12],[13,12]]] // E
];
export const DRONE_COUNT=336;
function pointsOnGlyph(strokes,count){
 const segments=[];let total=0;for(const stroke of strokes)for(let i=1;i<stroke.length;i++){const a=stroke[i-1],b=stroke[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(len){segments.push({a,b,len,start:total});total+=len;}}
 const points=[];for(let i=0;i<count;i++){const d=(i+.5)*total/count;let j=0;while(j+1<segments.length&&segments[j].start+segments[j].len<d)j++;const s=segments[j],t=(d-s.start)/s.len;points.push([s.a[0]+(s.b[0]-s.a[0])*t,s.a[1]+(s.b[1]-s.a[1])*t]);}return points;
}
// Share lights in proportion to stroke length so simple characters are not
// denser than complex ones. The allocation is deterministic on every device.
function allocateByStrokeLength(glyphs,total){
 const lengths=glyphs.map(g=>g.reduce((sum,stroke)=>sum+stroke.slice(1).reduce((n,p,i)=>n+Math.hypot(p[0]-stroke[i][0],p[1]-stroke[i][1]),0),0));
 const sum=lengths.reduce((a,b)=>a+b,0),exact=lengths.map(n=>n*total/sum),counts=exact.map(Math.floor);
 let left=total-counts.reduce((a,b)=>a+b,0);
 const order=exact.map((n,i)=>({i,remainder:n-counts[i]})).sort((a,b)=>b.remainder-a.remainder||a.i-b.i);
 for(let i=0;i<left;i++)counts[order[i].i]++;return counts;
}
export function droneWordTargets(word){
 const chinese=word==='zh';if(!chinese&&word!=='en')throw new Error('Unknown drone lettering');
 const glyphs=chinese?CHINESE:ENGLISH,advance=chinese?27:21,scale=chinese?1.25:1.18,center=(glyphs.length-1)*advance/2;
 const counts=allocateByStrokeLength(glyphs,DRONE_COUNT),points=[];
 glyphs.forEach((glyph,index)=>{for(const [u,v] of pointsOnGlyph(glyph,counts[index]))points.push({z:(index*advance-center+u-(chinese?12:9))*scale,y:(12-v)*scale});});
 return points;
}
