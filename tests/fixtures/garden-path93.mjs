// Published visitor BFS before scratch-buffer optimization.
export function gardenPath93(clear,start,end,occupied=null){
 const step=.5,key=p=>p[0]+','+p[1],queue=[start],seen=new Set([key(start)]),parents=new Map();let finish;
 for(let i=0;i<queue.length;i++){const p=queue[i];if(key(p)===key(end)){finish=p;break;}for(const [dx,dz]of [[step,0],[-step,0],[0,step],[0,-step]]){const q=[p[0]+dx,p[1]+dz],k=key(q);if(seen.has(k)||q[0]<-120||q[0]>32||q[1]<206||q[1]>336||!clear(...q)||!clear(p[0]+dx/2,p[1]+dz/2)||occupied&&occupied(...q))continue;seen.add(k);parents.set(k,p);queue.push(q);}}
 if(!finish)throw Error('Garden visitor circuit is blocked');const result=[];while(finish){result.push(finish);finish=parents.get(key(finish));}return result.reverse();
}
