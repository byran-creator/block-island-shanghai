export class SuiteControls{
 constructor(){this.water=0;this.tap=false;this.drain=false;this.tv=false;}
 toggleTap(){this.tap=!this.tap;if(this.tap)this.drain=false;}
 toggleDrain(){this.drain=!this.drain;if(this.drain)this.tap=false;}
 tick(dt){if(!Number.isFinite(dt)||dt<=0)return;this.water=Math.max(0,Math.min(1,this.water+dt*(this.tap ? .075 : this.drain ? -.14 : 0)));if(this.water===1)this.tap=false;if(this.water===0)this.drain=false;}
 serialize(){return {water:this.water,tap:this.tap,drain:this.drain,tv:this.tv};}
 restore(d){this.water=Number.isFinite(d?.water)?Math.max(0,Math.min(1,d.water)):0;this.tap=!!d?.tap&&this.water<1;this.drain=!this.tap&&!!d?.drain&&this.water>0;this.tv=!!d?.tv;}
}
