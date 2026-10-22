import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {buildWorldSnapshot} from './world-snapshot-build.mjs';

export async function bundleWorldWorker(directory='game'){
 const cacheSource=await readFile(path.resolve(directory,'world-cache.js'),'utf8'),revision=cacheSource.match(/export const WORLD_CACHE_REVISION='([^']+)'/)?.[1];
 const snapshot=await buildWorldSnapshot(directory,{revision});
 const result=await build({entryPoints:[path.resolve(directory,'world-worker.js')],bundle:true,minify:true,format:'esm',target:'es2022',write:false,legalComments:'inline',plugins:[{name:'prebuilt-default-world',setup(build){build.onLoad({filter:/[\\/]world-worker\.js$/},async args=>{const source=await readFile(args.path,'utf8'),anchor='const PREBUILT_WORLD=null;';if(!source.includes(anchor))throw Error('World snapshot anchor missing');return {contents:source.replace(anchor,'const PREBUILT_WORLD='+JSON.stringify(snapshot.manifest)+';'),loader:'js',resolveDir:path.dirname(args.path)};});}}]}),code=result.outputFiles[0].text;
 return {code,name:'world-worker-'+createHash('sha256').update(code).digest('hex').slice(0,12)+'.js',snapshot,buildId:snapshot.manifest.packedSha256};
}
export function worldWorkerReference(source,name,buildId=null,manifest=null){
 const original="new URL('./world-worker.js',import.meta.url)";
 if(!source.includes(original))throw new Error('World worker URL anchor missing');
 return source.replace(original,`new URL('./${name}',import.meta.url)`).replace('export const WORLD_BUILD_ID=null;','export const WORLD_BUILD_ID='+JSON.stringify(buildId)+';').replace('export const WORLD_SNAPSHOT=null;','export const WORLD_SNAPSHOT='+JSON.stringify(manifest)+';');
}
export const worldSnapshotPreload=name=>'<link rel="preload" as="fetch" type="application/octet-stream" crossorigin="anonymous" href="./'+name+'">';
