import {build} from 'esbuild';
import path from 'node:path';

// The tiny loader runs as soon as its HTML is parsed, before the main city
// module, removing the second request/deferred ESM delay before registration.
export async function inlineLoadingMusic(html,directory='game'){
 const anchor='<script type="module" src="./loading-music.js"></script>';
 if(!html.includes(anchor))throw Error('Loading music entry anchor missing');
 const result=await build({entryPoints:[path.resolve(directory,'loading-music.js')],bundle:true,minify:true,format:'iife',target:'es2019',write:false,legalComments:'inline',define:{'import.meta.url':'document.baseURI'}});
 const code=result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script');
 return html.replace(anchor,'<script id="loading-music-bootstrap">'+code+'</script>');
}

export async function inlineStartupEntry(html,directory='game'){
 const anchor='<script type="module" src="./startup-entry.js"></script>';
 if(!html.includes(anchor))throw Error('Startup controller anchor missing');
 const result=await build({entryPoints:[path.resolve(directory,'startup-entry.js')],bundle:true,minify:true,format:'iife',target:'es2019',write:false,legalComments:'inline'});
 return html.replace(anchor,'<script id="startup-guard">'+result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script')+'</script>');
}
