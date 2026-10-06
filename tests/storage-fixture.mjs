import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
export function storageFixture(){
 const sqlite=new DatabaseSync(':memory:');for(const name of readdirSync(new URL('../drizzle/',import.meta.url)).filter(x=>x.endsWith('.sql')))sqlite.exec(readFileSync(new URL('../drizzle/'+name,import.meta.url),'utf8'));
 const objects=new Map();
 const env={DB:{prepare(sql){const statement=sqlite.prepare(sql);return {bind(...args){return {all:async()=>({results:statement.all(...args)}),first:async()=>statement.get(...args)||null,run:async()=>statement.run(...args)}}}}},BUCKET:{put:async(key,value)=>objects.set(key,value),get:async key=>objects.has(key)?{text:async()=>objects.get(key)}:null,delete:async key=>objects.delete(key)}};
 return {env,objects,sqlite};
}
