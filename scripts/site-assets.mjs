import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
const binaryTypes={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.avif':'image/avif','.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav','.woff2':'font/woff2'};
const textTypes={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml'};
export async function collectSiteAssets(directory='game'){
 const assets={};
 async function collect(relative=''){
  for(const entry of await readdir(path.join(directory,relative),{withFileTypes:true})){
   const name=relative?relative+'/'+entry.name:entry.name;
   if(entry.isDirectory()){if(name==='assets'||name.startsWith('assets/'))await collect(name);continue;}
   if(!entry.isFile()||entry.name.startsWith('__playtest'))continue;
   const ext=path.extname(name).toLowerCase(),type=binaryTypes[ext]||textTypes[ext];if(!type)continue;
   const bytes=await readFile(path.join(directory,name));
   assets['/'+name]={body:bytes.toString(binaryTypes[ext]?'base64':'utf8'),type,...(binaryTypes[ext]?{encoding:'base64'}:{})};
  }
 }
 await collect();return assets;
}
