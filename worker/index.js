// The platform supplies authenticated identity for this private Site.
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
function repository(env,user){
 if(!env.DB||!env.BUCKET)throw new Error('Save storage unavailable');
 return {list:()=>env.DB.prepare('SELECT id, kind, saved_at AS savedAt, crystals, placed, best FROM game_saves WHERE user_id = ? ORDER BY saved_at DESC LIMIT 11').bind(user).all(),get:id=>env.DB.prepare('SELECT object_key FROM game_saves WHERE id = ? AND user_id = ?').bind(id,user).first(),write:row=>env.DB.prepare('INSERT INTO game_saves (id,user_id,kind,saved_at,crystals,placed,best,object_key) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET saved_at=excluded.saved_at, crystals=excluded.crystals, placed=excluded.placed, best=excluded.best').bind(row.id,user,row.kind,row.savedAt,row.crystals,row.placed,row.best,row.key).run(),old:()=>env.DB.prepare("SELECT id, object_key FROM game_saves WHERE user_id = ? AND kind = 'manual' ORDER BY saved_at DESC LIMIT -1 OFFSET 10").bind(user).all(),remove:id=>env.DB.prepare('DELETE FROM game_saves WHERE id = ? AND user_id = ?').bind(id,user).run()};
}
export function validSave(s){return s&&(s.version===3||s.version===4||s.version===6)&&Array.isArray(s.edits)&&s.edits.length<=50000&&s.edits.every(e=>Array.isArray(e)&&e.length===2&&typeof e[0]==='string'&&/^-?\d{1,3},\d{1,3},-?\d{1,3}$/.test(e[0])&&Number.isInteger(e[1])&&e[1]>=0&&e[1]<=12)&&s.pos&&['x','y','z'].every(k=>Number.isFinite(s.pos[k]))&&s.adventure&&Array.isArray(s.adventure.state?.collected)&&s.adventure.state.collected.length<=5&&typeof s.adventure.poster==='string'&&s.adventure.poster.startsWith('data:image/png;base64,')&&s.adventure.poster.length<1500000;}
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(!url.pathname.startsWith('/api/')){const path=url.pathname==='/'?'/index.html':url.pathname;const asset=typeof SITE_ASSETS!=='undefined'?SITE_ASSETS[path]:null;if(asset)return new Response(asset.body,{headers:{'Content-Type':asset.type,'Cache-Control':'no-cache'}});return new Response('Not found',{status:404});}
  const user=request.headers.get('oai-authenticated-user-id');if(!user)return json({error:'请登录后读取或保存云端进度。'},401);
  if(request.method==='POST'&&request.headers.get('Origin')!==url.origin)return json({error:'请求来源不正确。'},403);
  try{
   const db=repository(env,user);
   if(url.pathname==='/api/saves'&&request.method==='GET')return json({saves:(await db.list()).results});
   if(url.pathname.startsWith('/api/saves/')&&request.method==='GET'){const row=await db.get(decodeURIComponent(url.pathname.slice(11)));if(!row)return json({error:'找不到这个存档。'},404);const object=await env.BUCKET.get(row.object_key);if(!object)return json({error:'这个存档暂时无法读取，请重试。'},503);return new Response(await object.text(),{headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}
   if(url.pathname==='/api/saves'&&request.method==='POST'){
    if(Number(request.headers.get('Content-Length'))>3000000)return json({error:'存档过大。'},413);
    const text=await request.text();if(text.length>3000000)return json({error:'存档过大。'},413);
    let body;try{body=JSON.parse(text)}catch{return json({error:'存档格式不正确。'},400)}
    if(!validSave(body.data))return json({error:'存档数据不完整。'},400);
    const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(user)),owner=[...new Uint8Array(hash)].map(v=>v.toString(16).padStart(2,'0')).join('');
    const kind=body.kind==='auto'?'auto':'manual',id=kind==='auto'?`auto-${owner}`:crypto.randomUUID(),key=`saves/${owner}/${id}.json`,savedAt=new Date().toISOString();
    const data={...body.data,savedAt};await env.BUCKET.put(key,JSON.stringify(data),{httpMetadata:{contentType:'application/json'}});
    const row={id,kind,savedAt,crystals:data.adventure.state.collected.length,placed:Math.max(0,Number(data.placed)||0),best:Number.isFinite(data.adventure.state.best)?data.adventure.state.best:null,key};
    await db.write(row);
    for(const old of (await db.old()).results){await db.remove(old.id);await env.BUCKET.delete(old.object_key);}
    return json({save:{id,kind,savedAt,crystals:row.crystals,placed:row.placed,best:row.best}});
   }
   return json({error:'找不到这个接口。'},404);
  }catch(error){console.error('Game save storage failure',error.message);return json({error:'云端存档暂时不可用，当前进度仍在游戏中，请稍后重试。'},503);}
 }
};
