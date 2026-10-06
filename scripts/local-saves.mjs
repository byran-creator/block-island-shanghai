import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {validSave} from '../worker/index.js';

// Development only. Production continues to use authenticated D1/R2 saves.
export function createLocalSaves(directory){
 const file=join(directory,'saves.json');let queue=Promise.resolve();
 async function records(){try{return JSON.parse(await readFile(file,'utf8'))}catch(e){if(e.code==='ENOENT')return [];throw e}}
 const metadata=r=>({id:r.id,kind:r.kind,savedAt:r.data.savedAt,crystals:r.data.adventure.state.collected.length,placed:Math.max(0,Number(r.data.placed)||0),best:Number.isFinite(r.data.adventure.state.best)?r.data.adventure.state.best:null});
 return async function localSaves(req,res,next){
  const url=new URL(req.url,'http://localhost');if(!/^\/api\/saves(?:\/|$)/.test(url.pathname))return next();
  const reply=(value,status=200)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(value))};
  try{
   if(req.method==='GET'){await queue;const all=await records();if(url.pathname==='/api/saves')return reply({saves:all.map(metadata),storage:'local'});const id=decodeURIComponent(url.pathname.slice(11)),saved=all.find(r=>r.id===id);return saved?reply(saved.data):reply({error:'找不到这个本地存档。'},404)}
   if(req.method!=='POST'||url.pathname!=='/api/saves')return reply({error:'找不到这个接口。'},404);
   // Browsers may write only from this development server's origin.
   if(!req.headers.origin||new URL(req.headers.origin).host!==req.headers.host)return reply({error:'请求来源不正确。'},403);
   const chunks=[];let bytes=0;for await(const chunk of req){const buffer=Buffer.from(chunk);bytes+=buffer.length;if(bytes>3000000)return reply({error:'存档过大。'},413);chunks.push(buffer)}const body=Buffer.concat(chunks).toString('utf8');
   let input;try{input=JSON.parse(body)}catch{return reply({error:'存档格式不正确。'},400)}
   if(!validSave(input.data))return reply({error:'存档数据不完整。'},400);
   const kind=input.kind==='auto'?'auto':'manual',id=kind==='auto'?'local-auto':randomUUID(),row={id,kind,data:{...input.data,savedAt:new Date().toISOString()}};
   const write=queue.then(async()=>{const all=await records();const others=all.filter(r=>r.id!==id);const kept=[row,...others].sort((a,b)=>b.data.savedAt.localeCompare(a.data.savedAt));let manual=0;const trimmed=kept.filter(r=>r.kind==='auto'||++manual<=10);await mkdir(directory,{recursive:true});const temp=file+'.tmp';await writeFile(temp,JSON.stringify(trimmed));await rename(temp,file)});
   queue=write.catch(()=>{});await write;return reply({save:metadata(row),storage:'local'});
  }catch(error){console.error('Local save failure:',error.message);return reply({error:'本地存档写入失败，请检查目录权限和磁盘空间。'},503)}
 };
}
export function localSavesPlugin(directory){return {name:'block-island-local-saves',apply:'serve',configureServer(server){server.middlewares.use(createLocalSaves(directory))},transformIndexHtml(html){return html.replaceAll('云端保存','本地保存').replaceAll('云端存档','本地存档').replace('YOUR ISLAND / CLOUD SAVES','YOUR ISLAND / LOCAL SAVES')}}}
