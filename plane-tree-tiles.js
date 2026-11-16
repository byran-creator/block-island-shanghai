// The original fourteen terrain tiles occupy the top row of the atlas.
export const PLANE_TREE_LEAVES_TILE=14,PLANE_TREE_BARK_TILE=15;

const leaf=[
 '....#....','....#....','.##.##.#.','..######.','#########',
 '.#######.','..#####..','...###...','....#....','....#....'
];
export function drawPlaneTreeTiles(ctx){
 ctx.fillStyle='#426b37';ctx.fillRect(0,16,16,16);
 for(const [ox,oy,color,turn] of [[0,0,'#6b943d',false],[7,5,'#7ca34e',true],[-2,8,'#527e3c',false]]){
  ctx.fillStyle=color;
  for(let y=0;y<leaf.length;y++)for(let x=0;x<leaf[y].length;x++){
   const px=ox+(turn?9-y:x),py=oy+(turn?x:y);
   if(leaf[y][x]==='#'&&px>=0&&px<16&&py<16)ctx.fillRect(px,16+py,1,1);
  }
 }
 ctx.fillStyle='#a2b366';ctx.fillRect(4,20,1,5);ctx.fillRect(11,24,5,1);

 ctx.fillStyle='#8e8b6e';ctx.fillRect(16,16,16,16);
 for(const [x,y,width,height,color] of [
  [0,1,5,4,'#adb09a'],[3,0,3,2,'#adb09a'],[2,5,4,3,'#a8a58c'],
  [9,1,5,5,'#ccc3a9'],[12,4,4,3,'#ccc3a9'],[8,8,4,3,'#747d63'],
  [1,10,5,5,'#bcb49b'],[4,12,3,4,'#bcb49b'],[11,11,5,4,'#a5a88a']
 ]){ctx.fillStyle=color;ctx.fillRect(16+x,16+y,width,height);}
}
