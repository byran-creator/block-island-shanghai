function Tn(i,t){if(i>=120-.5&&i<=283&&t>=203&&t<=210){let e=i-.5,n=192-D;return e<n?26:e<212?26+(e-n)/(212-n)*5:e<=255?31:Math.max(26,31-(e-255)/20*5)}return i>=117&&i<=124&&t>=187&&t<=210?26:null}var Z={min:-224,max:400},D=56,b={jinmao:{x:191.5,z:78.5,top:99},swfc:{x:217.5,z:90.5,top:112},shanghai:{x:189.5,z:106.5,top:136}},qt={x:126,z:42,top:108},Ae={dx:35,dz:280},I=i=>i<0?136.125+1.05*Math.min(-i,64)+.42*Math.max(0,-i-64):i<=124?108+50*((i-48)/64)**2:108+50*(76/64)**2+(i-124)*.55,Ge=i=>I(i)-18-D,Pi=i=>I(i)+9,V={x:Math.round(I(-66)-122),z:-66,top:83},Rn=(i,t)=>i>=Ge(t)&&i<=Pi(t);function Li(i,t,e){if(Math.hypot(i-88,t-332)<65&&(e=Math.max(e,25-Math.floor(Math.max(0,Math.hypot(i-88,t-332)-59)*2))),i>=254&&i<=266&&t>=219&&t<=236)return e;if(t>=Z.min&&t<=244){let n=i-I(t);if(Rn(i,t))return 7+Math.floor(Math.abs((n+D/2+4.5)/(13.5+D/2))*5);if(i>=Z.min&&i<Ge(t)-1&&t<=242&&(t<202||i>=102-D)||n>10&&i<(t<0?Z.max:317)&&t<=234)return 25}return e}var Xt=(i,t,e,n=2)=>({id:i,name:t,points:e,width:n}),Yt=[Xt("nanpu","\u5357\u6D66\u98CE\u683C\u659C\u62C9\u6865",[[176-D,190,26],[176-D,206,26],[192-D,206,26],[212,206,31],[255,206,31],[275,206,26],[282,206,26]],3),Xt("city","\u9646\u5BB6\u5634\u6EE8\u6C5F\u6B65\u9053",[[124,54,26],[139,54,26],[139,110,26],[183,122,26],[215,174,26]]),Xt("mountain","\u957F\u6C5F\u98CE\u683C\u5C71\u5C9B\u6865",[[312,42,26],[328,42,31],[328,80,33],[330,75,34]]),Xt("forest","\u7FE1\u7FE0\u8DE8\u6D77\u6865",[[278,216,26],[318,217,29],[330,228,31],[331,240,35]]),Xt("sand","\u91D1\u6C99\u8DE8\u6D77\u6865",[[30,190,26],[30,204,26],[65,210,28],[65,230,29]]),Xt("home","\u751F\u6D3B\u5C9B\u8FDE\u63A5\u6865",[[65,230,29],[50,257,29],[45,285,26],[45,329,26],[75,329,26]]),Xt("outer","\u8FDC\u5C9B\u8FDE\u63A5\u6865",[[353,278,29],[363,328,32],[350,355,30]])];function Di(i){let t=[];for(let e=1;e<i.points.length;e++){let[n,s,r]=i.points[e-1],[o,a,h]=i.points[e],c=Math.max(Math.abs(o-n),Math.abs(a-s))*2;for(let l=e===1?0:1;l<=c;l++){let f=l/c;t.push({x:Math.round(n+(o-n)*f),z:Math.round(s+(a-s)*f),y:Math.round(r+(h-r)*f)})}}return t}function Ui(i,t,e){return i>=206&&i<=257&&[208,255].some(n=>Math.abs(i-n)<=1)&&e>=200&&e<=212&&t>=10&&t<=59||t>=25&&Object.values(b).some(n=>Math.abs(i+.5-n.x)<=12&&Math.abs(e+.5-n.z)<=13)?!0:Yt.some(n=>n.samples.some(s=>Math.abs(i-s.x)<=n.width&&Math.abs(e-s.z)<=n.width&&t>=s.y-1&&t<=s.y+2))}for(let i of Yt)i.samples=Di(i);function pr(i,t,e){return{set:(n,s,r,o)=>i.set(n+t,s,r+e,o),fill:(n,s,r,o,a,h,c)=>i.fill(n+t,s,r+e,o+t,a,h+e,c),disc:(n,s,r,o,a)=>i.disc(n+t,s,r+e,o,a)}}function mr(i){let t=(e,n,s,r)=>i.set(Math.floor(b.swfc.x)+s-71,n,Math.floor(b.swfc.z)-e+145,r);return{set:t,fill:(e,n,s,r,o,a,h)=>{for(let c=e;c<=r;c++)for(let l=n;l<=o;l++)for(let f=s;f<=a;f++)t(c,l,f,h)}}}function An(i,t,e,n=10){for(let s=-n;s<=n;s++)for(let r=-n;r<=n;r++){let o=t+s,a=e+r;o>I(a)+9&&(i.fill(o,15,a,o,24,a,3),i.set(o,25,a,9))}}function Ni(i){i.fill(110,23,116,124,28,121,0),i.fill(107,24,117,109,28,119,0),i.fill(104,25,117,106,28,119,0);for(let t=Z.min;t<=236;t++)for(let e=Math.ceil(Ge(t));e<=Pi(t);e++)i.fill(e,18,t,e,25,t,0);An(i,b.jinmao.x-.5,b.jinmao.z-.5),An(i,b.swfc.x-.5,b.swfc.z-.5,11);{let t=pr(arguments[0],b.jinmao.x-123.5,b.jinmao.z-62.5),e={x:123.5,z:62.5};for(let n=26;n<99;n++){let s=(n-26)/73,r=n%9===7||n%9===8,o=8-Math.floor(s*8)*.75+(r?1:0);for(let a=115;a<=131;a++)for(let h=54;h<=70;h++){let c=Math.abs(a+.5-e.x),l=Math.abs(h+.5-e.z),f=Math.max(c,l)<=o&&c+l<=o*1.45,u=Math.max(c,l)>=o-1||c+l>=o*1.45-1.4;f&&(u||r)&&t.set(a,n,h,r||c===l?9:11)}}t.fill(121,26,67,125,31,72,0),t.fill(122,25,69,124,25,72,12),t.disc(123,90,62,4,9),t.fill(121,91,60,125,94,64,0),t.fill(122,90,61,124,90,63,12),t.fill(123,96,62,123,99,62,9);for(let n=91;n<=94;n++)for(let s=-3;s<=3;s++)for(let r=-3;r<=3;r++)Math.abs(s)+Math.abs(r)<=5&&(Math.abs(s)===3||Math.abs(r)===3||Math.abs(s)+Math.abs(r)===5)&&t.set(123+s,n,62+r,s===0||r===0?9:11);t.fill(120,95,59,126,99,65,0);for(let n=95;n<=99;n++)t.disc(123,n,62,Math.max(.5,3.7-(n-95)*.8),9)}{let t=mr(arguments[0]),e={x:145.5,z:71.5};for(let n=26;n<=111;n++){let s=(n-26)/85,r=9-Math.floor(s*4),o=7-Math.floor(s*4);for(let a=136;a<=154;a++)for(let h=64;h<=78;h++){let c=Math.abs(a+.5-e.x),l=Math.abs(h+.5-e.z);c>r||l>o||n>=96&&n<=107&&c<=3+(n-96)*.12||(c>=r-1||l>=o-1||n%12===1||n===95||n>=108)&&t.set(a,n,h,c>=r-1||n>=108?9:11)}}t.fill(143,26,77,147,31,83,0),t.fill(144,25,80,146,25,84,12),t.fill(141,103,70,149,103,72,12),t.fill(141,104,69,149,104,69,11),t.fill(141,104,73,149,104,73,11)}for(let t=64;t<=112;t++){let e=Math.floor(Ge(t)-2);for(let n=e-3;n<=e-1;n++)i.set(n,25,t,9),i.fill(n,26,t,n,28,t,0);t%12===4&&(i.fill(e-1,26,t,e-1,28,t,9),i.set(e-1,29,t,12))}i.fill(50-D,25,76,57-D,25,81,1),i.fill(50-D,26,76,57-D,29,81,0);for(let t of Object.values(b))An(i,t.x-.5,t.z-.5,13)}function Oi(i,t=()=>!1){for(let e of Yt){let n=Di(e);if(e.samples=n,e.id==="nanpu"){for(let s=117;s<=282;s++)for(let r=187;r<=209;r++){let o=Tn(s+.5,r+.5);if(o===null)continue;let a=Math.floor(o+1e-6)-1;i.fill(s,a+1,r,s,Math.min(143,a+25),r,0),i.set(s,a,r,9)}continue}for(let s of n)for(let r=-e.width;r<=e.width;r++)for(let o=-e.width;o<=e.width;o++)i.fill(s.x+r,s.y,s.z+o,s.x+r,s.y+2,s.z+o,0),i.set(s.x+r,s.y-1,s.z+o,e.id==="nanpu"?9:7);for(let s=10;s<n.length-10;s+=28){let r=n[s],o=n[Math.min(s+2,n.length-1)],a=Math.abs(o.x-r.x)>=Math.abs(o.z-r.z);for(let h of[-1,1]){let c=r.x+(a?0:h*(e.width+1)),l=r.z+(a?h*(e.width+1):0);t(c,l)||Yt.some(f=>f.samples.some(u=>Math.abs(c-u.x)<=f.width&&Math.abs(l-u.z)<=f.width))||(i.fill(c,Math.min(i.surfaceAt(c,l),r.y-1),l,c,r.y-1,l,9),i.set(c,r.y,l,9),i.set(c,r.y+1,l,12))}}}for(let e of[208,255]){for(let n of[201,211])i.fill(e-1,10,n-1,e+1,59,n+1,9),i.fill(e,49,n,e,58,n,10);i.fill(e-1,55,201,e+1,57,211,9)}}var gr={office:{id:"towerOffice",name:"\u529E\u516C\u4F53\u9A8C\u5C42",y:46},books:{id:"duoyun",name:"52F \xB7 \u6735\u4E91\u4E66\u9662",y:66}},uc={x:b.shanghai.x,y:26,z:b.shanghai.z-3},dc={id:"shanghai-tower-office",name:"\u4E0A\u6D77\u4E2D\u5FC3 \xB7 \u529E\u516C\u5C42",x:b.shanghai.x,y:26,z:b.shanghai.z+4.5},pc=[{x:b.shanghai.x-3.1,y:46,z:b.shanghai.z-1.7},{x:b.shanghai.x+3.1,y:46,z:b.shanghai.z-1.7}];function Fi(i,t){for(let e of Object.values(gr))for(let n=178;n<=201;n++)for(let s=95;s<=118;s++){let r=n+.5-b.shanghai.x,o=s+.5-b.shanghai.z,a=Math.hypot(r,o),h=Math.atan2(o,r),c=t(e.y+2,h)-.5;a<=c+.1&&(i.set(n,e.y-1,s,9),i.set(n,e.y+5,s,9));for(let l=e.y;l<e.y+5;l++)a<=t(l,h)+.5&&i.set(n,l,s,0)}for(let e=184;e<=195;e++)for(let n=101;n<=117;n++)Math.hypot(e+.5-b.shanghai.x,n+.5-b.shanghai.z)<6&&(i.fill(e,26,n,e,31,n,0),i.set(e,25,n,9));i.fill(187,26,110,191,30,118,0),i.fill(187,25,110,191,25,118,9)}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var Bi=0,ki=1,Hi=2,Vi=3,Gi=4,Wi=5,Xi=6,Yi=7;var ps=300;var Bn=1e3,We=1001,qi=1002;var xr=1006;var ms=1008;var yr=1009;var _r=1015;var Mr=1023;var tn=2300,kn=2301,Cn=2302,Zi=2400,$i=2401,Ji=2402;var gs="",G="srgb",xs="srgb-linear",ys="linear",Hn="srgb";var Ki=35044;var Xe=2e3,ji=2001,Le=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},K=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var xc=Math.PI/180,yc=180/Math.PI;function sn(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(K[i&255]+K[i>>8&255]+K[i>>16&255]+K[i>>24&255]+"-"+K[t&255]+K[t>>8&255]+"-"+K[t>>16&15|64]+K[t>>24&255]+"-"+K[e&63|128]+K[e>>8&255]+"-"+K[e>>16&255]+K[e>>24&255]+K[n&255]+K[n>>8&255]+K[n>>16&255]+K[n>>24&255]).toLowerCase()}function rt(i,t,e){return Math.max(t,Math.min(e,i))}function vr(i,t){return(i%t+t)%t}function In(i,t,e){return(1-e)*i+e*t}function Re(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function it(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Q=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(rt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},R=class i{constructor(t,e,n,s,r,o,a,h,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,h,c)}set(t,e,n,s,r,o,a,h,c){let l=this.elements;return l[0]=t,l[1]=s,l[2]=a,l[3]=e,l[4]=r,l[5]=h,l[6]=n,l[7]=o,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],h=n[6],c=n[1],l=n[4],f=n[7],u=n[2],d=n[5],p=n[8],m=s[0],g=s[3],x=s[6],S=s[1],C=s[4],T=s[7],v=s[2],A=s[5],E=s[8];return r[0]=o*m+a*S+h*v,r[3]=o*g+a*C+h*A,r[6]=o*x+a*T+h*E,r[1]=c*m+l*S+f*v,r[4]=c*g+l*C+f*A,r[7]=c*x+l*T+f*E,r[2]=u*m+d*S+p*v,r[5]=u*g+d*C+p*A,r[8]=u*x+d*T+p*E,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],h=t[6],c=t[7],l=t[8];return e*o*l-e*a*c-n*r*l+n*a*h+s*r*c-s*o*h}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],h=t[6],c=t[7],l=t[8],f=l*o-a*c,u=a*h-l*r,d=c*r-o*h,p=e*f+n*u+s*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return t[0]=f*m,t[1]=(s*c-l*n)*m,t[2]=(a*n-s*o)*m,t[3]=u*m,t[4]=(l*e-s*h)*m,t[5]=(s*r-a*e)*m,t[6]=d*m,t[7]=(n*h-c*e)*m,t[8]=(o*e-n*r)*m,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let h=Math.cos(r),c=Math.sin(r);return this.set(n*h,n*c,-n*(h*o+c*a)+o+t,-s*c,s*h,-s*(-c*o+h*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(zn.makeScale(t,e)),this}rotate(t){return this.premultiply(zn.makeRotation(-t)),this}translate(t,e){return this.premultiply(zn.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},zn=new R;function br(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Qi(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}var mt={enabled:!0,workingColorSpace:xs,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Hn&&(i.r=Tt(i.r),i.g=Tt(i.g),i.b=Tt(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Hn&&(i.r=ye(i.r),i.g=ye(i.g),i.b=ye(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===gs?ys:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Tt(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ye(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var ts=[.64,.33,.3,.6,.15,.06],es=[.2126,.7152,.0722],ns=[.3127,.329],is=new R().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ss=new R().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);mt.define({[xs]:{primaries:ts,whitePoint:ns,transfer:ys,toXYZ:is,fromXYZ:ss,luminanceCoefficients:es,workingColorSpaceConfig:{unpackColorSpace:G},outputColorSpaceConfig:{drawingBufferColorSpace:G}},[G]:{primaries:ts,whitePoint:ns,transfer:Hn,toXYZ:is,fromXYZ:ss,luminanceCoefficients:es,outputColorSpaceConfig:{drawingBufferColorSpace:G}}});var ce,Vn=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ce===void 0&&(ce=Qi("canvas")),ce.width=t.width,ce.height=t.height;let n=ce.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ce}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Qi("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Tt(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Tt(e[n]/255)*255):e[n]=Tt(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Sr=0,Gn=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Sr++}),this.uuid=sn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Pn(s[o].image)):r.push(Pn(s[o]))}else r=Pn(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Pn(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Vn.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Er=0,De=class i extends Le{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=We,s=We,r=xr,o=ms,a=Mr,h=yr,c=i.DEFAULT_ANISOTROPY,l=gs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Er++}),this.uuid=sn(),this.name="",this.source=new Gn(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=h,this.offset=new Q(0,0),this.repeat=new Q(1,1),this.center=new Q(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new R,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=l,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ps)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Bn:t.x=t.x-Math.floor(t.x);break;case We:t.x=t.x<0?0:1;break;case qi:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Bn:t.y=t.y-Math.floor(t.y);break;case We:t.y=t.y<0?0:1;break;case qi:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};De.DEFAULT_IMAGE=null;De.DEFAULT_MAPPING=ps;De.DEFAULT_ANISOTROPY=1;var Rt=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let h=n[s+0],c=n[s+1],l=n[s+2],f=n[s+3],u=r[o+0],d=r[o+1],p=r[o+2],m=r[o+3];if(a===0){t[e+0]=h,t[e+1]=c,t[e+2]=l,t[e+3]=f;return}if(a===1){t[e+0]=u,t[e+1]=d,t[e+2]=p,t[e+3]=m;return}if(f!==m||h!==u||c!==d||l!==p){let g=1-a,x=h*u+c*d+l*p+f*m,S=x>=0?1:-1,C=1-x*x;if(C>Number.EPSILON){let v=Math.sqrt(C),A=Math.atan2(v,x*S);g=Math.sin(g*A)/v,a=Math.sin(a*A)/v}let T=a*S;if(h=h*g+u*T,c=c*g+d*T,l=l*g+p*T,f=f*g+m*T,g===1-a){let v=1/Math.sqrt(h*h+c*c+l*l+f*f);h*=v,c*=v,l*=v,f*=v}}t[e]=h,t[e+1]=c,t[e+2]=l,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],h=n[s+1],c=n[s+2],l=n[s+3],f=r[o],u=r[o+1],d=r[o+2],p=r[o+3];return t[e]=a*p+l*f+h*d-c*u,t[e+1]=h*p+l*u+c*f-a*d,t[e+2]=c*p+l*d+a*u-h*f,t[e+3]=l*p-a*f-h*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,h=Math.sin,c=a(n/2),l=a(s/2),f=a(r/2),u=h(n/2),d=h(s/2),p=h(r/2);switch(o){case"XYZ":this._x=u*l*f+c*d*p,this._y=c*d*f-u*l*p,this._z=c*l*p+u*d*f,this._w=c*l*f-u*d*p;break;case"YXZ":this._x=u*l*f+c*d*p,this._y=c*d*f-u*l*p,this._z=c*l*p-u*d*f,this._w=c*l*f+u*d*p;break;case"ZXY":this._x=u*l*f-c*d*p,this._y=c*d*f+u*l*p,this._z=c*l*p+u*d*f,this._w=c*l*f-u*d*p;break;case"ZYX":this._x=u*l*f-c*d*p,this._y=c*d*f+u*l*p,this._z=c*l*p-u*d*f,this._w=c*l*f+u*d*p;break;case"YZX":this._x=u*l*f+c*d*p,this._y=c*d*f+u*l*p,this._z=c*l*p-u*d*f,this._w=c*l*f-u*d*p;break;case"XZY":this._x=u*l*f-c*d*p,this._y=c*d*f-u*l*p,this._z=c*l*p+u*d*f,this._w=c*l*f+u*d*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],h=e[9],c=e[2],l=e[6],f=e[10],u=n+a+f;if(u>0){let d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(l-h)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(n>a&&n>f){let d=2*Math.sqrt(1+n-a-f);this._w=(l-h)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>f){let d=2*Math.sqrt(1+a-n-f);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(h+l)/d}else{let d=2*Math.sqrt(1+f-n-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(h+l)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(rt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,h=e._y,c=e._z,l=e._w;return this._x=n*l+o*a+s*c-r*h,this._y=s*l+o*h+r*a-n*c,this._z=r*l+o*c+n*h-s*a,this._w=o*l-n*a-s*h-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let h=1-a*a;if(h<=Number.EPSILON){let d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}let c=Math.sqrt(h),l=Math.atan2(c,a),f=Math.sin((1-e)*l)/c,u=Math.sin(e*l)/c;return this._w=o*f+this._w*u,this._x=n*f+this._x*u,this._y=s*f+this._y*u,this._z=r*f+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},y=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(rs.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(rs.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,h=t.w,c=2*(o*s-a*n),l=2*(a*e-r*s),f=2*(r*n-o*e);return this.x=e+h*c+o*f-a*l,this.y=n+h*l+a*c-r*f,this.z=s+h*f+r*l-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,h=e.z;return this.x=s*h-r*a,this.y=r*o-n*h,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ln.copy(this).projectOnVector(t),this.sub(Ln)}reflect(t){return this.sub(Ln.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(rt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ln=new y,rs=new Rt,Kt=class{constructor(t=new y(1/0,1/0,1/0),e=new y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(xt.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(xt.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=xt.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,xt):xt.fromBufferAttribute(r,o),xt.applyMatrix4(t.matrixWorld),this.expandByPoint(xt);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ye.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ye.copy(n.boundingBox)),Ye.applyMatrix4(t.matrixWorld),this.union(Ye)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,xt),xt.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ce),qe.subVectors(this.max,Ce),he.subVectors(t.a,Ce),fe.subVectors(t.b,Ce),ue.subVectors(t.c,Ce),Pt.subVectors(fe,he),Lt.subVectors(ue,fe),Zt.subVectors(he,ue);let e=[0,-Pt.z,Pt.y,0,-Lt.z,Lt.y,0,-Zt.z,Zt.y,Pt.z,0,-Pt.x,Lt.z,0,-Lt.x,Zt.z,0,-Zt.x,-Pt.y,Pt.x,0,-Lt.y,Lt.x,0,-Zt.y,Zt.x,0];return!Dn(e,he,fe,ue,qe)||(e=[1,0,0,0,1,0,0,0,1],!Dn(e,he,fe,ue,qe))?!1:(Ze.crossVectors(Pt,Lt),e=[Ze.x,Ze.y,Ze.z],Dn(e,he,fe,ue,qe))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,xt).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(xt).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Et[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Et[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Et[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Et[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Et[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Et[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Et[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Et[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Et),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Et=[new y,new y,new y,new y,new y,new y,new y,new y],xt=new y,Ye=new Kt,he=new y,fe=new y,ue=new y,Pt=new y,Lt=new y,Zt=new y,Ce=new y,qe=new y,Ze=new y,$t=new y;function Dn(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){$t.fromArray(i,r);let a=s.x*Math.abs($t.x)+s.y*Math.abs($t.y)+s.z*Math.abs($t.z),h=t.dot($t),c=e.dot($t),l=n.dot($t);if(Math.max(-Math.max(h,c,l),Math.min(h,c,l))>a)return!1}return!0}var wr=new Kt,Ie=new y,Un=new y,Wn=class{constructor(t=new y,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):wr.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ie.subVectors(t,this.center);let e=Ie.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ie,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Un.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ie.copy(t.center).add(Un)),this.expandByPoint(Ie.copy(t.center).sub(Un))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}};var _t=class i{constructor(t,e,n,s,r,o,a,h,c,l,f,u,d,p,m,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,h,c,l,f,u,d,p,m,g)}set(t,e,n,s,r,o,a,h,c,l,f,u,d,p,m,g){let x=this.elements;return x[0]=t,x[4]=e,x[8]=n,x[12]=s,x[1]=r,x[5]=o,x[9]=a,x[13]=h,x[2]=c,x[6]=l,x[10]=f,x[14]=u,x[3]=d,x[7]=p,x[11]=m,x[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/de.setFromMatrixColumn(t,0).length(),r=1/de.setFromMatrixColumn(t,1).length(),o=1/de.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),h=Math.cos(s),c=Math.sin(s),l=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let u=o*l,d=o*f,p=a*l,m=a*f;e[0]=h*l,e[4]=-h*f,e[8]=c,e[1]=d+p*c,e[5]=u-m*c,e[9]=-a*h,e[2]=m-u*c,e[6]=p+d*c,e[10]=o*h}else if(t.order==="YXZ"){let u=h*l,d=h*f,p=c*l,m=c*f;e[0]=u+m*a,e[4]=p*a-d,e[8]=o*c,e[1]=o*f,e[5]=o*l,e[9]=-a,e[2]=d*a-p,e[6]=m+u*a,e[10]=o*h}else if(t.order==="ZXY"){let u=h*l,d=h*f,p=c*l,m=c*f;e[0]=u-m*a,e[4]=-o*f,e[8]=p+d*a,e[1]=d+p*a,e[5]=o*l,e[9]=m-u*a,e[2]=-o*c,e[6]=a,e[10]=o*h}else if(t.order==="ZYX"){let u=o*l,d=o*f,p=a*l,m=a*f;e[0]=h*l,e[4]=p*c-d,e[8]=u*c+m,e[1]=h*f,e[5]=m*c+u,e[9]=d*c-p,e[2]=-c,e[6]=a*h,e[10]=o*h}else if(t.order==="YZX"){let u=o*h,d=o*c,p=a*h,m=a*c;e[0]=h*l,e[4]=m-u*f,e[8]=p*f+d,e[1]=f,e[5]=o*l,e[9]=-a*l,e[2]=-c*l,e[6]=d*f+p,e[10]=u-m*f}else if(t.order==="XZY"){let u=o*h,d=o*c,p=a*h,m=a*c;e[0]=h*l,e[4]=-f,e[8]=c*l,e[1]=u*f+m,e[5]=o*l,e[9]=d*f-p,e[2]=p*f-d,e[6]=a*l,e[10]=m*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Tr,t,Ar)}lookAt(t,e,n){let s=this.elements;return lt.subVectors(t,e),lt.lengthSq()===0&&(lt.z=1),lt.normalize(),Dt.crossVectors(n,lt),Dt.lengthSq()===0&&(Math.abs(n.z)===1?lt.x+=1e-4:lt.z+=1e-4,lt.normalize(),Dt.crossVectors(n,lt)),Dt.normalize(),$e.crossVectors(lt,Dt),s[0]=Dt.x,s[4]=$e.x,s[8]=lt.x,s[1]=Dt.y,s[5]=$e.y,s[9]=lt.y,s[2]=Dt.z,s[6]=$e.z,s[10]=lt.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],h=n[8],c=n[12],l=n[1],f=n[5],u=n[9],d=n[13],p=n[2],m=n[6],g=n[10],x=n[14],S=n[3],C=n[7],T=n[11],v=n[15],A=s[0],E=s[4],w=s[8],P=s[12],L=s[1],O=s[5],U=s[9],N=s[13],k=s[2],$=s[6],dt=s[10],Wt=s[14],zt=s[3],q=s[7],J=s[11],at=s[15];return r[0]=o*A+a*L+h*k+c*zt,r[4]=o*E+a*O+h*$+c*q,r[8]=o*w+a*U+h*dt+c*J,r[12]=o*P+a*N+h*Wt+c*at,r[1]=l*A+f*L+u*k+d*zt,r[5]=l*E+f*O+u*$+d*q,r[9]=l*w+f*U+u*dt+d*J,r[13]=l*P+f*N+u*Wt+d*at,r[2]=p*A+m*L+g*k+x*zt,r[6]=p*E+m*O+g*$+x*q,r[10]=p*w+m*U+g*dt+x*J,r[14]=p*P+m*N+g*Wt+x*at,r[3]=S*A+C*L+T*k+v*zt,r[7]=S*E+C*O+T*$+v*q,r[11]=S*w+C*U+T*dt+v*J,r[15]=S*P+C*N+T*Wt+v*at,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],h=t[9],c=t[13],l=t[2],f=t[6],u=t[10],d=t[14],p=t[3],m=t[7],g=t[11],x=t[15];return p*(+r*h*f-s*c*f-r*a*u+n*c*u+s*a*d-n*h*d)+m*(+e*h*d-e*c*u+r*o*u-s*o*d+s*c*l-r*h*l)+g*(+e*c*f-e*a*d-r*o*f+n*o*d+r*a*l-n*c*l)+x*(-s*a*l-e*h*f+e*a*u+s*o*f-n*o*u+n*h*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],h=t[6],c=t[7],l=t[8],f=t[9],u=t[10],d=t[11],p=t[12],m=t[13],g=t[14],x=t[15],S=f*g*c-m*u*c+m*h*d-a*g*d-f*h*x+a*u*x,C=p*u*c-l*g*c-p*h*d+o*g*d+l*h*x-o*u*x,T=l*m*c-p*f*c+p*a*d-o*m*d-l*a*x+o*f*x,v=p*f*h-l*m*h-p*a*u+o*m*u+l*a*g-o*f*g,A=e*S+n*C+s*T+r*v;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let E=1/A;return t[0]=S*E,t[1]=(m*u*r-f*g*r-m*s*d+n*g*d+f*s*x-n*u*x)*E,t[2]=(a*g*r-m*h*r+m*s*c-n*g*c-a*s*x+n*h*x)*E,t[3]=(f*h*r-a*u*r-f*s*c+n*u*c+a*s*d-n*h*d)*E,t[4]=C*E,t[5]=(l*g*r-p*u*r+p*s*d-e*g*d-l*s*x+e*u*x)*E,t[6]=(p*h*r-o*g*r-p*s*c+e*g*c+o*s*x-e*h*x)*E,t[7]=(o*u*r-l*h*r+l*s*c-e*u*c-o*s*d+e*h*d)*E,t[8]=T*E,t[9]=(p*f*r-l*m*r-p*n*d+e*m*d+l*n*x-e*f*x)*E,t[10]=(o*m*r-p*a*r+p*n*c-e*m*c-o*n*x+e*a*x)*E,t[11]=(l*a*r-o*f*r-l*n*c+e*f*c+o*n*d-e*a*d)*E,t[12]=v*E,t[13]=(l*m*s-p*f*s+p*n*u-e*m*u-l*n*g+e*f*g)*E,t[14]=(p*a*s-o*m*s-p*n*h+e*m*h+o*n*g-e*a*g)*E,t[15]=(o*f*s-l*a*s+l*n*h-e*f*h-o*n*u+e*a*u)*E,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,h=t.z,c=r*o,l=r*a;return this.set(c*o+n,c*a-s*h,c*h+s*a,0,c*a+s*h,l*a+n,l*h-s*o,0,c*h-s*a,l*h+s*o,r*h*h+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,h=e._w,c=r+r,l=o+o,f=a+a,u=r*c,d=r*l,p=r*f,m=o*l,g=o*f,x=a*f,S=h*c,C=h*l,T=h*f,v=n.x,A=n.y,E=n.z;return s[0]=(1-(m+x))*v,s[1]=(d+T)*v,s[2]=(p-C)*v,s[3]=0,s[4]=(d-T)*A,s[5]=(1-(u+x))*A,s[6]=(g+S)*A,s[7]=0,s[8]=(p+C)*E,s[9]=(g-S)*E,s[10]=(1-(u+m))*E,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=de.set(s[0],s[1],s[2]).length(),o=de.set(s[4],s[5],s[6]).length(),a=de.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],yt.copy(this);let c=1/r,l=1/o,f=1/a;return yt.elements[0]*=c,yt.elements[1]*=c,yt.elements[2]*=c,yt.elements[4]*=l,yt.elements[5]*=l,yt.elements[6]*=l,yt.elements[8]*=f,yt.elements[9]*=f,yt.elements[10]*=f,e.setFromRotationMatrix(yt),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Xe){let h=this.elements,c=2*r/(e-t),l=2*r/(n-s),f=(e+t)/(e-t),u=(n+s)/(n-s),d,p;if(a===Xe)d=-(o+r)/(o-r),p=-2*o*r/(o-r);else if(a===ji)d=-o/(o-r),p=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return h[0]=c,h[4]=0,h[8]=f,h[12]=0,h[1]=0,h[5]=l,h[9]=u,h[13]=0,h[2]=0,h[6]=0,h[10]=d,h[14]=p,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Xe){let h=this.elements,c=1/(e-t),l=1/(n-s),f=1/(o-r),u=(e+t)*c,d=(n+s)*l,p,m;if(a===Xe)p=(o+r)*f,m=-2*f;else if(a===ji)p=r*f,m=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return h[0]=2*c,h[4]=0,h[8]=0,h[12]=-u,h[1]=0,h[5]=2*l,h[9]=0,h[13]=-d,h[2]=0,h[6]=0,h[10]=m,h[14]=-p,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},de=new y,yt=new _t,Tr=new y(0,0,0),Ar=new y(1,1,1),Dt=new y,$e=new y,lt=new y,os=new _t,as=new Rt,en=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],h=s[1],c=s[5],l=s[9],f=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(rt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-l,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-rt(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(h,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(rt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(h,r));break;case"ZYX":this._y=Math.asin(-rt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(h,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(rt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-rt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-l,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return os.makeRotationFromQuaternion(t),this.setFromRotationMatrix(os,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return as.setFromEuler(this),this.setFromQuaternion(as,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};en.DEFAULT_ORDER="XYZ";var Xn=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Rr=0,ls=new y,pe=new Rt,wt=new _t,Je=new y,ze=new y,Cr=new y,Ir=new Rt,cs=new y(1,0,0),hs=new y(0,1,0),fs=new y(0,0,1),us={type:"added"},zr={type:"removed"},me={type:"childadded",child:null},Nn={type:"childremoved",child:null},Nt=class i extends Le{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Rr++}),this.uuid=sn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new y,e=new en,n=new Rt,s=new y(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new _t},normalMatrix:{value:new R}}),this.matrix=new _t,this.matrixWorld=new _t,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Xn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return pe.setFromAxisAngle(t,e),this.quaternion.multiply(pe),this}rotateOnWorldAxis(t,e){return pe.setFromAxisAngle(t,e),this.quaternion.premultiply(pe),this}rotateX(t){return this.rotateOnAxis(cs,t)}rotateY(t){return this.rotateOnAxis(hs,t)}rotateZ(t){return this.rotateOnAxis(fs,t)}translateOnAxis(t,e){return ls.copy(t).applyQuaternion(this.quaternion),this.position.add(ls.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(cs,t)}translateY(t){return this.translateOnAxis(hs,t)}translateZ(t){return this.translateOnAxis(fs,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(wt.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Je.copy(t):Je.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ze.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wt.lookAt(ze,Je,this.up):wt.lookAt(Je,ze,this.up),this.quaternion.setFromRotationMatrix(wt),s&&(wt.extractRotation(s.matrixWorld),pe.setFromRotationMatrix(wt),this.quaternion.premultiply(pe.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(us),me.child=t,this.dispatchEvent(me),me.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(zr),Nn.child=t,this.dispatchEvent(Nn),Nn.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),wt.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),wt.multiply(t.parent.matrixWorld)),t.applyMatrix4(wt),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(us),me.child=t,this.dispatchEvent(me),me.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ze,t,Cr),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ze,Ir,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,h){return a[h.uuid]===void 0&&(a[h.uuid]=h.toJSON(t)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let h=a.shapes;if(Array.isArray(h))for(let c=0,l=h.length;c<l;c++){let f=h[c];r(t.shapes,f)}else r(t.shapes,h)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let h=0,c=this.material.length;h<c;h++)a.push(r(t.materials,this.material[h]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let h=this.animations[a];s.animations.push(r(t.animations,h))}}if(e){let a=o(t.geometries),h=o(t.materials),c=o(t.textures),l=o(t.images),f=o(t.shapes),u=o(t.skeletons),d=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),h.length>0&&(n.materials=h),c.length>0&&(n.textures=c),l.length>0&&(n.images=l),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=s,n;function o(a){let h=[];for(let c in a){let l=a[c];delete l.metadata,h.push(l)}return h}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};Nt.DEFAULT_UP=new y(0,1,0);Nt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var _s={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ut={h:0,s:0,l:0},Ke={h:0,s:0,l:0};function On(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var X=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=G){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,mt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=mt.workingColorSpace){return this.r=t,this.g=e,this.b=n,mt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=mt.workingColorSpace){if(t=vr(t,1),e=rt(e,0,1),n=rt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=On(o,r,t+1/3),this.g=On(o,r,t),this.b=On(o,r,t-1/3)}return mt.toWorkingColorSpace(this,s),this}setStyle(t,e=G){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=G){let n=_s[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Tt(t.r),this.g=Tt(t.g),this.b=Tt(t.b),this}copyLinearToSRGB(t){return this.r=ye(t.r),this.g=ye(t.g),this.b=ye(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=G){return mt.fromWorkingColorSpace(j.copy(this),t),Math.round(rt(j.r*255,0,255))*65536+Math.round(rt(j.g*255,0,255))*256+Math.round(rt(j.b*255,0,255))}getHexString(t=G){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=mt.workingColorSpace){mt.fromWorkingColorSpace(j.copy(this),e);let n=j.r,s=j.g,r=j.b,o=Math.max(n,s,r),a=Math.min(n,s,r),h,c,l=(a+o)/2;if(a===o)h=0,c=0;else{let f=o-a;switch(c=l<=.5?f/(o+a):f/(2-o-a),o){case n:h=(s-r)/f+(s<r?6:0);break;case s:h=(r-n)/f+2;break;case r:h=(n-s)/f+4;break}h/=6}return t.h=h,t.s=c,t.l=l,t}getRGB(t,e=mt.workingColorSpace){return mt.fromWorkingColorSpace(j.copy(this),e),t.r=j.r,t.g=j.g,t.b=j.b,t}getStyle(t=G){mt.fromWorkingColorSpace(j.copy(this),t);let e=j.r,n=j.g,s=j.b;return t!==G?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Ut),this.setHSL(Ut.h+t,Ut.s+e,Ut.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ut),t.getHSL(Ke);let n=In(Ut.h,Ke.h,e),s=In(Ut.s,Ke.s,e),r=In(Ut.l,Ke.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},j=new X;X.NAMES=_s;var H=new y,je=new Q,At=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ki,this.updateRanges=[],this.gpuType=_r,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)je.fromBufferAttribute(this,e),je.applyMatrix3(t),this.setXY(e,je.x,je.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)H.fromBufferAttribute(this,e),H.applyMatrix3(t),this.setXYZ(e,H.x,H.y,H.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)H.fromBufferAttribute(this,e),H.applyMatrix4(t),this.setXYZ(e,H.x,H.y,H.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)H.fromBufferAttribute(this,e),H.applyNormalMatrix(t),this.setXYZ(e,H.x,H.y,H.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)H.fromBufferAttribute(this,e),H.transformDirection(t),this.setXYZ(e,H.x,H.y,H.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Re(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=it(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Re(e,this.array)),e}setX(t,e){return this.normalized&&(e=it(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Re(e,this.array)),e}setY(t,e){return this.normalized&&(e=it(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Re(e,this.array)),e}setZ(t,e){return this.normalized&&(e=it(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Re(e,this.array)),e}setW(t,e){return this.normalized&&(e=it(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=it(e,this.array),n=it(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=it(e,this.array),n=it(n,this.array),s=it(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=it(e,this.array),n=it(n,this.array),s=it(s,this.array),r=it(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ki&&(t.usage=this.usage),t}};var Yn=class extends At{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var qn=class extends At{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var tt=class extends At{constructor(t,e,n){super(new Float32Array(t),e,n)}},Pr=0,pt=new _t,Fn=new Nt,ge=new y,ct=new Kt,Pe=new Kt,W=new y,Ct=class i extends Le{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pr++}),this.uuid=sn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(br(t)?qn:Yn)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new R().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return pt.makeRotationFromQuaternion(t),this.applyMatrix4(pt),this}rotateX(t){return pt.makeRotationX(t),this.applyMatrix4(pt),this}rotateY(t){return pt.makeRotationY(t),this.applyMatrix4(pt),this}rotateZ(t){return pt.makeRotationZ(t),this.applyMatrix4(pt),this}translate(t,e,n){return pt.makeTranslation(t,e,n),this.applyMatrix4(pt),this}scale(t,e,n){return pt.makeScale(t,e,n),this.applyMatrix4(pt),this}lookAt(t){return Fn.lookAt(t),Fn.updateMatrix(),this.applyMatrix4(Fn.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ge).negate(),this.translate(ge.x,ge.y,ge.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new tt(n,3))}else{for(let n=0,s=e.count;n<s;n++){let r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Kt);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new y(-1/0,-1/0,-1/0),new y(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];ct.setFromBufferAttribute(r),this.morphTargetsRelative?(W.addVectors(this.boundingBox.min,ct.min),this.boundingBox.expandByPoint(W),W.addVectors(this.boundingBox.max,ct.max),this.boundingBox.expandByPoint(W)):(this.boundingBox.expandByPoint(ct.min),this.boundingBox.expandByPoint(ct.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Wn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new y,1/0);return}if(t){let n=this.boundingSphere.center;if(ct.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Pe.setFromBufferAttribute(a),this.morphTargetsRelative?(W.addVectors(ct.min,Pe.min),ct.expandByPoint(W),W.addVectors(ct.max,Pe.max),ct.expandByPoint(W)):(ct.expandByPoint(Pe.min),ct.expandByPoint(Pe.max))}ct.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)W.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(W));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],h=this.morphTargetsRelative;for(let c=0,l=a.count;c<l;c++)W.fromBufferAttribute(a,c),h&&(ge.fromBufferAttribute(t,c),W.add(ge)),s=Math.max(s,n.distanceToSquared(W))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new At(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],h=[];for(let w=0;w<n.count;w++)a[w]=new y,h[w]=new y;let c=new y,l=new y,f=new y,u=new Q,d=new Q,p=new Q,m=new y,g=new y;function x(w,P,L){c.fromBufferAttribute(n,w),l.fromBufferAttribute(n,P),f.fromBufferAttribute(n,L),u.fromBufferAttribute(r,w),d.fromBufferAttribute(r,P),p.fromBufferAttribute(r,L),l.sub(c),f.sub(c),d.sub(u),p.sub(u);let O=1/(d.x*p.y-p.x*d.y);isFinite(O)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(f,-d.y).multiplyScalar(O),g.copy(f).multiplyScalar(d.x).addScaledVector(l,-p.x).multiplyScalar(O),a[w].add(m),a[P].add(m),a[L].add(m),h[w].add(g),h[P].add(g),h[L].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let w=0,P=S.length;w<P;++w){let L=S[w],O=L.start,U=L.count;for(let N=O,k=O+U;N<k;N+=3)x(t.getX(N+0),t.getX(N+1),t.getX(N+2))}let C=new y,T=new y,v=new y,A=new y;function E(w){v.fromBufferAttribute(s,w),A.copy(v);let P=a[w];C.copy(P),C.sub(v.multiplyScalar(v.dot(P))).normalize(),T.crossVectors(A,P);let O=T.dot(h[w])<0?-1:1;o.setXYZW(w,C.x,C.y,C.z,O)}for(let w=0,P=S.length;w<P;++w){let L=S[w],O=L.start,U=L.count;for(let N=O,k=O+U;N<k;N+=3)E(t.getX(N+0)),E(t.getX(N+1)),E(t.getX(N+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new At(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);let s=new y,r=new y,o=new y,a=new y,h=new y,c=new y,l=new y,f=new y;if(t)for(let u=0,d=t.count;u<d;u+=3){let p=t.getX(u+0),m=t.getX(u+1),g=t.getX(u+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,m),o.fromBufferAttribute(e,g),l.subVectors(o,r),f.subVectors(s,r),l.cross(f),a.fromBufferAttribute(n,p),h.fromBufferAttribute(n,m),c.fromBufferAttribute(n,g),a.add(l),h.add(l),c.add(l),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(m,h.x,h.y,h.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),l.subVectors(o,r),f.subVectors(s,r),l.cross(f),n.setXYZ(u+0,l.x,l.y,l.z),n.setXYZ(u+1,l.x,l.y,l.z),n.setXYZ(u+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)W.fromBufferAttribute(t,e),W.normalize(),t.setXYZ(e,W.x,W.y,W.z)}toNonIndexed(){function t(a,h){let c=a.array,l=a.itemSize,f=a.normalized,u=new c.constructor(h.length*l),d=0,p=0;for(let m=0,g=h.length;m<g;m++){a.isInterleavedBufferAttribute?d=h[m]*a.data.stride+a.offset:d=h[m]*l;for(let x=0;x<l;x++)u[p++]=c[d++]}return new At(u,l,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let h=s[a],c=t(h,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let h=[],c=r[a];for(let l=0,f=c.length;l<f;l++){let u=c[l],d=t(u,n);h.push(d)}e.morphAttributes[a]=h}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,h=o.length;a<h;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let h=this.parameters;for(let c in h)h[c]!==void 0&&(t[c]=h[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let h in n){let c=n[h];t.data.attributes[h]=c.toJSON(t.data)}let s={},r=!1;for(let h in this.morphAttributes){let c=this.morphAttributes[h],l=[];for(let f=0,u=c.length;f<u;f++){let d=c[f];l.push(d.toJSON(t.data))}l.length>0&&(s[h]=l,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let c in s){let l=s[c];this.setAttribute(c,l.clone(e))}let r=t.morphAttributes;for(let c in r){let l=[],f=r[c];for(let u=0,d=f.length;u<d;u++)l.push(f[u].clone(e));this.morphAttributes[c]=l}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,l=o.length;c<l;c++){let f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let h=t.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}};var et=class i extends Ct{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let h=[],c=[],l=[],f=[],u=0,d=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,s,o,2),p("x","z","y",1,-1,t,n,-e,s,o,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(h),this.setAttribute("position",new tt(c,3)),this.setAttribute("normal",new tt(l,3)),this.setAttribute("uv",new tt(f,2));function p(m,g,x,S,C,T,v,A,E,w,P){let L=T/E,O=v/w,U=T/2,N=v/2,k=A/2,$=E+1,dt=w+1,Wt=0,zt=0,q=new y;for(let J=0;J<dt;J++){let at=J*O-N;for(let le=0;le<$;le++){let Ve=le*L-U;q[m]=Ve*S,q[g]=at*C,q[x]=k,c.push(q.x,q.y,q.z),q[m]=0,q[g]=0,q[x]=A>0?1:-1,l.push(q.x,q.y,q.z),f.push(le/E),f.push(1-J/w),Wt+=1}}for(let J=0;J<w;J++)for(let at=0;at<E;at++){let le=u+at+$*J,Ve=u+at+$*(J+1),dr=u+(at+1)+$*(J+1),zi=u+(at+1)+$*J;h.push(le,Ve,zi),h.push(Ve,dr,zi),zt+=6}a.addGroup(d,zt,P),d+=zt,u+=Wt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Lr(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function st(i){let t={};for(let e=0;e<i.length;e++){let n=Lr(i[e]);for(let s in n)t[s]=n[s]}return t}var Dr=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ur=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Nr=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Or=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Fr=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Br=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,kr=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Hr=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vr=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Gr=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Wr=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Xr=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Yr=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,qr=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Zr=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,$r=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Jr=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Kr=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,jr=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Qr=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,to=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,eo=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,no=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,io=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,so=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ro=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,oo=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ao=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,lo=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,co=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ho="gl_FragColor = linearToOutputTexel( gl_FragColor );",fo=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,uo=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,po=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,mo=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,go=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xo=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,yo=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,_o=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Mo=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,vo=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,bo=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,So=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Eo=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,wo=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,To=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ao=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ro=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Co=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Io=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,zo=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Po=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Lo=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Do=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Uo=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,No=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Oo=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Fo=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Bo=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ko=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ho=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Vo=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Go=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Wo=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xo=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Yo=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,qo=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Zo=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$o=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jo=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ko=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jo=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Qo=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ta=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ea=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,na=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ia=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,sa=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ra=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,oa=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,aa=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,la=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ca=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,ha=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,fa=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ua=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,da=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,pa=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ma=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ga=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,xa=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ya=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,_a=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ma=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,va=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,ba=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Sa=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ea=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,wa=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ta=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Aa=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ra=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ca=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ia=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,za=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Pa=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,La=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Da=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Ua=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Na=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Oa=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fa=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ba=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ka=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ha=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Va=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ga=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Wa=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Xa=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ya=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,qa=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Za=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,$a=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ja=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ka=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ja=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Qa=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tl=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,el=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,nl=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,il=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sl=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,rl=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ol=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,al=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ll=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,cl=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,hl=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fl=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ul=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,dl=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,z={alphahash_fragment:Dr,alphahash_pars_fragment:Ur,alphamap_fragment:Nr,alphamap_pars_fragment:Or,alphatest_fragment:Fr,alphatest_pars_fragment:Br,aomap_fragment:kr,aomap_pars_fragment:Hr,batching_pars_vertex:Vr,batching_vertex:Gr,begin_vertex:Wr,beginnormal_vertex:Xr,bsdfs:Yr,iridescence_fragment:qr,bumpmap_pars_fragment:Zr,clipping_planes_fragment:$r,clipping_planes_pars_fragment:Jr,clipping_planes_pars_vertex:Kr,clipping_planes_vertex:jr,color_fragment:Qr,color_pars_fragment:to,color_pars_vertex:eo,color_vertex:no,common:io,cube_uv_reflection_fragment:so,defaultnormal_vertex:ro,displacementmap_pars_vertex:oo,displacementmap_vertex:ao,emissivemap_fragment:lo,emissivemap_pars_fragment:co,colorspace_fragment:ho,colorspace_pars_fragment:fo,envmap_fragment:uo,envmap_common_pars_fragment:po,envmap_pars_fragment:mo,envmap_pars_vertex:go,envmap_physical_pars_fragment:Ao,envmap_vertex:xo,fog_vertex:yo,fog_pars_vertex:_o,fog_fragment:Mo,fog_pars_fragment:vo,gradientmap_pars_fragment:bo,lightmap_pars_fragment:So,lights_lambert_fragment:Eo,lights_lambert_pars_fragment:wo,lights_pars_begin:To,lights_toon_fragment:Ro,lights_toon_pars_fragment:Co,lights_phong_fragment:Io,lights_phong_pars_fragment:zo,lights_physical_fragment:Po,lights_physical_pars_fragment:Lo,lights_fragment_begin:Do,lights_fragment_maps:Uo,lights_fragment_end:No,logdepthbuf_fragment:Oo,logdepthbuf_pars_fragment:Fo,logdepthbuf_pars_vertex:Bo,logdepthbuf_vertex:ko,map_fragment:Ho,map_pars_fragment:Vo,map_particle_fragment:Go,map_particle_pars_fragment:Wo,metalnessmap_fragment:Xo,metalnessmap_pars_fragment:Yo,morphinstance_vertex:qo,morphcolor_vertex:Zo,morphnormal_vertex:$o,morphtarget_pars_vertex:Jo,morphtarget_vertex:Ko,normal_fragment_begin:jo,normal_fragment_maps:Qo,normal_pars_fragment:ta,normal_pars_vertex:ea,normal_vertex:na,normalmap_pars_fragment:ia,clearcoat_normal_fragment_begin:sa,clearcoat_normal_fragment_maps:ra,clearcoat_pars_fragment:oa,iridescence_pars_fragment:aa,opaque_fragment:la,packing:ca,premultiplied_alpha_fragment:ha,project_vertex:fa,dithering_fragment:ua,dithering_pars_fragment:da,roughnessmap_fragment:pa,roughnessmap_pars_fragment:ma,shadowmap_pars_fragment:ga,shadowmap_pars_vertex:xa,shadowmap_vertex:ya,shadowmask_pars_fragment:_a,skinbase_vertex:Ma,skinning_pars_vertex:va,skinning_vertex:ba,skinnormal_vertex:Sa,specularmap_fragment:Ea,specularmap_pars_fragment:wa,tonemapping_fragment:Ta,tonemapping_pars_fragment:Aa,transmission_fragment:Ra,transmission_pars_fragment:Ca,uv_pars_fragment:Ia,uv_pars_vertex:za,uv_vertex:Pa,worldpos_vertex:La,background_vert:Da,background_frag:Ua,backgroundCube_vert:Na,backgroundCube_frag:Oa,cube_vert:Fa,cube_frag:Ba,depth_vert:ka,depth_frag:Ha,distanceRGBA_vert:Va,distanceRGBA_frag:Ga,equirect_vert:Wa,equirect_frag:Xa,linedashed_vert:Ya,linedashed_frag:qa,meshbasic_vert:Za,meshbasic_frag:$a,meshlambert_vert:Ja,meshlambert_frag:Ka,meshmatcap_vert:ja,meshmatcap_frag:Qa,meshnormal_vert:tl,meshnormal_frag:el,meshphong_vert:nl,meshphong_frag:il,meshphysical_vert:sl,meshphysical_frag:rl,meshtoon_vert:ol,meshtoon_frag:al,points_vert:ll,points_frag:cl,shadow_vert:hl,shadow_frag:fl,sprite_vert:ul,sprite_frag:dl},_={common:{diffuse:{value:new X(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new R},alphaMap:{value:null},alphaMapTransform:{value:new R},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new R}},envmap:{envMap:{value:null},envMapRotation:{value:new R},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new R}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new R}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new R},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new R},normalScale:{value:new Q(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new R},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new R}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new R}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new R}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new X(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new X(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new R},alphaTest:{value:0},uvTransform:{value:new R}},sprite:{diffuse:{value:new X(16777215)},opacity:{value:1},center:{value:new Q(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new R},alphaMap:{value:null},alphaMapTransform:{value:new R},alphaTest:{value:0}}},ds={basic:{uniforms:st([_.common,_.specularmap,_.envmap,_.aomap,_.lightmap,_.fog]),vertexShader:z.meshbasic_vert,fragmentShader:z.meshbasic_frag},lambert:{uniforms:st([_.common,_.specularmap,_.envmap,_.aomap,_.lightmap,_.emissivemap,_.bumpmap,_.normalmap,_.displacementmap,_.fog,_.lights,{emissive:{value:new X(0)}}]),vertexShader:z.meshlambert_vert,fragmentShader:z.meshlambert_frag},phong:{uniforms:st([_.common,_.specularmap,_.envmap,_.aomap,_.lightmap,_.emissivemap,_.bumpmap,_.normalmap,_.displacementmap,_.fog,_.lights,{emissive:{value:new X(0)},specular:{value:new X(1118481)},shininess:{value:30}}]),vertexShader:z.meshphong_vert,fragmentShader:z.meshphong_frag},standard:{uniforms:st([_.common,_.envmap,_.aomap,_.lightmap,_.emissivemap,_.bumpmap,_.normalmap,_.displacementmap,_.roughnessmap,_.metalnessmap,_.fog,_.lights,{emissive:{value:new X(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:z.meshphysical_vert,fragmentShader:z.meshphysical_frag},toon:{uniforms:st([_.common,_.aomap,_.lightmap,_.emissivemap,_.bumpmap,_.normalmap,_.displacementmap,_.gradientmap,_.fog,_.lights,{emissive:{value:new X(0)}}]),vertexShader:z.meshtoon_vert,fragmentShader:z.meshtoon_frag},matcap:{uniforms:st([_.common,_.bumpmap,_.normalmap,_.displacementmap,_.fog,{matcap:{value:null}}]),vertexShader:z.meshmatcap_vert,fragmentShader:z.meshmatcap_frag},points:{uniforms:st([_.points,_.fog]),vertexShader:z.points_vert,fragmentShader:z.points_frag},dashed:{uniforms:st([_.common,_.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:z.linedashed_vert,fragmentShader:z.linedashed_frag},depth:{uniforms:st([_.common,_.displacementmap]),vertexShader:z.depth_vert,fragmentShader:z.depth_frag},normal:{uniforms:st([_.common,_.bumpmap,_.normalmap,_.displacementmap,{opacity:{value:1}}]),vertexShader:z.meshnormal_vert,fragmentShader:z.meshnormal_frag},sprite:{uniforms:st([_.sprite,_.fog]),vertexShader:z.sprite_vert,fragmentShader:z.sprite_frag},background:{uniforms:{uvTransform:{value:new R},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:z.background_vert,fragmentShader:z.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new R}},vertexShader:z.backgroundCube_vert,fragmentShader:z.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:z.cube_vert,fragmentShader:z.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:z.equirect_vert,fragmentShader:z.equirect_frag},distanceRGBA:{uniforms:st([_.common,_.displacementmap,{referencePosition:{value:new y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:z.distanceRGBA_vert,fragmentShader:z.distanceRGBA_frag},shadow:{uniforms:st([_.lights,_.fog,{color:{value:new X(0)},opacity:{value:1}}]),vertexShader:z.shadow_vert,fragmentShader:z.shadow_frag}};ds.physical={uniforms:st([ds.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new R},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new R},clearcoatNormalScale:{value:new Q(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new R},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new R},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new R},sheen:{value:0},sheenColor:{value:new X(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new R},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new R},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new R},transmissionSamplerSize:{value:new Q},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new R},attenuationDistance:{value:0},attenuationColor:{value:new X(0)},specularColor:{value:new X(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new R},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new R},anisotropyVector:{value:new Q},anisotropyMap:{value:null},anisotropyMapTransform:{value:new R}}]),vertexShader:z.meshphysical_vert,fragmentShader:z.meshphysical_frag};var Jt=(1+Math.sqrt(5))/2,xe=1/Jt,_c=[new y(-Jt,xe,0),new y(Jt,xe,0),new y(-xe,0,Jt),new y(xe,0,Jt),new y(0,Jt,-xe),new y(0,Jt,xe),new y(-1,1,-1),new y(1,1,-1),new y(-1,1,1),new y(1,1,1)];var Mc=new Float32Array(16),vc=new Float32Array(9),bc=new Float32Array(4);var Sc={[Bi]:ki,[Hi]:Xi,[Gi]:Yi,[Vi]:Wi,[ki]:Bi,[Xi]:Hi,[Yi]:Gi,[Wi]:Vi};var ht=class extends Nt{constructor(){super(),this.isGroup=!0,this.type="Group"}};var Ue=class i extends Ct{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,h=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:h};let c=this;s=Math.floor(s),r=Math.floor(r);let l=[],f=[],u=[],d=[],p=0,m=[],g=n/2,x=0;S(),o===!1&&(t>0&&C(!0),e>0&&C(!1)),this.setIndex(l),this.setAttribute("position",new tt(f,3)),this.setAttribute("normal",new tt(u,3)),this.setAttribute("uv",new tt(d,2));function S(){let T=new y,v=new y,A=0,E=(e-t)/n;for(let w=0;w<=r;w++){let P=[],L=w/r,O=L*(e-t)+t;for(let U=0;U<=s;U++){let N=U/s,k=N*h+a,$=Math.sin(k),dt=Math.cos(k);v.x=O*$,v.y=-L*n+g,v.z=O*dt,f.push(v.x,v.y,v.z),T.set($,E,dt).normalize(),u.push(T.x,T.y,T.z),d.push(N,1-L),P.push(p++)}m.push(P)}for(let w=0;w<s;w++)for(let P=0;P<r;P++){let L=m[P][w],O=m[P+1][w],U=m[P+1][w+1],N=m[P][w+1];(t>0||P!==0)&&(l.push(L,O,N),A+=3),(e>0||P!==r-1)&&(l.push(O,U,N),A+=3)}c.addGroup(x,A,0),x+=A}function C(T){let v=p,A=new Q,E=new y,w=0,P=T===!0?t:e,L=T===!0?1:-1;for(let U=1;U<=s;U++)f.push(0,g*L,0),u.push(0,L,0),d.push(.5,.5),p++;let O=p;for(let U=0;U<=s;U++){let k=U/s*h+a,$=Math.cos(k),dt=Math.sin(k);E.x=P*dt,E.y=g*L,E.z=P*$,f.push(E.x,E.y,E.z),u.push(0,L,0),A.x=$*.5+.5,A.y=dt*.5*L+.5,d.push(A.x,A.y),p++}for(let U=0;U<s;U++){let N=v+U,k=O+U;T===!0?l.push(k,k+1,N):l.push(k+1,k,N),w+=3}c.addGroup(x,w,T===!0?1:2),x+=w}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var Ne=class i extends Ct{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let h=Math.min(o+a,Math.PI),c=0,l=[],f=new y,u=new y,d=[],p=[],m=[],g=[];for(let x=0;x<=n;x++){let S=[],C=x/n,T=0;x===0&&o===0?T=.5/e:x===n&&h===Math.PI&&(T=-.5/e);for(let v=0;v<=e;v++){let A=v/e;f.x=-t*Math.cos(s+A*r)*Math.sin(o+C*a),f.y=t*Math.cos(o+C*a),f.z=t*Math.sin(s+A*r)*Math.sin(o+C*a),p.push(f.x,f.y,f.z),u.copy(f).normalize(),m.push(u.x,u.y,u.z),g.push(A+T,1-C),S.push(c++)}l.push(S)}for(let x=0;x<n;x++)for(let S=0;S<e;S++){let C=l[x][S+1],T=l[x][S],v=l[x+1][S],A=l[x+1][S+1];(x!==0||o>0)&&d.push(C,T,A),(x!==n-1||h<Math.PI)&&d.push(T,v,A)}this.setIndex(d),this.setAttribute("position",new tt(p,3)),this.setAttribute("normal",new tt(m,3)),this.setAttribute("uv",new tt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function Qe(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function pl(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var _e=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let h=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===h)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Zn=class extends _e{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Zi,endingEnd:Zi}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],h=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case $i:r=t,a=2*e-n;break;case Ji:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(h===void 0)switch(this.getSettings_().endingEnd){case $i:o=t,h=2*n-e;break;case Ji:o=1,h=n+s[1]-s[0];break;default:o=t-1,h=e}let c=(n-e)*.5,l=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(h-n),this._offsetPrev=r*l,this._offsetNext=o*l}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,h=t*a,c=h-a,l=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,p=(n-e)/(s-e),m=p*p,g=m*p,x=-u*g+2*u*m-u*p,S=(1+u)*g+(-1.5-2*u)*m+(-.5+u)*p+1,C=(-1-d)*g+(1.5+d)*m+.5*p,T=d*g-d*m;for(let v=0;v!==a;++v)r[v]=x*o[l+v]+S*o[c+v]+C*o[h+v]+T*o[f+v];return r}},$n=class extends _e{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,h=t*a,c=h-a,l=(n-e)/(s-e),f=1-l;for(let u=0;u!==a;++u)r[u]=o[c+u]*f+o[h+u]*l;return r}},Jn=class extends _e{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Mt=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Qe(e,this.TimeBufferType),this.values=Qe(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Qe(t.times,Array),values:Qe(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Jn(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new $n(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Zn(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case tn:e=this.InterpolantFactoryMethodDiscrete;break;case kn:e=this.InterpolantFactoryMethodLinear;break;case Cn:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return tn;case this.InterpolantFactoryMethodLinear:return kn;case this.InterpolantFactoryMethodSmooth:return Cn}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let h=n[a];if(typeof h=="number"&&isNaN(h)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,h),t=!1;break}if(o!==null&&o>h){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,h,o),t=!1;break}o=h}if(s!==void 0&&pl(s))for(let a=0,h=s.length;a!==h;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Cn,r=t.length-1,o=1;for(let a=1;a<r;++a){let h=!1,c=t[a],l=t[a+1];if(c!==l&&(a!==1||c!==t[0]))if(s)h=!0;else{let f=a*n,u=f-n,d=f+n;for(let p=0;p!==n;++p){let m=e[f+p];if(m!==e[u+p]||m!==e[d+p]){h=!0;break}}}if(h){if(a!==o){t[o]=t[a];let f=a*n,u=o*n;for(let d=0;d!==n;++d)e[u+d]=e[f+d]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,h=o*n,c=0;c!==n;++c)e[h+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Mt.prototype.TimeBufferType=Float32Array;Mt.prototype.ValueBufferType=Float32Array;Mt.prototype.DefaultInterpolation=kn;var jt=class extends Mt{constructor(t,e,n){super(t,e,n)}};jt.prototype.ValueTypeName="bool";jt.prototype.ValueBufferType=Array;jt.prototype.DefaultInterpolation=tn;jt.prototype.InterpolantFactoryMethodLinear=void 0;jt.prototype.InterpolantFactoryMethodSmooth=void 0;var Kn=class extends Mt{};Kn.prototype.ValueTypeName="color";var jn=class extends Mt{};jn.prototype.ValueTypeName="number";var Qn=class extends _e{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,h=(n-e)/(s-e),c=t*a;for(let l=c+a;c!==l;c+=4)Rt.slerpFlat(r,0,o,c-a,o,c,h);return r}},nn=class extends Mt{InterpolantFactoryMethodLinear(t){return new Qn(this.times,this.values,this.getValueSize(),t)}};nn.prototype.ValueTypeName="quaternion";nn.prototype.InterpolantFactoryMethodSmooth=void 0;var Qt=class extends Mt{constructor(t,e,n){super(t,e,n)}};Qt.prototype.ValueTypeName="string";Qt.prototype.ValueBufferType=Array;Qt.prototype.DefaultInterpolation=tn;Qt.prototype.InterpolantFactoryMethodLinear=void 0;Qt.prototype.InterpolantFactoryMethodSmooth=void 0;var ti=class extends Mt{};ti.prototype.ValueTypeName="vector";var ei=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,h,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(l){a++,r===!1&&s.onStart!==void 0&&s.onStart(l,o,a),r=!0},this.itemEnd=function(l){o++,s.onProgress!==void 0&&s.onProgress(l,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(l){s.onError!==void 0&&s.onError(l)},this.resolveURL=function(l){return h?h(l):l},this.setURLModifier=function(l){return h=l,this},this.addHandler=function(l,f){return c.push(l,f),this},this.removeHandler=function(l){let f=c.indexOf(l);return f!==-1&&c.splice(f,2),this},this.getHandler=function(l){for(let f=0,u=c.length;f<u;f+=2){let d=c[f],p=c[f+1];if(d.global&&(d.lastIndex=0),d.test(l))return p}return null}}},ml=new ei,ni=class{constructor(t){this.manager=t!==void 0?t:ml,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};ni.DEFAULT_MATERIAL_NAME="__DEFAULT";var si="\\[\\]\\.:\\/",gl=new RegExp("["+si+"]","g"),ri="[^"+si+"]",xl="[^"+si.replace("\\.","")+"]",yl=/((?:WC+[\/:])*)/.source.replace("WC",ri),_l=/(WCOD+)?/.source.replace("WCOD",xl),Ml=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ri),vl=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ri),bl=new RegExp("^"+yl+_l+Ml+vl+"$"),Sl=["material","materials","bones","map"],ii=class{constructor(t,e,n){let s=n||B.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},B=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(gl,"")}static parseTrackName(t){let e=bl.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Sl.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let h=n(a.children);if(h)return h}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let l=0;l<t.length;l++)if(t[l].name===c){c=l;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let h=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}h=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(h=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(h=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[h],this.setValue=this.SetterByBindingTypeAndVersioning[h][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};B.Composite=ii;B.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};B.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};B.prototype.GetterByBindingType=[B.prototype._getValue_direct,B.prototype._getValue_array,B.prototype._getValue_arrayElement,B.prototype._getValue_toArray];B.prototype.SetterByBindingTypeAndVersioning=[[B.prototype._setValue_direct,B.prototype._setValue_direct_setNeedsUpdate,B.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[B.prototype._setValue_array,B.prototype._setValue_array_setNeedsUpdate,B.prototype._setValue_array_setMatrixWorldNeedsUpdate],[B.prototype._setValue_arrayElement,B.prototype._setValue_arrayElement_setNeedsUpdate,B.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[B.prototype._setValue_fromArray,B.prototype._setValue_fromArray_setNeedsUpdate,B.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ec=new Float32Array(1);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");function oi(i,t){let e=i.rotation.y;return{x:i.position.x+t.x*Math.cos(e)+t.z*Math.sin(e),z:i.position.z-t.x*Math.sin(e)+t.z*Math.cos(e)}}var Oe=190,rn=30;function vs(i,t=0){let e=((i+t*Oe/2)%Oe+Oe)%Oe,n=Math.PI*1.5+Math.max(0,e-rn)/(Oe-rn)*Math.PI*2,s=78+40*Math.cos(n),r=-40*Math.sin(n),o=(I(s+.01)-I(s-.01))/.02,a=o*r+13*Math.cos(n);return{x:I(s)-32+13*Math.sin(n),y:22.22,z:s,yaw:Math.atan2(a,r)+Math.PI,moored:e<rn,remaining:rn-e}}var Pc=new et(1,1,1);function Tl(i){let t=2166136261;for(let e of i)t=Math.imul(t^e.charCodeAt(0),16777619);return t>>>0}var Al=["lane","warehouse","terrace","courtyard","deco"],an=["slab","setback","chamfer","split","lantern","slope"],bs=["#497c94","#83a6b8","#527b80","#a3b1be","#546c86","#b7c3ca"],Ss=["#d5d3c9","#adb3b9","#a59787","#e3daca","#b5b0aa","#b97f68"],Rl={"ifc-north":"chamfer","ifc-south":"chamfer","boc-pudong":"slope",aurora:"slab","shangrila-river":"terrace","shangrila-grand":"setback","bank-shanghai":"lantern",stock:"split"},Cl={"ifc-north":"#82a4b3","ifc-south":"#82a4b3","boc-pudong":"#557e89","shangrila-river":"#c4c9c9","shangrila-grand":"#b5bdc2",magnolia:"#acc2cf"};function hi(i){let t=Tl(i.id),e=/back|infill|front/.test(i.id),n=i.bank==="west"&&e,s=I(i.z)-D-i.x,r=n?s>145&&t%5<2:i.bank==="east"&&!["convention","mall"].includes(i.kind)||i.kind==="glass",o=n&&s>100?["terrace","courtyard","deco"]:Al,a=i.form??Rl[i.id]??(e?r?an[t%an.length]:o[t%o.length]:r?an[t%an.length]:"landmark"),h=i.bank==="east"&&e&&i.x<213&&i.z<70,c=i.district==="historic-block"?i.h:n?s<100?8+t%8:s<145?14+t%12:r?28+t%15:17+t%14:h?Math.min(i.h,34+t%5):i.h,l=a==="lane"?Math.min(c,7+t%4):a==="warehouse"?Math.min(c,10+t%5):c;return{seed:t,form:a,modern:r,height:l,wall:r?i.kind==="hotel"?9:11:a==="warehouse"||a==="lane"?8:[9,3,6][t%3],trim:r&&t%3===0?3:9,roof:a==="lane"?4:a==="warehouse"?8:3,color:Cl[i.id]??(i.kind==="gold"?"#b59c54":r?bs[(t>>>8)%bs.length]:Ss[t%Ss.length]),floor:r?4+(t>>>6)%3:3,spacing:a==="warehouse"?4:r?2+(t>>>2)%2:3}}function cn(i,t,e){let n=i.rx,s=i.rz,r=0,o=!1,a=e/t.height;if(e>=5){if(t.form==="slab"&&(t.seed%2?n=Math.max(2,n-2):s=Math.max(2,s-2)),t.form==="setback"||t.form==="deco"||t.form==="terrace"){let h=a>.82?2:a>.58?1:0;n=Math.max(2,n-h),s=Math.max(2,s-h)}(t.form==="chamfer"||t.form==="lantern")&&(r=Math.min(2,n-1,s-1)),t.form==="split"&&(o=!0),t.form==="slope"&&a>.68&&(n=Math.max(2,n-Math.floor((a-.68)*10)))}return{rx:n,rz:s,cut:r,notch:o}}function ln(i,t,e){return Math.abs(t)<=i.rx&&Math.abs(e)<=i.rz&&Math.abs(t)+Math.abs(e)<=i.rx+i.rz-i.cut&&!(i.notch&&Math.abs(t)<=1&&e>=i.rz-1)}function Es(i,t,e){let{x:n,z:s}=t;for(let a=0;a<e.height;a++){let h=cn(t,e,a),c=cn(t,e,a+1),l=26+a;for(let f=-h.rx;f<=h.rx;f++)for(let u=-h.rz;u<=h.rz;u++){if(!ln(h,f,u))continue;if(![[1,0],[-1,0],[0,1],[0,-1]].some(([S,C])=>!ln(h,f+S,u+C))){ln(c,f,u)||i.set(n+f,l,s+u,e.trim);continue}let p=Math.abs(f)===h.rx?u:f,m=a%e.floor>=1&&a%e.floor<=2&&(p+e.seed)%e.spacing===0,g=p%4===0,x=a%e.floor===0;i.set(n+f,l,s+u,e.modern?a<5||g||x?e.trim:e.wall:m?11:x&&e.form!=="lane"?e.trim:e.wall)}}let r=cn(t,e,e.height-1),o=26+e.height;for(let a=-r.rx;a<=r.rx;a++)for(let h=-r.rz;h<=r.rz;h++)ln(r,a,h)&&i.set(n+a,o,s+h,e.roof);if(e.form==="lane"||e.form==="warehouse"){let a=e.seed%2===0,h=a?r.rz:r.rx;for(let c=0;c<=h;c++)for(let l=-r.rx;l<=r.rx;l++)for(let f=-r.rz;f<=r.rz;f++)Math.abs(a?f:l)<=h-c&&i.set(n+l,o+c,s+f,e.roof);i.fill(n+r.rx-1,o+1,s-r.rz+1,n+r.rx-1,o+4,s-r.rz+1,8)}else if(e.form==="deco"||e.form==="lantern")i.fill(n-1,o+1,s-1,n+1,o+4,s+1,e.trim),i.set(n,o+5,s,9);else if(i.fill(n-1,o+1,s-1,n+1,o+2,s+1,3),e.form==="terrace"||e.form==="courtyard")for(let a of[-r.rx+1,r.rx-1])i.fill(n+a,o+1,s-r.rz+1,n+a,o+1,s+r.rz-1,5);e.form==="courtyard"&&r.rx>=4&&r.rz>=4&&i.fill(n-1,o,s-1,n+1,o+1,s+1,11)}var M={x:-46,y:26,z:188,minX:-130,maxX:34,minZ:146,maxZ:276,entry:{x:-46.5,y:26,z:150.5,name:"\u8C6B\u56ED \xB7 \u5317\u95E8\u724C\u574A"},tea:{x:-46,y:26,z:178},snack:{x:-26,y:26,z:271},riddle:{x:-62,y:26,z:203},arrival:{x:-43.5,y:26,z:159.5,name:"\u8C6B\u56ED \xB7 \u4E5D\u66F2\u6865\u4E0E\u6E56\u5FC3\u4EAD"}},ve={...M,z:M.z+60,minZ:M.minZ+60,maxZ:M.maxZ+60,...Object.fromEntries(["entry","tea","snack","riddle","arrival"].map(i=>[i,{...M[i],z:M[i].z+60}]))};var ws=[[-86,212],[-77,212],[-77,218],[-72,218]],Ts=[[-86,262],[-77,262],[-77,265],[-70,265]];var Il=[{id:"north",axis:"z",x:-35,z:194},{id:"west",axis:"x",x:-75,z:205}],zl=[{axis:"z",x:-46,z:194,y:28.5,r:1.1},{axis:"z",x:-46,z:208,y:28.5,r:1.1}],fn=[{x1:-61.2,x2:-25.5,z1:166,z2:193.8},{x1:-66,x2:-24,z1:230,z2:242},{x1:-23,x2:2,z1:198,z2:223}],Pl=[{x1:-73,x2:-67,z1:155,z2:166},{x1:-41,x2:-32,z1:156,z2:165},{x1:-25,x2:-19,z1:177,z2:187},{x1:-72,x2:-67,z1:195,z2:202},{x1:-54,x2:-44,z1:198,z2:207},{x1:-39,x2:-30,z1:203,z2:208},{x1:-49,x2:-38,z1:219,z2:226},{x1:-74,x2:-62,z1:212,z2:228},{x1:-60,x2:-42,z1:244,z2:256},{x1:-58,x2:-42,z1:222,z2:232}],As=[[-35,194],[-35,196],[-40,197.5],[-45,196.5],[-50,198],[-54,197.5],[-54,204],[-60,204],[-68,205],[-75,205]],Rs=[[-35,196],[-35,204],[-35,211],[-29.5,211]],Cs=[[2.5,211],[5,215],[5,225]],Is=[[-54,204],[-60,214],[-62,226],[-62,246],[-52,248],[-42,248]],Ll=[[-75,205],[-86,206],[-94,206],[-94,222],[-86,226],[-78,226],[-68,226]];function Dl(i,t,e=3){return gt(i,t,As,e)||gt(i,t,Rs,e)||gt(i,t,Cs,e)||gt(i,t,Is,e)||gt(i,t,Ll,e)}function Ul(i,t,e){let n=(e.x1+e.x2)/2,s=(e.z1+e.z2)/2,r=(e.x2-e.x1)/2,o=(e.z2-e.z1)/2;return((i-n)/r)**2+((t-s)/o)**2<.9+.1*Math.sin(i*1.3+t*.7)&&!Dl(i,t,1.6)&&!fn.some(a=>i>=a.x1-1&&i<=a.x2+1&&t>=a.z1-1&&t<=a.z2+1)}var hn=[[-64,173],[-58,173],[-58,176],[-54,176],[-54,184],[-51,184],[-51,178],[-40,178],[-40,184],[-35,184],[-35,192]];function gt(i,t,e,n=3){return e.some((s,r)=>{if(!r)return!1;let o=e[r-1],a=s[0]-o[0],h=s[1]-o[1],c=Math.max(0,Math.min(1,((i-o[0])*a+(t-o[1])*h)/(a*a+h*h||1)));return Math.hypot(i-o[0]-c*a,t-o[1]-c*h)<=n})}function un(i,t){return i>=ve.minX-2&&i<=ve.maxX+2&&t>=ve.minZ-2&&t<=ve.maxZ+2||gt(i,t,ws,2)||gt(i,t,Ts,2)}var Nl=[{id:"huxinting",x:-46,z:178,rx:2.5,rz:2.5,levels:1},{id:"tea-gallery",x:-74,z:158,rx:5,rz:3,levels:1},{id:"lubolang",x:-20,z:188,rx:5,rz:4,levels:2},{id:"nanxiang",x:-26,z:271,rx:6,rz:3,levels:2},{id:"craft-shop",x:-62,z:271,rx:6,rz:3,levels:2},{id:"bazaar-west-candy",x:-107,z:156,rx:5,rz:4,levels:2},{id:"bazaar-stage",x:-107,z:172,rx:5,rz:4,levels:2},{id:"old-city-west",x:-107,z:188,rx:5,rz:6,levels:3},{id:"bazaar-west-herbs",x:-107,z:204,rx:5,rz:5,levels:2},{id:"west-craft-hall",x:-107,z:220,rx:5,rz:4,levels:2},{id:"west-wine-shop",x:-107,z:236,rx:5,rz:4,levels:2},{id:"west-tea-house",x:-107,z:252,rx:5,rz:4,levels:2},{id:"huabao-lou",x:-86,z:172,rx:5,rz:6,levels:3},{id:"tonghanchun",x:-86,z:188,rx:5,rz:4,levels:2},{id:"west-bazaar-2",x:-86,z:226,rx:5,rz:3,levels:2},{id:"west-bazaar-3",x:-86,z:238,rx:5,rz:3,levels:2},{id:"west-bazaar-4",x:-86,z:250,rx:5,rz:3,levels:2},{id:"tianyu-lou",x:8,z:172,rx:4,rz:6,levels:3},{id:"hefeng-lou",x:8,z:188,rx:4,rz:4,levels:2},{id:"shanghai-hotel",x:8,z:204,rx:4,rz:6,levels:3},{id:"ningbo-tangtuan",x:8,z:220,rx:4,rz:4,levels:2},{id:"old-city-east",x:8,z:236,rx:4,rz:6,levels:3},{id:"bazaar-east-gold",x:8,z:252,rx:4,rz:4,levels:2},{id:"old-city-northeast",x:25,z:156,rx:4,rz:4,levels:2},...Array.from({length:7},(i,t)=>({id:"yuyuan-street-"+t,x:25,z:168+t*12,rx:4,rz:4,levels:2})),{id:"old-city-south",x:-49,z:271,rx:7,rz:3,levels:2},{id:"yuyuan-south-west",x:-78,z:271,rx:6,rz:3,levels:2},{id:"yuyuan-south-east",x:-18,z:271,rx:6,rz:3,levels:2},{id:"sansui-tang",x:-71,z:198,rx:4,rz:3,levels:1,historic:"sansui"},{id:"yangshan-tang",x:-62,z:216,rx:4,rz:3,levels:2,historic:"yangshan"},{id:"dianchun-tang",x:-52,z:232,rx:4,rz:3,levels:1,historic:"dianchun"},{id:"yuhua-tang",x:-58,z:248,rx:3.5,rz:3,levels:1,historic:"yuhua"},{id:"wangjiang-ting",x:-72,z:224,rx:2.5,rz:2.5,levels:1,historic:"wangjiang"}];function zs(i){for(let e=-55;e<=-25;e++)for(let n=80;n<=210;n++)i.get(e,25,n)||(i.fill(e,18,n,e,24,n,3),i.set(e,25,n,9));for(let e=M.minX-2;e<=M.maxX+2;e++)for(let n=M.minZ+60-2;n<=M.maxZ+60+2;n++)i.get(e,25,n)||(i.fill(e,18,n,e,24,n,3),i.set(e,25,n,9));for(let e of[ws,Ts])for(let n=1;n<e.length;n++){let s=e[n-1],r=e[n];i.fill(Math.min(s[0],r[0])-2,25,Math.min(s[1],r[1])-2,Math.max(s[0],r[0])+2,25,Math.max(s[1],r[1])+2,9),i.fill(Math.min(s[0],r[0])-2,26,Math.min(s[1],r[1])-2,Math.max(s[0],r[0])+2,29,Math.max(s[1],r[1])+2,0)}let t={get:(e,n,s)=>i.get(e,n,s+60),set:(e,n,s,r)=>i.set(e,n,s+60,r),fill:(e,n,s,r,o,a,h)=>i.fill(e,n,s+60,r,o,a+60,h)};t.fill(M.minX,18,M.minZ,M.maxX,24,M.maxZ,3),t.fill(M.minX,26,M.minZ,M.maxX,35,M.maxZ,0),t.fill(M.minX,25,M.minZ,M.maxX,25,M.maxZ,9),t.fill(-61,20,166,-26,20,194,3),t.fill(-61,21,166,-26,25,194,0),t.fill(-50,25,174,-42,25,182,7);for(let e of[-2.5,2.5])for(let n of[-2.5,2.5])t.fill(Math.round(-46+e),21,Math.round(178+n),Math.round(-46+e),24,Math.round(178+n),9);for(let e=1;e<hn.length;e++){let n=hn[e-1],s=hn[e];t.fill(Math.min(n[0],s[0])-1,25,Math.min(n[1],s[1])-1,Math.max(n[0],s[0])+1,25,Math.max(n[1],s[1])+1,7),t.fill(n[0],21,n[1],n[0],24,n[1],9)}t.fill(-36,25,188,-34,25,194,7),t.fill(-62,25,170,-59,25,193,7);for(let e of[-61,-59])for(let n of[170,176,181,186,192])t.fill(e,21,n,e,24,n,9);for(let e of fn.slice(1))t.fill(e.x1,20,e.z1,e.x2,20,e.z2,3),t.fill(e.x1,21,e.z1,e.x2,25,e.z2,0);for(let e=-68;e<=-22;e++)for(let n=228;n<=244;n++)t.fill(e,21,n,e,32,n,0),t.fill(e,20,n,e,20,n,3);t.fill(-38,26,208,5,36,214,0);for(let e=-76;e<=3;e++)for(let n=148;n<=265;n++)fn.some(s=>e>=s.x1&&e<=s.x2&&n>=s.z1&&n<=s.z2)||e>=-48&&e<=-44&&n<=160||gt(e,n,hn,1.2)||t.set(e,25,n,1);for(let e of Pl)for(let n=e.x1;n<=e.x2;n++)for(let s=e.z1;s<=e.z2;s++)Ul(n+.5,s+.5,e)&&t.set(n,25,s,1);for(let e=148;e<=268;e++){for(let n=M.minX;n<=-80;n++)t.set(n,25,e,9);for(let n=5;n<=M.maxX;n++)t.set(n,25,e,9)}t.fill(M.minX,26,M.minZ,M.minX,28,M.maxZ,9),t.fill(M.maxX,26,M.minZ,M.maxX,28,M.maxZ,9),t.fill(M.minX,26,M.minZ,M.maxX,28,M.minZ,9),t.fill(M.minX,26,M.maxZ,M.maxX,28,M.maxZ,9),t.fill(-48,26,M.minZ,-45,32,M.minZ+16,0);for(let e of[-52,-49,-44,-41])t.fill(e,26,148,e,29,148,9);t.fill(-118,26,M.minZ,-84,32,M.minZ+6,0),t.fill(10,26,M.minZ,32,32,M.minZ+6,0),t.fill(-118,26,M.maxZ-6,-84,32,M.maxZ,0),t.fill(10,26,M.maxZ-6,32,32,M.maxZ,0),t.fill(M.minX,26,202,M.minX,29,218,0),t.fill(M.minX,26,155,M.minX,29,162,0),t.fill(M.minX,26,258,M.minX,29,266,0),t.fill(-38,26,194,-32,30,194,9),t.fill(-37,26,194,-33,29,194,0),t.fill(-75,26,202,-75,30,208,9),t.fill(-75,26,203,-75,29,207,0);for(let e of Il)e.axis==="z"?t.fill(e.x-3,26,e.z,e.x+3,31,e.z,0):t.fill(e.x,26,e.z-3,e.x,31,e.z+3,0);for(let e of zl)e.axis==="z"?t.fill(e.x-2,27,e.z,e.x+2,30,e.z,0):t.fill(e.x,27,e.z-2,e.x,30,e.z+2,0);for(let e=-75;e<=5;e++)for(let n=194;n<=260;n++)fn.some(s=>e>=s.x1&&e<=s.x2&&n>=s.z1&&n<=s.z2)||(gt(e+.5,n+.5,As,.85)||gt(e+.5,n+.5,Rs,.85)||gt(e+.5,n+.5,Cs,.85)||gt(e+.5,n+.5,Is,.85))&&t.set(e,25,n,9);for(let e=148;e<=158;e++)for(let n=-48;n<=-45;n++)t.set(n,25,e,9);for(let e of Nl)t.fill(e.x-e.rx,25,e.z-e.rz,e.x+e.rx,25,e.z+e.rz,9);t.fill(-112,26,146,-84,35,276,0),t.fill(10,26,146,26,35,276,0),t.fill(-94,26,146,-76,35,165,0),t.fill(-94,25,146,-76,25,165,9),t.fill(-94,26,198,-76,35,212,0),t.fill(-94,25,198,-76,25,212,9),t.fill(-94,26,264,12,35,274,0),t.fill(-94,25,264,12,25,274,9);for(let e=-68;e<=-22;e++)for(let n=228;n<=244;n++)t.fill(e,21,n,e,28,n,0)}function fi(i,t=6){let e=i.slice(0,-1),n=[];for(let s=0;s<e.length;s++){let r=e[(s+e.length-1)%e.length],o=e[s],a=e[(s+1)%e.length],h=Math.hypot(o[0]-r[0],o[1]-r[1]),c=Math.hypot(a[0]-o[0],a[1]-o[1]);if(((o[0]-r[0])*(a[0]-o[0])+(o[1]-r[1])*(a[1]-o[1]))/(h*c||1)>.995||h<.01||c<.01){n.push(o);continue}let f=Math.min(t,h*.4,c*.4),u=[o[0]+(r[0]-o[0])*f/h,o[1]+(r[1]-o[1])*f/h,o[2]??26],d=[o[0]+(a[0]-o[0])*f/c,o[1]+(a[1]-o[1])*f/c,o[2]??26];for(let p=0;p<=16;p++){let m=p/16,g=1-m;n.push([g*g*u[0]+2*g*m*o[0]+m*m*d[0],g*g*u[1]+2*g*m*o[1]+m*m*d[1],o[2]??26])}}return n.push(n[0]),n}var ft={x:50,z:-21,south:-3,north:-39,y:26,width:5},Ol=i=>-21+.035*(i-62),ee=(i,t)=>i<=88&&Math.abs(t-Ol(i))<=9;function Ps(i,t,e){return Math.abs(i-ft.x)<=ft.width+2&&e>=ft.north-1&&e<=ft.south+1&&t>=24&&t<=37}function Ls(i,t=[]){for(let o=-224;o<=88;o++)for(let a=-43;a<=-8;a++)ee(o,a)&&(i.fill(o,15,a,o,142,a,0),i.set(o,14,a,6));for(let o of t)for(let a of o.samples)if(ee(a.x,a.z)&&a.x<ft.x-12)for(let h=-o.width;h<=o.width;h++)for(let c=-o.width;c<=o.width;c++)i.set(Math.round(a.x)+h,25,Math.round(a.z)+c,9);let{x:e,north:n,south:s,width:r}=ft;for(let o=n;o<=s;o++)i.fill(e-r,25,o,e+r,25,o,9),i.fill(e-r,26,o,e+r,36,o,0);for(let o of[n,-21,s])i.fill(e-r,14,o-1,e+r,24,o+1,9);for(let o of[-1,1])for(let a=n;a<=s;a++)i.set(e+o*(r+1),26,a,9)}var gn=i=>Math.round(I(i)-21-D),Y=i=>I(i)-38-D,Ot=i=>I(i)-84-D,mi=i=>I(i)-40,Fl=i=>I(i)-84,Ft=[{id:"beijing",name:"\u5317\u4EAC\u4E1C\u8DEF",z:14,width:2,kind:"road"},{id:"dianchi",name:"\u6EC7\u6C60\u8DEF",z:45,width:2,kind:"road"},{id:"nanjing",name:"\u5357\u4EAC\u4E1C\u8DEF\u6B65\u884C\u8857",z:66,width:4,kind:"pedestrian"},{id:"jiujiang",name:"\u4E5D\u6C5F\u8DEF",z:99,width:2,kind:"road"},{id:"hankou",name:"\u6C49\u53E3\u8DEF",z:116,width:2,kind:"road"},{id:"fuzhou",name:"\u798F\u5DDE\u8DEF",z:162,width:3,kind:"road"},{id:"guangdong",name:"\u5E7F\u4E1C\u8DEF",z:192,width:2,kind:"road"},{id:"yanan",name:"\u5EF6\u5B89\u4E1C\u8DEF",z:238,width:4,kind:"road"}],ie=[{id:"consulate",name:"\u5916\u6EE9\u6E90 \xB7 \u82F1\u56FD\u9886\u4E8B\u9986",z:5,h:9,kind:"brick",rz:4},{id:"avenue-0",name:"\u6021\u548C\u6D0B\u884C \xB7 \u5916\u6EE927\u53F7",z:25,h:13,kind:"steps",rz:5},{id:"bank",name:"\u4E2D\u56FD\u94F6\u884C \xB7 \u5916\u6EE923\u53F7",z:38,h:21,kind:"steps",rz:4},{id:"peace",name:"\u548C\u5E73\u996D\u5E97\u5317\u697C \xB7 \u5916\u6EE920\u53F7",z:54,h:20,kind:"copper",rz:6},{id:"peace-south",name:"\u548C\u5E73\u996D\u5E97\u5357\u697C \xB7 \u5916\u6EE919\u53F7",z:78,h:12,kind:"baroque",rz:6},{id:"avenue-1",name:"\u9EA6\u52A0\u5229\u94F6\u884C \xB7 \u5916\u6EE918\u53F7",z:92,h:15,kind:"steps",rz:4},{id:"avenue-2",name:"\u5B57\u6797\u5927\u697C \xB7 \u5916\u6EE917\u53F7",z:106,h:19,kind:"steps",rz:4},{id:"avenue-3",name:"\u534E\u4FC4\u9053\u80DC\u94F6\u884C \xB7 \u5916\u6EE915\u53F7",z:124,h:11,kind:"baroque",rz:3},{id:"customs",name:"\u6C5F\u6D77\u5173\u949F\u697C \xB7 \u5916\u6EE913\u53F7",z:137,h:15,kind:"clock",rz:6},{id:"hsbc",name:"\u6C47\u4E30\u94F6\u884C\u5927\u697C \xB7 \u5916\u6EE912\u53F7",z:151,h:14,kind:"dome",rz:6},{id:"avenue-4",name:"\u8F6E\u8239\u62DB\u5546\u5C40 \xB7 \u5916\u6EE99\u53F7",z:173,h:11,kind:"brick",rz:5},{id:"avenue-5",name:"\u5927\u5317\u7535\u62A5 \xB7 \u5916\u6EE97\u53F7",z:185,h:13,kind:"baroque",rz:4},{id:"avenue-6",name:"\u6709\u5229\u94F6\u884C \xB7 \u5916\u6EE93\u53F7",z:200,h:15,kind:"dome",rz:4},{id:"avenue-7",name:"\u4E0A\u6D77\u603B\u4F1A \xB7 \u5916\u6EE92\u53F7",z:214,h:11,kind:"baroque",rz:6},{id:"asia",name:"\u4E9A\u7EC6\u4E9A\u5927\u697C \xB7 \u5916\u6EE91\u53F7",z:228,h:14,kind:"steps",rz:5}].map(i=>({...i,x:Math.round(I(i.z)-58),rx:7,front:Math.round(I(i.z)-58)+7,bank:"west"}));function ut(i){let t=[],e=0;for(let n=1;n<i.length;n++){let[s,r,o=26]=i[n-1],[a,h,c=26]=i[n],l=Math.hypot(a-s,h-r),f=Math.max(1,Math.ceil(l*2));for(let u=n===1?0:1;u<=f;u++){let d=u/f;t.push({x:s+(a-s)*d,z:r+(h-r)*d,y:o+(c-o)*d,d:e+l*d})}e+=l}return t.lengthMeters=e,t}var ne=(i,t,e)=>{let n=[],s=Math.sign(e-t);for(let r=t;s*(e-r)>=0;r+=s*2)n.push([I(r)-i,r]);return n.at(-1)[1]!==e&&n.push([I(e)-i,e]),n},pn=[[146,31],[213,31],[260,65],[263,121],[256,166],[228,178],[203,137],[197,106],[196,82],[196,50],[196,19],[146,19],[146,31]],be=ut(pn),Os=ut([[146,31],[193,31],[246,58],[260,65]]),Fs=ut([...ne(40,14,238),...ne(84,238,14),[mi(14),14]]),Bs=[[282,206],[296,180],[305,140],[306,98],[306,54],[291,22],[226,12],[167,12],[146,20],[146,31],[213,31],[260,65],[263,121],[256,166],[263,187],[282,206]],ks=ut(Bs),Ds=[[192-D,206,26],[212,206,31],[255,206,31],[275,206,26],[282,206,26]],Bl=ut([[Y(206),206],...Ds,...Bs.slice(1),...Ds.slice(0,-1).reverse(),...ne(40+D,206,14),...ne(84+D,14,238),...ne(40+D,238,206)]),xn=[{id:"bund",samples:Fs},{id:"lujiazui",samples:be},{id:"pudong",samples:ks},{id:"bridge",samples:Bl}],Hs=Ft.filter(i=>i.kind==="road").map(i=>({...i,samples:ut([[Fl(i.z),i.z],[mi(i.z),i.z]])})),gi=[{id:"bund",samples:Fs,width:3},{id:"financial",samples:be,width:3},{id:"pudong",samples:ks,width:3},{id:"century",samples:Os,width:3},{id:"bridge-approach",samples:ut([[275,206],[282,206]]),width:3},...Hs];function Fe(i,t,e=gi){let n=1/0;for(let s of e)for(let r=0;r<s.samples.length;r+=4){let o=s.samples[r];n=Math.min(n,Math.hypot(i-o.x,t-o.z)-s.width)}return n}var yn=(i,t)=>Fe(i,t,St)<1.2,Be=[{id:"convention",name:"\u4E0A\u6D77\u56FD\u9645\u4F1A\u8BAE\u4E2D\u5FC3",x:130,z:64,rx:6,rz:5,h:9,kind:"convention"},{id:"superbrand",name:"\u6B63\u5927\u5E7F\u573A",x:145,z:7,rx:9,rz:5,h:10,kind:"mall"},{id:"ifc-north",name:"\u56FD\u91D1\u4E2D\u5FC3 \xB7 \u5317\u5854",x:157,z:42,rx:5,rz:5,h:45,kind:"glass"},{id:"ifc-south",name:"\u56FD\u91D1\u4E2D\u5FC3 \xB7 \u5357\u5854",x:174,z:42,rx:5,rz:5,h:43,kind:"glass"},{id:"shangrila-river",name:"\u9999\u683C\u91CC\u62C9 \xB7 \u6D66\u6C5F\u697C",x:180,z:108,rx:5,rz:5,h:38,kind:"hotel"},{id:"shangrila-grand",name:"\u9999\u683C\u91CC\u62C9 \xB7 \u7D2B\u91D1\u878D\u697C",x:218,z:119,rx:6,rz:7,h:50,kind:"hotel"},{id:"boc-pudong",name:"\u4E2D\u94F6\u5927\u53A6",x:218,z:81,rx:6,rz:6,h:60,kind:"glass"},{id:"hsbc-pudong",name:"\u6C47\u4E30\u5927\u697C \xB7 \u9646\u5BB6\u5634",x:240,z:84,rx:6,rz:5,h:44,kind:"glass"},{id:"aurora",name:"\u9707\u65E6\u5927\u53A6",x:226,z:137,rx:6,rz:6,h:41,kind:"gold"},{id:"citi",name:"\u82B1\u65D7\u96C6\u56E2\u5927\u53A6",x:242,z:152,rx:5,rz:6,h:43,kind:"glass"},{id:"bea",name:"\u4E1C\u4E9A\u94F6\u884C\u91D1\u878D\u5927\u53A6",x:245,z:181,rx:5,rz:5,h:45,kind:"glass"},{id:"bank-shanghai",name:"\u4E0A\u6D77\u94F6\u884C\u5927\u53A6",x:282,z:79,rx:6,rz:7,h:51,kind:"glass"},{id:"bocom",name:"\u4EA4\u94F6\u91D1\u878D\u5927\u53A6",x:247,z:112,rx:5,rz:6,h:48,kind:"glass"},{id:"stock",name:"\u4E0A\u6D77\u8BC1\u5238\u5927\u53A6",x:284,z:119,rx:5,rz:6,h:43,kind:"glass"},{id:"south-finance",name:"\u6EE8\u6C5F\u91D1\u878D\u697C\u7FA4",x:281,z:152,rx:5,rz:6,h:35,kind:"glass"},{id:"north-finance",name:"\u9646\u5BB6\u5634\u5317\u4FA7\u5546\u52A1\u697C",x:231,z:65,rx:5,rz:5,h:42,kind:"glass"}].map(i=>({...i,bank:"east",front:i.x-i.rx,entranceSide:-1})),F=[...Be,...ie],kl={jinmao:{x:159.5,z:62.5},swfc:{x:181.5,z:56.5},shanghai:{x:152.5,z:85.5}},ot=[];function _n(i){if(i.x-i.rx<3||i.x+i.rx>315||i.z-i.rz<0||i.z+i.rz>233||i.bank==="west"&&i.z>199&&i.x-i.rx<103)return!1;for(let t=i.x-i.rx-2;t<=i.x+i.rx+2;t++)for(let e=i.z-i.rz-2;e<=i.z+i.rz+2;e++){let n=t>I(e)+10,s=t<I(e)-46;if((i.bank==="east"?!n:!s)||Fe(t,e)<1||Ft.some(r=>Math.abs(e-r.z)<=r.width+1)&&i.bank==="west")return!1}return!F.some(t=>Math.abs(t.x-i.x)<=t.rx+i.rx+3&&Math.abs(t.z-i.z)<=t.rz+i.rz+3)&&!Object.values(kl).some(t=>Math.abs(t.x-i.x)<i.rx+15&&Math.abs(t.z-i.z)<i.rz+15)&&Math.hypot(i.x-qt.x,i.z-qt.z)>i.rx+15}for(let i of[106,132,158])for(let t=27;t<=223;t+=17){let e={id:`bund-back-${i}-${t}`,name:"\u5916\u6EE9\u540E\u65B9\u8857\u533A",x:Math.round(I(t)-i),z:t,rx:5,rz:5,h:8+(t*7+i)%14,kind:t%3?"brick":"baroque",bank:"west",entranceSide:1};_n(e)&&(e.front=e.x+e.rx,ot.push(e),F.push(e))}for(let i=200;i<=308;i+=18)for(let t=20;t<=200;t+=24){let e={id:`pudong-back-${i}-${t}`,name:"\u9646\u5BB6\u5634\u5546\u52A1\u8857\u533A",x:i,z:t,rx:4,rz:5,h:15+(i+t*3)%25,kind:"glass",bank:"east",entranceSide:-1};_n(e)&&(e.front=e.x-e.rx,ot.push(e),F.push(e))}for(let i of[73,100,120,141,162,183])for(let t=6;t<=230;t+=11){let e={id:`bund-infill-${i}-${t}`,name:"\u5916\u6EE9\u91CC\u8857",x:Math.round(I(t)-i),z:t,rx:3,rz:3,h:7+(t+i)%13,kind:t%2?"brick":"baroque",bank:"west",entranceSide:1};_n(e)&&(e.front=e.x+e.rx,ot.push(e),F.push(e))}for(let i=148;i<=310;i+=13)for(let t=14;t<=220;t+=15){let e={id:`pudong-infill-${i}-${t}`,name:"\u9646\u5BB6\u5634\u8857\u533A",x:i,z:t,rx:3,rz:3,h:14+(i+t)%22,kind:"glass",bank:"east",entranceSide:-1};_n(e)&&(e.front=e.x-e.rx,ot.push(e),F.push(e))}var Hl=ut([...ne(40,14,-140),...ne(84,-140,14),[mi(14),14]]),Vs=[];for(let i=-14;i>=-140;i-=2)Vs.push([I(i)+28,i]);var Vl=ut([[167,12],[167,-8],...Vs,[384,-140],[384,-8],[210,-8],[210,12],[167,12]]),xi=[{id:"north-bund",samples:Hl,width:3},{id:"north-pudong",samples:Vl,width:2}],St=[...gi.filter(i=>i.id!=="century").map(i=>({...i,width:["financial","pudong"].includes(i.id)?2:i.width})),...xi];for(let i of xi)xn.push({id:i.id,samples:i.samples});var Bt=[];function Mn(i){if(i.front=i.x+(i.entranceSide??1)*i.rx,!(i.x-i.rx<Z.min+4||i.x+i.rx>Z.max-4||i.z-i.rz<Z.min+4)){for(let t=i.x-i.rx-3;t<=i.x+i.rx+3;t++)for(let e=i.z-i.rz-3;e<=i.z+i.rz+3;e++)if((i.bank==="east"?t<I(e)+11:t>I(e)-46)||Fe(t,e,St)<1)return;F.some(t=>Math.abs(t.x-i.x)<=t.rx+i.rx+4&&Math.abs(t.z-i.z)<=t.rz+i.rz+4)||(Bt.push(i),F.push(i))}}for(let[i,t,e,n,s]of[[169,-8,34,5,5],[194,-30,47,6,6],[226,-61,59,6,6],[253,-96,53,6,5],[287,-117,63,6,6],[226,-24,39,5,5],[264,-43,52,6,5],[310,-62,46,6,6]])Mn({id:`pudong-front-${i}-${t}`,name:"\u9646\u5BB6\u5634\u5317\u4FA7\u6EE8\u6C5F\u697C\u7FA4",x:i,z:t,h:e,rx:n,rz:s,kind:"glass",bank:"east",entranceSide:-1});for(let i=-18;i>=-138;i-=22)for(let t=48;t<=170;t+=23){let e=Math.round(I(i)+t);Mn({id:`pudong-back-north-${t}-${i}`,name:"\u9646\u5BB6\u5634\u5317\u4FA7\u8857\u533A",x:e,z:i,rx:5,rz:5,h:26+(Math.abs(i)*3+t)%35,kind:t%2?"hotel":"glass",bank:"east",entranceSide:-1})}for(let i=-8;i>=-140;i-=22)for(let t of[58,106,132,158,184,210,238,266,294]){let e=Math.round(I(i)-t),n=i<-30&&t>=106;Mn({id:`bund-back-north-${t}-${i}`,name:n?"\u5317\u5916\u6EE9\u8857\u533A":"\u5916\u6EE9\u6E90\u5468\u8FB9\u8857\u533A",x:e,z:i,rx:5,rz:5,h:n?25+(Math.abs(i)+t)%36:11+(Math.abs(i)+t)%12,kind:n?"glass":t%3?"baroque":"brick",bank:"west",entranceSide:1})}for(let i=-136;i<=-8;i+=23)for(let t=22;t<=176;t+=22)Mn({id:`bund-back-west-${i}-${t}`,name:"\u5916\u6EE9\u540E\u65B9\u57CE\u5E02\u8857\u533A",x:i,z:t,rx:5,rz:5,h:12+(Math.abs(i)+t)%19,kind:t%3?"baroque":"brick",bank:"west",entranceSide:1});for(let i of F)i.bank==="west"&&(i.x-=D,i.front-=D);for(let i of[...gi.filter(t=>t.id==="bund"||Hs.includes(t)),xi[0]])for(let t of i.samples)t.x-=D;var Gl=[{id:"ifc-mall",name:"\u56FD\u91D1\u4E2D\u5FC3\u5546\u573A",x:166,z:50,rx:5,rz:2,h:7,kind:"mall",form:"terrace"},{id:"jinmao-podium",name:"\u91D1\u8302\u5546\u4E1A\u88D9\u623F",x:174,z:73,rx:3,rz:4,h:6,kind:"mall",form:"terrace"},{id:"swfc-podium",name:"\u73AF\u7403\u91D1\u878D\u4E2D\u5FC3\u88D9\u623F",x:187,z:74,rx:4,rz:4,h:8,kind:"mall",form:"terrace"},{id:"pudong-infill-southeast-1",name:"\u6EE8\u6C5F\u5546\u4E1A\u697C",x:170,z:104,rx:4,rz:3,h:18,kind:"glass",form:"setback"},{id:"pudong-infill-southeast-2",name:"\u9646\u5BB6\u5634\u5546\u52A1\u697C",x:205,z:91,rx:3,rz:4,h:29,kind:"glass",form:"slab"}];for(let i of Gl)Object.assign(i,{bank:"east",entranceSide:-1,front:i.x-i.rx}),ot.push(i),F.push(i);var Us=F.find(i=>i.id==="pudong-infill-187-89");Us&&Object.assign(Us,{name:"\u56FD\u91D1\u6C47\u670D\u52A1\u516C\u5BD3",kind:"hotel",h:24,form:"setback"});var ui=F.find(i=>i.id==="pudong-infill-southeast-2");ui&&Object.assign(ui,{name:"\u6C64\u81E3\u4E00\u54C1 \xB7 \u6C5F\u666F\u516C\u5BD3",kind:"hotel",h:60,rx:4,rz:6,front:ui.x-4,form:"landmark"});for(let i=207;i<=297;i+=13)for(let t=74;t<=179;t+=15){let e={id:`pudong-density-${i}-${t}`,name:"\u9646\u5BB6\u5634\u5546\u52A1\u8857\u533A",x:i,z:t,rx:3,rz:4,h:20+(i*3+t)%24,kind:(i+t)%3?"glass":"hotel",bank:"east",entranceSide:-1,front:i-3};if(F.some(s=>Math.abs(s.x-i)<=s.rx+e.rx+2&&Math.abs(s.z-t)<=s.rz+e.rz+2)||Object.values(b).some(s=>Math.abs(s.x-i)<e.rx+15&&Math.abs(s.z-t)<e.rz+15)||i-e.rx<=I(t)+13||i-e.rx<=214&&t-e.rz<=58)continue;let n=!0;for(let s=i-e.rx-1;s<=i+e.rx+1;s++)for(let r=t-e.rz-1;r<=t+e.rz+1;r++)Fe(s,r,St)<1&&(n=!1);n&&(ot.push(e),F.push(e))}var Gs=[[226,12],[291,22],[306,54],[306,98],[305,140],[296,180],[282,206],[263,187],[256,166],[263,121],[260,65],[213,31],[226,12]];pn.splice(0,pn.length,...Gs);var yi=ut(Gs);be.splice(0,be.length,...yi);be.lengthMeters=yi.lengthMeters;var _i=-188,se=new Set(F.filter(i=>i.bank==="west"&&/back|infill/.test(i.id)&&i.x<-10&&i.x+i.rx>=_i&&i.z+i.rz>=61&&i.z-i.rz<=71).map(i=>i.id));for(let i of[F,ot,Bt])for(let t=i.length-1;t>=0;t--)se.has(i[t].id)&&i.splice(t,1);var kt=[];for(let i of[Be,ot,Bt,F])for(let t=i.length-1;t>=0;t--){let e=i[t];(e.bank==="east"&&(Object.values(b).some(n=>Math.abs(e.x-n.x)<=e.rx+12&&Math.abs(e.z-n.z)<=e.rz+13)||yi.some(n=>Math.abs(e.x-n.x)<=e.rx+4&&Math.abs(e.z-n.z)<=e.rz+4))||e.bank==="west"&&Math.abs(e.x-V.x)<=e.rx+10&&Math.abs(e.z-V.z)<=e.rz+9)&&(se.add(e.id),i.splice(t,1))}var Ws={id:"magnolia",name:"\u767D\u7389\u5170\u5E7F\u573A \xB7 \u5317\u5916\u6EE9",x:V.x,z:V.z,rx:8,rz:7,h:56,kind:"glass",form:"chamfer",bank:"west",entranceSide:1,front:V.x+8};kt.push(Ws);F.push(Ws);var Wl=(i,t)=>i>=176&&i<=216&&t>=38&&t<=60,di=new Map;function Xl(i,t){let e=i+","+t;return di.has(e)||di.set(e,Fe(i,t,St)),di.get(e)}function Se(i){if(i.front=i.x+(i.entranceSide??1)*i.rx,i.x-i.rx<Z.min+3||i.x+i.rx>=317)return!1;let t=i.id.startsWith("nanjing-")?0:1;if(F.some(e=>Math.abs(e.x-i.x)<=e.rx+i.rx+t&&Math.abs(e.z-i.z)<=e.rz+i.rz+t)||F.some(e=>{let n=qs(e);return Math.abs(n.x-i.x)<=i.rx+1&&Math.abs(n.z-i.z)<=i.rz+1})||Object.values(b).some(e=>Math.abs(e.x-i.x)<i.rx+13&&Math.abs(e.z-i.z)<i.rz+14)||i.bank==="east"&&Math.hypot(i.x-qt.x,i.z-qt.z)<Math.max(i.rx,i.rz)+15)return!1;for(let e=i.x-i.rx-1;e<=i.x+i.rx+1;e++)for(let n=i.z-i.rz-1;n<=i.z+i.rz+1;n++)if((i.bank==="west"?e>=I(n)-101||n>=202&&e<102-D:e<=I(n)+11||Wl(e,n))||Xl(e,n)<1||i.bank==="west"&&Ft.some(s=>Math.abs(n-s.z)<=s.width))return!1;return kt.push(i),F.push(i),!0}for(let i of[ot,F])for(let t=i.length-1;t>=0;t--)["jinmao-podium","swfc-podium"].includes(i[t].id)&&(se.add(i[t].id),i.splice(t,1));for(let i of[{id:"jinmao-podium",name:"\u91D1\u8302\u5546\u4E1A\u88D9\u623F",x:166,z:79,rx:3,rz:4,h:6,kind:"mall",form:"terrace"},{id:"swfc-podium",name:"\u73AF\u7403\u91D1\u878D\u4E2D\u5FC3\u88D9\u623F",x:238,z:99,rx:4,rz:4,h:8,kind:"mall",form:"terrace"},{id:"shangrila-river",name:"\u9999\u683C\u91CC\u62C9 \xB7 \u6D66\u6C5F\u697C",x:203,z:126,rx:5,rz:5,h:38,kind:"hotel",form:"terrace"},{id:"pudong-infill-southeast-1",name:"\u6EE8\u6C5F\u5546\u4E1A\u697C",x:214,z:146,rx:4,rz:3,h:18,kind:"glass",form:"setback"},{id:"pudong-infill-southeast-2",name:"\u6C64\u81E3\u4E00\u54C1 \xB7 A\u680B\u6C5F\u666F\u516C\u5BD3",x:224,z:160,rx:4,rz:6,h:60,kind:"hotel",form:"landmark"}]){for(let t of[ot,Bt,F])for(let e=t.length-1;e>=0;e--){let n=t[e];n.bank==="east"&&/back|infill|front|density/.test(n.id)&&Math.abs(n.x-i.x)<=n.rx+i.rx+2&&Math.abs(n.z-i.z)<=n.rz+i.rz+2&&(se.add(n.id),t.splice(e,1))}Se({...i,bank:"east",entranceSide:-1})}for(let i of[{id:"ifc-retail-extension",name:"\u56FD\u91D1\u4E2D\u5FC3\u5546\u4E1A\u88D9\u623F",x:168,z:24,rx:9,rz:2,h:8,form:"terrace",kind:"mall"},{id:"pudong-infill-retail-east",name:"\u9646\u5BB6\u5634\u5546\u4E1A\u697C",x:185,z:23,rx:5,rz:3,h:22,form:"slab",kind:"glass"}])Se({...i,bank:"east",entranceSide:-1});for(let i of[{id:"nanjing-infill-corner-north",name:"\u5357\u4EAC\u4E1C\u8DEF\u6CBF\u8857\u5546\u53A6",x:-21,z:55,rx:4,rz:5,h:13,entranceSide:1},{id:"nanjing-infill-corner-south",name:"\u7F8E\u4F26\u5927\u697C\u5546\u4E1A\u7EC4\u56E2",x:-12,z:77,rx:4,rz:5,h:13,entranceSide:-1}])Se({...i,kind:"baroque",form:"terrace",district:"historic-block",bank:"west",entranceAxis:"z",shop:!0});for(let i of[-1,1])for(let t=_i+10;t<=4;t+=13){let e=66+i*11,n={id:`nanjing-infill-${i}-${t}`,name:"\u5357\u4EAC\u4E1C\u8DEF\u6CBF\u8857\u5546\u53A6",x:t,z:e,rx:5,rz:5,h:11+(Math.abs(t)+e)%9,kind:"baroque",form:Math.abs(t)%3?"terrace":"deco",district:"historic-block",bank:"west",entranceAxis:"z",entranceSide:-i,shop:!0};Se(n)}for(let i=-137;i<=233;i+=9)for(let t=-207;t<=127;t+=9){let e=8+(Math.abs(t)*7+Math.abs(i)*3)%12;Se({id:`bund-infill-tight-${t}-${i}`,name:"\u5916\u6EE9\u5386\u53F2\u8857\u574A",x:t,z:i,rx:3,rz:3,h:e,kind:(t+i)%3?"baroque":"brick",form:(t+i)%4?"terrace":"warehouse",district:"historic-block",bank:"west",entranceSide:1,shop:!0})}for(let i=-5;i<=179;i+=9)for(let t=146;t<=302;t+=9)Se({id:`pudong-infill-tight-${t}-${i}`,name:"\u9646\u5BB6\u5634\u5546\u4F4F\u8857\u574A",x:t,z:i,rx:3,rz:3,h:15+(t*3+Math.abs(i))%23,kind:(t+i)%4?"glass":"hotel",form:(t+i)%3?"setback":"slab",bank:"east",entranceSide:-1});var dn=kt.filter(i=>i.id.startsWith("nanjing-")).sort((i,t)=>i.x-t.x);dn.length&&(dn[0].name="\u6C38\u5B89\u767E\u8D27 \xB7 \u5357\u4EAC\u4E1C\u8DEF",dn[2].name="\u5148\u65BD\u516C\u53F8\u5386\u53F2\u5546\u53A6",dn.at(-1).name="\u7F8E\u4F26\u5927\u697C \xB7 \u5916\u6EE9\u4E2D\u592E");var pi=Yt.find(i=>i.id==="nanpu");for(let i of[ie,Be,ot,Bt,kt,F])for(let t=i.length-1;t>=0;t--){let e=i[t];pi.samples.some(n=>Math.abs(n.x-e.x)<=e.rx+pi.width+2&&Math.abs(n.z-e.z)<=e.rz+pi.width+2)&&(se.add(e.id),i.splice(t,1))}var Ns=new Set;for(let i of Ft)i.kind==="road"&&(i.width=4);for(let i of St){if(i.width=Math.max(4,i.width),Ns.has(i.samples)||i.samples.length<3)continue;Ns.add(i.samples);let t=i.samples.map(r=>[r.x,r.z,r.y]);if(i.id==="north-bund"){let r=t.findIndex(o=>o[1]<=-52);t=[[Y(14),14,26],[ft.x,5,26],[ft.x,-45,26],t[r],...t.slice(r+1)]}t=t.map(([r,o,a])=>Math.abs(r-(Y(o)-2))<.8&&o>=14?[r+2+(o>112&&o<136?4*Math.sin(Math.PI*(o-112)/24):0),o,a]:[r,o,a]);let e=t.filter((r,o)=>o===0||o===t.length-1||Math.abs((r[0]-t[o-1][0])*(t[o+1][1]-r[1])-(r[1]-t[o-1][1])*(t[o+1][0]-r[0]))>.001),n=Math.hypot(t[0][0]-t.at(-1)[0],t[0][1]-t.at(-1)[1])<.1,s=ut(n?fi(e,7):t);i.samples.splice(0,i.samples.length,...s),i.samples.lengthMeters=s.lengthMeters}var mn=xn.find(i=>i.id==="bridge").samples,Xs=ut(fi(mn.map(i=>({...i,x:Math.abs(i.x-(Y(i.z)-2))<.8&&i.z>=14?i.x+2+(i.z>112&&i.z<136?4*Math.sin(Math.PI*(i.z-112)/24):0):i.x})).filter((i,t,e)=>t===0||t===e.length-1||Math.abs((i.x-e[t-1].x)*(e[t+1].z-i.z)-(i.z-e[t-1].z)*(e[t+1].x-i.x))>.001).map(i=>[i.x,i.z,i.y]),7));mn.splice(0,mn.length,...Xs);mn.lengthMeters=Xs.lengthMeters;for(let i of[ie,Be,ot,Bt,kt,F])for(let t=i.length-1;t>=0;t--){let e=i[t],n=ee(e.x-e.rx,e.z-e.rz)||ee(e.x+e.rx,e.z+e.rz)||ee(e.x,e.z),s=St.some(r=>r.samples.some((o,a)=>a%3===0&&Math.abs(o.x-e.x)<=e.rx+r.width+.8&&Math.abs(o.z-e.z)<=e.rz+r.width+.8));(n||s&&/back|infill|front|density/.test(e.id)&&e.id!=="pudong-infill-southeast-2")&&(se.add(e.id),i.splice(t,1))}for(let[i,t]of kt.filter(e=>e.id.startsWith("nanjing-")).entries())t.streetIndex=i;for(let i of[ot,Bt,kt,F])for(let t=i.length-1;t>=0;t--){let e=i[t];if(!/back|infill|density/.test(e.id))continue;let n=!1;for(let s=e.x-e.rx-1;s<=e.x+e.rx+1&&!n;s++)for(let r=e.z-e.rz-1;r<=e.z+e.rz+1;r++)if(un(s,r)){n=!0;break}n&&(se.add(e.id),i.splice(t,1))}var Ys=[...Be,...ot,...Bt,...kt],Ee=[...ie,...Ys];function qs(i,t=2.5){let e=i.entranceSide??1;return i.entranceAxis==="z"?{x:i.x+.5,z:i.z+e*(i.rz+t)}:{x:i.x+e*(i.rx+t),z:i.z+.5}}function Zs(i,t,e){return t>=25&&Ee.some(n=>Math.abs(i-n.x)<=n.rx+1&&Math.abs(e-n.z)<=n.rz+1)}function Yl(i,t){let{x:e,z:n,h:s,rx:r,rz:o}=t,a=t.entranceSide??1,h=hi(t);if(i.fill(e-r,18,n-o,e+r,25,n+o,3),i.fill(e-r,26,n-o,e+r,26+s,n+o,0),h.form!=="landmark")Es(i,t,h);else{let c=["glass","gold","hotel"].includes(t.kind);for(let l=26;l<26+s;l++)for(let f=e-r;f<=e+r;f++)for(let u=n-o;u<=n+o;u++){if(f!==e-r&&f!==e+r&&u!==n-o&&u!==n+o)continue;let d=l%4>=1&&l%4<=2&&(f===e+r||f===e-r?Math.abs(u-n)%3===1:Math.abs(f-e)%3===1);i.set(f,l,u,c?l%8===0||Math.abs(f-e)===r&&Math.abs(u-n)===o?9:t.kind==="gold"?6:11:d?11:l%4===0?9:t.kind==="brick"?8:h.wall)}i.fill(e-r-1,26+s,n-o-1,e+r+1,26+s,n+o+1,9)}for(let c=e-r+1;c<e+r;c++)for(let l=n-o+1;l<n+o;l++)i.set(c,25,l,(c+l)%2?9:6);if(t.entranceAxis==="z"){let c=n+a*o,l=c+a*4;i.fill(e-1,26,c,e+1,29,c,0),i.fill(e-1,25,Math.min(c,l),e+1,25,Math.max(c,l),9),i.fill(e-1,26,Math.min(c+a,l),e+1,29,Math.max(c+a,l),0)}else{let c=e+a*r,l=c+a*4;i.fill(c,26,n-1,c,29,n+1,0),i.fill(Math.min(c,l),25,n-1,Math.max(c,l),25,n+1,9),i.fill(Math.min(c+a,l),26,n-1,Math.max(c+a,l),29,n+1,0)}if(t.id==="pudong-infill-southeast-2")for(let c=29;c<26+s;c+=4)Math.abs(c-77)>1&&i.fill(e-r+1,c,n-o+1,e+r-1,c,n+o-1,9);for(let c of[-o+2,o-2])i.fill(e-r+2,26,n+c,e+r-2,26,n+c,7),i.set(e-a*(r-2),27,n+c,12);if(t.id.startsWith("nanjing-")&&t.entranceAxis==="z")for(let c of[-o+2,o-2])i.fill(e-1,26,n+c,e+1,27,n+c,0);if(h.form==="landmark"){if(t.kind==="copper"){i.fill(e-3,27+s,n-3,e+3,31+s,n+3,9);for(let c=0;c<5;c++)i.fill(e-4+c,32+s+c,n-4+c,e+4-c,32+s+c,n+4-c,5)}if(t.kind==="steps"||t.kind==="glass")for(let c=0;c<3;c++)i.fill(e-r+1+c,27+s+c,n-o+1,e+r-1-c,27+s+c,n+o-1,9);if(t.kind==="clock"&&(i.fill(e-3,27+s,n-3,e+3,39+s,n+3,9),i.fill(e-2,40+s,n-2,e+2,41+s,n+2,9),i.set(e,42+s,n,12)),t.kind==="dome")for(let c=0;c<=5;c++)i.disc(e,27+s+c,n,Math.sqrt(Math.max(0,25-c*c)),9);if(t.kind==="baroque"){for(let c of[-r+1,r-1])i.fill(e+c,27+s,n-2,e+c,29+s,n+2,9);i.fill(e-2,27+s,n-2,e+2,29+s,n+2,9)}if(t.kind==="brick")for(let c=0;c<4;c++)i.fill(e-r,27+s+c,n-o+c,e+r,27+s+c,n+o-c,8)}}function $s(i){for(let e=Z.min;e<Z.max;e++)for(let n=Z.min;n<=234;n++){if(i.get(e,25,n)!==1||e<102-D&&n>=202)continue;let s=e-I(n);e>=178&&e<=214&&n>=40&&n<=58||s>10&&s<18||(s<-45||s>18)&&i.set(e,25,n,(Math.floor(e/6)+Math.floor(n/6))%5===0?1:9)}for(let e of St)for(let n of e.samples){let s=Math.round(n.x),r=Math.round(n.z);for(let o=-e.width-2;o<=e.width+2;o++)for(let a=-e.width-2;a<=e.width+2;a++){let h=s+o,c=r+a;Rn(h,c)||Object.values(b).some(l=>Math.abs(h+.5-l.x)<=12&&Math.abs(c+.5-l.z)<=13)||(i.fill(h,23,c,h,24,c,3),i.set(h,25,c,Math.abs(o)<=e.width&&Math.abs(a)<=e.width?3:9),i.fill(h,26,c,h,32,c,0))}}let t=Ft.find(e=>e.id==="nanjing");for(let e=_i;e<=Y(t.z)-4;e++)for(let n=t.z-t.width;n<=t.z+t.width;n++)i.fill(e,24,n,e,24,n,3),i.set(e,25,n,Math.abs(n-t.z)<1?6:9),i.fill(e,26,n,e,34,n,0);for(let e of Ee)Yl(i,e);i.fill(V.x-7,82,V.z-6,V.x+7,82,V.z+6,9),i.fill(V.x-7,83,V.z-6,V.x+7,89,V.z+6,0)}var Mi=[{id:"stele-66",west:-36,east:-21,z:66,halfZ:3.8,roadWest:-31,roadEast:-25},{id:"bund-66",west:8.7,east:28.1,z:66,halfZ:3.8,roadWest:13,roadEast:23}];var ql=Ft.flatMap(i=>["bund","stele"].map(t=>{let e=t+"-"+i.z,n=Mi.find(c=>c.id===e),s=(t==="bund"?Y(i.z):Ot(i.z))+.5,r=Math.min(n?.roadWest??s-4,s-4),o=Math.max(n?.roadEast??s+4,s+4),a=Math.floor((o-r)/1.1),h=(o-r)/a;return{id:e,west:r,east:o,z:n?.z??i.z+.5,depth:5.2,stripes:Array.from({length:a},(c,l)=>r+(l+.5)*h)}}));var Zl=new et(1,1,1),vi=Zl.attributes.uv;for(let i=0;i<6;i++)for(let t=i*4;t<i*4+4;t++){let e=vi.getX(t),n=vi.getY(t);vi.setXY(t,(i%3+e)/3,(1-Math.floor(i/3)+n)/2)}var vn=vs(0),bi=new ht;bi.position.set(vn.x,vn.y,vn.z);bi.rotation.y=vn.yaw;var Js=oi(bi,{x:1.7,z:4.8}),Jl={x:42,y:26.04,z:Js.z,endX:61,entry:Js,deck:23.36},mh=new et(1,1,1);var zh=[[Y(14),14],[Ot(14),14],[Y(206),206],[Y(238),238],[Ot(238),238],[(Y(206)+Y(238))/2,222],[(Y(206)+Ot(238))/2,222],[213,31],[226,12,12,8],[210,12],[282,206],[260,65],[291,22],[210,-8],[167,12],[Y(-140),-140],[Ot(-140),-140]];var Qs=Zs;function tr(i){for(let t=Z.min;t<=242;t++){let e=gn(t),n=Math.round(Y(t));for(let s=n-5;s<=e+2;s++)i.fill(s,18,t,s,24,t,3),i.set(s,25,t,s>=e-10?9:s>=n-3&&s<=n+3?3:1),i.fill(s,26,t,s,38,t,0)}$s(i),i.fill(258,25,214,262,25,218,7),i.fill(258,26,214,262,30,230,0),i.fill(258,24,219,262,24,220,7),i.fill(258,23,221,262,23,222,7),i.fill(258,22,223,262,22,230,7);for(let t=178;t<=214;t++)for(let e=40;e<=58;e++)(Math.abs(t-195)<2||Math.abs(e-49)<2)&&i.set(t,25,e,6);i.fill(200,21,43,208,24,47,0),i.fill(200,20,43,208,20,47,6);for(let[t,e]of[[120,308],[137,304],[140,314],[117,315],[132,315],[124,313]]){i.fill(t,26,e,t,30,e,4);for(let n=-2;n<=2;n++)for(let s=-2;s<=2;s++)Math.abs(n)+Math.abs(s)<4&&i.fill(t+n,30,e+s,t+n,32,e+s,5)}}var tu=new et(1,1,1),eu=new Ne(1,12,8),nu=new Ue(1,1,1,20);var re=ie.find(i=>i.id==="peace"),lu={y:42,lift:{x:re.x+3.5,y:26,z:re.z+.5},arrival:{x:re.x+3.5,y:42,z:re.z+.5},counter:{x:re.x-3.5,y:42,z:re.z+.5}};function er(i){let t=re,{x:e,z:n}=t;i.fill(e-t.rx+1,41,n-t.rz+1,e+t.rx-1,41,n+t.rz-1,9),i.fill(e-t.rx+1,42,n-t.rz+1,e+t.rx-1,44,n+t.rz-1,0),i.fill(e-t.rx+1,45,n-t.rz+1,e+t.rx-1,45,n+t.rz-1,9),i.fill(e+t.rx,43,n-t.rz+2,e+t.rx,44,n+t.rz-2,0);for(let s of[-3,3])for(let r of[-2,1])i.set(e+r,42,n+s,4);i.fill(e-t.rx+1,42,n-1,e-t.rx+2,42,n+1,8);for(let s of[-5,5])for(let r of[-4,4])i.fill(e+s,42,n+r,e+s,44,n+r,8);i.fill(e-t.rx+3,42,n-1,e+t.rx-1,44,n+1,0),i.fill(e+2,26,n-1,e+4,30,n+1,0),i.set(e+3,25,n,12),i.set(e+3,41,n,12)}var bn={x:-94,z:-40},fu=-Math.PI/2,we=i=>({x:bn.x-i.z,y:i.y,z:bn.z+i.x}),Si=i=>({x:i.z-bn.z,y:i.y,z:bn.x-i.x}),Te=[{id:"nanjing10",name:"\u5357\u4EAC\u4E1C\u8DEF",english:"East Nanjing Road",platformLabel:"B3",x:164,z:0,color:"#c6b3d0",sharedConcourse:!0,exits:[]},{id:"yuyuan",name:"\u8C6B\u56ED",english:"Yuyuan Garden",platformLabel:"B2",x:256,z:0,color:"#ae5142",exits:[{number:1,x:252,z:-8,dir:1,width:1.4,label:"\u8C6B\u56ED\u897F\u5317\u95E8 \xB7 \u6CB3\u5357\u5357\u8DEF"},{number:4,x:302,z:-8,dir:-1,width:1.4,label:"\u8C6B\u56ED\u897F\u95E8 \xB7 \u798F\u4F51\u8DEF"}]}],Ei=Te.flatMap(i=>[...i.exits.map(t=>({station:i.id,exit:t.number,...t,from:26,to:16,length:18,kind:"entrance"})),{station:i.id,x:i.x-12,z:3,dir:1,from:16,to:6,length:18,width:1.5,kind:"platform"}]),uu=Te.map(i=>({...i,...we({...i,y:16}),line:10,exits:i.exits.map(t=>({...t,...we({...t,y:26}),axis:"z"}))})),oe=[[-100,79],[-100,85],[-114,85],[-114,124],[-107,124]];function nr(i,t,e,n){let s=n[0]-e[0],r=n[1]-e[1],o=Math.max(0,Math.min(1,((i-e[0])*s+(t-e[1])*r)/(s*s+r*r||1)));return Math.hypot(i-e[0]-o*s,t-e[1]-o*r)}var ir=i=>i.y>=15&&i.y<22.5&&oe.some((t,e)=>e&&nr(i.x,i.z,oe[e-1],t)<4.2),sr=(i,t)=>Ei.find(e=>{let n=(i-e.x)*e.dir;return n>=-2&&n<=e.length+2&&Math.abs(t-e.z)<e.width});var ec=i=>Te.find(t=>Math.abs(i.x-t.x)<37&&Math.abs(i.z)<17&&i.y>=2.7&&i.y<23),nc=i=>!!ec(i)||!!sr(i.x,i.z)&&i.y<25.8||i.y>=2.7&&i.y<11&&i.x>127&&i.x<293&&Math.abs(i.z)<13,rr=i=>nc(Si(i));function or(i,t,e){let n=Si({x:i,y:t,z:e});return n.x>=127&&n.x<=293&&Math.abs(n.z)<=12&&t>=2&&t<=10||Te.some(s=>Math.abs(n.x-s.x)<=36&&Math.abs(n.z)<=16&&t>=15&&t<=22)||Ei.some(s=>{let r=(n.x-s.x)*s.dir,o=s.from+(s.to-s.from)*Math.max(0,Math.min(1,r/s.length));return r>=-3&&r<=s.length+3&&Math.abs(n.z-s.z)<=s.width+1&&t>=Math.floor(o)-1&&t<=Math.ceil(o)+3})?!0:t>=15&&t<=22&&oe.some((s,r)=>r&&nr(i,e,oe[r-1],s)<=3.1)}function ar(i,t,e=[]){let n={set(r,o,a,h){let c=we({x:r,y:o,z:a});return i.set(c.x,o,c.z,h)},get(r,o,a){let h=we({x:r,y:o,z:a});return i.get(h.x,o,h.z)},fill(r,o,a,h,c,l,f){let u=we({x:r,y:o,z:a}),d=we({x:h,y:c,z:l});i.fill(Math.min(u.x,d.x),o,Math.min(u.z,d.z),Math.max(u.x,d.x),c,Math.max(u.z,d.z),f)}};t(n,{stations:Te,ramps:Ei,lineZ:()=>0,minX:127,maxX:293});let s=new Map;for(let r=1;r<oe.length;r++){let o=oe[r-1],a=oe[r],h=Math.ceil(Math.hypot(a[0]-o[0],a[1]-o[1])*2);for(let c=0;c<=h;c++){let l=Math.round(o[0]+(a[0]-o[0])*c/h),f=Math.round(o[1]+(a[1]-o[1])*c/h);s.set(l+","+f,{x:l,z:f})}}for(let{x:r,z:o}of s.values())i.fill(r-3,15,o-3,r+3,22,o+3,9);for(let{x:r,z:o}of s.values())i.fill(r-2,16,o-2,r+2,21,o+2,0),i.fill(r-2,15,o-2,r+2,15,o+2,9);for(let r of e)i.fill(r.x-35,16,r.z-15,r.x+35,21,r.z+15,0);for(let r of Te)n.fill(r.x-35,16,r.z-15,r.x+35,21,r.z+15,0)}var ae=[{id:"nanjing",name:"\u5357\u4EAC\u4E1C\u8DEF",english:"East Nanjing Road",x:-94,z:66,hallY:16,platformY:6,color:"#8bc9b9",exits:[{number:1,x:-135,z:61.35,dir:1,width:.7,label:"\u5357\u4EAC\u4E1C\u8DEF\u5317\u4FA7 \xB7 \u6CB3\u5357\u4E2D\u8DEF"},{number:4,x:-107,z:70.65,dir:-1,width:.7,label:"\u5357\u4EAC\u4E1C\u8DEF\u5357\u4FA7 \xB7 \u5F80\u5916\u6EE9"}]},{id:"lujiazui",name:"\u9646\u5BB6\u5634",english:"Lujiazui",x:174,z:31,hallY:16,platformY:6,color:"#c9b1c7",exits:[{number:1,x:153,z:24,dir:1,label:"\u4E16\u7EAA\u5927\u9053 \xB7 \u4E1C\u65B9\u660E\u73E0\u65B9\u5411"},{number:3,x:205,z:24,dir:-1,label:"\u4E16\u7EAA\u5927\u9053 \xB7 \u94F6\u57CE\u4E2D\u8DEF\u65B9\u5411"}]}];var wi=ae.flatMap(i=>[...i.exits.map(t=>({station:i.id,exit:t.number,x:t.x,z:t.z,dir:t.dir,from:26,to:16,length:18,width:t.width??1.5,kind:"entrance"})),{station:i.id,x:i.x-12,z:i.z+3,dir:1,from:16,to:6,length:18,width:1.5,kind:"platform"}]);function ic(i,t){return wi.find(e=>{let n=(i-e.x)*e.dir;return n>=-2&&n<=e.length+2&&Math.abs(t-e.z)<e.width})}function sc(i){return ae.find(t=>Math.abs(i.x-t.x)<37&&Math.abs(i.z-t.z)<17&&i.y>=2.7&&i.y<23)}function rc(i){return!!sc(i)||!!ic(i.x,i.z)&&i.y<25.8||i.y>=2.7&&i.y<11&&i.x>-133&&i.x<212&&Math.abs(i.z-lr(i.x))<13}function lr(i){let t=ae[0],e=ae[1],n=Math.max(0,Math.min(1,(i-(t.x+36))/(e.x-36-(t.x+36))));return t.z+(e.z-t.z)*(n*n*(3-2*n))}function cr(i,t,e){return or(i,t,e)||oc({x:i,y:t,z:e})||wi.some(n=>Math.abs(e-n.z)<2&&(i-n.x)*n.dir>=-2&&(i-n.x)*n.dir<=n.length+1&&t>=n.to-1&&t<=29)}function Ti(i,{stations:t=ae,ramps:e=wi,lineZ:n=lr,minX:s=-133,maxX:r=213}={}){for(let o=s;o<=r;o++){let a=Math.round(n(o));i.fill(o,2,a-12,o,10,a+12,3),i.fill(o,3,a-11,o,9,a+11,0),i.fill(o,5,a-5,o,5,a+5,9)}for(let o of t)i.fill(o.x-36,15,o.z-16,o.x+36,22,o.z+16,9),i.fill(o.x-35,16,o.z-15,o.x+35,21,o.z+15,0),i.fill(o.x-36,2,o.z-12,o.x+36,11,o.z+12,9),i.fill(o.x-35,3,o.z-11,o.x+35,10,o.z+11,0),i.fill(o.x-35,5,o.z-5,o.x+35,5,o.z+5,9);for(let o of t)for(let a of[o.x-36,o.x+36])for(let h of[-1,1])i.fill(a,3,o.z+h*8-2,a,10,o.z+h*8+2,0);for(let o of e)for(let a=-3;a<=o.length+3;a++){let h=o.x+a*o.dir,c=o.from+(o.to-o.from)*Math.max(0,Math.min(1,a/o.length)),l=a<=0||a>=o.length,f=o.kind==="entrance"&&(o.width??1.5)<1,u=Math.floor(o.z);if(f){let d=u===61?59:68,p=u===61?63:73;if(a<=0)i.fill(h,26,u-1,h,29,u+1,0),i.fill(h,25,d,h,25,p,9);else if(a>=o.length)i.fill(h,15,u-1,h,15,u+1,9),i.fill(h,16,u-1,h,21,u+1,0),i.fill(h,22,d,h,25,p,9);else{i.fill(h,26,u,h,29,u,0);for(let m=d;m<=p;m++)m!==u&&i.set(h,25,m,9);if(a<=6)i.fill(h,Math.floor(c)-1,u,h,Math.ceil(c)+3,u,0);else{i.set(h,25,u,9);let m=Math.min(24,Math.ceil(c)+3);i.fill(h,Math.floor(c)-1,u,h,m,u,0),m<24&&i.fill(h,m+1,u,h,24,u,3)}}}else i.fill(h,Math.floor(c)-(l?0:1),Math.floor(o.z)-1,h,Math.ceil(c)+3,Math.floor(o.z)+1,0),l&&i.fill(h,Math.floor(c)-1,Math.floor(o.z)-1,h,Math.floor(c)-1,Math.floor(o.z)+1,9)}for(let o of t)i.fill(o.x-35,16,o.z-15,o.x+35,21,o.z+15,0)}function oc(i){return rc(i)||rr(i)||ir(i)}var Ht=Ee.find(i=>i.id==="peace"),Sn=Ee.find(i=>i.id==="pudong-infill-southeast-2"),hr=[{id:"peace-suite",name:"\u6211\u7684\u5916\u6EE9\u603B\u7EDF\u5957\u623F",x:Ht.x,z:Ht.z,y:47,rx:6,rz:5,view:1,balcony:!0,balconyDepth:3,lobby:{x:Ht.x+3.5,y:26,z:Ht.z+.5},target:{x:189.5,y:80,z:106.5}},{id:"tomson-suite",name:"\u6211\u7684\u6C64\u81E3\u4E00\u54C1\u6C5F\u666F\u5957\u623F",x:Sn.x,z:Sn.z,y:77,rx:4,rz:6,view:-1,balcony:!0,balconyDepth:2,lobby:{x:Sn.front-1.5,y:26,z:Sn.z+.5},target:{x:55,y:31,z:137}}];function fr(i){for(let t of hr){let{x:e,z:n,y:s,rx:r,rz:o}=t;if(i.fill(e-r,s-1,n-o,e+r,s+4,n+o,9),i.fill(e-r+1,s,n-o+1,e+r-1,s+3,n+o-1,0),i.fill(e+t.view*r,s,n-o+1,e+t.view*r,s+3,n+o-1,0),i.fill(e-1,s,n-o,e+1,s+2,n-o,0),t.balcony){let a=e+t.view*r,h=a+t.view*t.balconyDepth;i.fill(Math.min(a,h),s-1,n-o+1,Math.max(a,h),s-1,n+o-1,9),i.fill(Math.min(a,h),s,n-o+1,Math.max(a,h),s+3,n+o-1,0)}}i.fill(Ht.x+2,26,Ht.z-3,Ht.x+5,29,Ht.z+2,0)}function ur(i,t,e){return hr.some(n=>t>=n.y-1&&t<=n.y+4&&Math.abs(i-n.x)<=n.rx+(n.balconyDepth??0)&&Math.abs(e-n.z)<=n.rz)}var vt=Z.min,ke=Z.max,Vt=ke-vt,Ai=144;var Gt=16,En=22.25;function Ri(i,t,e,n,s,r=!1){i==="harbor"&&(n=n.map(([a,h,...c])=>[a+Ae.dx,h+Ae.dz,...c])),i==="cliff"&&(n=n.map(([a,h,...c])=>[a+157,h,...c])),i==="forest"&&(n=n.map(([a,h,...c])=>[a+157,h+91,...c]));let o=n.map(([a,h,c=0,l=1],f)=>({x:a+.5,y:s+c,z:h+.5,radius:l,stage:Math.floor(f/5)+1}));return{id:i,name:t,description:e,platforms:o,start:o[0],fallY:s-1.5,sprint:r,bounds:{x1:Math.min(...n.map(a=>a[0]))-2,x2:Math.max(...n.map(a=>a[0]))+2,z1:Math.min(...n.map(a=>a[1]))-2,z2:Math.max(...n.map(a=>a[1]))+2}}}var He=[Ri("harbor","\u6D77\u6E2F\u6298\u7EBF","12 \u5173 \xB7 \u5BBD\u5E73\u53F0\u3001\u77ED\u957F\u95F4\u9694\u4E0E\u8F6C\u5F2F\uFF0C\u9002\u5408\u70ED\u8EAB\u3002",[[69,70],[72,70],[76,71,1],[79,74,1],[81,77,2],[85,78,2],[89,77,2],[91,73,1],[95,71,1],[98,73,2],[101,77,2],[105,79,3]],26),Ri("forest","\u6797\u95F4\u8E0F\u53F6","24 \u5173 \xB7 \u5C0F\u5E73\u53F0\u3001\u4FA7\u8DF3\u548C\u9AD8\u4F4E\u843D\u5DEE\uFF0C\u6CBF\u6797\u51A0\u7ED5\u884C\u3002",[[158,161,0],[161,163,1],[165,164,1],[169,167,0],[171,171,1,0],[174,174,2],[178,175,2],[181,172,1,0],[184,169,2],[188,170,2],[191,174,3],[193,178,3,0],[190,182,2],[186,184,3],[183,188,4],[187,191,4],[191,194,4],[195,192,5],[198,188,5],[202,190,4],[205,194,5],[202,198,5],[198,202,6],[194,204,6]],45),Ri("cliff","\u4E91\u7AEF\u75BE\u8DD1","30 \u5173 \xB7 \u7A84\u53F0\u3001\u8FDC\u8DF3\u548C\u6298\u8FD4\uFF1B\u8FDC\u8DF3\u9700\u8981\u6309\u4F4F Shift\u3002",[[185,49,0],[190,49,0,0],[194,50,1],[199,51,1],[203,54,1,0],[206,58,2],[210,61,2],[215,61,2],[219,64,3],[222,68,3],[219,72,3,0],[214,73,2],[209,74,2],[205,78,3],[201,81,3],[197,83,4],[193,86,4],[189,89,4],[185,92,4],[181,95,5],[177,98,5],[174,102,4],[178,105,4],[182,108,5],[187,109,5],[192,108,6],[196,112,6],[200,115,5],[204,119,6],[209,120,7]],52,!0)],Ci=He[0].platforms;var zu={yuyuan:ve.arrival,waibaidu:{x:ft.x+5.2,y:26,z:ft.south-1,name:"\u5916\u767D\u6E21\u6865 \xB7 \u82CF\u5DDE\u6CB3\u53E3"},village:{x:75,y:26,z:329,name:"\u5976\u9F99\u6751"},gallery:{x:92,y:26,z:329,name:"\u6D82\u9E26\u8857"},tower:{x:126,y:26,z:54,name:"\u4E1C\u65B9\u660E\u73E0"},deck:{x:126,y:70,z:49,name:"\u4E91\u7AEF\u89C2\u666F\u53F0"},race:{...He[0].start,name:"\u6D77\u6E2F\u8DD1\u9177"},spring:{x:95,y:26,z:339,name:"\u5F39\u8DF3\u5E7F\u573A"},dock:{x:260.5,y:23,z:228.5,name:"\u6F5C\u6C34\u8865\u7ED9\u7AD9"},reef:{x:284,y:9,z:287,name:"\u73CA\u745A\u82B1\u56ED"},temple:{x:273.5,y:9,z:301.5,name:"\u6D77\u5E95\u795E\u6BBF"},forest:{x:331,y:35,z:240,name:"\u7FE1\u7FE0\u6797\u5C9B"},desert:{x:65,y:29,z:230,name:"\u91D1\u6C99\u5C9B"},shanghai:{x:b.shanghai.x,y:26,z:b.shanghai.z-3,name:"\u4E0A\u6D77\u4E2D\u5FC3\u5927\u53A6"},towerOffice:{x:b.shanghai.x,y:46,z:b.shanghai.z-3,name:"\u4E0A\u6D77\u4E2D\u5FC3 \xB7 \u529E\u516C\u5C42"},duoyun:{x:b.shanghai.x,y:66,z:b.shanghai.z-3,name:"52F \xB7 \u6735\u4E91\u4E66\u9662"},skyGarden:{x:b.shanghai.x,y:86,z:b.shanghai.z+4,name:"\u4E0A\u6D77\u4E2D\u5FC3 \xB7 \u7A7A\u4E2D\u82B1\u56ED"},skyDeck:{x:b.shanghai.x,y:136,z:b.shanghai.z,name:"\u4E0A\u6D77\u4E2D\u5FC3 \xB7 \u5DC5\u5CF0\u89C2\u666F\u53F0"},jinmao:{x:b.jinmao.x,y:26,z:b.jinmao.z+9,name:"\u91D1\u8302\u5927\u53A6"},jinmaoDeck:{x:b.jinmao.x,y:91,z:b.jinmao.z,name:"\u91D1\u8302 \xB7 \u89C2\u666F\u53F0"},swfc:{x:b.swfc.x+11,y:26,z:b.swfc.z,name:"\u73AF\u7403\u91D1\u878D\u4E2D\u5FC3"},swfcDeck:{x:b.swfc.x,y:104,z:b.swfc.z,name:"\u73AF\u7403 \xB7 \u4E91\u7AEF\u5929\u6865"},magnolia:{x:V.x+10.5,y:26,z:V.z+.5,name:"\u767D\u7389\u5170\u5E7F\u573A"},helipad:{x:V.x+4.5,y:83,z:V.z+4.5,name:"\u767D\u7389\u5170 \xB7 \u76F4\u5347\u673A\u5E73\u53F0"},northBund:{x:145.5,y:26,z:-130.5,name:"\u5317\u5916\u6EE9\u89C2\u666F\u70B9"},bund:{x:gn(84)-10.5,y:26,z:84.5,name:"\u5916\u6EE9\u89C2\u666F\u6B65\u9053"},nanpu:{x:236.5,y:31,z:206.5,name:"\u5357\u6D66\u98CE\u683C\u659C\u62C9\u6865"},bankStreet:{x:29.5,y:26,z:94.5,name:"\u5916\u6EE9\u4E07\u56FD\u5EFA\u7B51\u8857"},southPark:{x:195.5,y:26,z:48.5,name:"\u9646\u5BB6\u5634\u4E2D\u5FC3\u7EFF\u5730"},survivalCamp:{x:130.5,y:26,z:309.5,name:"\u751F\u5B58\u8425\u5730"}},Pu={...b.shanghai,base:26};function Ii(i,t){let e=Math.max(0,Math.min(1,(i-26)/110)),n=9*(1-.43*e),s=e*Math.PI*2/3;return n*(.87+.13*Math.cos((t-s)*3))}var Lu=[{id:"village",name:"\u51FA\u53D1\u4E4B\u5149",x:78.5,y:27.5,z:327.5},{id:"gallery",name:"\u6D82\u9E26\u4E4B\u5149",x:93,y:27.5,z:329,requires:"paint"},{id:"forest",name:"\u68EE\u6797\u4E4B\u5149",x:63.5,y:30.5,z:339.5},{id:"deck",name:"\u4E91\u7AEF\u4E4B\u5149",x:128,y:71.5,z:48},{id:"race",name:"\u8DC3\u52A8\u4E4B\u5149",x:Ci.at(-1).x,y:Ci.at(-1).y+1.5,z:Ci.at(-1).z}],wn=class{constructor({data:t,surface:e,generate:n=!0}={}){this.data=t??new Uint8Array(Vt*Vt*Ai),this.surface=e??new Uint16Array(Vt*Vt),n&&this.generate()}index(t,e,n){return(e*Vt+n-vt)*Vt+t-vt}valid(t,e,n){return t>=vt&&n>=vt&&e>=0&&t<ke&&n<ke&&e<Ai}get(t,e,n){return this.valid(t,e,n)?this.data[this.index(t,e,n)]:0}set(t,e,n,s){return this.valid(t,e,n)?(this.data[this.index(t,e,n)]=s,!0):!1}ground(t,e){for(let n=Ai-1;n>=0;n--)if(this.get(t,n,e))return n+1;return 0}protected(t,e,n){return e===0||e>=25&&un(t,n)||Ps(t,e,n)||ur(t,e,n)||cr(t,e,n)||Qs(t,e,n)||Ui(t,e,n)||t>=113&&t<=139&&n>=29&&n<=56&&e>=25||t>=86&&t<=98&&n>=323&&n<=328&&e>=25||He.some(s=>t>=s.bounds.x1&&t<=s.bounds.x2&&n>=s.bounds.z1&&n<=s.bounds.z2&&e>=s.fallY-2)||t>=61&&t<=66&&n>=337&&n<=342&&e>=25||t>=94&&t<=97&&n>=338&&n<=341&&e>=25||t>=257&&t<=263&&n>=214&&n<=230&&e>=21||t>=262&&t<=278&&n>=292&&n<=308&&e>=6}surfaceAt(t,e){return this.valid(Math.floor(t),0,Math.floor(e))&&this.surface[(Math.floor(e)-vt)*Vt+Math.floor(t)-vt]||1}fill(t,e,n,s,r,o,a){for(let h=t;h<=s;h++)for(let c=e;c<=r;c++)for(let l=n;l<=o;l++)this.set(h,c,l,a)}disc(t,e,n,s,r){for(let o=Math.ceil(t-s);o<=t+s;o++)for(let a=Math.ceil(n-s);a<=n+s;a++)Math.hypot(o-t,a-n)<=s&&this.set(o,e,a,r)}orb(t,e,n,s){for(let r=Math.floor(t-s);r<=Math.ceil(t+s);r++)for(let o=Math.floor(e-s);o<=Math.ceil(e+s);o++)for(let a=Math.floor(n-s);a<=Math.ceil(n+s);a++){let h=Math.hypot(r-t,o-e,a-n);h<=s&&h>s-1.3&&this.set(r,o,a,Math.abs(o-e)<=1?11:10)}}generate(){for(let l=vt;l<ke;l++)for(let f=vt;f<ke;f++){let u=6+Math.floor(Math.sin(l*.14)+Math.cos(f*.17));for(let[p,m,g,x]of[[330,60,31,34],[330,259,37,35],[65,230,27,28],[350,355,21,29]]){let S=Math.hypot(l-p,f-m);S<g&&(u=Math.max(u,Math.floor(x-Math.max(0,S-g*.53)*.8+Math.sin((l-(p===330?157:p===350?132:0))*.2)*1.4)))}(l>=69&&l<=82&&f>=312&&f<=334||l>=82&&l<=139&&f>=315&&f<=358)&&(u=25),u=Li(l,f,u),this.surface[(f-vt)*Vt+l-vt]=u+1;let d=Math.hypot(l-65,f-230)<28;for(let p=0;p<=u;p++)this.set(l,p,f,p===u?u<En||d?6:1:p<u-3?3:2)}let t=this,e=(l,f)=>({set:(u,d,p,m)=>t.set(u+l,d+Gt,p+f,m),get:(u,d,p)=>t.get(u+l,d+Gt,p+f),ground:(u,d)=>t.ground(u+l,d+f)-Gt,fill:(u,d,p,m,g,x,S)=>t.fill(u+l,d+Gt,p+f,m+l,g+Gt,x+f,S),disc:(u,d,p,m,g)=>t.disc(u+l,d+Gt,p+f,m,g),orb:(u,d,p,m)=>t.orb(u+l,d+Gt,p+f,m)}),n=e(Ae.dx,Ae.dz),s=1729,r=()=>(s=Math.imul(s,1664525)+1013904223>>>0,s/4294967296);for(let l=0;l<160;l++){let f=5+Math.floor(r()*115),u=5+Math.floor(r()*105),d=n.ground(f,u);if(d<9||d>15||f>31&&f<107&&u>27&&u<82||f>=24&&f<=34&&u>=55&&u<=65||n.get(f,d-1,u)!==1)continue;let p=4+Math.floor(r()*2);for(let m=0;m<p;m++)n.set(f,d+m,u,4);for(let m=-2;m<=2;m++)for(let g=-2;g<=2;g++)for(let x=-1;x<=1;x++)Math.abs(m)+Math.abs(g)+Math.abs(x)<5&&!n.get(f+m,d+p+x,u+g)&&n.set(f+m,d+p+x,u+g,5);n.set(f,d+p+2,u,5)}for(let l=36;l<=42;l++)for(let f=33;f<=39;f++)if(n.set(l,10,f,7),l===36||l===42||f===33||f===39)for(let u=11;u<=14;u++)f===39&&(l===39||l===40)&&u<14||(l===36||l===42)&&f===36&&(u===12||u===13)||n.set(l,u,f,(l===36||l===42)&&(f===33||f===39)?4:7);for(let l=35;l<=43;l++)for(let f=32;f<=40;f++)n.set(l,15+Math.min(l-35,43-l),f,8);n.fill(39,9,40,40,9,50,6),n.fill(40,9,49,94,9,51,6),n.fill(59,9,50,61,9,72,6),n.fill(60,9,70,69,9,72,6),n.fill(52,9,44,62,15,45,9),n.fill(52,15,45,62,15,45,10),n.fill(52,9,46,62,9,48,8),n.fill(54,10,39,60,13,40,8),n.fill(53,14,38,61,14,41,7);{let l=e(36,0);l.disc(90,9,42,12,9),l.disc(90,10,42,10,3);for(let f=11;f<=24;f++){let u=Math.round(7*(24-f)/13);for(let d of[0,2.094,4.189]){let p=Math.round(90+Math.cos(d)*u),m=Math.round(42+Math.sin(d)*u);l.fill(p-1,f,m-1,p+1,f,m+1,9)}}l.orb(90,26,42,5),l.fill(89,19,41,91,65,43,9),l.orb(90,54,42,4.5),l.orb(90,67,42,2),l.fill(90,65,42,90,qt.top-Gt,42,9),l.disc(90,27,42,6,9),l.disc(90,53,42,5,9);for(let f=0;f<360;f+=10){let u=f*Math.PI/180;l.set(Math.round(90+Math.cos(u)*4.5),54,Math.round(42+Math.sin(u)*4.5),11)}l.fill(89,9,52,91,9,54,12),l.fill(89,53,48,91,53,50,12),l.fill(89,54,48,91,56,50,0),l.fill(85,10,52,87,10,52,7),l.fill(94,10,52,96,10,52,7)}n.fill(59,9,58,61,9,60,12),n.fill(26,0,57,31,12,62,3),n.fill(26,13,57,31,20,62,0),n.fill(26,12,57,31,12,62,7);for(let l=0;l<4;l++)n.fill(29,12-l,63+l,30,12-l,63+l,7);for(let l=299;l<365;l+=7)for(let f=224;f<293;f+=9){let u=this.surfaceAt(l,f);if(!(u<=En+1||He.some(d=>l>=d.bounds.x1&&l<=d.bounds.x2&&f>=d.bounds.z1&&f<=d.bounds.z2))){this.fill(l,u,f,l,u+4,f,4);for(let d=-2;d<=2;d++)for(let p=-2;p<=2;p++)for(let m=3;m<=5;m++)Math.abs(d)+Math.abs(p)<4&&this.set(l+d,u+m,f+p,5)}}for(let l of He){let f=l.bounds;this.fill(f.x1,Math.floor(l.fallY)-1,f.z1,f.x2,65,f.z2,0);for(let[u,d]of l.platforms.entries()){let p=Math.floor(d.x),m=Math.floor(d.z),g=d.radius;this.fill(p-g,d.y-1,m-g,p+g,d.y-1,m+g,u%5===0?12:l.id==="forest"?5:l.id==="cliff"?10:11),this.set(p,d.y-1,m,12)}}let o=b.shanghai.x-136.5,a=b.shanghai.z-38.5,h={fill:(l,f,u,d,p,m,g)=>this.fill(l+o,f,u+a,d+o,p,m+a,g),set:(l,f,u,d)=>this.set(l+o,f,u+a,d),disc:(l,f,u,d,p)=>this.disc(l+o,f,u+a,d,p)};h.fill(125,20,25,147,25,51,3),h.fill(125,25,25,147,25,51,9);for(let l=26;l<136;l++)for(let f=126;f<=146;f++)for(let u=28;u<=48;u++){let d=f+.5-136.5,p=u+.5-38.5,m=Math.hypot(d,p),g=Math.atan2(p,d),x=Ii(l,g);m<=x&&m>=x-1.05&&h.set(f,l,u,l%10===5?9:11)}for(let l of[25,45,65,85,105,125,135]){let f=l>=135?5:Math.floor(Ii(l,0));h.disc(136,l,38,f,9),l<135&&(h.fill(135,l+1,37,137,l+5,39,0),h.fill(132,l+1,36,140,l+3,43,0))}h.fill(134,26,42,138,31,49,0),h.fill(135,25,46,137,25,49,12),h.fill(133,85,35,139,85,44,9),h.fill(133,86,35,139,89,44,0),h.fill(135,85,41,137,85,43,12);for(let l of[131,141])h.set(l,85,38,7),h.fill(l,86,38,l,88,38,5),h.set(l,89,38,12);h.disc(136,135,38,5,9),h.fill(134,136,36,138,140,40,0),h.fill(134,135,37,138,135,39,12);for(let l=136;l<=141;l++){let f=5-(l-136)*.65;for(let u=0;u<Math.PI*2;u+=.2)h.set(Math.round(136+Math.cos(u)*f),l,Math.round(38+Math.sin(u)*f),11)}h.fill(135,136,37,137,141,39,0),h.fill(135,136,41,137,139,44,0);let c={fill:(l,f,u,d,p,m,g)=>this.fill(l+140,f,u+155,d+140,p,m+155,g),set:(l,f,u,d)=>this.set(l+140,f,u+155,d),surfaceAt:(l,f)=>this.surfaceAt(l+140,f+155)};c.fill(122,6,137,138,7,153,9),c.fill(125,8,140,135,8,150,12);for(let l of[123,137])for(let f of[138,152])c.fill(l,8,f,l,15,f,9);c.fill(122,16,137,138,16,153,11),c.fill(128,9,141,132,10,149,9);for(let l=0;l<32;l++){let f=140+l*7%23,u=119+l*11%29,d=c.surfaceAt(f,u);d>En-5||(c.set(f,d,u,l%2?10:12),c.set(f,d+1,u,l%2?10:11),l%3===0&&(c.set(f-1,d+1,u,10),c.set(f+1,d+1,u,10)))}c.fill(151,6,119,160,6,124,7),c.fill(152,7,119,159,8,119,7),c.fill(152,7,124,159,8,124,7),c.fill(156,7,122,156,13,122,4);for(let l=0;l<55;l++){let f=115+l*13%60,u=103+l*19%55,d=c.surfaceAt(f,u);if(d<En-7)for(let p=0;p<2+l%4;p++)c.set(f,d+p,u,5)}this.fill(283,8,286,285,8,288,6),this.fill(283,9,286,285,12,288,0),Ni(this),tr(this),Oi(this,yn),Ls(this,St),er(this),zs(this),Ti(this),ar(this,Ti,ae),fr(this),Fi(this,Ii)}};self.onmessage=()=>{try{let i=new wn;self.postMessage({data:i.data,surface:i.surface},[i.data.buffer,i.surface.buffer])}catch(i){self.postMessage({error:String(i?.message??i)})}};
