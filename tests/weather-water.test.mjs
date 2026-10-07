import assert from 'node:assert/strict';
import {WeatherState,WEATHER_CYCLE_SECONDS} from '../game/weather.js';
import {clockOptions,advanceDay} from '../game/day-time.js';
import {WATER_LEVEL} from '../game/world.js';
import {isSwimming,movementSpeed,swimVelocity} from '../game/survival-state.js';

assert.equal(clockOptions().cycleSeconds,1200);assert.equal(advanceDay(36,1200,clockOptions()),36);
assert.equal(clockOptions({cycleSeconds:2400,paused:true}).cycleSeconds,2400,'Existing selected day length stays unchanged');
assert.equal(WEATHER_CYCLE_SECONDS,1200);
for(const [elapsed,type]of [[0,'clear'],[389,'clear'],[390,'cloudy'],[585,'rain'],[855,'fog'],[1065,'cloudy'],[1200,'clear']]){const w=new WeatherState();w.tick(elapsed);assert.equal(w.type,type);}
for(const elapsed of [0,400,1300,2000,2800,3500,4200]){
 const oldPhase=(elapsed%3600)/9,expected=oldPhase<130?'clear':oldPhase<195?'cloudy':oldPhase<285?'rain':oldPhase<355?'fog':'cloudy',w=new WeatherState();
 w.restore({timing:2,mode:'auto',elapsed,rain:.37,fog:.14,cloud:.4,humidity:70});assert.equal(w.type,expected);assert.equal(w.rain,.37);assert.equal(w.fog,.14);
 const state=w.serialize();assert(w.setCycle(600));w.tick(0);assert.equal(w.type,expected);assert.equal(w.rain,.37);assert.equal(w.elapsed/600,state.elapsed/1200);
 const roundTrip=new WeatherState();roundTrip.restore(w.serialize());assert.deepEqual(roundTrip.serialize(),w.serialize());assert(!w.setCycle(7));
}
const legacy=new WeatherState();legacy.restore({mode:'auto',elapsed:250});assert.equal(legacy.type,'rain');
const manual=new WeatherState();manual.setMode('rain');manual.setCycle(3600);manual.tick(45);assert(manual.rain>.99);assert.equal(manual.type,'rain');
const gradual=new WeatherState();gradual.elapsed=584;let rain=0;for(let i=0;i<90;i++){gradual.tick(1);assert(gradual.rain>=rain&&gradual.rain-rain<.02,'Automatic rain must fade in rather than jump');rain=gradual.rain;}assert(rain>.7);

assert(isSwimming({feet:WATER_LEVEL+.02}),'Contact starts before the feet have sunk through the plane');
assert(!isSwimming({feet:WATER_LEVEL+.8}),'A pier or boat deck is dry');assert(!isSwimming({feet:6,dry:true}),'Metro interior stays dry');
for(const sprint of [false,true])assert.equal(movementSpeed({swimming:true,sprint}),3.5,'Running requests cannot give land speed on water');
assert.equal(movementSpeed({swimming:true,equipped:true,sprint:true}),5.5);assert.equal(movementSpeed({swimming:false,sprint:true}),8.5);
for(const step of [1/30,1/60,1/120]){
 let feet=WATER_LEVEL-8,velocity=0,max=feet;
 for(let i=0;i<20/step;i++){velocity=swimVelocity({feet,velocity,space:true,down:false,grounded:false,dt:step});feet+=velocity*step;max=Math.max(max,feet);}
 assert(max<WATER_LEVEL-.4,'Holding Space in open water must not launch repeated jumps');assert(Math.abs(feet-(WATER_LEVEL-.85))<.02);assert(feet+1.62>WATER_LEVEL,'At the surface the eyes can breathe');
}
assert.equal(swimVelocity({feet:WATER_LEVEL-.85,velocity:0,space:true,shore:true,dt:1/60}),8,'A nearby low exit can still be climbed');
assert.equal(swimVelocity({feet:WATER_LEVEL-.5,velocity:0,space:true,down:true,dt:1/60}),-3.8,'Dive takes precedence over surfacing');
assert.equal(swimVelocity({feet:6,velocity:0,space:true,grounded:true,dry:true,dt:1/60}),8);
console.log('PASS: 20-minute day defaults, preserved day preferences, weather timing/legacy phase migration/pace persistence/smooth rain, water entry/speed/controlled ascent/low exits/dry metro and decks.');
