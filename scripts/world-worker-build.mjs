import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import path from 'node:path';

export async function bundleWorldWorker(directory='game'){
 const result=await build({entryPoints:[path.resolve(directory,'world-worker.js')],bundle:true,minify:true,format:'esm',target:'es2022',write:false,legalComments:'inline'}),code=result.outputFiles[0].text;
 return {code,name:'world-worker-'+createHash('sha256').update(code).digest('hex').slice(0,12)+'.js'};
}
export function worldWorkerReference(source,name){
 const original="new URL('./world-worker.js',import.meta.url)";
 if(!source.includes(original))throw new Error('World worker URL anchor missing');
 return source.replace(original,`new URL('./${name}',import.meta.url)`);
}
