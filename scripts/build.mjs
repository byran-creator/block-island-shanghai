import {transform} from 'esbuild';
import {readFile,readdir,mkdir,writeFile,cp,rm} from 'node:fs/promises';
const assets={};
for(const entry of await readdir('game',{withFileTypes:true})){if(!entry.isFile()||! /\.(html|js|css|txt)$/.test(entry.name))continue;assets['/'+entry.name]={body:await readFile('game/'+entry.name,'utf8'),type:entry.name.endsWith('.html')?'text/html; charset=utf-8':entry.name.endsWith('.css')?'text/css; charset=utf-8':entry.name.endsWith('.js')?'text/javascript; charset=utf-8':'text/plain; charset=utf-8'};}
for(const asset of Object.values(assets))if(asset.type.startsWith('text/javascript'))asset.body=(await transform(asset.body,{minify:true,format:'esm',target:'es2022',legalComments:'inline'})).code;
await rm('dist',{recursive:true,force:true});
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
await writeFile('dist/server/index.js','const SITE_ASSETS='+JSON.stringify(assets)+';\n'+await readFile('worker/index.js','utf8'));
await cp('.openai/hosting.json','dist/.openai/hosting.json');
await rm('dist/.openai/drizzle',{recursive:true,force:true});await cp('drizzle','dist/.openai/drizzle',{recursive:true});
console.log('Built game Worker, assets, cloud save metadata and migrations.');
