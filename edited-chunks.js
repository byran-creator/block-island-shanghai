// A save changes terrain only where its edit map differs from the current one.
// Include face neighbours, so chunk boundaries cannot retain a stale side.
export function changedEditChunks(previous,next,chunk){
 const changed=new Set();
 for(const key of new Set([...previous.keys(),...next.keys()])){
  if(previous.has(key)===next.has(key)&&previous.get(key)===next.get(key))continue;
  const [x,,z]=key.split(',').map(Number);
  for(const [a,b]of [[x,z],[x-1,z],[x+1,z],[x,z-1],[x,z+1]])changed.add(Math.floor(a/chunk)+','+Math.floor(b/chunk));
 }
 return changed;
}
