import {EXPANDED_LINE2_STATIONS,expandedLine2Z} from './metro-layout.js';
import {COMPLETE_LINE10_STATIONS,westLine10Center} from './metro-west-layout.js';

function samples(start,end,point){
 const steps=Math.ceil((end-start)/5);
 return Array.from({length:steps+1},(_,i)=>point(start+(end-start)*i/steps));
}
export const METRO_MAP_ROUTES=[
 ['#8bbd63',samples(EXPANDED_LINE2_STATIONS[0].x,EXPANDED_LINE2_STATIONS.at(-1).x,x=>({x,z:expandedLine2Z(x)}))],
 ['#c5a3cd',samples(COMPLETE_LINE10_STATIONS[0].x,COMPLETE_LINE10_STATIONS.at(-1).x,westLine10Center)]
];
