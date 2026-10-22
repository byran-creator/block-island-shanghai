import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
// Exercise the actual bundled renderer's first-use function with a counted GL
// driver; do not replace it with a second implementation of the branch.
const code=readFileSync('game/three.module.js','utf8'),at=code.indexOf('function onFirstUse( self ) {'),start=code.indexOf('{',at);let depth=1,end=start+1;for(;depth;end++){if(code[end]==='{')depth++;else if(code[end]==='}')depth--;}
const body=code.slice(start+1,end-1),run=new Function('gl','renderer','self',`let cachedUniforms,cachedAttributes;const program={},glVertexShader={},glFragmentShader={},prefixVertex='',prefixFragment='',getShaderErrors=()=>'',WebGLUniforms=class{},fetchAttributeLocations=()=>({});${body}`);
function driver(linked,checkShaderWarnings,logs=''){const calls={info:0,shader:0,error:0,link:0},gl={LINK_STATUS:1,VALIDATE_STATUS:2,getProgramParameter(){calls.link++;return linked;},getProgramInfoLog(){calls.info++;return logs;},getShaderInfoLog(){calls.shader++;return logs;},deleteShader(){},getError:()=>0},renderer={debug:{checkShaderErrors:true,checkShaderWarnings,onShaderError(){calls.error++;}}},self={};run(gl,renderer,self);return {calls,self};}
assert.deepEqual(driver(true,false).calls,{info:0,shader:0,error:0,link:1},'Successful links retain validation without three synchronous log readbacks');
assert.deepEqual(driver(true,undefined).calls,{info:1,shader:2,error:0,link:1},'Default Three diagnostics remain unchanged');
const bad=driver(false,false);assert.equal(bad.calls.error,1);assert.equal(bad.calls.info,1);assert.equal(bad.calls.shader,2);assert.equal(bad.self.diagnostics.runnable,false,'The production option must not hide failed shaders');
assert.doesNotThrow(()=>driver(false,false,null),'A lost context returning null must not crash while formatting diagnostics');
const game=readFileSync('game/game.js','utf8');assert(!game.includes('checkShaderErrors=false'));assert(game.includes('renderer.debug.checkShaderWarnings=false'));
console.log('PASS: actual renderer validates links, skips healthy warning readbacks only when requested, retains full failed-shader callbacks and tolerates null logs.');
