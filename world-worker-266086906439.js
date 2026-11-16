var Ui=[168,210],Nn=[201,211];function Oi(n,t){if(n>=120-.5&&n<=283&&t>=203&&t<=210){let e=n-.5,i=192-N;return e<i?26:e<212?26+(e-i)/(212-i)*5:e<=255?31:Math.max(26,31-(e-255)/20*5)}return n>=117&&n<=124&&t>=187&&t<=210?26:null}var lt={forest:{x:223,z:362,radius:37,peak:35,noiseOffset:50,dx:-107,dz:103,arrival:{x:224,y:35,z:343,name:"\u7FE1\u7FE0\u6797\u5C9B"}},mountain:{x:281,z:368,radius:19,peak:34,noiseOffset:108,dx:-49,dz:308,arrival:{x:281,y:34,z:369,name:"\u5357\u90E8\u5C71\u5C9B"}},outer:{x:367,z:378,radius:19,peak:29,noiseOffset:149,dx:17,dz:23,arrival:{x:367,y:30,z:378,name:"\u8FDC\u5C9B"}}};var Oe={x:-3,z:13},Un=-293,bs=-326,sn={x:Un+Oe.x,z:165+Oe.z},dt={bounds:{minX:-336,maxX:-273,minZ:43,maxZ:199},mansion:{x:-311+Oe.x,z:162+Oe.z,top:61,bow:sn},arrival:{x:-272.5,y:26,z:184.5,name:"\u6B66\u5EB7\u5927\u697C \xB7 \u8857\u89D2\u5E7F\u573A",mapX:sn.x,mapZ:sn.z,viewTarget:{x:sn.x,y:43.5,z:sn.z}},road:[[-284,179],[-284,168],[-289,158],[-298,151],[-304,143],[-301,134],[-302,115],[-306,102],[-308,84],[-310,69],[-306,54],[-308,48]],signs:[[-280,29,172,"\u6B66\u5EB7\u5927\u697C \xB7 \u6DEE\u6D77\u4E2D\u8DEF"],[-297,29,137,"\u6B66\u5EB7\u8DEF \xB7 \u68A7\u6850\u8857\u533A"]]},On={bounds:{minX:-266,maxX:-221,minZ:86,maxZ:152},arrival:{x:-244.5,y:26,z:151.5,name:"\u8861\u590D\u91CC \xB7 \u4F4F\u5B85\u5C0F\u9662",viewTarget:{x:-244,y:28.4,z:137}},signs:[[-244.5,29.3,152,"\u8861\u590D\u91CC \xB7 \u4F4F\u5B85\u5C0F\u9662"]]},Fi=3.5,Ss=[["west-huaihai","\u6DEE\u6D77\u4E2D\u8DEF",-284,179,-211,179,3],["west-huaihai-corner","\u6DEE\u6D77\u4E2D\u8DEF\u8F6C\u89D2",-284,179,-284,191,3],["west-huaihai-south","\u6DEE\u6D77\u4E2D\u8DEF\u5357\u6BB5",-327,191,-284,191,3]],Es=[{x:-269,z:165,rx:5,rz:4,face:1,style:"brick",height:12},{x:-254,z:164,rx:5,rz:5,face:1,style:"garden",height:10},{x:-241,z:165,rx:4,rz:4,face:1,style:"spanish",height:13},{x:-274,z:194,rx:4,rz:4,face:-1,style:"spanish",height:11},{x:-261,z:194,rx:5,rz:4,face:-1,style:"brick",height:12},{x:-228,z:194,rx:5,rz:4,face:-1,style:"garden",height:11}],ys=[{x:-323,z:57,rx:6,rz:5,face:1,style:"spanish",height:12},{x:-290,z:59,rx:6,rz:5,face:-1,style:"brick",height:11},{x:-326,z:74,rx:6,rz:5,face:1,style:"brick",height:10},{x:-288,z:75,rx:6,rz:5,face:-1,style:"garden",height:12},{x:-324,z:91,rx:6,rz:5,face:1,style:"garden",height:11},{x:-289,z:94,rx:7,rz:6,face:-1,style:"spanish",height:13},{x:-322,z:107,rx:6,rz:5,face:1,style:"brick",height:11,shop:"coffee"},{x:-286,z:111,rx:6,rz:5,face:-1,style:"garden",height:11,shop:"bookshop"},{x:-321,z:125,rx:6,rz:6,face:1,style:"spanish",height:10,shop:"flowers"},{x:-283,z:130,rx:6,rz:5,face:-1,style:"brick",height:12,shop:"film"},{x:-326,z:140,rx:6,rz:5,face:1,style:"garden",height:12},{x:-282,z:146,rx:7,rz:6,face:-1,style:"spanish",height:14},{x:-317,z:96,rx:2,rz:1,face:1,style:"garden",height:4,gate:!0}];function Ts(n,t){return n>=-336&&n<-288&&t>=40+Math.max(0,Math.floor((-n-319)/2))&&t<=201-Math.max(0,Math.floor((-n-322)/2))}function _s(n,t,e){return t>=n.minX&&t<=n.maxX&&e>=n.minZ&&e<=n.maxZ}function Fn(n,t){return _s(dt.bounds,n,t)||_s(On.bounds,n,t)?!0:n>=-287&&n<=-220&&t>=157&&t<=200&&Es.some(e=>Math.abs(n-e.x)<=e.rx+1&&Math.abs(t-e.z)<=e.rz+2)}function Cl(n,t){let e=1/0;for(let i=1;i<dt.road.length;i++){let[r,s]=dt.road[i-1],[o,a]=dt.road[i],l=o-r,f=a-s,c=Math.min(1,Math.max(0,((n-r)*l+(t-s)*f)/(l*l+f*f)));e=Math.min(e,Math.hypot(n-r-l*c,t-s-f*c))}return e}function As(n){for(let t=1;t<dt.road.length;t++){let[e,i]=dt.road[t-1],[r,s]=dt.road[t];if(n>=s&&n<=i)return Math.round(e+(r-e)*(i-n)/(i-s))}return dt.road.at(-1)[0]}function it(n,t){let e=Un-n;if(e<0||n<bs)return!1;let i=162-Math.floor(e*.5)+(e===0?2:e===1?1:0),r=168+Math.floor(e/12)-(e===0?2:0);return t>=i&&t<=r}function zl(n,t){return!it(n-1,t)||!it(n+1,t)||!it(n,t-1)||!it(n,t+1)}function Il(n){let t=(e,i,r,s)=>n.set(e+Oe.x,i,r+Oe.z,s);for(let e=bs-1;e<=Un+1;e++)for(let i=144;i<=172;i++){let r=it(e,i),s=r&&zl(e,i),o=Un-e;if(!r){if(it(e-1,i)||it(e+1,i)||it(e,i-1)||it(e,i+1)){for(let c of[35,55,60])t(e,c,i,9);for(let c of[36,56])(e+i)%2===0&&t(e,c,i,3)}continue}t(e,25,i,9);let a=(o+8)%7,l=a===0||a===6,f=o<=3||i<=151||i>=165;for(let c=26;c<=61;c++)if(c<=31){let h=!s&&it(e-3,i)&&it(e+3,i)&&it(e,i-3)&&it(e,i+3),u=s&&(l||c>=30&&(a===1||a===5)||c===31&&(a===2||a===4));if(h){let d=c>=27&&c<=29&&a>=2&&a<=4;t(e,c,i,d?11:c<=29?7:9)}else(u||!f&&s)&&t(e,c,i,9)}else{let h=[35,55,60,61].includes(c),u=h||[32,39,43,47,51].includes(c),d=o<=3?i%2===0:[1,2,4].includes(o%6),p=(c-36)%4,m=s&&d&&!u&&(c<36||p>0);(u||s)&&t(e,c,i,m?11:h||c<36||c>55?9:8),s&&d&&p===0&&c>=36&&c<=52&&(it(e,i-1)||t(e,c,i-1,9),it(e,i+1)||t(e,c,i+1,9))}}}function Bi(n,t){let{x:e,z:i,rx:r,rz:s,face:o,style:a,height:l,shop:f,gate:c}=t,h=e+o*r,u=25+l,d=a==="brick"?8:9,p=a==="garden"?3:8;if(c){n.fill(e-r,26,i,e-r,u,i,d),n.fill(e+r,26,i,e+r,u,i,d),n.fill(e-r,u,i,e+r,u,i,p);return}n.fill(e-r,25,i-s,e+r,25,i+s,f?7:9);for(let m of[e-r,e+r])n.fill(m,26,i-s,m,u,i+s,d);for(let m of[i-s,i+s])n.fill(e-r,26,m,e+r,u,m,d);for(let m=30;m<=u-2;m+=4){for(let g=i-s+2;g<=i+s-1;g+=3){for(let x of[e-r,e+r])n.fill(x,m,g,x,m+1,g,11);n.set(h+o,m-1,g,9),f||n.set(h+o,m,g-1,4)}for(let g=e-r+2;g<=e+r-2;g+=3)for(let x of[i-s,i+s])n.fill(g,m,x,g,m+1,x,11)}n.fill(e-r-1,u+1,i-s-1,e+r+1,u+1,i+s+1,9);for(let m=0;m<=Math.min(r,s);m++)n.fill(e-r+m,u+2+m,i-s+m,e+r-m,u+2+m,i+s-m,p);if(n.fill(e-r+2,u+2,i+s-1,e-r+2,u+5,i+s-1,8),f){n.fill(h,26,i-1,h,29,i+1,0);for(let g of[i-3,i+3])n.fill(h,27,g-1,h,28,g+1,11);for(let g=i-s;g<=i+s;g++)for(let x=1;x<=2;x++)n.set(h+o*x,30,g,g%2===0?7:9);let m=e-o*(r-1);n.fill(m,26,i-3,m,27,i+3,7);for(let g of[i-3,i,i+3])n.set(m,28,g,f==="flowers"?5:f==="film"?3:9);n.fill(Math.min(e,e+o),26,i+3,Math.max(e,e+o),26,i+4,7),n.fill(e-r+1,31,i-s+1,e+r-1,31,i+s-1,7)}else{n.fill(h,26,i,h,28,i,4),n.fill(h+o,29,i-2,h+o,29,i+2,9);for(let m of[i-s,i+s])n.fill(h+o*2,26,m,h+o*2,27,m,8);if(a==="garden")for(let m=i-2;m<=i+2;m++)m!==i&&n.set(h+o*2,27,m,5)}}function ws(n,t,e,i,r,s=0){n.fill(t,26,e,t,25+i,e,4);for(let o=1;o<=3;o++){let a=25+i+Math.floor(o/2),l=t+r*o,f=e+s*o;n.fill(l,a,f,l,a+1,f,4)}n.disc(t+r*2,27+i,e+s*2,4,5),n.disc(t+r,28+i,e+s,5,5),n.disc(t-r,29+i,e-s+1,4,5),n.disc(t+r*2,30+i,e+s*2-1,2,5)}function Rs(n){let t=dt.bounds;for(let e=t.minX;e<=t.maxX;e++)for(let i=t.minZ;i<=t.maxZ;i++){if(n.surfaceAt(e,i)<26)continue;let r=Cl(e,i);if(r<=Fi)n.set(e,25,i,3);else{if(n.get(e,25,i)===3)continue;r<=7?n.set(e,25,i,9):e<-288&&Math.abs(i-179)>5&&n.set(e,25,i,1)}}for(let e of ys){let{x:i,z:r,rx:s,rz:o,face:a}=e,l=i+a*s;if(e.gate)continue;let f=As(r);for(let c=Math.min(l,f);c<=Math.max(l,f);c++)for(let h=r-2;h<=r+2;h++)n.get(c,25,h)!==3&&n.set(c,25,h,9)}Il(n);for(let e of ys)Bi(n,e);for(let e of Bn)ws(n,...e);n.fill(-277,25,187,-270,25,192,9),Pl(n)}function Pl(n){let t={set:(e,i,r,s)=>n.set(r,i,e,s),fill:(e,i,r,s,o,a,l)=>n.fill(r,i,e,a,o,s,l)};for(let e of Es){let{x:i,z:r,rx:s,rz:o,face:a}=e,l=r+a*o,f=179-a*5;n.fill(i-2,25,Math.min(l,f),i+2,25,Math.max(l,f),9),Bi(t,{...e,x:r,z:i,rx:o,rz:s})}Ll(n)}function Ll(n){let{minX:t,maxX:e,minZ:i,maxZ:r}=On.bounds;n.fill(t,25,i,e,25,r,9),n.fill(-248,25,86,-240,25,154,6),n.fill(-265,25,95,-221,25,98,6),n.fill(-264,25,122,-223,25,125,6),n.fill(-245,25,136,-215,25,140,6);for(let[s,o,a,l,f]of[[-258,91,1,"brick",11],[-233,91,-1,"garden",10],[-258,103,1,"spanish",12],[-232,103,-1,"brick",14],[-257,115,1,"garden",10],[-231,116,-1,"brick",13],[-257,131,1,"brick",13],[-231,131,-1,"spanish",11],[-257,145,1,"garden",11],[-231,145,-1,"brick",15]])Bi(n,{x:s,z:o,rx:6,rz:4,face:a,style:l,height:f});for(let[s,o]of[[t,-249],[-239,e]])n.fill(s,26,r,o,26,r,8);for(let s of[-249,-239])n.fill(s,26,r,s,29,r,9);n.fill(-249,29,r,-239,29,r,8);for(let[s,o]of[[-250,137],[-239,144],[-251,124],[-237,124],[-251,97],[-237,97]])ws(n,s,o,4,0,1);for(let s of[-250,-238])n.fill(s,25,140,s+1,25,143,1),n.fill(s,26,142,s+1,26,142,7);n.fill(-218,25,137,-215,25,148,9)}var Bn=[[-331,169,5,-1],[-317,197,5,1],[-302,197,5,1],[-290,172,5,1]];for(let n=0;n<12;n++)for(let t of[-1,1]){let e=54+n*8+(t>0?3:0);Bn.push([As(e)+t*6,e,5+n%3,-t])}for(let n=-272;n<=-221;n+=10)Bn.push([n,173,6,0,1],[n+4,186,5,0,-1]);var Ms=(n,t,e)=>(t*256+e)*512+n,vs=new Set;for(let[n,t,e,i,r=0]of Bn){for(let s=26;s<=25+e;s++)vs.add(Ms(n,s,t));for(let s=1;s<=3;s++){let o=25+e+Math.floor(s/2);for(let a=o;a<=o+1;a++)vs.add(Ms(n+i*s,a,t+r*s))}}var ki={bounds:{minX:-244,maxX:-215,minZ:215,maxZ:248},arrival:{x:-228.5,y:26,z:219.5,name:"\u590D\u5174\u516C\u56ED \xB7 \u5317\u5165\u53E3",viewTarget:{x:-228.5,y:27,z:231}},signs:[[-228.5,29.5,218,"\u590D\u5174\u516C\u56ED \xB7 \u73AB\u7470\u82B1\u575B"]]},Cs=[["fuxing-middle","\u590D\u5174\u4E2D\u8DEF",-248,209,-138,209,2],["sinan-road","\u601D\u5357\u8DEF",-249,209,-249,298,2],["jinan-road","\u6D4E\u5357\u8DEF",-151,209,-151,298,2],["jianguo-middle","\u5EFA\u56FD\u4E2D\u8DEF",-249,253,-138,253,2],["taikang-road","\u6CF0\u5EB7\u8DEF",-249,298,-151,298,2]];function zs(n,t){if(t<202||t>326||n<-258||n>-131)return!1;let e=Math.max(0,Math.floor((t-304)/3));return n>=-258+e&&n<=-131-e}var Dl=[[-195,225,8,7,15,8],[-173,226,8,8,10,9],[-135,227,3,6,13,8],[-192,241,7,5,12,9],[-170,241,8,5,16,8],[-135,242,3,5,11,9],[-233,268,9,6,13,9],[-232,284,9,5,11,8],[-194,267,8,6,12,8],[-174,268,7,7,16,9],[-191,284,10,5,15,9],[-170,284,6,5,11,8],[-135,272,3,8,13,9],[-135,291,3,5,11,8],[-230,311,9,5,12,8],[-190,312,9,5,15,9],[-169,311,8,5,11,8]];function Nl(n,[t,e,i,r,s,o]){let a=t-i,l=t+i,f=e-r,c=e+r,h=25+s;n.fill(a-1,25,f-1,l+1,25,c+1,9);for(let u of[a,l])n.fill(u,26,f,u,h,c,o);for(let u of[f,c])n.fill(a,26,u,l,h,u,o);n.fill(a+1,25,f+1,l-1,25,c-1,7),n.fill(t-1,26,f,t+1,28,f,0),n.fill(t-2,29,f-1,t+2,29,f,9);for(let u=29;u<h-1;u+=4){for(let d of[f,c])for(let p=a+2;p<l-1;p+=3)n.fill(p,u+1,d,p+1,u+2,d,11),n.fill(p-1,u,d+(d===f?-1:1),p+1,u,d+(d===f?-1:1),9);for(let d of[a,l])for(let p=f+2;p<c-1;p+=3)n.fill(d,u+1,p,d,u+2,p,11);n.fill(a+1,u,f+1,l-1,u,c-1,7)}if(n.fill(a-1,h+1,f-1,l+1,h+1,c+1,9),o===8)for(let u=0;u<=3;u++)n.fill(a,h+2+u,f+u,l,h+2+u,c-u,8);else n.fill(a+2,h+2,f+2,l-2,h+2,c-2,3),n.fill(t-1,h+2,e-1,t+1,h+4,e+1,9)}function Is(n,t,e){n.fill(t,26,e,t,30,e,4),n.disc(t,29,e,2,5),n.disc(t,30,e,3,5),n.disc(t,31,e,2,5)}function Ul(n){let{minX:t,maxX:e,minZ:i,maxZ:r}=ki.bounds;n.fill(t,25,i,e,25,r,1);for(let s of[t,e])n.fill(s,26,i,s,26,r,5);for(let s of[i,r]){n.fill(t,26,s,-231,26,s,5),n.fill(-226,26,s,e,26,s,5);for(let o of[-231,-226])n.fill(o,26,s,o,28,s,9)}n.fill(-230,25,212,-227,25,250,9),n.fill(t+1,25,230,e-1,25,233,9);for(let s of[220,243])n.fill(t+2,25,s,e-2,25,s+1,6);for(let s of[t+2,e-2])n.fill(s,25,219,s+1,25,244,6);for(let s of[-237,-221])for(let o of[225,238])Ol(n,s,o,s<-229?-1:1);Fl(n,-222,231);for(let[s,o,a]of[[-242,217,6],[-217,217,5],[-242,246,6],[-217,246,5],[-242,231,4],[-216,233,6]])Is(n,s,o),n.fill(s,31,o,s,25+a,o,4),n.disc(s,26+a,o,3,5),n.disc(s,27+a,o,2,5),n.disc(s-1,25+a,o+1,2.4,5);for(let[s,o]of[[-235,218],[-221,218],[-236,245],[-222,245]])n.disc(s,26,o,1.45,5),n.set(s,27,o,5);for(let[s,o]of[[-238,230],[-237,245],[-224,244],[-219,235]])n.fill(s-1,26,o,s+1,26,o,7)}function Ol(n,t,e,i){for(let r=t-6;r<=t+6;r++)for(let s=e-4;s<=e+4;s++){let o=(r-t)*i/5.5,a=(s-e)/3.75,l=Math.hypot(o,a);if(l>1.12)continue;let f=Math.atan2(a,o),c=.22+(f+Math.PI)*.095,h=l>.87||Math.abs(l-c)<.15;n.set(r,25,s,h?5:l<.16?9:10),l>.87&&l<1&&Math.abs(a)<.45&&Math.abs(o)>.76&&n.set(r,26,s,5)}}function Fl(n,t,e){for(let i=t-3;i<=t+3;i++)for(let r=e-3;r<=e+3;r++){let s=Math.hypot(i-t,r-e);s<=2?n.set(i,25,r,11):s<=2.85&&n.set(i,26,r,9)}n.set(t,26,e,9),n.set(t,27,e,9)}function Ps(n){n.fill(-160,25,200,-156,25,206,6),n.fill(-230,25,200,-227,25,206,6);for(let t of Dl)Nl(n,t);Ul(n);for(let[t,e]of[[-202,224],[-163,225],[-202,242],[-158,244],[-223,262],[-201,277],[-161,277],[-242,308],[-202,308]])Is(n,t,e)}var pt={x:50,z:-21,south:-3,north:-39,y:26,width:5},on={start:-336,join:-216},Ls=n=>-21+.035*(n-62),Hi=[[-336,-65],[-308,-59],[-280,-64],[-252,-55],[-231,-40],[-216,Ls(-216)]],Ds=n=>n*n*(3-2*n);function Pt(n){if(n>=on.join)return Ls(n);for(let t=1;t<Hi.length;t++){let[e,i]=Hi[t-1],[r,s]=Hi[t];if(n<=r)return i+(s-i)*Ds(Math.max(0,(n-e)/(r-e)))}}var Lt=n=>6.5+2.5*Ds(Math.max(0,Math.min(1,(n+254)/38))),Et=(n,t)=>n<=88&&Math.abs(t-Pt(n))<=Lt(n);function Ns(n,t,e){return Math.abs(n-pt.x)<=pt.width+2&&e>=pt.north-1&&e<=pt.south+1&&t>=24&&t<=37}function Us(n,t=[],e=-224){for(let a=e;a<=88;a++){let l=Pt(a),f=Lt(a);for(let c=Math.ceil(l-f);c<=Math.floor(l+f);c++)n.fill(a,15,c,a,142,c,0),n.set(a,14,c,6)}for(let a of t)for(let l of a.samples)if(Et(l.x,l.z)&&l.x<pt.x-12)for(let f=-a.width;f<=a.width;f++)for(let c=-a.width;c<=a.width;c++)n.set(Math.round(l.x)+f,25,Math.round(l.z)+c,9);let{x:i,north:r,south:s,width:o}=pt;for(let a=r;a<=s;a++)n.fill(i-o,25,a,i+o,25,a,9),n.fill(i-o,26,a,i+o,36,a,0);for(let a of[r,-21,s])n.fill(i-o,14,a-1,i+o,24,a+1,9);for(let a of[-1,1])for(let l=r;l<=s;l++)n.set(i+a*(o+1),26,l,9)}function Gi(n,t){let{rx:e,rz:i,height:r,style:s}=n,o=t-26,a=o>=r-10;if(t<=31)return{rx:e,rz:i,cut:0,shift:0};if(s==="ribbon")return{rx:e-(a?2:1),rz:i,cut:2,shift:0};if(s==="terrace"){let l=a?2:o>=15?1:0;return{rx:e-l,rz:i-l,cut:l+1,shift:0}}return s==="split"?{rx:e-(a?2:1),rz:i-1,cut:1,shift:-1}:s==="fin"?{rx:e-1,rz:i-(a?2:1),cut:0,shift:0}:{rx:e-(a?2:1),rz:i-(a?2:1),cut:1,shift:0}}function Fe(n,t,e){let i=Math.abs(t-n.shift),r=Math.abs(e);return i<=n.rx&&r<=n.rz&&i+r<=n.rx+n.rz-n.cut}function Os(n,t){let{x:e,z:i,rx:r,rz:s,height:o,style:a}=t,l=25+o;n.fill(e-r,25,i-s,e+r,25,i+s,9);for(let c=26;c<=l;c++){let h=Gi(t,c),u=Gi(t,c+1);for(let d=-r;d<=r;d++)for(let p=-s;p<=s;p++){if(!Fe(h,d,p))continue;if(c===l||!Fe(u,d,p)){n.set(e+d,c,i+p,9);continue}let m=Math.abs(d-h.shift)===h.rx?p:d;if(!(!Fe(h,d-1,p)||!Fe(h,d+1,p)||!Fe(h,d,p-1)||!Fe(h,d,p+1)))continue;let x=c>=27&&c<=30&&Math.abs(m)>=1&&Math.abs(m)<=3,M=c>=l-2,w=a==="ribbon"&&(c-32)%4===0||a==="terrace"&&(c-32)%5===0,S=a==="frame"&&Math.abs(m)===2||a==="fin"&&m%3===0;n.set(e+d,c,i+p,c<=31?x?11:9:M||S?3:w?9:11)}}let f=Gi(t,l);if(n.fill(e+f.shift-2,l+1,i-1,e+f.shift+2,l+2,i+1,3),a==="frame"||a==="ribbon")for(let c of[-1,1]){let h=i+c*(f.rz-1);n.fill(e-2,l+1,h,e+2,l+1,h,9)}}var Ot=n=>n-10,kn=14,Hn={bounds:{minX:-336,maxX:-218,minZ:-90,maxZ:43},temple:{minX:-321,maxX:-288,minZ:Ot(-28),maxZ:Ot(18)},arrival:{x:-303.5,y:26,z:Ot(19.5),name:"\u9759\u5B89\u5BFA \xB7 \u5357\u4EAC\u897F\u8DEF\u5C71\u95E8",viewTarget:{x:-303.5,y:35,z:Ot(-9)}},signs:[[-303.5,30.1,Ot(17.6),"\u9759\u5B89\u5BFA \xB7 \u5C71\u95E8"],[-270.5,30.1,9.8,"\u4E45\u5149\u767E\u8D27"],[-317.5,30.1,32.2,"\u767E\u4E50\u95E8"],[-253.5,31,5.7,"\u9759\u5B89\u5609\u91CC\u4E2D\u5FC3"],[-298.5,29,31.6,"\u9759\u5B89\u516C\u56ED"]]},Bs=[["jingan-nanjing-west","\u5357\u4EAC\u897F\u8DEF",-331,kn,-206,kn,2],["jingan-huashan","\u534E\u5C71\u8DEF",-326,-34,-326,42,2],["jingan-changde","\u5E38\u5FB7\u8DEF",-281,-31,-281,42,2]],ks=[{x:-304,z:15,rx:4,rz:1,roof:31,layers:2},{x:-315,z:13,rx:3,rz:2,roof:31,layers:2},{x:-293,z:13,rx:3,rz:2,roof:31,layers:2},{x:-304,z:-3,rx:8,rz:5,roof:34,layers:4,upper:!0},{x:-302,z:-19,rx:9,rz:5,roof:37,layers:3,upper:!0},{x:-316,z:-5,rx:2,rz:4,roof:31,layers:2},{x:-292,z:-5,rx:2,rz:4,roof:31,layers:2}].map(n=>({...n,z:Ot(n.z)})),Vi={x:-317,z:Ot(-22),firstTier:32,tiers:6},ap=[...ks.flatMap(({x:n,z:t,rx:e,rz:i,roof:r,layers:s,upper:o})=>[{x:n,z:t,y:r,rx:e+1,rz:i+1},...o?[{x:n,z:t,y:r+s+2,rx:e-1,rz:i}]:[]]),...Array.from({length:Vi.tiers},(n,t)=>{let{x:e,z:i,firstTier:r}=Vi,s=Math.max(1,3-Math.floor(t/2));return{x:e,z:i,y:r+t*3+2,rx:s,rz:s}})],Bl=[{x:-312,z:-46,rx:7,rz:4,height:43,style:"ribbon"},{x:-271,z:2,rx:4,rz:6,height:10,style:"retail"},{x:-254,z:-3,rx:7,rz:7,height:46,style:"frame"},{x:-236,z:-6,rx:7,rz:6,height:36,style:"terrace"},{x:-237,z:-25,rx:6,rz:5,height:39,style:"fin"},{x:-270,z:-21,rx:5,rz:6,height:28,style:"split"},{x:-318,z:35,rx:3,rz:3,height:10,style:"ballroom"}],Fs=(n,t)=>n.map((e,i)=>[e,t,5+i%2]),kl=[...Fs([-278,-264,-255,-245,-234,-223,-212],kn-4),...Fs([-320,-311,-297,-288,-277,-269,-263,-246,-236,-225,-218,-212],kn+5)],Hl=[...kl,[-311,40,4],[-299,38,5],[-289,38,5]],Gl=(n,t,e)=>t>=n.minX&&t<=n.maxX&&e>=n.minZ&&e<=n.maxZ;function Hs(n,t){return n>=-288||n<-336||t<-104||t>43?!1:n>=-336+Math.max(0,Math.floor((-96-t)/2))}var Gs=(n,t,e)=>t>=25&&Gl(Hn.temple,n,e);function Wi(n,t,e,i,r,s,o){for(let a=0;a<o;a++){let l=r-a,f=Math.max(1,s-Math.floor((a+1)/2));n.fill(t-l,i+a,e-f,t+l,i+a,e+f,7)}for(let a of[-1,1])for(let l of[-1,1])n.set(t+a*r,i+1,e+l*s,7),n.set(t+a*(r-1),i+2,e+l*s,7)}function Vl(n,{x:t,z:e,rx:i,rz:r,roof:s,layers:o,upper:a}){let l=t-i,f=t+i,c=e-r,h=e+r;n.fill(l,25,c,f,25,h,9);for(let u of[l,f])n.fill(u,26,c,u,s-1,h,8);for(let u of[c,h]){n.fill(l,s-2,u,f,s-1,u,8);for(let d=l;d<=f;d+=2)Math.abs(d-t)<=1||(n.fill(d,26,u,d,s-2,u,4),Math.abs(d-t)>=3&&s>=34&&n.set(d+1,29,u,11))}if(Wi(n,t,e,s,i+1,r+1,o),a){let u=s+o,d=i-2,p=r-1;n.fill(t-d,u,e-p,t+d,u+1,e+p,8);for(let m=t-d+1;m<t+d;m+=2)for(let g of[e-p,e+p])n.set(m,u+1,g,11);Wi(n,t,e,u+2,d+1,p+1,2),n.fill(t-d,u+4,e,t+d,u+4,e,7)}}function Wl(n,{x:t,z:e,firstTier:i,tiers:r}){n.fill(t-2,26,e-2,t+2,i-1,e+2,8);for(let o=0;o<r;o++){let a=i+o*3,l=Math.max(1,3-Math.floor(o/2));n.fill(t-l+1,a,e-l+1,t+l-1,a+2,e+l-1,8),Wi(n,t,e,a+2,l,l,1)}let s=i+r*3;n.fill(t,s,e,t,s+5,e,7);for(let o of[-1,1])n.fill(t+o*2,s-6,e,t+o*2,s-1,e,7)}function Xl(n,t,e,i){n.fill(t,26,e,t,25+i,e,4);for(let r of[1,2])for(let s of[-1,1])n.set(t+s*r,24+i+r,e,4);n.disc(t,25+i,e,2,5),n.disc(t,26+i,e,3,5),n.disc(t,27+i,e,2,5),n.set(t,25+i,e,4)}function Vs(n,{x:t,z:e,rx:i,rz:r},s){for(let o=t-i-1;o<=t+i+1;o++)for(let a=e-r-1;a<=e+r+1;a++)if(!n.get(o,25,a)||Et(o,a)||n.get(o,26,a)||n.get(o,28,a)||s(o,a))return!1;return!0}function Ws(n,{x:t,z:e,rx:i,rz:r,height:s,style:o}){let a=25+s;n.fill(t-i,25,e-r,t+i,25,e+r,9);for(let l=26;l<=a;l++){let f=i,c=r,h=l===29||l===a;for(let u=t-f;u<=t+f;u++)for(let d of[e-c,e+c]){let p=l>=28&&!h&&u>t-f&&u<t+f&&(u-t+f)%3!==0;n.set(u,l,d,p?11:o==="ballroom"?8:9)}for(let u=e-c+1;u<e+c;u++)for(let d of[t-f,t+f])n.set(d,l,u,!h&&l>=30&&(u-e+c)%3!==0?11:9);(l===a||l===29)&&n.fill(t-f+1,l,e-c+1,t+f-1,l,e+c-1,9)}if(n.fill(t-2,a+1,e-1,t+2,a+2,e+1,3),o==="retail"||o==="ballroom"){let l=o==="ballroom"?-1:1,f=e+l*r;n.fill(t-2,26,f,t+2,28,f,0),n.fill(t-i,30,f+l,t+i,30,f+l,9)}}function Xs(n,t){let e=Hn.temple;n.fill(e.minX,25,e.minZ,e.maxX,25,e.maxZ+1,9);for(let i of[e.minX,e.maxX])n.fill(i,26,e.minZ,i,29,e.maxZ-1,8);n.fill(e.minX,26,e.minZ,e.maxX,29,e.minZ,8);for(let i of ks)Vl(n,i);Wl(n,Vi);for(let i of[-311,-297])for(let r of[Ot(4),Ot(8)])n.fill(i-1,26,r,i+1,26,r,9);n.fill(-314,25,30,-287,25,42,1),n.fill(-308,25,30,-304,25,42,9),n.fill(-311,25,35,-289,25,37,6);for(let[i,r,s]of Hl)Xl(n,i,r,s);for(let i of Bl)Vs(n,i,t)&&(i.height>20?Os(n,i):Ws(n,i))}function Ys(n,t){for(let r=on.start;r<=-232;r++){let s=Pt(r),o=Lt(r);for(let a of[-1,1]){let l=a<0?Math.ceil(s-o)-1:Math.floor(s+o)+1;n.fill(r,19,l,r,24,l,9);for(let f=0;f<3;f++)n.set(r,25,l+a*f,9)}}let e=-84,i=-35;n.fill(-328,25,e,-324,25,i,9);for(let r of[-1,1]){let o=Math.round(Pt(-326)+r*(Lt(-326)+2));n.fill(-328,19,o,-324,24,o,9)}for(let r of[-328,-324])for(let s=e;s<=i;s++)Et(r,s)&&n.set(r,26,s,9);for(let r of[-310,-291,-272,-252,-234])for(let s of[-1,1]){let l=[];for(let u=r-4-1;u<=r+4+1;u++)l.push(Pt(u)+s*Lt(u));let f=s<0?Math.floor(Math.min(...l)):Math.ceil(Math.max(...l)),h={...r===-234&&s===-1?{x:-262,z:-90}:{x:r,z:f+s*7},rx:4,rz:3,height:10+(r+336)%7,style:"frame"};Vs(n,h,t)&&Ws(n,h)}}var Yl=-288,rt={min:-336,minZ:-224,max:400},N=56,E={jinmao:{x:191.5,z:78.5,top:99},swfc:{x:217.5,z:90.5,top:112},shanghai:{x:189.5,z:106.5,top:136}},D={x:126,z:42,top:108},an={dx:35,dz:280},z=n=>n<0?136.125+1.05*Math.min(-n,64)+.42*Math.max(0,-n-64):n<=124?108+50*((n-48)/64)**2:108+50*(76/64)**2+(n-124)*.55,Gn=n=>z(n)-18-N,ln=n=>z(n)+9,W={x:Math.round(z(-66)-122),z:-66,top:83},Yi=(n,t)=>n>=Gn(t)&&n<=ln(t),Zi=-150;function Zs(n,t,e){let i=Zi+Math.round(2*Math.sin(n*.037));return t>=i?e:Math.min(e,Math.max(9,25+(t-i)*2))}function qs(n,t,e){if(Math.hypot(n-88,t-332)<65&&(e=Math.max(e,25-Math.floor(Math.max(0,Math.hypot(n-88,t-332)-59)*2))),n>=254&&n<=266&&t>=219&&t<=236)return e;if(zs(n,t))return 25;if(n<on.join&&t>=-74&&t<=-21&&Et(n,t))return 14;if(Hs(n,t))return 25;if(t>=rt.minZ&&t<=244){let i=n-z(t);if(Yi(n,t))return 7+Math.floor(Math.abs((i+N/2+4.5)/(13.5+N/2))*5);if(Ts(n,t)||n>=Yl&&n<Gn(t)-1&&t<=242&&(t<202||n>=102-N)||i>10&&n<(t<0?rt.max:317)&&t<=234)return 25}return e}var ye=(n,t,e,i=2)=>({id:n,name:t,points:e,width:i}),Qt=[ye("nanpu","\u5357\u6D66\u98CE\u683C\u659C\u62C9\u6865",[[176-N,190,26],[176-N,206,26],[192-N,206,26],[212,206,31],[255,206,31],[275,206,26],[282,206,26]],3),ye("city","\u9646\u5BB6\u5634\u6EE8\u6C5F\u6B65\u9053",[[124,54,26],[139,54,26],[139,110,26],[183,122,26],[215,174,26]]),ye("mountain","\u5357\u90E8\u5C71\u5C9B\u6865",[[321,348,26],[313,360,26],[298,366,30],[lt.mountain.arrival.x,lt.mountain.arrival.z,34]]),ye("forest","\u7FE1\u7FE0\u8DE8\u6D77\u6865",[[305,342,26],[289,342,26],[279,342,28],[250,343,31],[lt.forest.arrival.x,lt.forest.arrival.z,35]]),ye("sand","\u91D1\u6C99\u8DE8\u6D77\u6865",[[30,190,26],[30,204,26],[65,210,28],[65,230,29]]),ye("home","\u751F\u6D3B\u5C9B\u8FDE\u63A5\u6865",[[65,230,29],[50,257,29],[45,285,26],[45,329,26],[75,329,26]]),ye("outer","\u8FDC\u5C9B\u8FDE\u63A5\u6865",[[346,349,26],[346,355,26],[360,367,29],[lt.outer.arrival.x,lt.outer.arrival.z,30]])];function $s(n){let t=[];for(let e=1;e<n.points.length;e++){let[i,r,s]=n.points[e-1],[o,a,l]=n.points[e],f=Math.max(Math.abs(o-i),Math.abs(a-r))*2;for(let c=e===1?0:1;c<=f;c++){let h=c/f;t.push({x:Math.round(i+(o-i)*h),z:Math.round(r+(a-r)*h),y:Math.round(s+(l-s)*h)})}}return t}function Js(n,t,e){return t>=10&&t<=59&&e>=200&&e<=212&&Ui.some(i=>Math.abs(n-i)<=1)||t>=25&&Object.values(E).some(i=>Math.abs(n+.5-i.x)<=12&&Math.abs(e+.5-i.z)<=13)?!0:Qt.some(i=>i.samples.some(r=>Math.abs(n-r.x)<=i.width&&Math.abs(e-r.z)<=i.width&&t>=r.y-1&&t<=r.y+2))}for(let n of Qt)n.samples=$s(n);function Zl(n,t,e){return{set:(i,r,s,o)=>n.set(i+t,r,s+e,o),fill:(i,r,s,o,a,l,f)=>n.fill(i+t,r,s+e,o+t,a,l+e,f),disc:(i,r,s,o,a)=>n.disc(i+t,r,s+e,o,a)}}function ql(n){let t=(e,i,r,s)=>n.set(Math.floor(E.swfc.x)+r-71,i,Math.floor(E.swfc.z)-e+145,s);return{set:t,fill:(e,i,r,s,o,a,l)=>{for(let f=e;f<=s;f++)for(let c=i;c<=o;c++)for(let h=r;h<=a;h++)t(f,c,h,l)}}}function Xi(n,t,e,i=10){for(let r=-i;r<=i;r++)for(let s=-i;s<=i;s++){let o=t+r,a=e+s;o>z(a)+9&&(n.fill(o,15,a,o,24,a,3),n.set(o,25,a,9))}}function Ks(n){n.fill(110,23,116,124,28,121,0),n.fill(107,24,117,109,28,119,0),n.fill(104,25,117,106,28,119,0);for(let t=rt.minZ;t<=236;t++)for(let e=Math.ceil(Gn(t));e<=ln(t);e++)n.fill(e,18,t,e,25,t,0);Xi(n,E.jinmao.x-.5,E.jinmao.z-.5),Xi(n,E.swfc.x-.5,E.swfc.z-.5,11);{let t=Zl(arguments[0],E.jinmao.x-123.5,E.jinmao.z-62.5),e={x:123.5,z:62.5};for(let i=26;i<99;i++){let r=(i-26)/73,s=i%9===7||i%9===8,o=8-Math.floor(r*8)*.75+(s?1:0);for(let a=115;a<=131;a++)for(let l=54;l<=70;l++){let f=Math.abs(a+.5-e.x),c=Math.abs(l+.5-e.z),h=Math.max(f,c)<=o&&f+c<=o*1.45,u=Math.max(f,c)>=o-1||f+c>=o*1.45-1.4;h&&(u||s)&&t.set(a,i,l,s||f===c?9:11)}}t.fill(121,26,67,125,31,72,0),t.fill(122,25,69,124,25,72,12),t.disc(123,90,62,4,9),t.fill(121,91,60,125,94,64,0),t.fill(122,90,61,124,90,63,12),t.fill(123,96,62,123,99,62,9);for(let i=91;i<=94;i++)for(let r=-3;r<=3;r++)for(let s=-3;s<=3;s++)Math.abs(r)+Math.abs(s)<=5&&(Math.abs(r)===3||Math.abs(s)===3||Math.abs(r)+Math.abs(s)===5)&&t.set(123+r,i,62+s,r===0||s===0?9:11);t.fill(120,95,59,126,99,65,0);for(let i=95;i<=99;i++)t.disc(123,i,62,Math.max(.5,3.7-(i-95)*.8),9)}{let t=ql(arguments[0]),e={x:145.5,z:71.5};for(let i=26;i<=111;i++){let r=(i-26)/85,s=9-Math.floor(r*4),o=7-Math.floor(r*4);for(let a=136;a<=154;a++)for(let l=64;l<=78;l++){let f=Math.abs(a+.5-e.x),c=Math.abs(l+.5-e.z);f>s||c>o||i>=96&&i<=107&&f<=3+(i-96)*.12||(f>=s-1||c>=o-1||i%12===1||i===95||i>=108)&&t.set(a,i,l,f>=s-1||i>=108?9:11)}}t.fill(143,26,77,147,31,83,0),t.fill(144,25,80,146,25,84,12),t.fill(141,103,70,149,103,72,12),t.fill(141,104,69,149,104,69,11),t.fill(141,104,73,149,104,73,11)}for(let t=64;t<=112;t++){let e=Math.floor(Gn(t)-2);for(let i=e-3;i<=e-1;i++)n.set(i,25,t,9),n.fill(i,26,t,i,28,t,0);t%12===4&&(n.fill(e-1,26,t,e-1,28,t,9),n.set(e-1,29,t,12))}n.fill(50-N,25,76,57-N,25,81,1),n.fill(50-N,26,76,57-N,29,81,0);for(let t of Object.values(E))Xi(n,t.x-.5,t.z-.5,13)}function js(n,t=()=>!1){for(let e of Qt){let i=$s(e);if(e.samples=i,e.id==="nanpu"){for(let r=117;r<=282;r++)for(let s=187;s<=209;s++){let o=Oi(r+.5,s+.5);if(o===null)continue;let a=Math.floor(o+1e-6)-1;n.fill(r,a+1,s,r,Math.min(143,a+25),s,0),n.set(r,a,s,9)}continue}for(let r of i)for(let s=-e.width;s<=e.width;s++)for(let o=-e.width;o<=e.width;o++)n.fill(r.x+s,r.y,r.z+o,r.x+s,r.y+2,r.z+o,0),n.set(r.x+s,r.y-1,r.z+o,e.id==="nanpu"?9:7);for(let r=10;r<i.length-10;r+=28){let s=i[r],o=i[Math.min(r+2,i.length-1)],a=Math.abs(o.x-s.x)>=Math.abs(o.z-s.z);for(let l of[-1,1]){let f=s.x+(a?0:l*(e.width+1)),c=s.z+(a?l*(e.width+1):0);t(f,c)||Qt.some(h=>h.samples.some(u=>Math.abs(f-u.x)<=h.width&&Math.abs(c-u.z)<=h.width))||(n.fill(f,Math.min(n.surfaceAt(f,c),s.y-1),c,f,s.y-1,c,9),n.set(f,s.y,c,9),n.set(f,s.y+1,c,12))}}}for(let e of Ui){for(let i of Nn){let r=Math.min(25,n.surfaceAt(e,i)-1);n.fill(e-1,r,i-1,e+1,59,i+1,9),n.fill(e,49,i,e,58,i,10)}n.fill(e-1,55,Nn[0],e+1,57,Nn[1],9)}}var qi={x:D.x,z:D.z,y:70,radius:4.25,arrival:{x:D.x+.1,y:70,z:D.z-.7},exit:{x:D.x+.1,y:70,z:D.z-.7},snacks:{x:D.x+2.3,y:70,z:D.z+1.8},crystal:{x:D.x-2.1,y:71.5,z:D.z+1.3}};function Qs(n){n.fill(D.x-1,69,48,D.x+1,72,50,0);for(let t=D.x-5;t<=D.x+5;t++)for(let e=D.z-5;e<=D.z+5;e++){let i=Math.hypot(t-D.x,e-D.z);if(i<=4.6)for(let r=70;r<=71;r++)n.set(t,r,e,0);if(i<=3.2&&n.set(t,72,e,0),i<=3.8)for(let r=68;r<=69;r++)n.set(t,r,e,0)}n.fill(D.x-1,68,D.z-1,D.x+1,69,D.z+1,9)}var $l={office:{id:"towerOffice",name:"\u529E\u516C\u4F53\u9A8C\u5C42",y:46},books:{id:"duoyun",name:"52F \xB7 \u6735\u4E91\u4E66\u9662",y:66}},_p={x:E.shanghai.x,y:26,z:E.shanghai.z-3},Mp={id:"shanghai-tower-office",name:"\u4E0A\u6D77\u4E2D\u5FC3 \xB7 \u529E\u516C\u5C42",x:E.shanghai.x,y:26,z:E.shanghai.z+4.5},vp=[{x:E.shanghai.x-3.1,y:46,z:E.shanghai.z-1.7},{x:E.shanghai.x+3.1,y:46,z:E.shanghai.z-1.7}];function to(n,t){for(let e of Object.values($l))for(let i=178;i<=201;i++)for(let r=95;r<=118;r++){let s=i+.5-E.shanghai.x,o=r+.5-E.shanghai.z,a=Math.hypot(s,o),l=Math.atan2(o,s),f=t(e.y+2,l)-.5;a<=f+.1&&(n.set(i,e.y-1,r,9),n.set(i,e.y+5,r,9));for(let c=e.y;c<e.y+5;c++)a<=t(c,l)+.5&&n.set(i,c,r,0)}for(let e=184;e<=195;e++)for(let i=101;i<=117;i++)Math.hypot(e+.5-E.shanghai.x,i+.5-E.shanghai.z)<6&&(n.fill(e,26,i,e,31,i,0),n.set(e,25,i,9));n.fill(187,26,110,191,30,118,0),n.fill(187,25,110,191,25,118,9)}var Jl=[...[-18,-14,3,6].map(n=>({x:n,z:60.8})),...[-16,-9,-2,5].map(n=>({x:n,z:71.2}))];function Kl(n){let t=2166136261;for(let e of n)t=Math.imul(t^e.charCodeAt(0),16777619);return t>>>0}var jl=["lane","warehouse","terrace","courtyard","deco"],Vn=["slab","setback","chamfer","split","lantern","slope"],eo=["#497c94","#83a6b8","#527b80","#a3b1be","#546c86","#b7c3ca"],no=["#d5d3c9","#adb3b9","#a59787","#e3daca","#b5b0aa","#b97f68"],Ql={"ifc-north":"chamfer","ifc-south":"chamfer","boc-pudong":"slope",aurora:"slab","shangrila-river":"terrace","shangrila-grand":"setback","bank-shanghai":"lantern",stock:"split"},tc={"ifc-north":"#82a4b3","ifc-south":"#82a4b3","boc-pudong":"#557e89","shangrila-river":"#c4c9c9","shangrila-grand":"#b5bdc2",magnolia:"#acc2cf"};function Xn(n){let t=Kl(n.id),e=/back|infill|front/.test(n.id),i=n.bank==="west"&&e,r=z(n.z)-N-n.x,s=i?r>145&&t%5<2:n.bank==="east"&&!["convention","mall"].includes(n.kind)||n.kind==="glass",o=i&&r>100?["terrace","courtyard","deco"]:jl,a=n.form??Ql[n.id]??(e?s?Vn[t%Vn.length]:o[t%o.length]:s?Vn[t%Vn.length]:"landmark"),l=n.bank==="east"&&e&&n.x<213&&n.z<70,f=n.district==="historic-block"?n.h:i?r<100?8+t%8:r<145?14+t%12:s?28+t%15:17+t%14:l?Math.min(n.h,34+t%5):n.h,c=a==="lane"?Math.min(f,7+t%4):a==="warehouse"?Math.min(f,10+t%5):f;return{seed:t,form:a,modern:s,height:c,wall:s?n.kind==="hotel"?9:11:a==="warehouse"||a==="lane"?8:[9,3,6][t%3],trim:s&&t%3===0?3:9,roof:a==="lane"?4:a==="warehouse"?8:3,color:tc[n.id]??(n.kind==="gold"?"#b59c54":s?eo[(t>>>8)%eo.length]:no[t%no.length]),floor:s?4+(t>>>6)%3:3,spacing:a==="warehouse"?4:s?2+(t>>>2)%2:3}}function cn(n,t,e){let i=n.rx,r=n.rz,s=0,o=!1,a=e/t.height;if(e>=5){if(t.form==="slab"&&(t.seed%2?i=Math.max(2,i-2):r=Math.max(2,r-2)),t.form==="setback"||t.form==="deco"||t.form==="terrace"){let l=a>.82?2:a>.58?1:0;i=Math.max(2,i-l),r=Math.max(2,r-l)}(t.form==="chamfer"||t.form==="lantern")&&(s=Math.min(2,i-1,r-1)),t.form==="split"&&(o=!0),t.form==="slope"&&a>.68&&(i=Math.max(2,i-Math.floor((a-.68)*10)))}return{rx:i,rz:r,cut:s,notch:o}}function Wn(n,t,e){return Math.abs(t)<=n.rx&&Math.abs(e)<=n.rz&&Math.abs(t)+Math.abs(e)<=n.rx+n.rz-n.cut&&!(n.notch&&Math.abs(t)<=1&&e>=n.rz-1)}function io(n,t,e){let{x:i,z:r}=t;for(let a=0;a<e.height;a++){let l=cn(t,e,a),f=cn(t,e,a+1),c=26+a;for(let h=-l.rx;h<=l.rx;h++)for(let u=-l.rz;u<=l.rz;u++){if(!Wn(l,h,u))continue;if(![[1,0],[-1,0],[0,1],[0,-1]].some(([M,w])=>!Wn(l,h+M,u+w))){Wn(f,h,u)||n.set(i+h,c,r+u,e.trim);continue}let p=Math.abs(h)===l.rx?u:h,m=a%e.floor>=1&&a%e.floor<=2&&(p+e.seed)%e.spacing===0,g=p%4===0,x=a%e.floor===0;n.set(i+h,c,r+u,e.modern?a<5||g||x?e.trim:e.wall:m?11:x&&e.form!=="lane"?e.trim:e.wall)}}let s=cn(t,e,e.height-1),o=26+e.height;for(let a=-s.rx;a<=s.rx;a++)for(let l=-s.rz;l<=s.rz;l++)Wn(s,a,l)&&n.set(i+a,o,r+l,e.roof);if(e.form==="lane"||e.form==="warehouse"){let a=e.seed%2===0,l=a?s.rz:s.rx;for(let f=0;f<=l;f++)for(let c=-s.rx;c<=s.rx;c++)for(let h=-s.rz;h<=s.rz;h++)Math.abs(a?h:c)<=l-f&&n.set(i+c,o+f,r+h,e.roof);n.fill(i+s.rx-1,o+1,r-s.rz+1,i+s.rx-1,o+4,r-s.rz+1,8)}else if(e.form==="deco"||e.form==="lantern")n.fill(i-1,o+1,r-1,i+1,o+4,r+1,e.trim),n.set(i,o+5,r,9);else if(n.fill(i-1,o+1,r-1,i+1,o+2,r+1,3),e.form==="terrace"||e.form==="courtyard")for(let a of[-s.rx+1,s.rx-1])n.fill(i+a,o+1,r-s.rz+1,i+a,o+1,r+s.rz-1,5);e.form==="courtyard"&&s.rx>=4&&s.rz>=4&&n.fill(i-1,o,r-1,i+1,o+1,r+1,11)}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */var ro=0,so=1,oo=2,ao=3,lo=4,co=5,fo=6,ho=7;var Do=300;var sr=1e3,Yn=1001,uo=1002;var nc=1006;var No=1008;var ic=1009;var rc=1015;var sc=1023;var ni=2300,or=2301,$i=2302,po=2400,mo=2401,go=2402;var Uo="",X="srgb",Oo="srgb-linear",Fo="linear",ar="srgb";var xo=35044;var Zn=2e3,yo=2001,mn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let r=this._listeners[t];if(r!==void 0){let s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let i=this._listeners[t.type];if(i!==void 0){t.target=this;let r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}},tt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Rp=Math.PI/180,Cp=180/Math.PI;function si(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(tt[n&255]+tt[n>>8&255]+tt[n>>16&255]+tt[n>>24&255]+"-"+tt[t&255]+tt[t>>8&255]+"-"+tt[t>>16&15|64]+tt[t>>24&255]+"-"+tt[e&63|128]+tt[e>>8&255]+"-"+tt[e>>16&255]+tt[e>>24&255]+tt[i&255]+tt[i>>8&255]+tt[i>>16&255]+tt[i>>24&255]).toLowerCase()}function ht(n,t,e){return Math.max(t,Math.min(e,n))}function oc(n,t){return(n%t+t)%t}function Ji(n,t,e){return(1-e)*n+e*t}function fn(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ct(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var st=class n{constructor(t=0,e=0){n.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6],this.y=r[1]*e+r[4]*i+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(ht(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*i-o*r+t.x,this.y=s*r+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},C=class n{constructor(t,e,i,r,s,o,a,l,f){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,r,s,o,a,l,f)}set(t,e,i,r,s,o,a,l,f){let c=this.elements;return c[0]=t,c[1]=r,c[2]=a,c[3]=e,c[4]=s,c[5]=l,c[6]=i,c[7]=o,c[8]=f,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,r=e.elements,s=this.elements,o=i[0],a=i[3],l=i[6],f=i[1],c=i[4],h=i[7],u=i[2],d=i[5],p=i[8],m=r[0],g=r[3],x=r[6],M=r[1],w=r[4],S=r[7],b=r[2],R=r[5],T=r[8];return s[0]=o*m+a*M+l*b,s[3]=o*g+a*w+l*R,s[6]=o*x+a*S+l*T,s[1]=f*m+c*M+h*b,s[4]=f*g+c*w+h*R,s[7]=f*x+c*S+h*T,s[2]=u*m+d*M+p*b,s[5]=u*g+d*w+p*R,s[8]=u*x+d*S+p*T,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],f=t[7],c=t[8];return e*o*c-e*a*f-i*s*c+i*a*l+r*s*f-r*o*l}invert(){let t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],f=t[7],c=t[8],h=c*o-a*f,u=a*l-c*s,d=f*s-o*l,p=e*h+i*u+r*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return t[0]=h*m,t[1]=(r*f-c*i)*m,t[2]=(a*i-r*o)*m,t[3]=u*m,t[4]=(c*e-r*l)*m,t[5]=(r*s-a*e)*m,t[6]=d*m,t[7]=(i*l-f*e)*m,t[8]=(o*e-i*s)*m,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,r,s,o,a){let l=Math.cos(s),f=Math.sin(s);return this.set(i*l,i*f,-i*(l*o+f*a)+o+t,-r*f,r*l,-r*(-f*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Ki.makeScale(t,e)),this}rotate(t){return this.premultiply(Ki.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ki.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let r=0;r<9;r++)if(e[r]!==i[r])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Ki=new C;function ac(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function _o(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}var bt={enabled:!0,workingColorSpace:Oo,spaces:{},convert:function(n,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ar&&(n.r=kt(n.r),n.g=kt(n.g),n.b=kt(n.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(n.applyMatrix3(this.spaces[t].toXYZ),n.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ar&&(n.r=qe(n.r),n.g=qe(n.g),n.b=qe(n.b))),n},fromWorkingColorSpace:function(n,t){return this.convert(n,this.workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Uo?Fo:this.spaces[n].transfer},getLuminanceCoefficients:function(n,t=this.workingColorSpace){return n.fromArray(this.spaces[t].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,t,e){return n.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function kt(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function qe(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Mo=[.64,.33,.3,.6,.15,.06],vo=[.2126,.7152,.0722],bo=[.3127,.329],So=new C().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Eo=new C().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);bt.define({[Oo]:{primaries:Mo,whitePoint:bo,transfer:Fo,toXYZ:So,fromXYZ:Eo,luminanceCoefficients:vo,workingColorSpaceConfig:{unpackColorSpace:X},outputColorSpaceConfig:{drawingBufferColorSpace:X}},[X]:{primaries:Mo,whitePoint:bo,transfer:ar,toXYZ:So,fromXYZ:Eo,luminanceCoefficients:vo,outputColorSpaceConfig:{drawingBufferColorSpace:X}}});var Be,lr=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Be===void 0&&(Be=_o("canvas")),Be.width=t.width,Be.height=t.height;let i=Be.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=Be}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=_o("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let r=i.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=kt(s[o]/255)*255;return i.putImageData(r,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(kt(e[i]/255)*255):e[i]=kt(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},lc=0,cr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:lc++}),this.uuid=si(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(ji(r[o].image)):s.push(ji(r[o]))}else s=ji(r);i.url=s}return e||(t.images[this.uuid]=i),i}};function ji(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?lr.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var cc=0,gn=class n extends mn{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=Yn,r=Yn,s=nc,o=No,a=sc,l=ic,f=n.DEFAULT_ANISOTROPY,c=Uo){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cc++}),this.uuid=si(),this.name="",this.source=new cr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=f,this.format=a,this.internalFormat=null,this.type=l,this.offset=new st(0,0),this.repeat=new st(1,1),this.center=new st(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new C,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Do)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case sr:t.x=t.x-Math.floor(t.x);break;case Yn:t.x=t.x<0?0:1;break;case uo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case sr:t.y=t.y-Math.floor(t.y);break;case Yn:t.y=t.y<0?0:1;break;case uo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};gn.DEFAULT_IMAGE=null;gn.DEFAULT_MAPPING=Do;gn.DEFAULT_ANISOTROPY=1;var Ht=class{constructor(t=0,e=0,i=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=r}static slerpFlat(t,e,i,r,s,o,a){let l=i[r+0],f=i[r+1],c=i[r+2],h=i[r+3],u=s[o+0],d=s[o+1],p=s[o+2],m=s[o+3];if(a===0){t[e+0]=l,t[e+1]=f,t[e+2]=c,t[e+3]=h;return}if(a===1){t[e+0]=u,t[e+1]=d,t[e+2]=p,t[e+3]=m;return}if(h!==m||l!==u||f!==d||c!==p){let g=1-a,x=l*u+f*d+c*p+h*m,M=x>=0?1:-1,w=1-x*x;if(w>Number.EPSILON){let b=Math.sqrt(w),R=Math.atan2(b,x*M);g=Math.sin(g*R)/b,a=Math.sin(a*R)/b}let S=a*M;if(l=l*g+u*S,f=f*g+d*S,c=c*g+p*S,h=h*g+m*S,g===1-a){let b=1/Math.sqrt(l*l+f*f+c*c+h*h);l*=b,f*=b,c*=b,h*=b}}t[e]=l,t[e+1]=f,t[e+2]=c,t[e+3]=h}static multiplyQuaternionsFlat(t,e,i,r,s,o){let a=i[r],l=i[r+1],f=i[r+2],c=i[r+3],h=s[o],u=s[o+1],d=s[o+2],p=s[o+3];return t[e]=a*p+c*h+l*d-f*u,t[e+1]=l*p+c*u+f*h-a*d,t[e+2]=f*p+c*d+a*u-l*h,t[e+3]=c*p-a*h-l*u-f*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,r){return this._x=t,this._y=e,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,f=a(i/2),c=a(r/2),h=a(s/2),u=l(i/2),d=l(r/2),p=l(s/2);switch(o){case"XYZ":this._x=u*c*h+f*d*p,this._y=f*d*h-u*c*p,this._z=f*c*p+u*d*h,this._w=f*c*h-u*d*p;break;case"YXZ":this._x=u*c*h+f*d*p,this._y=f*d*h-u*c*p,this._z=f*c*p-u*d*h,this._w=f*c*h+u*d*p;break;case"ZXY":this._x=u*c*h-f*d*p,this._y=f*d*h+u*c*p,this._z=f*c*p+u*d*h,this._w=f*c*h-u*d*p;break;case"ZYX":this._x=u*c*h-f*d*p,this._y=f*d*h+u*c*p,this._z=f*c*p-u*d*h,this._w=f*c*h+u*d*p;break;case"YZX":this._x=u*c*h+f*d*p,this._y=f*d*h+u*c*p,this._z=f*c*p-u*d*h,this._w=f*c*h-u*d*p;break;case"XZY":this._x=u*c*h-f*d*p,this._y=f*d*h-u*c*p,this._z=f*c*p+u*d*h,this._w=f*c*h+u*d*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,r=Math.sin(i);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],r=e[4],s=e[8],o=e[1],a=e[5],l=e[9],f=e[2],c=e[6],h=e[10],u=i+a+h;if(u>0){let d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(c-l)*d,this._y=(s-f)*d,this._z=(o-r)*d}else if(i>a&&i>h){let d=2*Math.sqrt(1+i-a-h);this._w=(c-l)/d,this._x=.25*d,this._y=(r+o)/d,this._z=(s+f)/d}else if(a>h){let d=2*Math.sqrt(1+a-i-h);this._w=(s-f)/d,this._x=(r+o)/d,this._y=.25*d,this._z=(l+c)/d}else{let d=2*Math.sqrt(1+h-i-a);this._w=(o-r)/d,this._x=(s+f)/d,this._y=(l+c)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ht(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let r=Math.min(1,e/i);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,r=t._y,s=t._z,o=t._w,a=e._x,l=e._y,f=e._z,c=e._w;return this._x=i*c+o*a+r*f-s*l,this._y=r*c+o*l+s*a-i*f,this._z=s*c+o*f+i*l-r*a,this._w=o*c-i*a-r*l-s*f,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let i=this._x,r=this._y,s=this._z,o=this._w,a=o*t._w+i*t._x+r*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;let l=1-a*a;if(l<=Number.EPSILON){let d=1-e;return this._w=d*o+e*this._w,this._x=d*i+e*this._x,this._y=d*r+e*this._y,this._z=d*s+e*this._z,this.normalize(),this}let f=Math.sqrt(l),c=Math.atan2(f,a),h=Math.sin((1-e)*c)/f,u=Math.sin(e*c)/f;return this._w=o*h+this._w*u,this._x=i*h+this._x*u,this._y=r*h+this._y*u,this._z=s*h+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},y=class n{constructor(t=0,e=0,i=0){n.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(To.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(To.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*r,this.y=s[1]*e+s[4]*i+s[7]*r,this.z=s[2]*e+s[5]*i+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(t){let e=this.x,i=this.y,r=this.z,s=t.x,o=t.y,a=t.z,l=t.w,f=2*(o*r-a*i),c=2*(a*e-s*r),h=2*(s*i-o*e);return this.x=e+l*f+o*h-a*c,this.y=i+l*c+a*f-s*h,this.z=r+l*h+s*c-o*f,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*r,this.y=s[1]*e+s[5]*i+s[9]*r,this.z=s[2]*e+s[6]*i+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,r=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Qi.copy(this).projectOnVector(t),this.sub(Qi)}reflect(t){return this.sub(Qi.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(ht(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,r=this.z-t.z;return e*e+i*i+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let r=Math.sin(e)*t;return this.x=r*Math.sin(i),this.y=Math.cos(e)*t,this.z=r*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Qi=new y,To=new Ht,re=class{constructor(t=new y(1/0,1/0,1/0),e=new y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Tt.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Tt.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=Tt.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Tt):Tt.fromBufferAttribute(s,o),Tt.applyMatrix4(t.matrixWorld),this.expandByPoint(Tt);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),qn.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),qn.copy(i.boundingBox)),qn.applyMatrix4(t.matrixWorld),this.union(qn)}let r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Tt),Tt.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(hn),$n.subVectors(this.max,hn),ke.subVectors(t.a,hn),He.subVectors(t.b,hn),Ge.subVectors(t.c,hn),te.subVectors(He,ke),ee.subVectors(Ge,He),_e.subVectors(ke,Ge);let e=[0,-te.z,te.y,0,-ee.z,ee.y,0,-_e.z,_e.y,te.z,0,-te.x,ee.z,0,-ee.x,_e.z,0,-_e.x,-te.y,te.x,0,-ee.y,ee.x,0,-_e.y,_e.x,0];return!tr(e,ke,He,Ge,$n)||(e=[1,0,0,0,1,0,0,0,1],!tr(e,ke,He,Ge,$n))?!1:(Jn.crossVectors(te,ee),e=[Jn.x,Jn.y,Jn.z],tr(e,ke,He,Ge,$n))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Tt).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Tt).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ft[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ft[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ft[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ft[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ft[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ft[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ft[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ft[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ft),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Ft=[new y,new y,new y,new y,new y,new y,new y,new y],Tt=new y,qn=new re,ke=new y,He=new y,Ge=new y,te=new y,ee=new y,_e=new y,hn=new y,$n=new y,Jn=new y,Me=new y;function tr(n,t,e,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){Me.fromArray(n,s);let a=r.x*Math.abs(Me.x)+r.y*Math.abs(Me.y)+r.z*Math.abs(Me.z),l=t.dot(Me),f=e.dot(Me),c=i.dot(Me);if(Math.max(-Math.max(l,f,c),Math.min(l,f,c))>a)return!1}return!0}var fc=new re,un=new y,er=new y,fr=class{constructor(t=new y,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):fc.setFromPoints(t).getCenter(i);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;un.subVectors(t,this.center);let e=un.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),r=(i-this.radius)*.5;this.center.addScaledVector(un,r/i),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(er.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(un.copy(t.center).add(er)),this.expandByPoint(un.copy(t.center).sub(er))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}};var wt=class n{constructor(t,e,i,r,s,o,a,l,f,c,h,u,d,p,m,g){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,r,s,o,a,l,f,c,h,u,d,p,m,g)}set(t,e,i,r,s,o,a,l,f,c,h,u,d,p,m,g){let x=this.elements;return x[0]=t,x[4]=e,x[8]=i,x[12]=r,x[1]=s,x[5]=o,x[9]=a,x[13]=l,x[2]=f,x[6]=c,x[10]=h,x[14]=u,x[3]=d,x[7]=p,x[11]=m,x[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,i=t.elements,r=1/Ve.setFromMatrixColumn(t,0).length(),s=1/Ve.setFromMatrixColumn(t,1).length(),o=1/Ve.setFromMatrixColumn(t,2).length();return e[0]=i[0]*r,e[1]=i[1]*r,e[2]=i[2]*r,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,r=t.y,s=t.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),f=Math.sin(r),c=Math.cos(s),h=Math.sin(s);if(t.order==="XYZ"){let u=o*c,d=o*h,p=a*c,m=a*h;e[0]=l*c,e[4]=-l*h,e[8]=f,e[1]=d+p*f,e[5]=u-m*f,e[9]=-a*l,e[2]=m-u*f,e[6]=p+d*f,e[10]=o*l}else if(t.order==="YXZ"){let u=l*c,d=l*h,p=f*c,m=f*h;e[0]=u+m*a,e[4]=p*a-d,e[8]=o*f,e[1]=o*h,e[5]=o*c,e[9]=-a,e[2]=d*a-p,e[6]=m+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*c,d=l*h,p=f*c,m=f*h;e[0]=u-m*a,e[4]=-o*h,e[8]=p+d*a,e[1]=d+p*a,e[5]=o*c,e[9]=m-u*a,e[2]=-o*f,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*c,d=o*h,p=a*c,m=a*h;e[0]=l*c,e[4]=p*f-d,e[8]=u*f+m,e[1]=l*h,e[5]=m*f+u,e[9]=d*f-p,e[2]=-f,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,d=o*f,p=a*l,m=a*f;e[0]=l*c,e[4]=m-u*h,e[8]=p*h+d,e[1]=h,e[5]=o*c,e[9]=-a*c,e[2]=-f*c,e[6]=d*h+p,e[10]=u-m*h}else if(t.order==="XZY"){let u=o*l,d=o*f,p=a*l,m=a*f;e[0]=l*c,e[4]=-h,e[8]=f*c,e[1]=u*h+m,e[5]=o*c,e[9]=d*h-p,e[2]=p*h-d,e[6]=a*c,e[10]=m*h+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(hc,t,uc)}lookAt(t,e,i){let r=this.elements;return mt.subVectors(t,e),mt.lengthSq()===0&&(mt.z=1),mt.normalize(),ne.crossVectors(i,mt),ne.lengthSq()===0&&(Math.abs(i.z)===1?mt.x+=1e-4:mt.z+=1e-4,mt.normalize(),ne.crossVectors(i,mt)),ne.normalize(),Kn.crossVectors(mt,ne),r[0]=ne.x,r[4]=Kn.x,r[8]=mt.x,r[1]=ne.y,r[5]=Kn.y,r[9]=mt.y,r[2]=ne.z,r[6]=Kn.z,r[10]=mt.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,r=e.elements,s=this.elements,o=i[0],a=i[4],l=i[8],f=i[12],c=i[1],h=i[5],u=i[9],d=i[13],p=i[2],m=i[6],g=i[10],x=i[14],M=i[3],w=i[7],S=i[11],b=i[15],R=r[0],T=r[4],A=r[8],P=r[12],L=r[1],F=r[5],U=r[9],O=r[13],H=r[2],j=r[6],Mt=r[10],xe=r[14],jt=r[3],J=r[7],Q=r[11],ut=r[15];return s[0]=o*R+a*L+l*H+f*jt,s[4]=o*T+a*F+l*j+f*J,s[8]=o*A+a*U+l*Mt+f*Q,s[12]=o*P+a*O+l*xe+f*ut,s[1]=c*R+h*L+u*H+d*jt,s[5]=c*T+h*F+u*j+d*J,s[9]=c*A+h*U+u*Mt+d*Q,s[13]=c*P+h*O+u*xe+d*ut,s[2]=p*R+m*L+g*H+x*jt,s[6]=p*T+m*F+g*j+x*J,s[10]=p*A+m*U+g*Mt+x*Q,s[14]=p*P+m*O+g*xe+x*ut,s[3]=M*R+w*L+S*H+b*jt,s[7]=M*T+w*F+S*j+b*J,s[11]=M*A+w*U+S*Mt+b*Q,s[15]=M*P+w*O+S*xe+b*ut,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],r=t[8],s=t[12],o=t[1],a=t[5],l=t[9],f=t[13],c=t[2],h=t[6],u=t[10],d=t[14],p=t[3],m=t[7],g=t[11],x=t[15];return p*(+s*l*h-r*f*h-s*a*u+i*f*u+r*a*d-i*l*d)+m*(+e*l*d-e*f*u+s*o*u-r*o*d+r*f*c-s*l*c)+g*(+e*f*h-e*a*d-s*o*h+i*o*d+s*a*c-i*f*c)+x*(-r*a*c-e*l*h+e*a*u+r*o*h-i*o*u+i*l*c)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],f=t[7],c=t[8],h=t[9],u=t[10],d=t[11],p=t[12],m=t[13],g=t[14],x=t[15],M=h*g*f-m*u*f+m*l*d-a*g*d-h*l*x+a*u*x,w=p*u*f-c*g*f-p*l*d+o*g*d+c*l*x-o*u*x,S=c*m*f-p*h*f+p*a*d-o*m*d-c*a*x+o*h*x,b=p*h*l-c*m*l-p*a*u+o*m*u+c*a*g-o*h*g,R=e*M+i*w+r*S+s*b;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let T=1/R;return t[0]=M*T,t[1]=(m*u*s-h*g*s-m*r*d+i*g*d+h*r*x-i*u*x)*T,t[2]=(a*g*s-m*l*s+m*r*f-i*g*f-a*r*x+i*l*x)*T,t[3]=(h*l*s-a*u*s-h*r*f+i*u*f+a*r*d-i*l*d)*T,t[4]=w*T,t[5]=(c*g*s-p*u*s+p*r*d-e*g*d-c*r*x+e*u*x)*T,t[6]=(p*l*s-o*g*s-p*r*f+e*g*f+o*r*x-e*l*x)*T,t[7]=(o*u*s-c*l*s+c*r*f-e*u*f-o*r*d+e*l*d)*T,t[8]=S*T,t[9]=(p*h*s-c*m*s-p*i*d+e*m*d+c*i*x-e*h*x)*T,t[10]=(o*m*s-p*a*s+p*i*f-e*m*f-o*i*x+e*a*x)*T,t[11]=(c*a*s-o*h*s-c*i*f+e*h*f+o*i*d-e*a*d)*T,t[12]=b*T,t[13]=(c*m*r-p*h*r+p*i*u-e*m*u-c*i*g+e*h*g)*T,t[14]=(p*a*r-o*m*r-p*i*l+e*m*l+o*i*g-e*a*g)*T,t[15]=(o*h*r-c*a*r+c*i*l-e*h*l-o*i*u+e*a*u)*T,this}scale(t){let e=this.elements,i=t.x,r=t.y,s=t.z;return e[0]*=i,e[4]*=r,e[8]*=s,e[1]*=i,e[5]*=r,e[9]*=s,e[2]*=i,e[6]*=r,e[10]*=s,e[3]*=i,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,r))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),r=Math.sin(e),s=1-i,o=t.x,a=t.y,l=t.z,f=s*o,c=s*a;return this.set(f*o+i,f*a-r*l,f*l+r*a,0,f*a+r*l,c*a+i,c*l-r*o,0,f*l-r*a,c*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,r,s,o){return this.set(1,i,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,i){let r=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,f=s+s,c=o+o,h=a+a,u=s*f,d=s*c,p=s*h,m=o*c,g=o*h,x=a*h,M=l*f,w=l*c,S=l*h,b=i.x,R=i.y,T=i.z;return r[0]=(1-(m+x))*b,r[1]=(d+S)*b,r[2]=(p-w)*b,r[3]=0,r[4]=(d-S)*R,r[5]=(1-(u+x))*R,r[6]=(g+M)*R,r[7]=0,r[8]=(p+w)*T,r[9]=(g-M)*T,r[10]=(1-(u+m))*T,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,i){let r=this.elements,s=Ve.set(r[0],r[1],r[2]).length(),o=Ve.set(r[4],r[5],r[6]).length(),a=Ve.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],At.copy(this);let f=1/s,c=1/o,h=1/a;return At.elements[0]*=f,At.elements[1]*=f,At.elements[2]*=f,At.elements[4]*=c,At.elements[5]*=c,At.elements[6]*=c,At.elements[8]*=h,At.elements[9]*=h,At.elements[10]*=h,e.setFromRotationMatrix(At),i.x=s,i.y=o,i.z=a,this}makePerspective(t,e,i,r,s,o,a=Zn){let l=this.elements,f=2*s/(e-t),c=2*s/(i-r),h=(e+t)/(e-t),u=(i+r)/(i-r),d,p;if(a===Zn)d=-(o+s)/(o-s),p=-2*o*s/(o-s);else if(a===yo)d=-o/(o-s),p=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=f,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=c,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,r,s,o,a=Zn){let l=this.elements,f=1/(e-t),c=1/(i-r),h=1/(o-s),u=(e+t)*f,d=(i+r)*c,p,m;if(a===Zn)p=(o+s)*h,m=-2*h;else if(a===yo)p=s*h,m=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*f,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*c,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=m,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let r=0;r<16;r++)if(e[r]!==i[r])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}},Ve=new y,At=new wt,hc=new y(0,0,0),uc=new y(1,1,1),ne=new y,Kn=new y,mt=new y,Ao=new wt,wo=new Ht,ii=class n{constructor(t=0,e=0,i=0,r=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,r=this._order){return this._x=t,this._y=e,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let r=t.elements,s=r[0],o=r[4],a=r[8],l=r[1],f=r[5],c=r[9],h=r[2],u=r[6],d=r[10];switch(e){case"XYZ":this._y=Math.asin(ht(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-c,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(u,f),this._z=0);break;case"YXZ":this._x=Math.asin(-ht(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,f)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(ht(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-h,d),this._z=Math.atan2(-o,f)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ht(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,f));break;case"YZX":this._z=Math.asin(ht(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-c,f),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,f),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-c,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Ao.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ao,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return wo.setFromEuler(this),this.setFromQuaternion(wo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ii.DEFAULT_ORDER="XYZ";var hr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},dc=0,Ro=new y,We=new Ht,Bt=new wt,jn=new y,dn=new y,pc=new y,mc=new Ht,Co=new y(1,0,0),zo=new y(0,1,0),Io=new y(0,0,1),Po={type:"added"},gc={type:"removed"},Xe={type:"childadded",child:null},nr={type:"childremoved",child:null},se=class n extends mn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:dc++}),this.uuid=si(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new y,e=new ii,i=new Ht,r=new y(1,1,1);function s(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new wt},normalMatrix:{value:new C}}),this.matrix=new wt,this.matrixWorld=new wt,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return We.setFromAxisAngle(t,e),this.quaternion.multiply(We),this}rotateOnWorldAxis(t,e){return We.setFromAxisAngle(t,e),this.quaternion.premultiply(We),this}rotateX(t){return this.rotateOnAxis(Co,t)}rotateY(t){return this.rotateOnAxis(zo,t)}rotateZ(t){return this.rotateOnAxis(Io,t)}translateOnAxis(t,e){return Ro.copy(t).applyQuaternion(this.quaternion),this.position.add(Ro.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Co,t)}translateY(t){return this.translateOnAxis(zo,t)}translateZ(t){return this.translateOnAxis(Io,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Bt.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?jn.copy(t):jn.set(t,e,i);let r=this.parent;this.updateWorldMatrix(!0,!1),dn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bt.lookAt(dn,jn,this.up):Bt.lookAt(jn,dn,this.up),this.quaternion.setFromRotationMatrix(Bt),r&&(Bt.extractRotation(r.matrixWorld),We.setFromRotationMatrix(Bt),this.quaternion.premultiply(We.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Po),Xe.child=t,this.dispatchEvent(Xe),Xe.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(gc),nr.child=t,this.dispatchEvent(nr),nr.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Bt.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Bt.multiply(t.parent.matrixWorld)),t.applyMatrix4(Bt),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Po),Xe.child=t,this.dispatchEvent(Xe),Xe.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,r=this.children.length;i<r;i++){let o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(dn,t,pc),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(dn,mc,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let f=0,c=l.length;f<c;f++){let h=l[f];s(t.shapes,h)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,f=this.material.length;l<f;l++)a.push(s(t.materials,this.material[l]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),f=o(t.textures),c=o(t.images),h=o(t.shapes),u=o(t.skeletons),d=o(t.animations),p=o(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),f.length>0&&(i.textures=f),c.length>0&&(i.images=c),h.length>0&&(i.shapes=h),u.length>0&&(i.skeletons=u),d.length>0&&(i.animations=d),p.length>0&&(i.nodes=p)}return i.object=r,i;function o(a){let l=[];for(let f in a){let c=a[f];delete c.metadata,l.push(c)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let r=t.children[i];this.add(r.clone())}return this}};se.DEFAULT_UP=new y(0,1,0);se.DEFAULT_MATRIX_AUTO_UPDATE=!0;se.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Bo={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ie={h:0,s:0,l:0},Qn={h:0,s:0,l:0};function ir(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var Z=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=X){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,bt.toWorkingColorSpace(this,e),this}setRGB(t,e,i,r=bt.workingColorSpace){return this.r=t,this.g=e,this.b=i,bt.toWorkingColorSpace(this,r),this}setHSL(t,e,i,r=bt.workingColorSpace){if(t=oc(t,1),e=ht(e,0,1),i=ht(i,0,1),e===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+e):i+e-i*e,o=2*i-s;this.r=ir(o,s,t+1/3),this.g=ir(o,s,t),this.b=ir(o,s,t-1/3)}return bt.toWorkingColorSpace(this,r),this}setStyle(t,e=X){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=X){let i=Bo[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=kt(t.r),this.g=kt(t.g),this.b=kt(t.b),this}copyLinearToSRGB(t){return this.r=qe(t.r),this.g=qe(t.g),this.b=qe(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=X){return bt.fromWorkingColorSpace(et.copy(this),t),Math.round(ht(et.r*255,0,255))*65536+Math.round(ht(et.g*255,0,255))*256+Math.round(ht(et.b*255,0,255))}getHexString(t=X){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=bt.workingColorSpace){bt.fromWorkingColorSpace(et.copy(this),e);let i=et.r,r=et.g,s=et.b,o=Math.max(i,r,s),a=Math.min(i,r,s),l,f,c=(a+o)/2;if(a===o)l=0,f=0;else{let h=o-a;switch(f=c<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return t.h=l,t.s=f,t.l=c,t}getRGB(t,e=bt.workingColorSpace){return bt.fromWorkingColorSpace(et.copy(this),e),t.r=et.r,t.g=et.g,t.b=et.b,t}getStyle(t=X){bt.fromWorkingColorSpace(et.copy(this),t);let e=et.r,i=et.g,r=et.b;return t!==X?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(t,e,i){return this.getHSL(ie),this.setHSL(ie.h+t,ie.s+e,ie.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ie),t.getHSL(Qn);let i=Ji(ie.h,Qn.h,e),r=Ji(ie.s,Qn.s,e),s=Ji(ie.l,Qn.l,e);return this.setHSL(i,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*r,this.g=s[1]*e+s[4]*i+s[7]*r,this.b=s[2]*e+s[5]*i+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},et=new Z;Z.NAMES=Bo;var V=new y,ti=new st,Dt=class{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=xo,this.updateRanges=[],this.gpuType=rc,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[i+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ti.fromBufferAttribute(this,e),ti.applyMatrix3(t),this.setXY(e,ti.x,ti.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)V.fromBufferAttribute(this,e),V.applyMatrix3(t),this.setXYZ(e,V.x,V.y,V.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)V.fromBufferAttribute(this,e),V.applyMatrix4(t),this.setXYZ(e,V.x,V.y,V.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)V.fromBufferAttribute(this,e),V.applyNormalMatrix(t),this.setXYZ(e,V.x,V.y,V.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)V.fromBufferAttribute(this,e),V.transformDirection(t),this.setXYZ(e,V.x,V.y,V.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=fn(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ct(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=fn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ct(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=fn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ct(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=fn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ct(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=fn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ct(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ct(e,this.array),i=ct(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,r){return t*=this.itemSize,this.normalized&&(e=ct(e,this.array),i=ct(i,this.array),r=ct(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=r,this}setXYZW(t,e,i,r,s){return t*=this.itemSize,this.normalized&&(e=ct(e,this.array),i=ct(i,this.array),r=ct(r,this.array),s=ct(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==xo&&(t.usage=this.usage),t}};var ur=class extends Dt{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var dr=class extends Dt{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var nt=class extends Dt{constructor(t,e,i){super(new Float32Array(t),e,i)}},xc=0,vt=new wt,rr=new se,Ye=new y,gt=new re,pn=new re,Y=new y,Rt=class n extends mn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:xc++}),this.uuid=si(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ac(t)?dr:ur)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new C().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return vt.makeRotationFromQuaternion(t),this.applyMatrix4(vt),this}rotateX(t){return vt.makeRotationX(t),this.applyMatrix4(vt),this}rotateY(t){return vt.makeRotationY(t),this.applyMatrix4(vt),this}rotateZ(t){return vt.makeRotationZ(t),this.applyMatrix4(vt),this}translate(t,e,i){return vt.makeTranslation(t,e,i),this.applyMatrix4(vt),this}scale(t,e,i){return vt.makeScale(t,e,i),this.applyMatrix4(vt),this}lookAt(t){return rr.lookAt(t),rr.updateMatrix(),this.applyMatrix4(rr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ye).negate(),this.translate(Ye.x,Ye.y,Ye.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let r=0,s=t.length;r<s;r++){let o=t[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new nt(i,3))}else{for(let i=0,r=e.count;i<r;i++){let s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new re);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new y(-1/0,-1/0,-1/0),new y(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,r=e.length;i<r;i++){let s=e[i];gt.setFromBufferAttribute(s),this.morphTargetsRelative?(Y.addVectors(this.boundingBox.min,gt.min),this.boundingBox.expandByPoint(Y),Y.addVectors(this.boundingBox.max,gt.max),this.boundingBox.expandByPoint(Y)):(this.boundingBox.expandByPoint(gt.min),this.boundingBox.expandByPoint(gt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fr);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new y,1/0);return}if(t){let i=this.boundingSphere.center;if(gt.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){let a=e[s];pn.setFromBufferAttribute(a),this.morphTargetsRelative?(Y.addVectors(gt.min,pn.min),gt.expandByPoint(Y),Y.addVectors(gt.max,pn.max),gt.expandByPoint(Y)):(gt.expandByPoint(pn.min),gt.expandByPoint(pn.max))}gt.getCenter(i);let r=0;for(let s=0,o=t.count;s<o;s++)Y.fromBufferAttribute(t,s),r=Math.max(r,i.distanceToSquared(Y));if(e)for(let s=0,o=e.length;s<o;s++){let a=e[s],l=this.morphTargetsRelative;for(let f=0,c=a.count;f<c;f++)Y.fromBufferAttribute(a,f),l&&(Ye.fromBufferAttribute(t,f),Y.add(Ye)),r=Math.max(r,i.distanceToSquared(Y))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Dt(new Float32Array(4*i.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let A=0;A<i.count;A++)a[A]=new y,l[A]=new y;let f=new y,c=new y,h=new y,u=new st,d=new st,p=new st,m=new y,g=new y;function x(A,P,L){f.fromBufferAttribute(i,A),c.fromBufferAttribute(i,P),h.fromBufferAttribute(i,L),u.fromBufferAttribute(s,A),d.fromBufferAttribute(s,P),p.fromBufferAttribute(s,L),c.sub(f),h.sub(f),d.sub(u),p.sub(u);let F=1/(d.x*p.y-p.x*d.y);isFinite(F)&&(m.copy(c).multiplyScalar(p.y).addScaledVector(h,-d.y).multiplyScalar(F),g.copy(h).multiplyScalar(d.x).addScaledVector(c,-p.x).multiplyScalar(F),a[A].add(m),a[P].add(m),a[L].add(m),l[A].add(g),l[P].add(g),l[L].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let A=0,P=M.length;A<P;++A){let L=M[A],F=L.start,U=L.count;for(let O=F,H=F+U;O<H;O+=3)x(t.getX(O+0),t.getX(O+1),t.getX(O+2))}let w=new y,S=new y,b=new y,R=new y;function T(A){b.fromBufferAttribute(r,A),R.copy(b);let P=a[A];w.copy(P),w.sub(b.multiplyScalar(b.dot(P))).normalize(),S.crossVectors(R,P);let F=S.dot(l[A])<0?-1:1;o.setXYZW(A,w.x,w.y,w.z,F)}for(let A=0,P=M.length;A<P;++A){let L=M[A],F=L.start,U=L.count;for(let O=F,H=F+U;O<H;O+=3)T(t.getX(O+0)),T(t.getX(O+1)),T(t.getX(O+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Dt(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,d=i.count;u<d;u++)i.setXYZ(u,0,0,0);let r=new y,s=new y,o=new y,a=new y,l=new y,f=new y,c=new y,h=new y;if(t)for(let u=0,d=t.count;u<d;u+=3){let p=t.getX(u+0),m=t.getX(u+1),g=t.getX(u+2);r.fromBufferAttribute(e,p),s.fromBufferAttribute(e,m),o.fromBufferAttribute(e,g),c.subVectors(o,s),h.subVectors(r,s),c.cross(h),a.fromBufferAttribute(i,p),l.fromBufferAttribute(i,m),f.fromBufferAttribute(i,g),a.add(c),l.add(c),f.add(c),i.setXYZ(p,a.x,a.y,a.z),i.setXYZ(m,l.x,l.y,l.z),i.setXYZ(g,f.x,f.y,f.z)}else for(let u=0,d=e.count;u<d;u+=3)r.fromBufferAttribute(e,u+0),s.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),c.subVectors(o,s),h.subVectors(r,s),c.cross(h),i.setXYZ(u+0,c.x,c.y,c.z),i.setXYZ(u+1,c.x,c.y,c.z),i.setXYZ(u+2,c.x,c.y,c.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Y.fromBufferAttribute(t,e),Y.normalize(),t.setXYZ(e,Y.x,Y.y,Y.z)}toNonIndexed(){function t(a,l){let f=a.array,c=a.itemSize,h=a.normalized,u=new f.constructor(l.length*c),d=0,p=0;for(let m=0,g=l.length;m<g;m++){a.isInterleavedBufferAttribute?d=l[m]*a.data.stride+a.offset:d=l[m]*c;for(let x=0;x<c;x++)u[p++]=f[d++]}return new Dt(u,c,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,r=this.attributes;for(let a in r){let l=r[a],f=t(l,i);e.setAttribute(a,f)}let s=this.morphAttributes;for(let a in s){let l=[],f=s[a];for(let c=0,h=f.length;c<h;c++){let u=f[c],d=t(u,i);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let f=o[a];e.addGroup(f.start,f.count,f.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let f in l)l[f]!==void 0&&(t[f]=l[f]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let l in i){let f=i[l];t.data.attributes[l]=f.toJSON(t.data)}let r={},s=!1;for(let l in this.morphAttributes){let f=this.morphAttributes[l],c=[];for(let h=0,u=f.length;h<u;h++){let d=f[h];c.push(d.toJSON(t.data))}c.length>0&&(r[l]=c,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone(e));let r=t.attributes;for(let f in r){let c=r[f];this.setAttribute(f,c.clone(e))}let s=t.morphAttributes;for(let f in s){let c=[],h=s[f];for(let u=0,d=h.length;u<d;u++)c.push(h[u].clone(e));this.morphAttributes[f]=c}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let f=0,c=o.length;f<c;f++){let h=o[f];this.addGroup(h.start,h.count,h.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}};var ot=class n extends Rt{constructor(t=1,e=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],f=[],c=[],h=[],u=0,d=0;p("z","y","x",-1,-1,i,e,t,o,s,0),p("z","y","x",1,-1,i,e,-t,o,s,1),p("x","z","y",1,1,t,i,e,r,o,2),p("x","z","y",1,-1,t,i,-e,r,o,3),p("x","y","z",1,-1,t,e,i,r,s,4),p("x","y","z",-1,-1,t,e,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new nt(f,3)),this.setAttribute("normal",new nt(c,3)),this.setAttribute("uv",new nt(h,2));function p(m,g,x,M,w,S,b,R,T,A,P){let L=S/T,F=b/A,U=S/2,O=b/2,H=R/2,j=T+1,Mt=A+1,xe=0,jt=0,J=new y;for(let Q=0;Q<Mt;Q++){let ut=Q*F-O;for(let Ue=0;Ue<j;Ue++){let Dn=Ue*L-U;J[m]=Dn*M,J[g]=ut*w,J[x]=H,f.push(J.x,J.y,J.z),J[m]=0,J[g]=0,J[x]=R>0?1:-1,c.push(J.x,J.y,J.z),h.push(Ue/T),h.push(1-Q/A),xe+=1}}for(let Q=0;Q<A;Q++)for(let ut=0;ut<T;ut++){let Ue=u+ut+j*Q,Dn=u+ut+j*(Q+1),Rl=u+(ut+1)+j*(Q+1),xs=u+(ut+1)+j*Q;l.push(Ue,Dn,xs),l.push(Dn,Rl,xs),jt+=6}a.addGroup(d,jt,P),d+=jt,u+=xe}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function yc(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let r=n[e][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=r.clone():Array.isArray(r)?t[e][i]=r.slice():t[e][i]=r}}return t}function ft(n){let t={};for(let e=0;e<n.length;e++){let i=yc(n[e]);for(let r in i)t[r]=i[r]}return t}var _c=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mc=`#ifdef USE_ALPHAHASH
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
#endif`,vc=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bc=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sc=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ec=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Tc=`#ifdef USE_AOMAP
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
#endif`,Ac=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wc=`#ifdef USE_BATCHING
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
#endif`,Rc=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Cc=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,zc=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ic=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Pc=`#ifdef USE_IRIDESCENCE
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
#endif`,Lc=`#ifdef USE_BUMPMAP
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
#endif`,Dc=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Nc=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Uc=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Oc=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Fc=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Bc=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,kc=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Hc=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Gc=`#define PI 3.141592653589793
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
} // validated`,Vc=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Wc=`vec3 transformedNormal = objectNormal;
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
#endif`,Xc=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yc=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zc=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qc=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$c="gl_FragColor = linearToOutputTexel( gl_FragColor );",Jc=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Kc=`#ifdef USE_ENVMAP
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
#endif`,jc=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Qc=`#ifdef USE_ENVMAP
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
#endif`,tf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ef=`#ifdef USE_ENVMAP
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
#endif`,nf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,rf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,of=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,af=`#ifdef USE_GRADIENTMAP
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
}`,lf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ff=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,hf=`uniform bool receiveShadow;
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
#endif`,uf=`#ifdef USE_ENVMAP
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
#endif`,df=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,xf=`PhysicalMaterial material;
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
#endif`,yf=`struct PhysicalMaterial {
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
}`,_f=`
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
#endif`,Mf=`#if defined( RE_IndirectDiffuse )
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
#endif`,vf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,bf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Sf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ef=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Tf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Af=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Rf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Cf=`#if defined( USE_POINTS_UV )
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
#endif`,zf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,If=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Pf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Lf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Df=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Nf=`#ifdef USE_MORPHTARGETS
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
#endif`,Uf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Of=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ff=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Bf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gf=`#ifdef USE_NORMALMAP
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
#endif`,Vf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Yf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Zf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,$f=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Jf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Kf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,jf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,th=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,eh=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,nh=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ih=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,rh=`float getShadowMask() {
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
}`,sh=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,oh=`#ifdef USE_SKINNING
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
#endif`,ah=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lh=`#ifdef USE_SKINNING
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
#endif`,ch=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,fh=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hh=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,uh=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,dh=`#ifdef USE_TRANSMISSION
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
#endif`,ph=`#ifdef USE_TRANSMISSION
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
#endif`,mh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yh=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,_h=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mh=`uniform sampler2D t2D;
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
}`,vh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bh=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Sh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Eh=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Th=`#include <common>
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
}`,Ah=`#if DEPTH_PACKING == 3200
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
}`,wh=`#define DISTANCE
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
}`,Rh=`#define DISTANCE
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
}`,Ch=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,zh=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ih=`uniform float scale;
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
}`,Ph=`uniform vec3 diffuse;
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
}`,Lh=`#include <common>
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
}`,Dh=`uniform vec3 diffuse;
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
}`,Nh=`#define LAMBERT
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
}`,Uh=`#define LAMBERT
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
}`,Oh=`#define MATCAP
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
}`,Fh=`#define MATCAP
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
}`,Bh=`#define NORMAL
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
}`,kh=`#define NORMAL
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
}`,Hh=`#define PHONG
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
}`,Gh=`#define PHONG
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
}`,Vh=`#define STANDARD
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
}`,Wh=`#define STANDARD
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
}`,Xh=`#define TOON
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
}`,Yh=`#define TOON
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
}`,Zh=`uniform float size;
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
}`,qh=`uniform vec3 diffuse;
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
}`,$h=`#include <common>
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
}`,Jh=`uniform vec3 color;
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
}`,Kh=`uniform float rotation;
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
}`,jh=`uniform vec3 diffuse;
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
}`,I={alphahash_fragment:_c,alphahash_pars_fragment:Mc,alphamap_fragment:vc,alphamap_pars_fragment:bc,alphatest_fragment:Sc,alphatest_pars_fragment:Ec,aomap_fragment:Tc,aomap_pars_fragment:Ac,batching_pars_vertex:wc,batching_vertex:Rc,begin_vertex:Cc,beginnormal_vertex:zc,bsdfs:Ic,iridescence_fragment:Pc,bumpmap_pars_fragment:Lc,clipping_planes_fragment:Dc,clipping_planes_pars_fragment:Nc,clipping_planes_pars_vertex:Uc,clipping_planes_vertex:Oc,color_fragment:Fc,color_pars_fragment:Bc,color_pars_vertex:kc,color_vertex:Hc,common:Gc,cube_uv_reflection_fragment:Vc,defaultnormal_vertex:Wc,displacementmap_pars_vertex:Xc,displacementmap_vertex:Yc,emissivemap_fragment:Zc,emissivemap_pars_fragment:qc,colorspace_fragment:$c,colorspace_pars_fragment:Jc,envmap_fragment:Kc,envmap_common_pars_fragment:jc,envmap_pars_fragment:Qc,envmap_pars_vertex:tf,envmap_physical_pars_fragment:uf,envmap_vertex:ef,fog_vertex:nf,fog_pars_vertex:rf,fog_fragment:sf,fog_pars_fragment:of,gradientmap_pars_fragment:af,lightmap_pars_fragment:lf,lights_lambert_fragment:cf,lights_lambert_pars_fragment:ff,lights_pars_begin:hf,lights_toon_fragment:df,lights_toon_pars_fragment:pf,lights_phong_fragment:mf,lights_phong_pars_fragment:gf,lights_physical_fragment:xf,lights_physical_pars_fragment:yf,lights_fragment_begin:_f,lights_fragment_maps:Mf,lights_fragment_end:vf,logdepthbuf_fragment:bf,logdepthbuf_pars_fragment:Sf,logdepthbuf_pars_vertex:Ef,logdepthbuf_vertex:Tf,map_fragment:Af,map_pars_fragment:wf,map_particle_fragment:Rf,map_particle_pars_fragment:Cf,metalnessmap_fragment:zf,metalnessmap_pars_fragment:If,morphinstance_vertex:Pf,morphcolor_vertex:Lf,morphnormal_vertex:Df,morphtarget_pars_vertex:Nf,morphtarget_vertex:Uf,normal_fragment_begin:Of,normal_fragment_maps:Ff,normal_pars_fragment:Bf,normal_pars_vertex:kf,normal_vertex:Hf,normalmap_pars_fragment:Gf,clearcoat_normal_fragment_begin:Vf,clearcoat_normal_fragment_maps:Wf,clearcoat_pars_fragment:Xf,iridescence_pars_fragment:Yf,opaque_fragment:Zf,packing:qf,premultiplied_alpha_fragment:$f,project_vertex:Jf,dithering_fragment:Kf,dithering_pars_fragment:jf,roughnessmap_fragment:Qf,roughnessmap_pars_fragment:th,shadowmap_pars_fragment:eh,shadowmap_pars_vertex:nh,shadowmap_vertex:ih,shadowmask_pars_fragment:rh,skinbase_vertex:sh,skinning_pars_vertex:oh,skinning_vertex:ah,skinnormal_vertex:lh,specularmap_fragment:ch,specularmap_pars_fragment:fh,tonemapping_fragment:hh,tonemapping_pars_fragment:uh,transmission_fragment:dh,transmission_pars_fragment:ph,uv_pars_fragment:mh,uv_pars_vertex:gh,uv_vertex:xh,worldpos_vertex:yh,background_vert:_h,background_frag:Mh,backgroundCube_vert:vh,backgroundCube_frag:bh,cube_vert:Sh,cube_frag:Eh,depth_vert:Th,depth_frag:Ah,distanceRGBA_vert:wh,distanceRGBA_frag:Rh,equirect_vert:Ch,equirect_frag:zh,linedashed_vert:Ih,linedashed_frag:Ph,meshbasic_vert:Lh,meshbasic_frag:Dh,meshlambert_vert:Nh,meshlambert_frag:Uh,meshmatcap_vert:Oh,meshmatcap_frag:Fh,meshnormal_vert:Bh,meshnormal_frag:kh,meshphong_vert:Hh,meshphong_frag:Gh,meshphysical_vert:Vh,meshphysical_frag:Wh,meshtoon_vert:Xh,meshtoon_frag:Yh,points_vert:Zh,points_frag:qh,shadow_vert:$h,shadow_frag:Jh,sprite_vert:Kh,sprite_frag:jh},_={common:{diffuse:{value:new Z(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new C},alphaMap:{value:null},alphaMapTransform:{value:new C},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new C}},envmap:{envMap:{value:null},envMapRotation:{value:new C},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new C}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new C}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new C},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new C},normalScale:{value:new st(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new C},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new C}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new C}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new C}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Z(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Z(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new C},alphaTest:{value:0},uvTransform:{value:new C}},sprite:{diffuse:{value:new Z(16777215)},opacity:{value:1},center:{value:new st(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new C},alphaMap:{value:null},alphaMapTransform:{value:new C},alphaTest:{value:0}}},Lo={basic:{uniforms:ft([_.common,_.specularmap,_.envmap,_.aomap,_.lightmap,_.fog]),vertexShader:I.meshbasic_vert,fragmentShader:I.meshbasic_frag},lambert:{uniforms:ft([_.common,_.specularmap,_.envmap,_.aomap,_.lightmap,_.emissivemap,_.bumpmap,_.normalmap,_.displacementmap,_.fog,_.lights,{emissive:{value:new Z(0)}}]),vertexShader:I.meshlambert_vert,fragmentShader:I.meshlambert_frag},phong:{uniforms:ft([_.common,_.specularmap,_.envmap,_.aomap,_.lightmap,_.emissivemap,_.bumpmap,_.normalmap,_.displacementmap,_.fog,_.lights,{emissive:{value:new Z(0)},specular:{value:new Z(1118481)},shininess:{value:30}}]),vertexShader:I.meshphong_vert,fragmentShader:I.meshphong_frag},standard:{uniforms:ft([_.common,_.envmap,_.aomap,_.lightmap,_.emissivemap,_.bumpmap,_.normalmap,_.displacementmap,_.roughnessmap,_.metalnessmap,_.fog,_.lights,{emissive:{value:new Z(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:I.meshphysical_vert,fragmentShader:I.meshphysical_frag},toon:{uniforms:ft([_.common,_.aomap,_.lightmap,_.emissivemap,_.bumpmap,_.normalmap,_.displacementmap,_.gradientmap,_.fog,_.lights,{emissive:{value:new Z(0)}}]),vertexShader:I.meshtoon_vert,fragmentShader:I.meshtoon_frag},matcap:{uniforms:ft([_.common,_.bumpmap,_.normalmap,_.displacementmap,_.fog,{matcap:{value:null}}]),vertexShader:I.meshmatcap_vert,fragmentShader:I.meshmatcap_frag},points:{uniforms:ft([_.points,_.fog]),vertexShader:I.points_vert,fragmentShader:I.points_frag},dashed:{uniforms:ft([_.common,_.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:I.linedashed_vert,fragmentShader:I.linedashed_frag},depth:{uniforms:ft([_.common,_.displacementmap]),vertexShader:I.depth_vert,fragmentShader:I.depth_frag},normal:{uniforms:ft([_.common,_.bumpmap,_.normalmap,_.displacementmap,{opacity:{value:1}}]),vertexShader:I.meshnormal_vert,fragmentShader:I.meshnormal_frag},sprite:{uniforms:ft([_.sprite,_.fog]),vertexShader:I.sprite_vert,fragmentShader:I.sprite_frag},background:{uniforms:{uvTransform:{value:new C},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:I.background_vert,fragmentShader:I.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new C}},vertexShader:I.backgroundCube_vert,fragmentShader:I.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:I.cube_vert,fragmentShader:I.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:I.equirect_vert,fragmentShader:I.equirect_frag},distanceRGBA:{uniforms:ft([_.common,_.displacementmap,{referencePosition:{value:new y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:I.distanceRGBA_vert,fragmentShader:I.distanceRGBA_frag},shadow:{uniforms:ft([_.lights,_.fog,{color:{value:new Z(0)},opacity:{value:1}}]),vertexShader:I.shadow_vert,fragmentShader:I.shadow_frag}};Lo.physical={uniforms:ft([Lo.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new C},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new C},clearcoatNormalScale:{value:new st(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new C},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new C},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new C},sheen:{value:0},sheenColor:{value:new Z(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new C},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new C},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new C},transmissionSamplerSize:{value:new st},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new C},attenuationDistance:{value:0},attenuationColor:{value:new Z(0)},specularColor:{value:new Z(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new C},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new C},anisotropyVector:{value:new st},anisotropyMap:{value:null},anisotropyMapTransform:{value:new C}}]),vertexShader:I.meshphysical_vert,fragmentShader:I.meshphysical_frag};var ve=(1+Math.sqrt(5))/2,Ze=1/ve,zp=[new y(-ve,Ze,0),new y(ve,Ze,0),new y(-Ze,0,ve),new y(Ze,0,ve),new y(0,ve,-Ze),new y(0,ve,Ze),new y(-1,1,-1),new y(1,1,-1),new y(-1,1,1),new y(1,1,1)];var Ip=new Float32Array(16),Pp=new Float32Array(9),Lp=new Float32Array(4);var Dp={[ro]:so,[oo]:fo,[lo]:ho,[ao]:co,[so]:ro,[fo]:oo,[ho]:lo,[co]:ao};var xt=class extends se{constructor(){super(),this.isGroup=!0,this.type="Group"}};var xn=class n extends Rt{constructor(t=1,e=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};let f=this;r=Math.floor(r),s=Math.floor(s);let c=[],h=[],u=[],d=[],p=0,m=[],g=i/2,x=0;M(),o===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(c),this.setAttribute("position",new nt(h,3)),this.setAttribute("normal",new nt(u,3)),this.setAttribute("uv",new nt(d,2));function M(){let S=new y,b=new y,R=0,T=(e-t)/i;for(let A=0;A<=s;A++){let P=[],L=A/s,F=L*(e-t)+t;for(let U=0;U<=r;U++){let O=U/r,H=O*l+a,j=Math.sin(H),Mt=Math.cos(H);b.x=F*j,b.y=-L*i+g,b.z=F*Mt,h.push(b.x,b.y,b.z),S.set(j,T,Mt).normalize(),u.push(S.x,S.y,S.z),d.push(O,1-L),P.push(p++)}m.push(P)}for(let A=0;A<r;A++)for(let P=0;P<s;P++){let L=m[P][A],F=m[P+1][A],U=m[P+1][A+1],O=m[P][A+1];(t>0||P!==0)&&(c.push(L,F,O),R+=3),(e>0||P!==s-1)&&(c.push(F,U,O),R+=3)}f.addGroup(x,R,0),x+=R}function w(S){let b=p,R=new st,T=new y,A=0,P=S===!0?t:e,L=S===!0?1:-1;for(let U=1;U<=r;U++)h.push(0,g*L,0),u.push(0,L,0),d.push(.5,.5),p++;let F=p;for(let U=0;U<=r;U++){let H=U/r*l+a,j=Math.cos(H),Mt=Math.sin(H);T.x=P*Mt,T.y=g*L,T.z=P*j,h.push(T.x,T.y,T.z),u.push(0,L,0),R.x=j*.5+.5,R.y=Mt*.5*L+.5,d.push(R.x,R.y),p++}for(let U=0;U<r;U++){let O=b+U,H=F+U;S===!0?c.push(H,H+1,O):c.push(H+1,H,O),A+=3}f.addGroup(x,A,S===!0?1:2),x+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var yn=class n extends Rt{constructor(t=1,e=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));let l=Math.min(o+a,Math.PI),f=0,c=[],h=new y,u=new y,d=[],p=[],m=[],g=[];for(let x=0;x<=i;x++){let M=[],w=x/i,S=0;x===0&&o===0?S=.5/e:x===i&&l===Math.PI&&(S=-.5/e);for(let b=0;b<=e;b++){let R=b/e;h.x=-t*Math.cos(r+R*s)*Math.sin(o+w*a),h.y=t*Math.cos(o+w*a),h.z=t*Math.sin(r+R*s)*Math.sin(o+w*a),p.push(h.x,h.y,h.z),u.copy(h).normalize(),m.push(u.x,u.y,u.z),g.push(R+S,1-w),M.push(f++)}c.push(M)}for(let x=0;x<i;x++)for(let M=0;M<e;M++){let w=c[x][M+1],S=c[x][M],b=c[x+1][M],R=c[x+1][M+1];(x!==0||o>0)&&d.push(w,S,R),(x!==i-1||l<Math.PI)&&d.push(S,b,R)}this.setIndex(d),this.setAttribute("position",new nt(p,3)),this.setAttribute("normal",new nt(m,3)),this.setAttribute("uv",new nt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function ei(n,t,e){return!n||!e&&n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function Qh(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}var $e=class{constructor(t,e,i,r){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,r=e[i],s=e[i-1];n:{t:{let o;e:{i:if(!(t<r)){for(let a=i+2;;){if(r===void 0){if(t<s)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(s=r,r=e[++i],t<r)break t}o=e.length;break e}if(!(t>=s)){let a=e[1];t<a&&(i=2,s=a);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=e[--i-1],t>=s)break t}o=i,i=0;break e}break n}for(;i<o;){let a=i+o>>>1;t<e[a]?o=a:i=a+1}if(r=e[i],s=e[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,t,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=t*r;for(let o=0;o!==r;++o)e[o]=i[s+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},pr=class extends $e{constructor(t,e,i,r){super(t,e,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:po,endingEnd:po}}intervalChanged_(t,e,i){let r=this.parameterPositions,s=t-2,o=t+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case mo:s=t,a=2*e-i;break;case go:s=r.length-2,a=e+r[s]-r[s+1];break;default:s=t,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case mo:o=t,l=2*i-e;break;case go:o=1,l=i+r[1]-r[0];break;default:o=t-1,l=e}let f=(i-e)*.5,c=this.valueSize;this._weightPrev=f/(e-a),this._weightNext=f/(l-i),this._offsetPrev=s*c,this._offsetNext=o*c}interpolate_(t,e,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,f=l-a,c=this._offsetPrev,h=this._offsetNext,u=this._weightPrev,d=this._weightNext,p=(i-e)/(r-e),m=p*p,g=m*p,x=-u*g+2*u*m-u*p,M=(1+u)*g+(-1.5-2*u)*m+(-.5+u)*p+1,w=(-1-d)*g+(1.5+d)*m+.5*p,S=d*g-d*m;for(let b=0;b!==a;++b)s[b]=x*o[c+b]+M*o[f+b]+w*o[l+b]+S*o[h+b];return s}},mr=class extends $e{constructor(t,e,i,r){super(t,e,i,r)}interpolate_(t,e,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,f=l-a,c=(i-e)/(r-e),h=1-c;for(let u=0;u!==a;++u)s[u]=o[f+u]*h+o[l+u]*c;return s}},gr=class extends $e{constructor(t,e,i,r){super(t,e,i,r)}interpolate_(t){return this.copySampleValue_(t-1)}},Ct=class{constructor(t,e,i,r){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ei(e,this.TimeBufferType),this.values=ei(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:ei(t.times,Array),values:ei(t.values,Array)};let r=t.getInterpolation();r!==t.DefaultInterpolation&&(i.interpolation=r)}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new gr(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new mr(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new pr(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case ni:e=this.InterpolantFactoryMethodDiscrete;break;case or:e=this.InterpolantFactoryMethodLinear;break;case $i:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ni;case this.InterpolantFactoryMethodLinear:return or;case this.InterpolantFactoryMethodSmooth:return $i}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,r=e.length;i!==r;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,r=e.length;i!==r;++i)e[i]*=t}return this}trim(t,e){let i=this.times,r=i.length,s=0,o=r-1;for(;s!==r&&i[s]<t;)++s;for(;o!==-1&&i[o]>e;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=i.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,r=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==s;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(r!==void 0&&Qh(r))for(let a=0,l=r.length;a!==l;++a){let f=r[a];if(isNaN(f)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,f),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===$i,s=t.length-1,o=1;for(let a=1;a<s;++a){let l=!1,f=t[a],c=t[a+1];if(f!==c&&(a!==1||f!==t[0]))if(r)l=!0;else{let h=a*i,u=h-i,d=h+i;for(let p=0;p!==i;++p){let m=e[h+p];if(m!==e[u+p]||m!==e[d+p]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let h=a*i,u=o*i;for(let d=0;d!==i;++d)e[u+d]=e[h+d]}++o}}if(s>0){t[o]=t[s];for(let a=s*i,l=o*i,f=0;f!==i;++f)e[l+f]=e[a+f];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,r=new i(this.name,t,e);return r.createInterpolant=this.createInterpolant,r}};Ct.prototype.TimeBufferType=Float32Array;Ct.prototype.ValueBufferType=Float32Array;Ct.prototype.DefaultInterpolation=or;var be=class extends Ct{constructor(t,e,i){super(t,e,i)}};be.prototype.ValueTypeName="bool";be.prototype.ValueBufferType=Array;be.prototype.DefaultInterpolation=ni;be.prototype.InterpolantFactoryMethodLinear=void 0;be.prototype.InterpolantFactoryMethodSmooth=void 0;var xr=class extends Ct{};xr.prototype.ValueTypeName="color";var yr=class extends Ct{};yr.prototype.ValueTypeName="number";var _r=class extends $e{constructor(t,e,i,r){super(t,e,i,r)}interpolate_(t,e,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-e)/(r-e),f=t*a;for(let c=f+a;f!==c;f+=4)Ht.slerpFlat(s,0,o,f-a,o,f,l);return s}},ri=class extends Ct{InterpolantFactoryMethodLinear(t){return new _r(this.times,this.values,this.getValueSize(),t)}};ri.prototype.ValueTypeName="quaternion";ri.prototype.InterpolantFactoryMethodSmooth=void 0;var Se=class extends Ct{constructor(t,e,i){super(t,e,i)}};Se.prototype.ValueTypeName="string";Se.prototype.ValueBufferType=Array;Se.prototype.DefaultInterpolation=ni;Se.prototype.InterpolantFactoryMethodLinear=void 0;Se.prototype.InterpolantFactoryMethodSmooth=void 0;var Mr=class extends Ct{};Mr.prototype.ValueTypeName="vector";var vr=class{constructor(t,e,i){let r=this,s=!1,o=0,a=0,l,f=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this.itemStart=function(c){a++,s===!1&&r.onStart!==void 0&&r.onStart(c,o,a),s=!0},this.itemEnd=function(c){o++,r.onProgress!==void 0&&r.onProgress(c,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(c){r.onError!==void 0&&r.onError(c)},this.resolveURL=function(c){return l?l(c):c},this.setURLModifier=function(c){return l=c,this},this.addHandler=function(c,h){return f.push(c,h),this},this.removeHandler=function(c){let h=f.indexOf(c);return h!==-1&&f.splice(h,2),this},this.getHandler=function(c){for(let h=0,u=f.length;h<u;h+=2){let d=f[h],p=f[h+1];if(d.global&&(d.lastIndex=0),d.test(c))return p}return null}}},tu=new vr,br=class{constructor(t){this.manager=t!==void 0?t:tu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let i=this;return new Promise(function(r,s){i.load(t,r,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};br.DEFAULT_MATERIAL_NAME="__DEFAULT";var Er="\\[\\]\\.:\\/",eu=new RegExp("["+Er+"]","g"),Tr="[^"+Er+"]",nu="[^"+Er.replace("\\.","")+"]",iu=/((?:WC+[\/:])*)/.source.replace("WC",Tr),ru=/(WCOD+)?/.source.replace("WCOD",nu),su=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Tr),ou=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Tr),au=new RegExp("^"+iu+ru+su+ou+"$"),lu=["material","materials","bones","map"],Sr=class{constructor(t,e,i){let r=i||k.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,r)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},k=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(eu,"")}static parseTrackName(t){let e=au.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=i.nodeName.substring(r+1);lu.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===e||a.uuid===e)return a;let l=i(a.children);if(l)return l}return null},r=i(t.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)t[e++]=i[r]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,r=e.propertyName,s=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let f=e.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let c=0;c<t.length;c++)if(t[c].name===f){f=c;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(f!==void 0){if(t[f]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[f]}}let o=t[r];if(o===void 0){let f=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+f+"."+r+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[s]!==void 0&&(s=t.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};k.Composite=Sr;k.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};k.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};k.prototype.GetterByBindingType=[k.prototype._getValue_direct,k.prototype._getValue_array,k.prototype._getValue_arrayElement,k.prototype._getValue_toArray];k.prototype.SetterByBindingTypeAndVersioning=[[k.prototype._setValue_direct,k.prototype._setValue_direct_setNeedsUpdate,k.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[k.prototype._setValue_array,k.prototype._setValue_array_setNeedsUpdate,k.prototype._setValue_array_setMatrixWorldNeedsUpdate],[k.prototype._setValue_arrayElement,k.prototype._setValue_arrayElement_setNeedsUpdate,k.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[k.prototype._setValue_fromArray,k.prototype._setValue_fromArray_setNeedsUpdate,k.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Np=new Float32Array(1);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"170"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="170");function Ar(n,t){let e=n.rotation.y;return{x:n.position.x+t.x*Math.cos(e)+t.z*Math.sin(e),z:n.position.z-t.x*Math.sin(e)+t.z*Math.cos(e)}}var _n=190,oi=30;function Ho(n,t=0){let e=((n+t*_n/2)%_n+_n)%_n,i=Math.PI*1.5+Math.max(0,e-oi)/(_n-oi)*Math.PI*2,r=78+32*Math.cos(i),s=-32*Math.sin(i),o=(z(r+.01)-z(r-.01))/.02,a=o*s+13*Math.cos(i);return{x:z(r)-32+13*Math.sin(i),y:22.22,z:r,yaw:Math.atan2(a,s)+Math.PI,moored:e<oi,remaining:oi-e}}var qp=new ot(1,1,1);function Go(n,t,e,i){for(let r of n){let s=r.width+i+1e-9;for(let o=0;o<r.samples.length;o+=4){let a=r.samples[o],l=t-a.x,f=e-a.z;if(!(Math.abs(l)>s||Math.abs(f)>s)&&Math.hypot(l,f)-r.width<i)return!0}}return!1}function Vo(n,t=1.2){let i=new Map,r=0;for(let s of n)for(let o=0;o<s.samples.length;o+=4){let a=s.samples[o],l={x:a.x,z:a.z,width:s.width},f=s.width+t+1e-9;for(let c=Math.floor((a.x-f)/8);c<=Math.floor((a.x+f)/8);c++)for(let h=Math.floor((a.z-f)/8);h<=Math.floor((a.z+f)/8);h++){let u=c+","+h,d=i.get(u);d||i.set(u,d=[]),d.push(l),r++}}return{cells:i.size,references:r,contains(s,o){let a=i.get(Math.floor(s/8)+","+Math.floor(o/8));if(!a)return!1;for(let l of a)if(Math.hypot(s-l.x,o-l.z)-l.width<t)return!0;return!1}}}var v={x:-46,y:26,z:188,minX:-130,maxX:34,minZ:146,maxZ:276,entry:{x:-46.5,y:26,z:150.5,name:"\u8C6B\u56ED \xB7 \u5317\u95E8\u724C\u574A"},tea:{x:-46,y:26,z:178},snack:{x:-26,y:26,z:271},riddle:{x:-62,y:26,z:203},arrival:{x:-43.5,y:26,z:159.5,name:"\u8C6B\u56ED \xB7 \u4E5D\u66F2\u6865\u4E0E\u6E56\u5FC3\u4EAD"}},Ke={...v,z:v.z+60,minZ:v.minZ+60,maxZ:v.maxZ+60,...Object.fromEntries(["entry","tea","snack","riddle","arrival"].map(n=>[n,{...v[n],z:v[n].z+60}]))};var Wo=[[-86,212],[-77,212],[-77,218],[-72,218]],Xo=[[-86,262],[-77,262],[-77,265],[-70,265]];var hu=[{id:"north",axis:"z",x:-35,z:194},{id:"west",axis:"x",x:-75,z:205}],uu=[{axis:"z",x:-46,z:194,y:28.5,r:1.1},{axis:"z",x:-46,z:208,y:28.5,r:1.1}],ci=[{x1:-61.2,x2:-25.5,z1:166,z2:193.8},{x1:-66,x2:-24,z1:230,z2:242},{x1:-23,x2:2,z1:198,z2:223}],du=[{x1:-73,x2:-67,z1:155,z2:166},{x1:-41,x2:-32,z1:156,z2:165},{x1:-25,x2:-19,z1:177,z2:187},{x1:-72,x2:-67,z1:195,z2:202},{x1:-54,x2:-44,z1:198,z2:207},{x1:-39,x2:-30,z1:203,z2:208},{x1:-49,x2:-38,z1:219,z2:226},{x1:-74,x2:-62,z1:212,z2:228},{x1:-60,x2:-42,z1:244,z2:256},{x1:-58,x2:-42,z1:222,z2:232}],Yo=[[-35,194],[-35,196],[-40,197.5],[-45,196.5],[-50,198],[-54,197.5],[-54,204],[-60,204],[-68,205],[-75,205]],Zo=[[-35,196],[-35,204],[-35,211],[-29.5,211]],qo=[[2.5,211],[5,215],[5,225]],$o=[[-54,204],[-60,214],[-62,226],[-62,246],[-52,248],[-42,248]],pu=[[-75,205],[-86,206],[-94,206],[-94,222],[-86,226],[-78,226],[-68,226]];function mu(n,t,e=3){return St(n,t,Yo,e)||St(n,t,Zo,e)||St(n,t,qo,e)||St(n,t,$o,e)||St(n,t,pu,e)}function gu(n,t,e){let i=(e.x1+e.x2)/2,r=(e.z1+e.z2)/2,s=(e.x2-e.x1)/2,o=(e.z2-e.z1)/2;return((n-i)/s)**2+((t-r)/o)**2<.9+.1*Math.sin(n*1.3+t*.7)&&!mu(n,t,1.6)&&!ci.some(a=>n>=a.x1-1&&n<=a.x2+1&&t>=a.z1-1&&t<=a.z2+1)}var li=[[-64,173],[-58,173],[-58,176],[-54,176],[-54,184],[-51,184],[-51,178],[-40,178],[-40,184],[-35,184],[-35,192]];function St(n,t,e,i=3){return e.some((r,s)=>{if(!s)return!1;let o=e[s-1],a=r[0]-o[0],l=r[1]-o[1],f=Math.max(0,Math.min(1,((n-o[0])*a+(t-o[1])*l)/(a*a+l*l||1)));return Math.hypot(n-o[0]-f*a,t-o[1]-f*l)<=i})}function fi(n,t){return n>=Ke.minX-2&&n<=Ke.maxX+2&&t>=Ke.minZ-2&&t<=Ke.maxZ+2||St(n,t,Wo,2)||St(n,t,Xo,2)}var xu=[{id:"huxinting",x:-46,z:178,rx:2.5,rz:2.5,levels:1},{id:"tea-gallery",x:-74,z:158,rx:5,rz:3,levels:1},{id:"lubolang",x:-20,z:188,rx:5,rz:4,levels:2},{id:"nanxiang",x:-26,z:271,rx:6,rz:3,levels:2},{id:"craft-shop",x:-62,z:271,rx:6,rz:3,levels:2},{id:"bazaar-west-candy",x:-107,z:156,rx:5,rz:4,levels:2},{id:"bazaar-stage",x:-107,z:172,rx:5,rz:4,levels:2},{id:"old-city-west",x:-107,z:188,rx:5,rz:6,levels:3},{id:"bazaar-west-herbs",x:-107,z:204,rx:5,rz:5,levels:2},{id:"west-craft-hall",x:-107,z:220,rx:5,rz:4,levels:2},{id:"west-wine-shop",x:-107,z:236,rx:5,rz:4,levels:2},{id:"west-tea-house",x:-107,z:252,rx:5,rz:4,levels:2},{id:"huabao-lou",x:-86,z:172,rx:5,rz:6,levels:3},{id:"tonghanchun",x:-86,z:188,rx:5,rz:4,levels:2},{id:"west-bazaar-2",x:-86,z:226,rx:5,rz:3,levels:2},{id:"west-bazaar-3",x:-86,z:238,rx:5,rz:3,levels:2},{id:"west-bazaar-4",x:-86,z:250,rx:5,rz:3,levels:2},{id:"tianyu-lou",x:8,z:172,rx:4,rz:6,levels:3},{id:"hefeng-lou",x:8,z:188,rx:4,rz:4,levels:2},{id:"shanghai-hotel",x:8,z:204,rx:4,rz:6,levels:3},{id:"ningbo-tangtuan",x:8,z:220,rx:4,rz:4,levels:2},{id:"old-city-east",x:8,z:236,rx:4,rz:6,levels:3},{id:"bazaar-east-gold",x:8,z:252,rx:4,rz:4,levels:2},{id:"old-city-northeast",x:25,z:156,rx:4,rz:4,levels:2},...Array.from({length:7},(n,t)=>({id:"yuyuan-street-"+t,x:25,z:168+t*12,rx:4,rz:4,levels:2})),{id:"old-city-south",x:-49,z:271,rx:7,rz:3,levels:2},{id:"yuyuan-south-west",x:-78,z:271,rx:6,rz:3,levels:2},{id:"yuyuan-south-east",x:-18,z:271,rx:6,rz:3,levels:2},{id:"sansui-tang",x:-71,z:198,rx:4,rz:3,levels:1,historic:"sansui"},{id:"yangshan-tang",x:-62,z:216,rx:4,rz:3,levels:2,historic:"yangshan"},{id:"dianchun-tang",x:-52,z:232,rx:4,rz:3,levels:1,historic:"dianchun"},{id:"yuhua-tang",x:-58,z:248,rx:3.5,rz:3,levels:1,historic:"yuhua"},{id:"wangjiang-ting",x:-72,z:224,rx:2.5,rz:2.5,levels:1,historic:"wangjiang"}];function Jo(n){for(let e=-55;e<=-25;e++)for(let i=80;i<=210;i++)n.get(e,25,i)||(n.fill(e,18,i,e,24,i,3),n.set(e,25,i,9));for(let e=v.minX-2;e<=v.maxX+2;e++)for(let i=v.minZ+60-2;i<=v.maxZ+60+2;i++)n.get(e,25,i)||(n.fill(e,18,i,e,24,i,3),n.set(e,25,i,9));for(let e of[Wo,Xo])for(let i=1;i<e.length;i++){let r=e[i-1],s=e[i];n.fill(Math.min(r[0],s[0])-2,25,Math.min(r[1],s[1])-2,Math.max(r[0],s[0])+2,25,Math.max(r[1],s[1])+2,9),n.fill(Math.min(r[0],s[0])-2,26,Math.min(r[1],s[1])-2,Math.max(r[0],s[0])+2,29,Math.max(r[1],s[1])+2,0)}let t={get:(e,i,r)=>n.get(e,i,r+60),set:(e,i,r,s)=>n.set(e,i,r+60,s),fill:(e,i,r,s,o,a,l)=>n.fill(e,i,r+60,s,o,a+60,l)};t.fill(v.minX,18,v.minZ,v.maxX,24,v.maxZ,3),t.fill(v.minX,26,v.minZ,v.maxX,35,v.maxZ,0),t.fill(v.minX,25,v.minZ,v.maxX,25,v.maxZ,9),t.fill(-61,20,166,-26,20,194,3),t.fill(-61,21,166,-26,25,194,0),t.fill(-50,25,174,-42,25,182,7);for(let e of[-2.5,2.5])for(let i of[-2.5,2.5])t.fill(Math.round(-46+e),21,Math.round(178+i),Math.round(-46+e),24,Math.round(178+i),9);for(let e=1;e<li.length;e++){let i=li[e-1],r=li[e];t.fill(Math.min(i[0],r[0])-1,25,Math.min(i[1],r[1])-1,Math.max(i[0],r[0])+1,25,Math.max(i[1],r[1])+1,7),t.fill(i[0],21,i[1],i[0],24,i[1],9)}t.fill(-36,25,188,-34,25,194,7),t.fill(-62,25,170,-59,25,193,7);for(let e of[-61,-59])for(let i of[170,176,181,186,192])t.fill(e,21,i,e,24,i,9);for(let e of ci.slice(1))t.fill(e.x1,20,e.z1,e.x2,20,e.z2,3),t.fill(e.x1,21,e.z1,e.x2,25,e.z2,0);for(let e=-68;e<=-22;e++)for(let i=228;i<=244;i++)t.fill(e,21,i,e,32,i,0),t.fill(e,20,i,e,20,i,3);t.fill(-38,26,208,5,36,214,0);for(let e=-76;e<=3;e++)for(let i=148;i<=265;i++)ci.some(r=>e>=r.x1&&e<=r.x2&&i>=r.z1&&i<=r.z2)||e>=-48&&e<=-44&&i<=160||St(e,i,li,1.2)||t.set(e,25,i,1);for(let e of du)for(let i=e.x1;i<=e.x2;i++)for(let r=e.z1;r<=e.z2;r++)gu(i+.5,r+.5,e)&&t.set(i,25,r,1);for(let e=148;e<=268;e++){for(let i=v.minX;i<=-80;i++)t.set(i,25,e,9);for(let i=5;i<=v.maxX;i++)t.set(i,25,e,9)}t.fill(v.minX,26,v.minZ,v.minX,28,v.maxZ,9),t.fill(v.maxX,26,v.minZ,v.maxX,28,v.maxZ,9),t.fill(v.minX,26,v.minZ,v.maxX,28,v.minZ,9),t.fill(v.minX,26,v.maxZ,v.maxX,28,v.maxZ,9),t.fill(-48,26,v.minZ,-45,32,v.minZ+16,0);for(let e of[-52,-49,-44,-41])t.fill(e,26,148,e,29,148,9);t.fill(-118,26,v.minZ,-84,32,v.minZ+6,0),t.fill(10,26,v.minZ,32,32,v.minZ+6,0),t.fill(-118,26,v.maxZ-6,-84,32,v.maxZ,0),t.fill(10,26,v.maxZ-6,32,32,v.maxZ,0),t.fill(v.minX,26,202,v.minX,29,218,0),t.fill(v.minX,26,155,v.minX,29,162,0),t.fill(v.minX,26,258,v.minX,29,266,0),t.fill(-38,26,194,-32,30,194,9),t.fill(-37,26,194,-33,29,194,0),t.fill(-75,26,202,-75,30,208,9),t.fill(-75,26,203,-75,29,207,0);for(let e of hu)e.axis==="z"?t.fill(e.x-3,26,e.z,e.x+3,31,e.z,0):t.fill(e.x,26,e.z-3,e.x,31,e.z+3,0);for(let e of uu)e.axis==="z"?t.fill(e.x-2,27,e.z,e.x+2,30,e.z,0):t.fill(e.x,27,e.z-2,e.x,30,e.z+2,0);for(let e=-75;e<=5;e++)for(let i=194;i<=260;i++)ci.some(r=>e>=r.x1&&e<=r.x2&&i>=r.z1&&i<=r.z2)||(St(e+.5,i+.5,Yo,.85)||St(e+.5,i+.5,Zo,.85)||St(e+.5,i+.5,qo,.85)||St(e+.5,i+.5,$o,.85))&&t.set(e,25,i,9);for(let e=148;e<=158;e++)for(let i=-48;i<=-45;i++)t.set(i,25,e,9);for(let e of xu)t.fill(e.x-e.rx,25,e.z-e.rz,e.x+e.rx,25,e.z+e.rz,9);t.fill(-112,26,146,-84,35,276,0),t.fill(10,26,146,26,35,276,0),t.fill(-94,26,146,-76,35,165,0),t.fill(-94,25,146,-76,25,165,9),t.fill(-94,26,198,-76,35,212,0),t.fill(-94,25,198,-76,25,212,9),t.fill(-94,26,264,12,35,274,0),t.fill(-94,25,264,12,25,274,9);for(let e=-68;e<=-22;e++)for(let i=228;i<=244;i++)t.fill(e,21,i,e,28,i,0)}var Mn={bounds:{minX:-201,maxX:-136,minZ:155,maxZ:199},facade:{minX:-179,maxX:-149,minZ:165,frontZ:174,entryX:-158,doors:[-176,-170,-164,-158,-152]},arrival:{x:-158.5,y:26,z:188.5,name:"\u4E2D\u5171\u4E00\u5927\u4F1A\u5740 \xB7 \u5174\u4E1A\u8DEF",viewTarget:{x:-158,y:30.4,z:175}},signs:[[-139.5,29,179.5,"\u5174\u4E1A\u8DEF \xB7 \u4E2D\u5171\u4E00\u5927\u4F1A\u5740"],[-176.5,28.8,193.5,"\u65B0\u5929\u5730 \xB7 \u77F3\u5E93\u95E8\u91CC\u5F04"],[-165.5,29,140,"\u65B0\u5929\u5730 \xB7 \u592A\u4ED3\u8DEF\u8857\u574A"],[-219,29,163,"\u65B0\u5929\u5730 \xB7 \u9A6C\u5F53\u8DEF\u5C0F\u9662"]]},Ko={minX:-204,maxX:-136,minZ:119,maxZ:140},jo={minX:-232,maxX:-218,minZ:151,maxZ:173},Qo={minX:-201,maxX:-136,minZ:149,maxZ:158},yu=[Mn.bounds,Ko,jo,Qo];function _u(n,t,e=0){return yu.some(i=>n>=i.minX-e&&n<=i.maxX+e&&t>=i.minZ-e&&t<=i.maxZ+e)}function ta(n,t){return _u(n,t)}function ea(n,t,e,i,r,s){for(let o=0;o<=Math.floor((r-i)/2);o++)n.fill(t,s+o,i+o,e,s+o,r-o,3)}function na(n,t,e,i,r,s){for(let o of[t,e])n.fill(o,26,i,o,s,r,8);for(let o of[i,r])n.fill(t,26,o,e,s,o,8),n.fill(t,28,o,e,28,o,7),n.fill(t,s-1,o,e,s-1,o,7)}function hi(n,t,e,i){for(let r of[t-2,t+2])n.fill(r,26,e,r,30,e,9);n.fill(t-2,30,e,t+2,30,e,9),n.fill(t-1,31,e,t+1,31,e,7),n.set(t,32,e,7),n.fill(t-1,26,e-1,t+1,29,e-1,i?0:4)}function Mu(n){let{minX:t,maxX:e,minZ:i,frontZ:r,entryX:s,doors:o}=Mn.facade;na(n,t,e,i,r,35),ea(n,t-1,e+1,i-1,r+1,35);for(let a of o)hi(n,a,r+1,a===s),n.fill(a-1,32,r,a+1,33,r,11),n.fill(a,32,r,a,33,r,4),n.fill(a-2,34,r+1,a+2,34,r+1,9);n.fill(-166,25,166,-150,25,173,7),n.fill(-166,26,166,-166,32,173,8),n.fill(-178,26,167,-167,32,173,8),n.fill(-165,31,166,-150,31,173,4),n.fill(-163,26,167,-155,26,168,4);for(let a of[-163,-160,-157])n.set(a,26,170,7)}function Te(n,t,e,i){let r=e-3,s=e+3,o=i?r:s,a=i?-1:1;na(n,t-3,t+3,r,s,32),ea(n,t-4,t+4,r-1,s+1,32),n.fill(t-2,25,r,t+2,25,s,7);for(let l of[t-1,t+1])n.fill(l,26,o+a,l,29,o+a,9);n.fill(t-1,29,o+a,t+1,29,o+a,7),n.fill(t,26,o,t,28,o,4),n.fill(t-1,30,o,t+1,31,o,11),n.fill(t,30,o,t,31,o,4)}function oe(n,t,e,i){n.fill(t,26,e,t,25+i,e,4),n.disc(t,24+i,e,2,5),n.disc(t,25+i,e,3,5),n.disc(t,26+i,e,2,5)}function ia(n){let{minX:t,maxX:e,minZ:i,maxZ:r}=Mn.bounds;n.fill(t,25,i,e,25,r,9),n.fill(t,25,177,e,25,181,3),n.fill(t+2,25,161,e-3,25,163,6),n.fill(-163,25,182,-154,25,199,6),n.fill(-185,25,189,-138,25,191,6),Mu(n);for(let[s,o,a]of[[-195,164,!1],[-187,161,!1],[-195,185,!1],[-180,185,!1],[-171,185,!1],[-146,185,!1],[-195,195,!0],[-180,195,!0],[-171,195,!0],[-146,195,!0]])Te(n,s,o,a);n.fill(-192,25,171,-184,25,176,6);for(let[s,o,a]of[[-198,171,5],[-189,172,5],[-185,174,6],[-142,175,5],[-151,182,5],[-139,193,6],[-184,197,5]])oe(n,s,o,a);for(let s of[-182,-142])n.fill(s,26,184,s,26,185,7);bu(n),vu(n)}function vu(n){let{minX:t,maxX:e,minZ:i,maxZ:r}=Qo;n.fill(t,25,i,e,25,r,9),n.fill(t+1,25,149,e-1,25,150,6);for(let s of[-196,-181,-172,-154,-144])Te(n,s,154,!0);for(let s of[-165,-137])n.fill(s-1,25,150,s+1,25,158,6),hi(n,s,152,!0);oe(n,-189,152,4),oe(n,-160,152,5)}function bu(n){let t=Ko;n.fill(t.minX,25,t.minZ,t.maxX,25,t.maxZ,9),n.fill(t.minX+1,25,128,t.maxX-1,25,131,6),n.fill(t.minX+1,25,139,t.maxX-1,25,140,6);for(let i of[-198,-188,-176,-156,-145])Te(n,i,123,!1);for(let i of[-198,-188,-176,-157,-147])Te(n,i,135,!1);n.fill(-168,25,123,-164,25,140,6),hi(n,-166,129,!0),oe(n,-161,130,4);for(let i of[-166,-137])n.fill(i-1,25,135,i+1,25,142,6),hi(n,i,138,!0);oe(n,-169,136,5),oe(n,-141,136,4);let e=jo;n.fill(e.minX,25,e.minZ,e.maxX,25,e.maxZ,9),n.fill(-225,25,154,-220,25,171,6),n.fill(-222,25,161,-214,25,164,6),Te(n,-228,155,!1),Te(n,-228,169,!0),Te(n,-220,168,!0),oe(n,-230,162,5),oe(n,-219,154,4)}function ra(n,t){let e=i=>Math.round(n(i));return[["west-beijing","\u5317\u4EAC\u4E1C\u8DEF\u897F\u5411",-206,14,e(14),14,2],["west-xizang-middle","\u897F\u85CF\u4E2D\u8DEF\u8054\u7EDC\u6BB5",-206,14,-206,99,3],["west-jiujiang","\u4E5D\u6C5F\u8DEF\u897F\u5411",-206,99,e(99),99,2],["west-hankou","\u6C49\u53E3\u8DEF\u897F\u5411",-121,126,-13,126,2],["west-hankou-turn","\u6C49\u53E3\u8DEF\u63A5\u7EBF",-13,126,-13,116,2],["west-hankou-east","\u6C49\u53E3\u8DEF\u4E1C\u4FA7\u63A5\u7EBF",-13,116,e(116),116,2],["west-xizang-south","\u897F\u85CF\u5357\u8DEF\u8054\u7EDC\u6BB5",-121,126,-121,195,3],["west-taicang","\u592A\u4ED3\u8DEF",-211,145,-121,145,2],["west-madang","\u9A6C\u5F53\u8DEF",-211,145,-211,302,2],...Ss,...Cs,...Bs].map(([i,r,s,o,a,l,f])=>({id:i,name:r,ax:s,az:o,bx:a,bz:l,width:f,westGrid:!0,samples:t([[s,o],[a,l]])}))}function ui(n,t,e,i=0){let r=n.width+i;return t>=Math.min(n.ax,n.bx)-r&&t<=Math.max(n.ax,n.bx)+r&&e>=Math.min(n.az,n.bz)-r&&e<=Math.max(n.az,n.bz)+r}function sa(n,t){return n.some(e=>{let i=e.width+2;return t.x+t.rx>=Math.min(e.ax,e.bx)-i&&t.x-t.rx<=Math.max(e.ax,e.bx)+i&&t.z+t.rz>=Math.min(e.az,e.bz)-i&&t.z-t.rz<=Math.max(e.az,e.bz)+i})}function zr(n,t){for(let e of t){let i=e.width+2;for(let r=Math.min(e.ax,e.bx)-i;r<=Math.max(e.ax,e.bx)+i;r++)for(let s=Math.min(e.az,e.bz)-i;s<=Math.max(e.az,e.bz)+i;s++)ui(e,r,s)?n.set(r,25,s,3):n.get(r,25,s)!==3&&n.set(r,25,s,9)}}function vn(n,t=6){let e=n.slice(0,-1),i=[];for(let r=0;r<e.length;r++){let s=e[(r+e.length-1)%e.length],o=e[r],a=e[(r+1)%e.length],l=Math.hypot(o[0]-s[0],o[1]-s[1]),f=Math.hypot(a[0]-o[0],a[1]-o[1]);if(((o[0]-s[0])*(a[0]-o[0])+(o[1]-s[1])*(a[1]-o[1]))/(l*f||1)>.995||l<.01||f<.01){i.push(o);continue}let h=Math.min(t,l*.4,f*.4),u=[o[0]+(s[0]-o[0])*h/l,o[1]+(s[1]-o[1])*h/l,o[2]??26],d=[o[0]+(a[0]-o[0])*h/f,o[1]+(a[1]-o[1])*h/f,o[2]??26];for(let p=0;p<=16;p++){let m=p/16,g=1-m;i.push([g*g*u[0]+2*g*m*o[0]+m*m*d[0],g*g*u[1]+2*g*m*o[1]+m*m*d[1],o[2]??26])}}return i.push(i[0]),i}var gi=n=>Math.round(z(n)-21-N),q=n=>z(n)-38-N,Vt=n=>z(n)-84-N,Dr=n=>z(n)-40,Su=n=>z(n)-84,ae=[{id:"beijing",name:"\u5317\u4EAC\u4E1C\u8DEF",z:14,width:2,kind:"road"},{id:"dianchi",name:"\u6EC7\u6C60\u8DEF",z:45,width:2,kind:"road"},{id:"nanjing",name:"\u5357\u4EAC\u4E1C\u8DEF\u6B65\u884C\u8857",z:66,width:4,kind:"pedestrian"},{id:"jiujiang",name:"\u4E5D\u6C5F\u8DEF",z:99,width:2,kind:"road"},{id:"hankou",name:"\u6C49\u53E3\u8DEF",z:116,width:2,kind:"road"},{id:"fuzhou",name:"\u798F\u5DDE\u8DEF",z:162,width:3,kind:"road"},{id:"guangdong",name:"\u5E7F\u4E1C\u8DEF",z:192,width:2,kind:"road"},{id:"yanan",name:"\u5EF6\u5B89\u4E1C\u8DEF",z:238,width:4,kind:"road"}],we=[{id:"bund-origin-north",name:"\u5916\u6EE9\u6E90 \xB7 \u6C5F\u7554\u65E7\u5546\u697C",z:-9,h:11,kind:"steps",rx:3,rz:2},{id:"bund-origin-south",name:"\u5916\u6EE9\u6E90 \xB7 \u5386\u53F2\u5546\u697C",z:-3,h:12,kind:"baroque",rx:3,rz:2},{id:"consulate",name:"\u5916\u6EE9\u6E90 \xB7 \u82F1\u56FD\u9886\u4E8B\u9986",z:5,h:9,kind:"brick",rz:4},{id:"avenue-0",name:"\u6021\u548C\u6D0B\u884C \xB7 \u5916\u6EE927\u53F7",z:25,h:13,kind:"steps",rz:5},{id:"bank",name:"\u4E2D\u56FD\u94F6\u884C \xB7 \u5916\u6EE923\u53F7",z:38,h:21,kind:"steps",rz:4},{id:"peace",name:"\u548C\u5E73\u996D\u5E97\u5317\u697C \xB7 \u5916\u6EE920\u53F7",z:54,h:20,kind:"copper",rz:6},{id:"peace-south",name:"\u548C\u5E73\u996D\u5E97\u5357\u697C \xB7 \u5916\u6EE919\u53F7",z:78,h:12,kind:"baroque",rz:6},{id:"avenue-1",name:"\u9EA6\u52A0\u5229\u94F6\u884C \xB7 \u5916\u6EE918\u53F7",z:92,h:15,kind:"steps",rz:4},{id:"avenue-2",name:"\u5B57\u6797\u5927\u697C \xB7 \u5916\u6EE917\u53F7",z:106,h:19,kind:"steps",rz:4},{id:"avenue-3",name:"\u534E\u4FC4\u9053\u80DC\u94F6\u884C \xB7 \u5916\u6EE915\u53F7",z:124,h:11,kind:"baroque",rz:3},{id:"customs",name:"\u6C5F\u6D77\u5173\u949F\u697C \xB7 \u5916\u6EE913\u53F7",z:137,h:15,kind:"clock",rz:6},{id:"hsbc",name:"\u6C47\u4E30\u94F6\u884C\u5927\u697C \xB7 \u5916\u6EE912\u53F7",z:151,h:14,kind:"dome",rz:6},{id:"avenue-4",name:"\u8F6E\u8239\u62DB\u5546\u5C40 \xB7 \u5916\u6EE99\u53F7",z:173,h:11,kind:"brick",rz:5},{id:"avenue-5",name:"\u5927\u5317\u7535\u62A5 \xB7 \u5916\u6EE97\u53F7",z:185,h:13,kind:"baroque",rz:4},{id:"avenue-6",name:"\u6709\u5229\u94F6\u884C \xB7 \u5916\u6EE93\u53F7",z:200,h:15,kind:"dome",rz:4},{id:"avenue-7",name:"\u4E0A\u6D77\u603B\u4F1A \xB7 \u5916\u6EE92\u53F7",z:214,h:11,kind:"baroque",rz:6},{id:"asia",name:"\u4E9A\u7EC6\u4E9A\u5927\u697C \xB7 \u5916\u6EE91\u53F7",z:228,h:14,kind:"steps",rz:5}].map(n=>({...n,x:Math.round(z(n.z)-58),rx:n.rx??7,front:Math.round(z(n.z)-58)+(n.rx??7),bank:"west"}));function $(n){let t=[],e=0;for(let i=1;i<n.length;i++){let[r,s,o=26]=n[i-1],[a,l,f=26]=n[i],c=Math.hypot(a-r,l-s),h=Math.max(1,Math.ceil(c*2));for(let u=i===1?0:1;u<=h;u++){let d=u/h;t.push({x:r+(a-r)*d,z:s+(l-s)*d,y:o+(f-o)*d,d:e+c*d})}e+=c}return t.lengthMeters=e,t}var xi=ra(Vt,$),yi=[["expo-bridge-link","\u5357\u6D66\u5927\u6865 \xB7 \u4E16\u535A\u56ED\u63A5\u7EBF",282,206,282,215],["expo-north-entry","\u4E16\u535A\u5317\u63A5\u7EBF",282,215,313,215],["expo-inland","\u6D66\u4E1C\u5357\u8DEF \xB7 \u4E16\u535A\u56ED\u652F\u8DEF",313,215,313,271],["expo-cross-north","\u4E16\u535A\u5317\u8857",313,226,389,226],["expo-xueye","\u96EA\u91CE\u8DEF",313,249,389,249],["expo-avenue","\u4E16\u535A\u5927\u9053",313,271,389,271],["expo-gaoke-north","\u9AD8\u79D1\u897F\u8DEF \xB7 \u5317\u6BB5",359,217,359,275],["expo-gaoke-bend","\u9AD8\u79D1\u897F\u8DEF \xB7 \u573A\u9986\u63A5\u7EBF",359,275,363,275],["expo-gaoke","\u9AD8\u79D1\u897F\u8DEF \xB7 \u573A\u9986\u6BB5",363,275,363,311],["expo-drop-off","\u4E16\u535A\u56ED\u843D\u5BA2\u8DEF",363,306,373,306],["expo-drop-off-turn","\u4E16\u535A\u56ED\u843D\u5BA2\u8DEF \xB7 \u56DE\u8F6C",373,306,373,311],["expo-drop-off-return","\u4E16\u535A\u56ED\u843D\u5BA2\u8DEF \xB7 \u51FA\u53E3",363,311,373,311]].map(([n,t,e,i,r,s])=>({id:n,name:t,ax:e,az:i,bx:r,bz:s,width:2,westGrid:!0,samples:$([[e,i],[r,s]])}));function ca(n,t,e=0){return yi.some(i=>ui(i,n,t,e))}var Ae=(n,t,e)=>{let i=[],r=Math.sign(e-t);for(let s=t;r*(e-s)>=0;s+=r*2)i.push([z(s)-n,s]);return i.at(-1)[1]!==e&&i.push([z(e)-n,e]),i},pi=[[146,31],[213,31],[260,65],[263,121],[256,166],[228,178],[203,137],[197,106],[196,82],[196,50],[196,19],[146,19],[146,31]],je=$(pi),fa=$([[146,31],[193,31],[246,58],[260,65]]),ha=$([...Ae(40,14,238),...Ae(84,238,14),[Dr(14),14]]),ua=[[282,206],[296,180],[305,140],[306,98],[306,54],[291,22],[226,12],[167,12],[146,20],[146,31],[213,31],[260,65],[263,121],[256,166],[263,187],[282,206]],da=$(ua),oa=[[192-N,206,26],[212,206,31],[255,206,31],[275,206,26],[282,206,26]],Eu=$([[q(206),206],...oa,...ua.slice(1),...oa.slice(0,-1).reverse(),...Ae(40+N,206,14),...Ae(84+N,14,238),...Ae(40+N,238,206)]),bn=[{id:"bund",samples:ha},{id:"lujiazui",samples:je},{id:"pudong",samples:da},{id:"bridge",samples:Eu}],pa=ae.filter(n=>n.kind==="road").map(n=>({...n,samples:$([[Su(n.z),n.z],[Dr(n.z),n.z]])})),Nr=[{id:"bund",samples:ha,width:3},{id:"financial",samples:je,width:3},{id:"pudong",samples:da,width:3},{id:"century",samples:fa,width:3},{id:"bridge-approach",samples:$([[275,206],[282,206]]),width:3},...pa],_i=(n,t,e=Nr)=>Go(e,n,t,1);function Wt(n,t){return Uu.contains(n,t)}var Sn=[{id:"convention",name:"\u4E0A\u6D77\u56FD\u9645\u4F1A\u8BAE\u4E2D\u5FC3",x:130,z:64,rx:6,rz:5,h:9,kind:"convention"},{id:"superbrand",name:"\u6B63\u5927\u5E7F\u573A",x:145,z:7,rx:9,rz:5,h:10,kind:"mall"},{id:"ifc-north",name:"\u56FD\u91D1\u4E2D\u5FC3 \xB7 \u5317\u5854",x:157,z:42,rx:5,rz:5,h:45,kind:"glass"},{id:"ifc-south",name:"\u56FD\u91D1\u4E2D\u5FC3 \xB7 \u5357\u5854",x:174,z:42,rx:5,rz:5,h:43,kind:"glass"},{id:"shangrila-river",name:"\u9999\u683C\u91CC\u62C9 \xB7 \u6D66\u6C5F\u697C",x:180,z:108,rx:5,rz:5,h:38,kind:"hotel"},{id:"shangrila-grand",name:"\u9999\u683C\u91CC\u62C9 \xB7 \u7D2B\u91D1\u878D\u697C",x:218,z:119,rx:6,rz:7,h:50,kind:"hotel"},{id:"boc-pudong",name:"\u4E2D\u94F6\u5927\u53A6",x:218,z:81,rx:6,rz:6,h:60,kind:"glass"},{id:"hsbc-pudong",name:"\u6C47\u4E30\u5927\u697C \xB7 \u9646\u5BB6\u5634",x:240,z:84,rx:6,rz:5,h:44,kind:"glass"},{id:"aurora",name:"\u9707\u65E6\u5927\u53A6",x:226,z:137,rx:6,rz:6,h:41,kind:"gold"},{id:"citi",name:"\u82B1\u65D7\u96C6\u56E2\u5927\u53A6",x:242,z:152,rx:5,rz:6,h:43,kind:"glass"},{id:"bea",name:"\u4E1C\u4E9A\u94F6\u884C\u91D1\u878D\u5927\u53A6",x:245,z:181,rx:5,rz:5,h:45,kind:"glass"},{id:"bank-shanghai",name:"\u4E0A\u6D77\u94F6\u884C\u5927\u53A6",x:282,z:79,rx:6,rz:7,h:51,kind:"glass"},{id:"bocom",name:"\u4EA4\u94F6\u91D1\u878D\u5927\u53A6",x:247,z:112,rx:5,rz:6,h:48,kind:"glass"},{id:"stock",name:"\u4E0A\u6D77\u8BC1\u5238\u5927\u53A6",x:284,z:119,rx:5,rz:6,h:43,kind:"glass"},{id:"south-finance",name:"\u6EE8\u6C5F\u91D1\u878D\u697C\u7FA4",x:281,z:152,rx:5,rz:6,h:35,kind:"glass"},{id:"north-finance",name:"\u9646\u5BB6\u5634\u5317\u4FA7\u5546\u52A1\u697C",x:231,z:65,rx:5,rz:5,h:42,kind:"glass"}].map(n=>({...n,bank:"east",front:n.x-n.rx,entranceSide:-1})),B=[...Sn,...we],Tu={jinmao:{x:159.5,z:62.5},swfc:{x:181.5,z:56.5},shanghai:{x:152.5,z:85.5}},at=[];function Mi(n){if(n.x-n.rx<3||n.x+n.rx>315||n.z-n.rz<0||n.z+n.rz>233||n.bank==="west"&&n.z>199&&n.x-n.rx<103)return!1;for(let t=n.x-n.rx-2;t<=n.x+n.rx+2;t++)for(let e=n.z-n.rz-2;e<=n.z+n.rz+2;e++){let i=t>z(e)+10,r=t<z(e)-46;if((n.bank==="east"?!i:!r)||_i(t,e)||ae.some(s=>Math.abs(e-s.z)<=s.width+1)&&n.bank==="west")return!1}return!B.some(t=>Math.abs(t.x-n.x)<=t.rx+n.rx+3&&Math.abs(t.z-n.z)<=t.rz+n.rz+3)&&!Object.values(Tu).some(t=>Math.abs(t.x-n.x)<n.rx+15&&Math.abs(t.z-n.z)<n.rz+15)&&Math.hypot(n.x-D.x,n.z-D.z)>n.rx+15}for(let n of[106,132,158])for(let t=27;t<=223;t+=17){let e={id:`bund-back-${n}-${t}`,name:"\u5916\u6EE9\u540E\u65B9\u8857\u533A",x:Math.round(z(t)-n),z:t,rx:5,rz:5,h:8+(t*7+n)%14,kind:t%3?"brick":"baroque",bank:"west",entranceSide:1};Mi(e)&&(e.front=e.x+e.rx,at.push(e),B.push(e))}for(let n=200;n<=308;n+=18)for(let t=20;t<=200;t+=24){let e={id:`pudong-back-${n}-${t}`,name:"\u9646\u5BB6\u5634\u5546\u52A1\u8857\u533A",x:n,z:t,rx:4,rz:5,h:15+(n+t*3)%25,kind:"glass",bank:"east",entranceSide:-1};Mi(e)&&(e.front=e.x-e.rx,at.push(e),B.push(e))}for(let n of[73,100,120,141,162,183])for(let t=6;t<=230;t+=11){let e={id:`bund-infill-${n}-${t}`,name:"\u5916\u6EE9\u91CC\u8857",x:Math.round(z(t)-n),z:t,rx:3,rz:3,h:7+(t+n)%13,kind:t%2?"brick":"baroque",bank:"west",entranceSide:1};Mi(e)&&(e.front=e.x+e.rx,at.push(e),B.push(e))}for(let n=148;n<=310;n+=13)for(let t=14;t<=220;t+=15){let e={id:`pudong-infill-${n}-${t}`,name:"\u9646\u5BB6\u5634\u8857\u533A",x:n,z:t,rx:3,rz:3,h:14+(n+t)%22,kind:"glass",bank:"east",entranceSide:-1};Mi(e)&&(e.front=e.x-e.rx,at.push(e),B.push(e))}var Au=$([...Ae(40,14,-140),...Ae(84,-140,14),[Dr(14),14]]),ma=[];for(let n=-14;n>=-140;n-=2)ma.push([z(n)+28,n]);var wu=$([[167,12],[167,-8],...ma,[384,-140],[384,-8],[210,-8],[210,12],[167,12]]),Ur=[{id:"north-bund",samples:Au,width:3},{id:"north-pudong",samples:wu,width:2}],Nt=[...Nr.filter(n=>n.id!=="century").map(n=>({...n,width:["financial","pudong"].includes(n.id)?2:n.width})),...Ur];for(let n of Ur)bn.push({id:n.id,samples:n.samples});var Xt=[];function vi(n){if(n.front=n.x+(n.entranceSide??1)*n.rx,!(n.x-n.rx<rt.min+4||n.x+n.rx>rt.max-4||n.z-n.rz<rt.minZ+4)){for(let t=n.x-n.rx-3;t<=n.x+n.rx+3;t++)for(let e=n.z-n.rz-3;e<=n.z+n.rz+3;e++)if((n.bank==="east"?t<z(e)+11:t>z(e)-46)||_i(t,e,Nt))return;B.some(t=>Math.abs(t.x-n.x)<=t.rx+n.rx+4&&Math.abs(t.z-n.z)<=t.rz+n.rz+4)||(Xt.push(n),B.push(n))}}for(let[n,t,e,i,r]of[[169,-8,34,5,5],[194,-30,47,6,6],[226,-61,59,6,6],[253,-96,53,6,5],[287,-117,63,6,6],[226,-24,39,5,5],[264,-43,52,6,5],[310,-62,46,6,6]])vi({id:`pudong-front-${n}-${t}`,name:"\u9646\u5BB6\u5634\u5317\u4FA7\u6EE8\u6C5F\u697C\u7FA4",x:n,z:t,h:e,rx:i,rz:r,kind:"glass",bank:"east",entranceSide:-1});for(let n=-18;n>=-138;n-=22)for(let t=48;t<=170;t+=23){let e=Math.round(z(n)+t);vi({id:`pudong-back-north-${t}-${n}`,name:"\u9646\u5BB6\u5634\u5317\u4FA7\u8857\u533A",x:e,z:n,rx:5,rz:5,h:26+(Math.abs(n)*3+t)%35,kind:t%2?"hotel":"glass",bank:"east",entranceSide:-1})}for(let n=-8;n>=-140;n-=22)for(let t of[58,106,132,158,184,210,238,266,294]){let e=Math.round(z(n)-t),i=n<-30&&t>=106;vi({id:`bund-back-north-${t}-${n}`,name:i?"\u5317\u5916\u6EE9\u8857\u533A":"\u5916\u6EE9\u6E90\u5468\u8FB9\u8857\u533A",x:e,z:n,rx:5,rz:5,h:i?25+(Math.abs(n)+t)%36:11+(Math.abs(n)+t)%12,kind:i?"glass":t%3?"baroque":"brick",bank:"west",entranceSide:1})}for(let n=-136;n<=-8;n+=23)for(let t=22;t<=176;t+=22)vi({id:`bund-back-west-${n}-${t}`,name:"\u5916\u6EE9\u540E\u65B9\u57CE\u5E02\u8857\u533A",x:n,z:t,rx:5,rz:5,h:12+(Math.abs(n)+t)%19,kind:t%3?"baroque":"brick",bank:"west",entranceSide:1});for(let n of B)n.bank==="west"&&(n.x-=N,n.front-=N);for(let n of[...Nr.filter(t=>t.id==="bund"||pa.includes(t)),Ur[0]])for(let t of n.samples)t.x-=N;var Ru=[{id:"ifc-mall",name:"\u56FD\u91D1\u4E2D\u5FC3\u5546\u573A",x:166,z:50,rx:5,rz:2,h:7,kind:"mall",form:"terrace"},{id:"jinmao-podium",name:"\u91D1\u8302\u5546\u4E1A\u88D9\u623F",x:174,z:73,rx:3,rz:4,h:6,kind:"mall",form:"terrace"},{id:"swfc-podium",name:"\u73AF\u7403\u91D1\u878D\u4E2D\u5FC3\u88D9\u623F",x:187,z:74,rx:4,rz:4,h:8,kind:"mall",form:"terrace"},{id:"pudong-infill-southeast-1",name:"\u6EE8\u6C5F\u5546\u4E1A\u697C",x:170,z:104,rx:4,rz:3,h:18,kind:"glass",form:"setback"},{id:"pudong-infill-southeast-2",name:"\u9646\u5BB6\u5634\u5546\u52A1\u697C",x:205,z:91,rx:3,rz:4,h:29,kind:"glass",form:"slab"}];for(let n of Ru)Object.assign(n,{bank:"east",entranceSide:-1,front:n.x-n.rx}),at.push(n),B.push(n);var aa=B.find(n=>n.id==="pudong-infill-187-89");aa&&Object.assign(aa,{name:"\u56FD\u91D1\u6C47\u670D\u52A1\u516C\u5BD3",kind:"hotel",h:24,form:"setback"});var Ir=B.find(n=>n.id==="pudong-infill-southeast-2");Ir&&Object.assign(Ir,{name:"\u6C64\u81E3\u4E00\u54C1 \xB7 \u6C5F\u666F\u516C\u5BD3",kind:"hotel",h:60,rx:4,rz:6,front:Ir.x-4,form:"landmark"});for(let n=207;n<=297;n+=13)for(let t=74;t<=179;t+=15){let e={id:`pudong-density-${n}-${t}`,name:"\u9646\u5BB6\u5634\u5546\u52A1\u8857\u533A",x:n,z:t,rx:3,rz:4,h:20+(n*3+t)%24,kind:(n+t)%3?"glass":"hotel",bank:"east",entranceSide:-1,front:n-3};if(B.some(r=>Math.abs(r.x-n)<=r.rx+e.rx+2&&Math.abs(r.z-t)<=r.rz+e.rz+2)||Object.values(E).some(r=>Math.abs(r.x-n)<e.rx+15&&Math.abs(r.z-t)<e.rz+15)||n-e.rx<=z(t)+13||n-e.rx<=214&&t-e.rz<=58)continue;let i=!0;for(let r=n-e.rx-1;r<=n+e.rx+1;r++)for(let s=t-e.rz-1;s<=t+e.rz+1;s++)_i(r,s,Nt)&&(i=!1);i&&(at.push(e),B.push(e))}var ga=[[226,12],[291,22],[306,54],[306,98],[305,140],[296,180],[282,206],[263,187],[256,166],[263,121],[260,65],[213,31],[226,12]];pi.splice(0,pi.length,...ga);var Or=$(ga);je.splice(0,je.length,...Or);je.lengthMeters=Or.lengthMeters;var Fr=-188,le=new Set(B.filter(n=>n.bank==="west"&&/back|infill/.test(n.id)&&n.x<-10&&n.x+n.rx>=Fr&&n.z+n.rz>=61&&n.z-n.rz<=71).map(n=>n.id));for(let n of[B,at,Xt])for(let t=n.length-1;t>=0;t--)le.has(n[t].id)&&n.splice(t,1);var Yt=[];for(let n of[Sn,at,Xt,B])for(let t=n.length-1;t>=0;t--){let e=n[t];(e.bank==="east"&&(Object.values(E).some(i=>Math.abs(e.x-i.x)<=e.rx+12&&Math.abs(e.z-i.z)<=e.rz+13)||Or.some(i=>Math.abs(e.x-i.x)<=e.rx+4&&Math.abs(e.z-i.z)<=e.rz+4))||e.bank==="west"&&Math.abs(e.x-W.x)<=e.rx+10&&Math.abs(e.z-W.z)<=e.rz+9)&&(le.add(e.id),n.splice(t,1))}var xa={id:"magnolia",name:"\u767D\u7389\u5170\u5E7F\u573A \xB7 \u5317\u5916\u6EE9",x:W.x,z:W.z,rx:8,rz:7,h:56,kind:"glass",form:"chamfer",bank:"west",entranceSide:1,front:W.x+8};Yt.push(xa);B.push(xa);var Cu=(n,t)=>n>=176&&n<=216&&t>=38&&t<=60,Pr=new Map;function zu(n,t){let e=n+","+t;return Pr.has(e)||Pr.set(e,_i(n,t,Nt)),Pr.get(e)}function ce(n){if(n.front=n.x+(n.entranceSide??1)*n.rx,n.x-n.rx<rt.min+3||n.x+n.rx>=317)return!1;let t=n.id.startsWith("nanjing-")?0:1;if(B.some(e=>Math.abs(e.x-n.x)<=e.rx+n.rx+t&&Math.abs(e.z-n.z)<=e.rz+n.rz+t)||B.some(e=>{let i=va(e);return Math.abs(i.x-n.x)<=n.rx+1&&Math.abs(i.z-n.z)<=n.rz+1})||Object.values(E).some(e=>Math.abs(e.x-n.x)<n.rx+13&&Math.abs(e.z-n.z)<n.rz+14)||n.bank==="east"&&Math.hypot(n.x-D.x,n.z-D.z)<Math.max(n.rx,n.rz)+15)return!1;for(let e=n.x-n.rx-1;e<=n.x+n.rx+1;e++)for(let i=n.z-n.rz-1;i<=n.z+n.rz+1;i++)if((n.bank==="west"?e>=z(i)-101||i>=202&&e<102-N:e<=z(i)+11||Cu(e,i))||zu(e,i)||n.bank==="west"&&ae.some(r=>Math.abs(i-r.z)<=r.width))return!1;return Yt.push(n),B.push(n),!0}for(let n of[at,B])for(let t=n.length-1;t>=0;t--)["jinmao-podium","swfc-podium"].includes(n[t].id)&&(le.add(n[t].id),n.splice(t,1));for(let n of[{id:"jinmao-podium",name:"\u91D1\u8302\u5546\u4E1A\u88D9\u623F",x:166,z:79,rx:3,rz:4,h:6,kind:"mall",form:"terrace"},{id:"swfc-podium",name:"\u73AF\u7403\u91D1\u878D\u4E2D\u5FC3\u88D9\u623F",x:238,z:99,rx:4,rz:4,h:8,kind:"mall",form:"terrace"},{id:"shangrila-river",name:"\u9999\u683C\u91CC\u62C9 \xB7 \u6D66\u6C5F\u697C",x:203,z:126,rx:5,rz:5,h:38,kind:"hotel",form:"terrace"},{id:"pudong-infill-southeast-1",name:"\u6EE8\u6C5F\u5546\u4E1A\u697C",x:214,z:146,rx:4,rz:3,h:18,kind:"glass",form:"setback"},{id:"pudong-infill-southeast-2",name:"\u6C64\u81E3\u4E00\u54C1 \xB7 A\u680B\u6C5F\u666F\u516C\u5BD3",x:224,z:160,rx:4,rz:6,h:60,kind:"hotel",form:"landmark"}]){for(let t of[at,Xt,B])for(let e=t.length-1;e>=0;e--){let i=t[e];i.bank==="east"&&/back|infill|front|density/.test(i.id)&&Math.abs(i.x-n.x)<=i.rx+n.rx+2&&Math.abs(i.z-n.z)<=i.rz+n.rz+2&&(le.add(i.id),t.splice(e,1))}ce({...n,bank:"east",entranceSide:-1})}for(let n of[{id:"ifc-retail-extension",name:"\u56FD\u91D1\u4E2D\u5FC3\u5546\u4E1A\u88D9\u623F",x:168,z:24,rx:9,rz:2,h:8,form:"terrace",kind:"mall"},{id:"pudong-infill-retail-east",name:"\u9646\u5BB6\u5634\u5546\u4E1A\u697C",x:185,z:23,rx:5,rz:3,h:22,form:"slab",kind:"glass"}])ce({...n,bank:"east",entranceSide:-1});for(let n of[{id:"nanjing-infill-corner-north",name:"\u5357\u4EAC\u4E1C\u8DEF\u6CBF\u8857\u5546\u53A6",x:-21,z:55,rx:4,rz:5,h:13,entranceSide:1},{id:"nanjing-infill-corner-south",name:"\u7F8E\u4F26\u5927\u697C\u5546\u4E1A\u7EC4\u56E2",x:-12,z:77,rx:4,rz:5,h:13,entranceSide:-1}])ce({...n,kind:"baroque",form:"terrace",district:"historic-block",bank:"west",entranceAxis:"z",shop:!0});for(let n of[-1,1])for(let t=Fr+10;t<=4;t+=13){let e=66+n*11,i={id:`nanjing-infill-${n}-${t}`,name:"\u5357\u4EAC\u4E1C\u8DEF\u6CBF\u8857\u5546\u53A6",x:t,z:e,rx:5,rz:5,h:11+(Math.abs(t)+e)%9,kind:"baroque",form:Math.abs(t)%3?"terrace":"deco",district:"historic-block",bank:"west",entranceAxis:"z",entranceSide:-n,shop:!0};ce(i)}for(let[n,t]of[-108,-92,-75,-58,-42,-27].entries())ce({id:"hankou-infill-"+t,name:"\u6C49\u53E3\u8DEF\u6CBF\u8857\u5546\u4F4F\u697C",x:t,z:109,rx:5,rz:3,h:10+n%3*2,kind:n%2?"brick":"baroque",form:n%3?"terrace":"deco",district:"historic-block",bank:"west",entranceAxis:"z",entranceSide:1});for(let n=-137;n<=233;n+=9)for(let t=-207;t<=127;t+=9){let e=8+(Math.abs(t)*7+Math.abs(n)*3)%12;ce({id:`bund-infill-tight-${t}-${n}`,name:"\u5916\u6EE9\u5386\u53F2\u8857\u574A",x:t,z:n,rx:3,rz:3,h:e,kind:(t+n)%3?"baroque":"brick",form:(t+n)%4?"terrace":"warehouse",district:"historic-block",bank:"west",entranceSide:1,shop:!0})}for(let n=-5;n<=179;n+=9)for(let t=146;t<=302;t+=9)ce({id:`pudong-infill-tight-${t}-${n}`,name:"\u9646\u5BB6\u5634\u5546\u4F4F\u8857\u574A",x:t,z:n,rx:3,rz:3,h:15+(t*3+Math.abs(n))%23,kind:(t+n)%4?"glass":"hotel",form:(t+n)%3?"setback":"slab",bank:"east",entranceSide:-1});for(let[n,t]of[[-255,-100],[-234,-90],[-252,-78],[-255,26],[-235,30],[-253,56],[-242,76],[-228,80],[-252,117],[-235,123]])ce({id:`west-infill-${n}-${t}`,name:"\u6D66\u897F\u6CBF\u8857\u8857\u574A",x:n,z:t,rx:5,rz:4,h:9+(n+t+400)%8,kind:"brick",form:"terrace",bank:"west",entranceSide:1});var di=Yt.filter(n=>n.id.startsWith("nanjing-")).sort((n,t)=>n.x-t.x);di.length&&(di[0].name="\u6C38\u5B89\u767E\u8D27 \xB7 \u5357\u4EAC\u4E1C\u8DEF",di[2].name="\u5148\u65BD\u516C\u53F8\u5386\u53F2\u5546\u53A6",di.at(-1).name="\u7F8E\u4F26\u5927\u697C \xB7 \u5916\u6EE9\u4E2D\u592E");var Lr=Qt.find(n=>n.id==="nanpu");for(let n of[we,Sn,at,Xt,Yt,B])for(let t=n.length-1;t>=0;t--){let e=n[t];Lr.samples.some(i=>Math.abs(i.x-e.x)<=e.rx+Lr.width+2&&Math.abs(i.z-e.z)<=e.rz+Lr.width+2)&&(le.add(e.id),n.splice(t,1))}var la=new Set;for(let n of ae)n.kind==="road"&&(n.width=4);for(let n of Nt){if(n.width=Math.max(4,n.width),la.has(n.samples)||n.samples.length<3)continue;la.add(n.samples);let t=n.samples.map(s=>[s.x,s.z,s.y]);if(n.id==="north-bund"){let s=t.findIndex(o=>o[1]<=-52);t=[[q(14),14,26],[pt.x,5,26],[pt.x,-45,26],t[s],...t.slice(s+1)]}t=t.map(([s,o,a])=>Math.abs(s-(q(o)-2))<.8&&o>=14?[s+2+(o>112&&o<136?4*Math.sin(Math.PI*(o-112)/24):0),o,a]:[s,o,a]);let e=t.filter((s,o)=>o===0||o===t.length-1||Math.abs((s[0]-t[o-1][0])*(t[o+1][1]-s[1])-(s[1]-t[o-1][1])*(t[o+1][0]-s[0]))>.001),i=Math.hypot(t[0][0]-t.at(-1)[0],t[0][1]-t.at(-1)[1])<.1,r=$(i?vn(e,7):t);n.samples.splice(0,n.samples.length,...r),n.samples.lengthMeters=r.lengthMeters}var mi=bn.find(n=>n.id==="bridge").samples,ya=$(vn(mi.map(n=>({...n,x:Math.abs(n.x-(q(n.z)-2))<.8&&n.z>=14?n.x+2+(n.z>112&&n.z<136?4*Math.sin(Math.PI*(n.z-112)/24):0):n.x})).filter((n,t,e)=>t===0||t===e.length-1||Math.abs((n.x-e[t-1].x)*(e[t+1].z-n.z)-(n.z-e[t-1].z)*(e[t+1].x-n.x))>.001).map(n=>[n.x,n.z,n.y]),7));mi.splice(0,mi.length,...ya);mi.lengthMeters=ya.lengthMeters;var Iu=[[313,226],[359,226],[359,275],[363,275],[363,306],[373,306],[373,311],[363,311],[363,275],[359,275],[359,271],[313,271],[313,226]],Pu=[[-249,209],[-151,209],[-151,253],[-249,253],[-249,209]];bn.push({id:"expo-local",samples:$(vn(Iu,2.8)),cars:4,lane:1,oneWay:!0},{id:"puxi-local",samples:$(vn(Pu,2.8)),cars:4,lane:1.05});var _a=Nt.slice();Nt.push(...xi,...yi,{id:"wukang-road",name:"\u6B66\u5EB7\u8DEF",width:Fi,samples:$(dt.road),regionalVoxels:!0});var Lu=Qt.filter(n=>n.id==="sand"||n.id==="home");for(let n of[at,Xt,Yt,B])for(let t=n.length-1;t>=0;t--){let e=n[t];/^bund-(?:back|infill)/.test(e.id)&&Lu.some(i=>i.samples.some(r=>Math.abs(r.x-e.x)<=e.rx+i.width+1&&Math.abs(r.z-e.z)<=e.rz+i.width+1))&&(le.add(e.id),n.splice(t,1))}for(let n of[we,Sn,at,Xt,Yt,B])for(let t=n.length-1;t>=0;t--){let e=n[t],i=Et(e.x-e.rx,e.z-e.rz)||Et(e.x+e.rx,e.z+e.rz)||Et(e.x,e.z),r=e.bank==="west"&&sa(xi,e)||_a.some(s=>s.samples.some((o,a)=>a%3===0&&Math.abs(o.x-e.x)<=e.rx+s.width+.8&&Math.abs(o.z-e.z)<=e.rz+s.width+.8));(i||r&&/back|infill|front|density/.test(e.id)&&e.id!=="pudong-infill-southeast-2")&&(le.add(e.id),n.splice(t,1))}for(let[n,t]of Yt.filter(e=>e.id.startsWith("nanjing-")).entries())t.streetIndex=n;for(let n of[at,Xt,Yt,B])for(let t=n.length-1;t>=0;t--){let e=n[t];if(!/back|infill|density/.test(e.id))continue;let i=!1;for(let r=e.x-e.rx-1;r<=e.x+e.rx+1&&!i;r++)for(let s=e.z-e.rz-1;s<=e.z+e.rz+1;s++)if(fi(r,s)||ta(r,s)||Fn(r,s)){i=!0;break}i&&(le.add(e.id),n.splice(t,1))}var Ma=[...Sn,...at,...Xt,...Yt],Re=[...we,...Ma],Du=Re.find(n=>n.id==="bund-infill-tight--207--92");Object.assign(Du,{x:-222,z:-111,front:-219});function va(n,t=2.5){let e=n.entranceSide??1;return n.entranceAxis==="z"?{x:n.x+.5,z:n.z+e*(n.rz+t)}:{x:n.x+e*(n.rx+t),z:n.z+.5}}function ba(n,t,e){return t>=25&&Re.some(i=>Math.abs(n-i.x)<=i.rx+1&&Math.abs(e-i.z)<=i.rz+1)}function Nu(n,t){let{x:e,z:i,h:r,rx:s,rz:o}=t,a=t.entranceSide??1,l=Xn(t);if(n.fill(e-s,18,i-o,e+s,25,i+o,3),n.fill(e-s,26,i-o,e+s,26+r,i+o,0),l.form!=="landmark")io(n,t,l);else{let f=["glass","gold","hotel"].includes(t.kind);for(let c=26;c<26+r;c++)for(let h=e-s;h<=e+s;h++)for(let u=i-o;u<=i+o;u++){if(h!==e-s&&h!==e+s&&u!==i-o&&u!==i+o)continue;let d=c%4>=1&&c%4<=2&&(h===e+s||h===e-s?Math.abs(u-i)%3===1:Math.abs(h-e)%3===1);n.set(h,c,u,f?c%8===0||Math.abs(h-e)===s&&Math.abs(u-i)===o?9:t.kind==="gold"?6:11:d?11:c%4===0?9:t.kind==="brick"?8:l.wall)}n.fill(e-s-1,26+r,i-o-1,e+s+1,26+r,i+o+1,9)}for(let f=e-s+1;f<e+s;f++)for(let c=i-o+1;c<i+o;c++)n.set(f,25,c,(f+c)%2?9:6);if(t.entranceAxis==="z"){let f=i+a*o,c=f+a*4;n.fill(e-1,26,f,e+1,29,f,0),n.fill(e-1,25,Math.min(f,c),e+1,25,Math.max(f,c),9),n.fill(e-1,26,Math.min(f+a,c),e+1,29,Math.max(f+a,c),0)}else{let f=e+a*s,c=f+a*4;n.fill(f,26,i-1,f,29,i+1,0),n.fill(Math.min(f,c),25,i-1,Math.max(f,c),25,i+1,9),n.fill(Math.min(f+a,c),26,i-1,Math.max(f+a,c),29,i+1,0)}if(t.id==="pudong-infill-southeast-2")for(let f=29;f<26+r;f+=4)Math.abs(f-77)>1&&n.fill(e-s+1,f,i-o+1,e+s-1,f,i+o-1,9);for(let f of[-o+2,o-2])n.fill(e-s+2,26,i+f,e+s-2,26,i+f,7),n.set(e-a*(s-2),27,i+f,12);if(t.id.startsWith("nanjing-")&&t.entranceAxis==="z")for(let f of[-o+2,o-2])n.fill(e-1,26,i+f,e+1,27,i+f,0);if(l.form==="landmark"){if(t.kind==="copper"){n.fill(e-3,27+r,i-3,e+3,31+r,i+3,9);for(let f=0;f<5;f++)n.fill(e-4+f,32+r+f,i-4+f,e+4-f,32+r+f,i+4-f,5)}if(t.kind==="steps"||t.kind==="glass")for(let f=0;f<3;f++)n.fill(e-s+1+f,27+r+f,i-o+1,e+s-1-f,27+r+f,i+o-1,9);if(t.kind==="clock"&&(n.fill(e-3,27+r,i-3,e+3,39+r,i+3,9),n.fill(e-2,40+r,i-2,e+2,41+r,i+2,9),n.set(e,42+r,i,12)),t.kind==="dome")for(let f=0;f<=5;f++)n.disc(e,27+r+f,i,Math.sqrt(Math.max(0,25-f*f)),9);if(t.kind==="baroque"){for(let f of[-s+1,s-1])n.fill(e+f,27+r,i-2,e+f,29+r,i+2,9);n.fill(e-2,27+r,i-2,e+2,29+r,i+2,9)}if(t.kind==="brick")for(let f=0;f<4;f++)n.fill(e-s,27+r+f,i-o+f,e+s,27+r+f,i+o-f,8)}}function Sa(n){for(let e=rt.min;e<rt.max;e++)for(let i=rt.minZ;i<=234;i++){if(n.get(e,25,i)!==1||e<102-N&&i>=202)continue;let r=e-z(i);e>=178&&e<=214&&i>=40&&i<=58||r>10&&r<18||(r<-45||r>18)&&n.set(e,25,i,(Math.floor(e/6)+Math.floor(i/6))%5===0?1:9)}for(let e of _a)for(let i of e.samples){let r=Math.round(i.x),s=Math.round(i.z);for(let o=-e.width-2;o<=e.width+2;o++)for(let a=-e.width-2;a<=e.width+2;a++){let l=r+o,f=s+a;Yi(l,f)||Object.values(E).some(c=>Math.abs(l+.5-c.x)<=12&&Math.abs(f+.5-c.z)<=13)||(n.fill(l,23,f,l,24,f,3),n.set(l,25,f,Math.abs(o)<=e.width&&Math.abs(a)<=e.width?3:9),n.fill(l,26,f,l,32,f,0))}}let t=ae.find(e=>e.id==="nanjing");for(let e=Fr;e<=q(t.z)-4;e++)for(let i=t.z-t.width;i<=t.z+t.width;i++)n.fill(e,24,i,e,24,i,3),n.set(e,25,i,Math.abs(i-t.z)<1?6:9),n.fill(e,26,i,e,34,i,0);for(let e of Re)Nu(n,e);zr(n,xi),zr(n,yi),n.fill(W.x-7,82,W.z-6,W.x+7,82,W.z+6,9),n.fill(W.x-7,83,W.z-6,W.x+7,89,W.z+6,0)}var Uu=Vo(Nt);var Br=[{id:"stele-66",west:-36,east:-21,z:66,halfZ:3.8,roadWest:-31,roadEast:-25},{id:"bund-66",west:8.7,east:28.1,z:66,halfZ:3.8,roadWest:13,roadEast:23}];var Ou=ae.flatMap(n=>["bund","stele"].map(t=>{let e=t+"-"+n.z,i=Br.find(f=>f.id===e),r=(t==="bund"?q(n.z):Vt(n.z))+.5,s=Math.min(i?.roadWest??r-4,r-4),o=Math.max(i?.roadEast??r+4,r+4),a=Math.floor((o-s)/1.1),l=(o-s)/a;return{id:e,west:s,east:o,z:i?.z??n.z+.5,depth:5.2,stripes:Array.from({length:a},(f,c)=>s+(c+.5)*l)}}));var Fu=new ot(1,1,1),kr=Fu.attributes.uv;for(let n=0;n<6;n++)for(let t=n*4;t<n*4+4;t++){let e=kr.getX(t),i=kr.getY(t);kr.setXY(t,(n%3+e)/3,(1-Math.floor(n/3)+i)/2)}var bi=Ho(0),Hr=new xt;Hr.position.set(bi.x,bi.y,bi.z);Hr.rotation.y=bi.yaw;var Ea=Ar(Hr,{x:1.7,z:4.8}),ku={x:42,y:26.04,z:Ea.z,endX:61,entry:Ea,deck:23.36},Fm=new ot(1,1,1);var n1=[[q(14),14],[Vt(14),14],[q(206),206],[q(238),238],[Vt(238),238],[(q(206)+q(238))/2,222],[(q(206)+Vt(238))/2,222],[213,31],[226,12,12,8],[210,12],[282,206],[260,65],[291,22],[210,-8],[167,12],[q(-140),-140],[Vt(-140),-140]];var Aa=[];for(let n=4;n<=18;n++)for(let t=4;t<=18;t++)Aa.push({x:n,z:t,d:(n-7)**2+(t-7)**2});Aa.sort((n,t)=>n.d-t.d||n.x-t.x||n.z-t.z);var wa=ba,Xu=Zi+2;function Ra(n){for(let t=Xu;t<=242;t++){let e=gi(t),i=Math.round(q(t));for(let r=i-5;r<=e+2;r++)n.fill(r,18,t,r,24,t,3),n.set(r,25,t,r>=e-10?9:r>=i-3&&r<=i+3?3:1),n.fill(r,26,t,r,38,t,0)}Sa(n),n.fill(258,25,214,262,25,218,7),n.fill(258,26,214,262,30,230,0),n.fill(258,24,219,262,24,220,7),n.fill(258,23,221,262,23,222,7),n.fill(258,22,223,262,22,230,7);for(let t=178;t<=214;t++)for(let e=40;e<=58;e++)(Math.abs(t-195)<2||Math.abs(e-49)<2)&&n.set(t,25,e,6);n.fill(200,21,43,208,24,47,0),n.fill(200,20,43,208,20,47,6);for(let[t,e]of[[120,308],[137,304],[140,314],[117,315],[132,315],[124,313]]){n.fill(t,26,e,t,30,e,4);for(let i=-2;i<=2;i++)for(let r=-2;r<=2;r++)Math.abs(i)+Math.abs(r)<4&&n.fill(t+i,30,e+r,t+i,32,e+r,5)}}var k0=new ot(1,1,1),H0=new yn(1,12,8),G0=new xn(1,1,1,20);var Ce=we.find(n=>n.id==="peace"),q0={y:42,lift:{x:Ce.x+3.5,y:26,z:Ce.z+.5},arrival:{x:Ce.x+3.5,y:42,z:Ce.z+.5},counter:{x:Ce.x-3.5,y:42,z:Ce.z+.5}};function Ca(n){let t=Ce,{x:e,z:i}=t;n.fill(e-t.rx+1,41,i-t.rz+1,e+t.rx-1,41,i+t.rz-1,9),n.fill(e-t.rx+1,42,i-t.rz+1,e+t.rx-1,44,i+t.rz-1,0),n.fill(e-t.rx+1,45,i-t.rz+1,e+t.rx-1,45,i+t.rz-1,9),n.fill(e+t.rx,43,i-t.rz+2,e+t.rx,44,i+t.rz-2,0);for(let r of[-3,3])for(let s of[-2,1])n.set(e+s,42,i+r,4);n.fill(e-t.rx+1,42,i-1,e-t.rx+2,42,i+1,8);for(let r of[-5,5])for(let s of[-4,4])n.fill(e+r,42,i+s,e+r,44,i+s,8);n.fill(e-t.rx+3,42,i-1,e+t.rx-1,44,i+1,0),n.fill(e+2,26,i-1,e+4,30,i+1,0),n.set(e+3,25,i,12),n.set(e+3,41,i,12)}var Pe={x:-94,z:-40},K0=-Math.PI/2,ze=n=>({x:Pe.x-n.z,y:n.y,z:Pe.z+n.x}),Qe=n=>({x:n.z-Pe.z,y:n.y,z:Pe.x-n.x}),fe=[{id:"nanjing10",name:"\u5357\u4EAC\u4E1C\u8DEF",english:"East Nanjing Road",platformLabel:"B3",x:164,z:0,color:"#c6b3d0",sharedConcourse:!0,exits:[]},{id:"yuyuan",name:"\u8C6B\u56ED",english:"Yuyuan Garden",platformLabel:"B2",x:256,z:0,color:"#ae5142",exits:[{number:1,x:252,z:-8,dir:1,width:1.4,label:"\u8C6B\u56ED\u897F\u5317\u95E8 \xB7 \u6CB3\u5357\u5357\u8DEF"},{number:4,x:302,z:-8,dir:-1,width:1.4,label:"\u8C6B\u56ED\u897F\u95E8 \xB7 \u798F\u4F51\u8DEF"}]}],Vr=fe.flatMap(n=>[...n.exits.map(t=>({station:n.id,exit:t.number,...t,from:26,to:16,length:18,kind:"entrance"})),{station:n.id,x:n.x-12,z:3,dir:1,from:16,to:6,length:18,width:1.5,kind:"platform"}]),j0=fe.map(n=>({...n,...ze({...n,y:16}),line:10,exits:n.exits.map(t=>({...t,...ze({...t,y:26}),axis:"z"}))})),Ie=[[-100,79],[-100,85],[-114,85],[-114,124],[-107,124]];function za(n,t,e,i){let r=i[0]-e[0],s=i[1]-e[1],o=Math.max(0,Math.min(1,((n-e[0])*r+(t-e[1])*s)/(r*r+s*s||1)));return Math.hypot(n-e[0]-o*r,t-e[1]-o*s)}var Ia=n=>n.y>=15&&n.y<22.5&&Ie.some((t,e)=>e&&za(n.x,n.z,Ie[e-1],t)<4.2),Pa=(n,t)=>Vr.find(e=>{let i=(n-e.x)*e.dir;return i>=-2&&i<=e.length+2&&Math.abs(t-e.z)<e.width});var Yu=n=>fe.find(t=>Math.abs(n.x-t.x)<37&&Math.abs(n.z)<17&&n.y>=2.7&&n.y<23),Zu=n=>!!Yu(n)||!!Pa(n.x,n.z)&&n.y<25.8||n.y>=2.7&&n.y<11&&n.x>127&&n.x<293&&Math.abs(n.z)<13,La=n=>Zu(Qe(n));function Da(n,t,e){let i=Qe({x:n,y:t,z:e});return i.x>=127&&i.x<=293&&Math.abs(i.z)<=12&&t>=2&&t<=10||fe.some(r=>Math.abs(i.x-r.x)<=36&&Math.abs(i.z)<=16&&t>=15&&t<=22)||Vr.some(r=>{let s=(i.x-r.x)*r.dir,o=r.from+(r.to-r.from)*Math.max(0,Math.min(1,s/r.length));return s>=-3&&s<=r.length+3&&Math.abs(i.z-r.z)<=r.width+1&&t>=Math.floor(o)-1&&t<=Math.ceil(o)+3})?!0:t>=15&&t<=22&&Ie.some((r,s)=>s&&za(n,e,Ie[s-1],r)<=3.1)}function Na(n,t,e=[]){let i={set(s,o,a,l){let f=ze({x:s,y:o,z:a});return n.set(f.x,o,f.z,l)},get(s,o,a){let l=ze({x:s,y:o,z:a});return n.get(l.x,o,l.z)},fill(s,o,a,l,f,c,h){let u=ze({x:s,y:o,z:a}),d=ze({x:l,y:f,z:c});n.fill(Math.min(u.x,d.x),o,Math.min(u.z,d.z),Math.max(u.x,d.x),f,Math.max(u.z,d.z),h)}};t(i,{stations:fe,ramps:Vr,lineZ:()=>0,minX:127,maxX:293});let r=new Map;for(let s=1;s<Ie.length;s++){let o=Ie[s-1],a=Ie[s],l=Math.ceil(Math.hypot(a[0]-o[0],a[1]-o[1])*2);for(let f=0;f<=l;f++){let c=Math.round(o[0]+(a[0]-o[0])*f/l),h=Math.round(o[1]+(a[1]-o[1])*f/l);r.set(c+","+h,{x:c,z:h})}}for(let{x:s,z:o}of r.values())n.fill(s-3,15,o-3,s+3,22,o+3,9);for(let{x:s,z:o}of r.values())n.fill(s-2,16,o-2,s+2,21,o+2,0),n.fill(s-2,15,o-2,s+2,15,o+2,9);for(let s of e)n.fill(s.x-35,16,s.z-15,s.x+35,21,s.z+15,0);for(let s of fe)i.fill(s.x-35,16,s.z-15,s.x+35,21,s.z+15,0)}var _t={id:"jingan",name:"\u9759\u5B89\u5BFA",english:"Jing'an Temple",x:-300,z:32,hallY:16,platformY:6,color:"#bdad79",exits:[{number:6,x:-300,z:23,dir:-1,width:1.3,label:"\u5357\u4EAC\u897F\u8DEF \xB7 \u9759\u5B89\u5BFA\u5C71\u95E8"}]},yt=24,he=Math.PI*3/4,Zt=Math.SQRT1_2,Ti=296,Si=Ti+yt*he,Ua=Pe.z+Ti,qr=-94+yt*(Math.cos(he)-1),Xr=Ua+yt*Math.sin(he),Oa=Si+(166+qr)/Zt,Ai=62,Ei=Oa+Ai,Yr=Ei+yt*Math.PI/4,Fa=-166-Ai*Zt-yt*Zt,Zr=Yr+263+Fa,qt=[{id:"xintiandi",name:"\u4E00\u5927\u4F1A\u5740\xB7\u65B0\u5929\u5730",english:"Xintiandi",x:Oa,z:0,platformLabel:"B2",color:"#a86352",exits:[{number:6,x:800,z:-9,dir:1,width:1.4,label:"\u5174\u4E1A\u8DEF \xB7 \u4E2D\u5171\u4E00\u5927\u4F1A\u5740",separate:!0}]},{id:"library",name:"\u4E0A\u6D77\u56FE\u4E66\u9986",english:"Shanghai Library",x:Zr,z:0,platformLabel:"B2",color:"#6e9091",exits:[{number:1,x:Zr+9,z:Xr-(166+qr)-Ai*Zt+yt*(Math.sin(he)-1)-201,dir:-1,width:1.4,label:"\u6DEE\u6D77\u4E2D\u8DEF \xB7 \u6B66\u5EB7\u8DEF"}]}];function Ba(n){let t=i=>({x:-94,z:Pe.z+i,dx:0,dz:1});if(n<=Ti)return t(n);if(n<=Si){let i=(n-Ti)/yt;return{x:-94+yt*(Math.cos(i)-1),z:Ua+yt*Math.sin(i),dx:-Math.sin(i),dz:Math.cos(i)}}if(n<=Ei){let i=(n-Si)*Zt;return{x:qr-i,z:Xr-i,dx:-Zt,dz:-Zt}}let e=Xr-(Ei-Si)*Zt;if(n<=Yr){let i=he-(n-Ei)/yt;return{x:-166-Ai*Zt-yt*(Math.cos(i)-Math.cos(he)),z:e-yt*(Math.sin(i)-Math.sin(he)),dx:-Math.sin(i),dz:Math.cos(i)}}return{x:Fa-(n-Yr),z:e+yt*(Math.sin(he)-1),dx:-1,dz:0}}var $r=qt.flatMap(n=>[...n.exits.map(t=>({station:n.id,exit:t.number,...t,from:26,to:16,length:18,kind:"entrance"})),{station:n.id,x:n.x-12,z:3,dir:1,from:16,to:6,length:18,width:1.5,kind:"platform"}]),wi=[..._t.exits.map(n=>({station:_t.id,exit:n.number,...n,from:26,to:16,length:18,kind:"entrance"})),{station:_t.id,x:_t.x-12,z:_t.z+3,dir:1,from:16,to:6,length:18,width:1.5,kind:"platform"}],ka=(n,t,e,i,r=0,s=0)=>({x:n,z:t,dx:e,dz:i,localX:r,localZ:s}),An=new Map(qt.map(n=>{let t=Ba(n.x);return[n.id,ka(t.x,t.z,t.dx,t.dz,n.x,0)]})),Le=$r.find(n=>n.separate),Ha=ka(-158,203,-1,0,Le.x,Le.z);function Ga(n,t){let e=n.x-t.localX,i=n.z-t.localZ;return{x:t.x+e*t.dx-i*t.dz,y:n.y,z:t.z+e*t.dz+i*t.dx}}function En(n,t){let e=n.x-t.x,i=n.z-t.z;return{x:t.localX+e*t.dx+i*t.dz,y:n.y,z:t.localZ-e*t.dz+i*t.dx}}var qu=(n,t)=>Ga({...n,y:26},n.separate?Ha:An.get(t.id)),Jr=(n,t)=>n>=-315&&n<=-116&&t>=150&&t<=283;function Kr(n){if(!Jr(n.x,n.z)){let r=Qe(n);return r.x<=310?r:{x:-2e3,y:n.y,z:-2e3}}let t=En(n,Ha),e=(t.x-Le.x)*Le.dir;if(e>=-5&&e<=Le.length+2.5&&Math.abs(t.z-Le.z)<2.05&&n.y>=26-Math.max(0,e)*10/18-1.1)return t;for(let r of qt){let s=En(n,An.get(r.id));if(Math.abs(s.x-r.x)<=37.5&&Math.abs(s.z)<=17.5||!r.exits[0].separate&&Math.abs(s.z-r.exits[0].z)<2.8&&Math.abs(s.x-r.exits[0].x)<23)return s}let i=Qe(n);return i.x<=310?i:{x:-2e3,y:n.y,z:-2e3}}var $u=n=>qt.find(t=>Math.abs(n.x-t.x)<37&&Math.abs(n.z)<17&&n.y>=2.7&&n.y<23),jr=(n,t)=>$r.find(e=>{let i=(n-e.x)*e.dir;return i>=-2&&i<=e.length+2&&Math.abs(t-e.z)<e.width}),Qr=(n,t)=>n?n.from+(n.to-n.from)*Math.max(0,Math.min(1,(t-n.x)*n.dir/n.length)):null;var Va=qt[0],Wa=An.get("xintiandi"),Wr=(n,t)=>{let e=Ga({x:Va.x+n,y:16,z:t},Wa);return[e.x,e.z]},Tn=[[-176,203],[-179,203],[-179,199],Wr(32,24),Wr(-22,24),Wr(-22,13)];function ts(n,t,e,i){let r=i[0]-e[0],s=i[1]-e[1],o=Math.max(0,Math.min(1,((n-e[0])*r+(t-e[1])*s)/(r*r+s*s||1)));return Math.hypot(n-e[0]-o*r,t-e[1]-o*s)}var Ju=n=>n.y>=15&&n.y<22.5&&Tn.some((t,e)=>e&&ts(n.x,n.z,Tn[e-1],t)<3.5);function es(n){if(!Jr(n.x,n.z)||n.y<2.7||n.y>=25.8)return!1;let t=Kr(n);return!!$u(t)||!!jr(t.x,t.z)&&n.y<25.8||Ju(n)}var e2=[{..._t.exits[0],id:"metro-jingan",line:2,name:"2\u53F7\u7EBF \xB7 \u9759\u5B89\u5BFA",x:-297,y:26,z:23},...qt.map(n=>{let t=n.exits[0];return{...qu({...t,x:t.x-3*t.dir},n),id:"metro-10-"+n.id,name:"10\u53F7\u7EBF \xB7 "+n.name,line:10}})],n2=[...fe,...qt];function wn(n){let t=Math.max(0,Math.min(1,(-130-n)/134));return 66+(_t.z-66)*t*t*(3-2*t)}function ns(n,t){return wi.find(e=>{let i=(n-e.x)*e.dir;return i>=-2&&i<=e.length+2&&Math.abs(t-e.z)<e.width})}function Xa(n){return Math.abs(n.x-_t.x)<37&&Math.abs(n.z-_t.z)<17&&n.y>=2.7&&n.y<23?_t:void 0}function is(n){return!!Xa(n)||!!ns(n.x,n.z)&&n.y<25.8||n.y>=2.7&&n.y<11&&n.x>=-335&&n.x<=-130&&Math.abs(n.z-wn(n.x))<13}var Ri=(n,t)=>n+","+t;function Ku(n,t,e,i,r,s){let o=new Map;for(let a=n;a<=t;a+=.35){let l=e(a);for(let f of i){let c=l.x-l.dz*f,h=l.z+l.dx*f;for(let u=Math.floor(c-s);u<=c+s;u++)for(let d=Math.floor(h-s);d<=h+s;d++){let p=(u+.5-c)**2+(d+.5-h)**2;if(p<=s**2){let m=Ri(u,d),g=o.get(m);g?p<=r**2&&(g.inner=!0):o.set(m,{x:u,z:d,inner:p<=r**2})}}}}return o}var ju,rs=()=>ju??=Ku(284,Zr+37,Ba,[-8,8],3.5,4.5);function Ya(n){return n.y>=2.7&&n.y<11&&n.z>=153&&n.z<=295&&n.x<=-76&&n.x>=-306&&!!rs().get(Ri(Math.floor(n.x),Math.floor(n.z)))?.inner}function Za(n,t,e){if(t<2||t>30)return!1;if(n>=-336&&n<=-130&&t>=2&&t<=11&&Math.abs(e-Math.round(wn(n)))<=13||(is({x:n,y:t,z:e})||es({x:n,y:t,z:e}))&&t>=2&&t<=25||t>=2&&t<=10&&n<=-76&&n>=-306&&e>=153&&e<=295&&rs().has(Ri(n,e))||t>=15&&t<=22&&Tn.some((s,o)=>o&&ts(n+.5,e+.5,Tn[o-1],s)<=3.5))return!0;if(Jr(n,e))for(let s of qt){let o=En({x:n+.5,y:t,z:e+.5},An.get(s.id));if(t<=22&&o.x>=s.x-37&&o.x<s.x+38&&o.z>=-16&&o.z<17)return!0}let i=Kr({x:n+.5,y:t,z:e+.5}),r=jr(i.x,i.z)??ns(n+.5,e+.5);if(r){let s=Qr(r,r.station==="jingan"?n+.5:i.x);if(t>=Math.floor(s)-1&&t<=Math.ceil(s)+3)return!0}return t>=15&&(n>=-277&&n<=-249&&e>=199&&e<=203||n>=-181&&n<=-154&&e>=202&&e<=204)}function Qu(n,t,e){let i=An.get(e.id),r={...i,localX:0},s=new Int8Array(3360*31).fill(-1),o=(f,c,h)=>(c*42+h+21)*80+f+40,a={fill(f,c,h,u,d,p,m){for(let g=f;g<=u;g++)for(let x=h;x<=p;x++)for(let M=c;M<=d;M++)s[o(g,M,x)]=m}},l=$r.filter(f=>f.station===e.id&&!f.separate).map(f=>({...f,x:Math.round(f.x-e.x)}));t(a,{stations:[{...e,x:0}],ramps:l,minX:-37,maxX:37,lineZ:()=>0});for(let f=Math.floor(r.x)-42;f<=r.x+42;f++)for(let c=Math.floor(r.z)-42;c<=r.z+42;c++){let h=En({x:f+.5,z:c+.5},r),u=Math.floor(h.x),d=Math.floor(h.z);if(!(u<-40||u>=40||d<-21||d>=21))for(let p=2;p<=29;p++){let m=s[o(u,p,d)];m>=0&&n.set(f,p,c,m)}}}function td(n){let t=Tn,e=new Map;for(let i=1;i<t.length;i++){let r=t[i-1],s=t[i];for(let o=Math.floor(Math.min(r[0],s[0])-4);o<=Math.max(r[0],s[0])+4;o++)for(let a=Math.floor(Math.min(r[1],s[1])-4);a<=Math.max(r[1],s[1])+4;a++){let l=ts(o+.5,a+.5,r,s);if(l<3.5){let f=Ri(o,a);e.set(f,{x:o,z:a,inner:e.get(f)?.inner||l<2.55})}}}for(let{x:i,z:r,inner:s}of e.values()){let o=En({x:i+.5,z:r+.5},Wa);!s&&Math.abs(o.x-Va.x)<35&&o.z>=-15&&o.z<16||(n.set(i,15,r,9),n.set(i,22,r,9),n.fill(i,16,r,i,21,r,s?0:9))}}function qa(n,t){t(n,{stations:[_t],ramps:wi,lineZ:wn,minX:-335,maxX:-130});for(let{x:e,z:i,inner:r}of rs().values())e>-110&&i<246||(n.set(e,2,i,3),n.set(e,5,i,3),n.set(e,10,i,3),n.fill(e,3,i,e,4,i,r?0:3),n.fill(e,6,i,e,9,i,r?0:3));for(let e of qt)Qu(n,t,e);td(n),t(n,{stations:[],ramps:[{...Le,x:-158,z:203,dir:-1}],minX:1,maxX:0})}var $t=[{id:"nanjing",name:"\u5357\u4EAC\u4E1C\u8DEF",english:"East Nanjing Road",x:-94,z:66,hallY:16,platformY:6,color:"#8bc9b9",exits:[{number:1,x:-135,z:61.35,dir:1,width:.7,label:"\u5357\u4EAC\u4E1C\u8DEF\u5317\u4FA7 \xB7 \u6CB3\u5357\u4E2D\u8DEF"},{number:4,x:-107,z:70.65,dir:-1,width:.7,label:"\u5357\u4EAC\u4E1C\u8DEF\u5357\u4FA7 \xB7 \u5F80\u5916\u6EE9"}]},{id:"lujiazui",name:"\u9646\u5BB6\u5634",english:"Lujiazui",x:174,z:31,hallY:16,platformY:6,color:"#c9b1c7",exits:[{number:1,x:153,z:24,dir:1,label:"\u4E16\u7EAA\u5927\u9053 \xB7 \u4E1C\u65B9\u660E\u73E0\u65B9\u5411"},{number:3,x:205,z:24,dir:-1,label:"\u4E16\u7EAA\u5927\u9053 \xB7 \u94F6\u57CE\u4E2D\u8DEF\u65B9\u5411"}]}],ue={id:"centuryPark",name:"\u4E16\u7EAA\u516C\u56ED",english:"Century Park",x:349,z:47,hallY:16,platformY:6,color:"#91b38e",exits:[{number:2,x:315,z:34,dir:1,width:1.4,label:"\u4E16\u7EAA\u516C\u56ED \xB7 \u897F\u5165\u53E3"}],localGuide:["\u4E16\u7EAA\u516C\u56ED\u600E\u4E48\u8D70\uFF1F","\u4ECE2\u53F7\u53E3\u51FA\u7AD9\uFF0C\u5411\u5357\u6CBF\u4EBA\u884C\u9053\u8D70\u5230\u4E16\u7EAA\u516C\u56ED\u897F\u5165\u53E3\uFF0C\u53EF\u53BB\u4E16\u7EAA\u82B1\u949F\u548C\u955C\u5929\u6E56\u3002"]};var $a=n=>[...n.exits.map(t=>({station:n.id,exit:t.number,x:t.x,z:t.z,dir:t.dir,from:26,to:16,length:18,width:t.width??1.5,kind:"entrance"})),{station:n.id,x:n.x-12,z:n.z+3,dir:1,from:16,to:6,length:18,width:1.5,kind:"platform"}],Ci=$t.flatMap($a),zi=$a(ue),a2=[_t,...$t,ue],l2=[...wi,...Ci,...zi],Ja=(n,t,e)=>n.find(i=>{let r=(t-i.x)*i.dir;return r>=-2&&r<=i.length+2&&Math.abs(e-i.z)<i.width});function ed(n,t){return Ja(Ci,n,t)}function nd(n){return $t.find(t=>Math.abs(n.x-t.x)<37&&Math.abs(n.z-t.z)<17&&n.y>=2.7&&n.y<23)}function id(n){return!!nd(n)||!!ed(n.x,n.z)&&n.y<25.8||n.y>=2.7&&n.y<11&&n.x>-133&&n.x<212&&Math.abs(n.z-ss(n.x))<13}function ss(n){let t=$t[0],e=$t[1],i=Math.max(0,Math.min(1,(n-(t.x+36))/(e.x-36-(t.x+36))));return t.z+(e.z-t.z)*(i*i*(3-2*i))}var tn=214,os=ue.x+36;function as(n){if(n<-94)return wn(n);if(n<tn)return ss(n);let t=$t[1].z,e=Math.min(1,(n-tn)/(ue.x-36-tn));return t+(ue.z-t)*e*e*(3-2*e)}function rd(n){let t=ue;return Math.abs(n.x-t.x)<37&&Math.abs(n.z-t.z)<17&&n.y>=2.7&&n.y<23?t:void 0}function sd(n){return id(n)||is(n)||!!rd(n)||n.y<25.8&&n.y>=15&&!!Ja(zi,n.x,n.z)||n.x>=tn-2&&n.x<=os+1&&n.y>=2.7&&n.y<11&&Math.abs(n.z-as(n.x))<13}function od(n,t,e){if(n<tn||n>os||t<2||t>29)return!1;let{x:i,z:r}=ue;return t<=10&&Math.abs(e-Math.round(as(n)))<=12||Math.abs(n-i)<=36&&(t>=15&&t<=22&&Math.abs(e-r)<=16||t<=11&&Math.abs(e-r)<=12)?!0:zi.some(s=>{let o=(n-s.x)*s.dir;if(o<-3||o>s.length+3||Math.abs(e-Math.floor(s.z))>1)return!1;let a=Qr(s,n);return t>=Math.floor(a)-1&&t<=Math.ceil(a)+3})}function Ka(n,t,e){return Da(n,t,e)||Za(n,t,e)||od(n,t,e)||ad({x:n,y:t,z:e})||Ci.some(i=>Math.abs(e-i.z)<2&&(n-i.x)*i.dir>=-2&&(n-i.x)*i.dir<=i.length+1&&t>=i.to-1&&t<=29)}function Rn(n,{stations:t=$t,ramps:e=Ci,lineZ:i=ss,minX:r=-133,maxX:s=213}={}){for(let o=r;o<=s;o++){let a=Math.round(i(o));n.fill(o,2,a-12,o,10,a+12,3),n.fill(o,3,a-11,o,9,a+11,0),n.fill(o,5,a-5,o,5,a+5,9)}for(let o of t)n.fill(o.x-36,15,o.z-16,o.x+36,22,o.z+16,9),n.fill(o.x-35,16,o.z-15,o.x+35,21,o.z+15,0),n.fill(o.x-36,2,o.z-12,o.x+36,11,o.z+12,9),n.fill(o.x-35,3,o.z-11,o.x+35,10,o.z+11,0),n.fill(o.x-35,5,o.z-5,o.x+35,5,o.z+5,9);for(let o of t)for(let a of[o.x-36,o.x+36])for(let l of[-1,1])n.fill(a,3,o.z+l*8-2,a,10,o.z+l*8+2,0);for(let o of e)for(let a=-3;a<=o.length+3;a++){let l=o.x+a*o.dir,f=o.from+(o.to-o.from)*Math.max(0,Math.min(1,a/o.length)),c=a<=0||a>=o.length,h=o.kind==="entrance"&&(o.width??1.5)<1,u=Math.floor(o.z);if(h){let d=u===61?59:68,p=u===61?63:73;if(a<=0)n.fill(l,26,u-1,l,29,u+1,0),n.fill(l,25,d,l,25,p,9);else if(a>=o.length)n.fill(l,15,u-1,l,15,u+1,9),n.fill(l,16,u-1,l,21,u+1,0),n.fill(l,22,d,l,25,p,9);else{n.fill(l,26,u,l,29,u,0);for(let m=d;m<=p;m++)m!==u&&n.set(l,25,m,9);if(a<=6)n.fill(l,Math.floor(f)-1,u,l,Math.ceil(f)+3,u,0);else{n.set(l,25,u,9);let m=Math.min(24,Math.ceil(f)+3);n.fill(l,Math.floor(f)-1,u,l,m,u,0),m<24&&n.fill(l,m+1,u,l,24,u,3)}}}else n.fill(l,Math.floor(f)-(c?0:1),Math.floor(o.z)-1,l,Math.ceil(f)+3,Math.floor(o.z)+1,0),c&&n.fill(l,Math.floor(f)-1,Math.floor(o.z)-1,l,Math.floor(f)-1,Math.floor(o.z)+1,9)}for(let o of t)n.fill(o.x-35,16,o.z-15,o.x+35,21,o.z+15,0)}function ja(n){Rn(n,{stations:[ue],ramps:zi,lineZ:as,minX:tn,maxX:os})}function ad(n){return sd(n)||La(n)||Ia(n)||es(n)||Ya(n)}var de=Re.find(n=>n.id==="peace"),Ii=Re.find(n=>n.id==="pudong-infill-southeast-2"),Qa=[{id:"peace-suite",name:"\u6211\u7684\u5916\u6EE9\u603B\u7EDF\u5957\u623F",x:de.x,z:de.z,y:47,rx:6,rz:5,view:1,balcony:!0,balconyDepth:3,lobby:{x:de.x+3.5,y:26,z:de.z+.5},target:{x:189.5,y:80,z:106.5}},{id:"tomson-suite",name:"\u6211\u7684\u6C64\u81E3\u4E00\u54C1\u6C5F\u666F\u5957\u623F",x:Ii.x,z:Ii.z,y:77,rx:4,rz:6,view:-1,balcony:!0,balconyDepth:2,lobby:{x:Ii.front-1.5,y:26,z:Ii.z+.5},target:{x:55,y:31,z:137}}];function tl(n){for(let t of Qa){let{x:e,z:i,y:r,rx:s,rz:o}=t;if(n.fill(e-s,r-1,i-o,e+s,r+4,i+o,9),n.fill(e-s+1,r,i-o+1,e+s-1,r+3,i+o-1,0),n.fill(e+t.view*s,r,i-o+1,e+t.view*s,r+3,i+o-1,0),n.fill(e-1,r,i-o,e+1,r+2,i-o,0),t.balcony){let a=e+t.view*s,l=a+t.view*t.balconyDepth;n.fill(Math.min(a,l),r-1,i-o+1,Math.max(a,l),r-1,i+o-1,9),n.fill(Math.min(a,l),r,i-o+1,Math.max(a,l),r+3,i+o-1,0)}}n.fill(de.x+2,26,de.z-3,de.x+5,29,de.z+2,0)}function el(n,t,e){return Qa.some(i=>t>=i.y-1&&t<=i.y+4&&Math.abs(n-i.x)<=i.rx+(i.balconyDepth??0)&&Math.abs(e-i.z)<=i.rz)}var It={bounds:{minX:316,maxX:383,minZ:45,maxZ:124},arrival:{x:321.5,y:26,z:58.5,name:"\u4E16\u7EAA\u516C\u56ED \xB7 \u897F\u5165\u53E3",viewTarget:{x:331,y:27.8,z:66}},lake:{x:342,z:85},flowerClock:{minX:326,maxX:336,minZ:62,maxZ:71},bridge:{rails:[356,360],fromZ:82,toZ:96},signs:[[324.5,30.1,58.5,"\u4E16\u7EAA\u516C\u56ED \xB7 \u955C\u5929\u6E56 / \u4E16\u7EAA\u82B1\u949F"],[342.5,29,67.5,"\u955C\u5929\u6E56 \xB7 \u6E56\u6EE8\u89C2\u666F\u53F0"],[358.5,29.4,80.5,"\u4E91\u5E06\u6865 \xB7 \u9E1F\u7C7B\u4FDD\u62A4\u533A"],[369.5,29.2,60.5,"\u4E61\u571F\u7530\u56ED\u533A \xB7 \u7530\u57C2\u4E0E\u82B1\u5703"],[355.5,29,112.5,"\u758F\u6797\u8349\u576A \xB7 \u6162\u8DD1\u9053"]]},{bounds:pe}=It;var Cn=(n,t,e,i,r,s)=>((n-e)/r)**2+((t-i)/s)**2,ld=[[320,59],[335,59],[347,61],[354,66],[358,74],[358,99],[354,105],[347,111],[335,111],[327,105],[322,94],[321,77],[320,69],[320,59]],cd=[[[308,58],[323,58]],[[338,59],[341,67]],[[352,64],[359,57],[371,58],[378,65],[380,76],[380,97],[375,107],[367,111],[347,111]],[[353,115],[352,124],[352,127]],[[333,110],[344,118],[352,118]]],ls={walking:[[321,69],[321,76],[322,92],[323,99],[328,104],[329,107],[324,107],[322,106],[321,102],[320,95],[319,87],[319,75],[321,69]],running:[[327,108],[334,115],[344,119],[357,119],[367,113],[366,109],[352,109],[337,108],[327,108]],cycling:[[358,74],[358,99],[362,104],[371,108],[378,102],[380,96],[380,74],[376,63],[370,59],[363,61],[358,67],[358,74]]};function nl(n,t,e){if(n<pe.minX||n>pe.maxX||t<pe.minZ||t>pe.maxZ)return e;let i=(Math.sin(n*1.2+t*.65)+Math.cos(t*.8-n*.4))*.026,r=Math.min(Cn(n,t,342,85,13.8,17.8),Cn(n,t,337,92,8.8,10.2)),s=Cn(n,t,369,88,8.8,15.5),o=Cn(n,t,370,88,3.5,6)<=1+i,a=Cn(n,t,356,88,11.5,4.5),l=Math.min(r,a,o?1/0:s)-i;return l<.8?18:l<=1?21:l<1.13?24:e}var fd=(n,t,e,i,r,s)=>{let o=r-e,a=s-i,l=Math.max(0,Math.min(1,((n-e)*o+(t-i)*a)/(o*o+a*a)));return(n-e-l*o)**2+(t-i-l*a)**2};function zn(n,t,e,i=6){for(let r=1;r<t.length;r++){let[s,o]=t[r-1],[a,l]=t[r];for(let f=Math.floor(Math.min(s,a)-e);f<=Math.max(s,a)+e;f++)for(let c=Math.floor(Math.min(o,l)-e);c<=Math.max(o,l)+e;c++){let h=n.surfaceAt(f,c);h<25||fd(f,c,s,o,a,l)>e**2||n.fill(f,h-1,c,f,25,c,i)}}}function Pi(n,t,e,i,r=2){if(n.get(t,25,e)===1){n.fill(t,26,e,t,25+i,e,4);for(let s=i-1;s<=i+1;s++)n.disc(t,26+s,e,s===i-1?r-.45:r,5);n.set(t,28+i,e,5)}}function hd(n){n.fill(316,25,54,333,25,61,9);for(let s of[54,62])n.fill(318,26,s,319,30,s,9),n.fill(320,26,s,320,29,s,4);n.fill(317,30,54,321,30,62,9),n.fill(318,31,55,320,31,61,3);let{minX:t,maxX:e,minZ:i,maxZ:r}=It.flowerClock;n.fill(t-1,25,i-1,e,25,r,9),n.fill(t,26,i,e-1,26,r-1,5),n.fill(332,27,i,e-1,27,r-1,5)}function ud(n){n.fill(339,25,64,343,25,72,7);for(let r of[68,71])for(let s of[339,343])n.fill(s,n.surfaceAt(s,r)-1,r,s,26,r,4);n.fill(339,26,72,343,26,72,4);for(let r of[339,343])n.fill(r,26,69,r,26,72,4);let{rails:t,fromZ:e,toZ:i}=It.bridge;for(let r=e-2;r<=i+1;r++){for(let s=357;s<=359;s++)n.fill(s,24,r,s,25,r,9);if(r>=e&&r<i)for(let s of t)n.set(s,26,r,9)}for(let r of[e+1,i-2])for(let s of t)n.fill(s,n.surfaceAt(s,r)-1,r,s,27,r,9);for(let r=69;r<=103;r++)for(let s=327;s<=378;s++)n.surfaceAt(s,r)!==25||n.get(s,25,r)||(s<356?n.set(s,24,r,(s*3+r*5)%7<2?3:6):(n.set(s,24,r,2),(s+r*3)%5<2&&n.set(s,25,r,5)))}function dd(n){for(let[t,e,i,r]of[[321,49,6,2],[326,49,5,2],[338,52,6,2],[345,52,5,2],[352,52,6,2],[359,49,5,2],[317,73,7,2],[318,81,6,2],[325,84,5,2],[317,89,6,2],[318,101,7,2],[321,113,6,2],[328,117,7,2],[338,120,5,2],[363,120,6,2],[376,115,5,2],[371,86,5,2],[369,90,5,2],[376,69,5,2],[374,51,6,2],[379,49,5,2]])Pi(n,t,e,i,r);for(let t=324;t<=330;t+=3)for(let e of[99,105,113])n.get(t,25,e)===1&&Pi(n,t,e,4,2);for(let[t,e,i]of[[326,96,5],[327,102,5],[332,107,5],[331,111,6],[333,115,5]])Pi(n,t,e,i,2.4);for(let[t,e,i]of[[334,70,5],[349,66,6],[352,102,6],[364,76,5],[374,100,6]])if(Pi(n,t,e,i,2.6),n.get(t,26,e)===4)for(let[r,s]of[[-2,0],[2,0],[0,2]])n.set(t+r,25+i,e+s,5),n.set(t+r,24+i,e+s,5);for(let t=363;t<=372;t+=2)for(let e=47;e<=54;e++)n.set(t,25,e,2),(e+t)%3!==1&&n.set(t,26,e,12);for(let t of[372,377])for(let e of[110,113])n.fill(t,26,e,t,29,e,4);n.fill(371,29,109,378,29,114,9),n.fill(372,30,110,377,30,113,4),n.fill(372,25,110,377,25,113,7);for(let[t,e]of[[333,72],[347,62],[345,114],[363,120]])n.surfaceAt(t,e)===26&&n.fill(t-1,26,e,t+1,26,e,7)}function il(n){for(let t=pe.minX;t<=pe.maxX;t++)for(let e=pe.minZ;e<=pe.maxZ;e++){let i=n.surfaceAt(t,e);i>=25&&n.set(t,i-1,e,1)}zn(n,ld,1.45);for(let t of cd)zn(n,t,1.35);zn(n,ls.walking,1.2),zn(n,ls.running,1.4,8),zn(n,ls.cycling,1.35,3),hd(n),ud(n),dd(n)}var pd=[[173,216],[234,249],[259,267],[284,289],[308,293],[338,291],[357,299]];function md(n,t){for(let e=1;e<n.length;e++){let[i,r]=n[e-1],[s,o]=n[e];if(t<=s)return Math.round(r+(o-r)*(t-i)/(s-i))}return n.at(-1)[1]}function Jt(n){return n<=234?Math.ceil(ln(n))+2:md(pd,n)}function sl(n,t){if(t<174||t>357)return!1;let e=Jt(t);return n>=e&&n<=e+(t<214?3:10)}var De={palace:{x:340,z:334,rx:23,rz:19,top:52},arena:{x:326,z:294,rx:21,rz:15,top:43},arrival:{x:377.5,y:26,z:303.5,name:"\u4E2D\u534E\u827A\u672F\u5BAB \xB7 \u4E16\u535A\u56ED",viewTarget:{x:340,y:39,z:334}},concert:{x:326.5,y:26,z:310.5,name:"\u6885\u8D5B\u5FB7\u65AF-\u5954\u9A70\u6587\u5316\u4E2D\u5FC3",viewTarget:{x:326,y:31,z:294}},river:{x:296.5,y:26,z:315.5,name:"\u4E16\u535A\u6EE8\u6C5F \xB7 \u4E09\u9053",viewTarget:{x:286,y:25,z:291}},bicycle:{x:302.5,z:316.5},bounds:{minX:215,maxX:394,minZ:173,maxZ:357},signs:[[215.5,28.6,174.5,"\u6D66\u4E1C\u6EE8\u6C5F \xB7 \u5357\u884C\uFF1A\u5357\u6D66\u5927\u6865 / \u4E16\u535A\u56ED"],[244.5,28.7,218.5,"\u4E16\u535A\u6EE8\u6C5F \xB7 \u6F2B\u6B65\u9053 / \u8DD1\u6B65\u9053 / \u9A91\u884C\u9053"],[298.5,28.6,314.5,"\u4E16\u535A\u56ED \xB7 \u5411\u4E1C\uFF1A\u4E2D\u534E\u827A\u672F\u5BAB"],[304.5,28.4,271.5,"\u6D66\u4E1C\u5357\u6BB5 \xB7 \u5858\u6865 / \u5357\u7801\u5934"],[276.5,29,246.5,"\u5357\u7801\u5934 \xB7 \u6EE8\u6C5F\u827A\u672F\u4ED3"],[326.5,29.5,308.5,"\u6885\u8D5B\u5FB7\u65AF-\u5954\u9A70\u6587\u5316\u4E2D\u5FC3 \xB7 \u5357\u5165\u53E3"],[332.5,30,319.5,"\u4E2D\u534E\u827A\u672F\u5BAB \xB7 2010 \u4E0A\u6D77\u4E16\u535A\u4F1A\u4E2D\u56FD\u9986"],[309.5,29,326.5,"\u4E16\u535A\u8F74 \xB7 \u4E16\u535A\u6E90\u4E0E\u9633\u5149\u8C37"],[319.5,30.3,350.5,"\u4E2D\u534E\u827A\u672F\u5BAB\u7AD9 \xB7 \u5730\u94C1 8 \u53F7\u7EBF \xB7 3\u53F7\u53E3\u5730\u9762\u6807\u8BC6"]]};var cs=-224,ol=Array.from({length:582},(n,t)=>{let e=t+cs;return e<=234?Math.floor(ln(e))+2:Jt(e)}),rl=(n,t,e,i=0)=>Math.abs(n-e.x)<=e.rx+i&&Math.abs(t-e.z)<=e.rz+i;function al(n,t,e){return t>=25&&e>=235&&e<=357&&(n>=Jt(e)&&n<=Jt(e)+10||rl(n,e,De.palace,2)||rl(n,e,De.arena,2))}function gd(n){for(let t=174;t<=357;t++){let e=Jt(t),i=Jt(t-1),r=(t<214?3:10)+Math.max(0,i-e);for(let o=0;o<=r;o++){let a=e+o;t<=234&&n.get(a,25,t)===0&&n.fill(a,21,t,a,24,t,3);let l=o===0?3:o<=3?9:o<=5?8:o===6||o===10?1:3;n.set(a,25,t,o===8&&t%7<2?9:l)}let s=Jt(t+1);t>=179&&(t<195||t>213)&&(t<340||t>344)&&t!==357&&(n.fill(e,26,t,Math.max(e,s-1),26,t,9),t%12===2&&(n.fill(e,27,t,e,28,t,3),n.set(e,29,t,12)))}}function xd(n){let{x:t,z:e}=De.palace;n.fill(t-23,25,e-20,t+23,25,e+20,9);for(let i of[-9,9])for(let r of[-7,7])n.fill(t+i-2,26,e+r-2,t+i+2,39,e+r+2,8),n.fill(t+i,27,e+r-2,t+i,36,e+r-2,3),n.fill(t+i,27,e+r+2,t+i,36,e+r+2,3);for(let[i,r,s]of[[37,11,9],[39,13,11],[41,15,13],[43,17,15],[45,19,16],[47,21,18],[49,23,19]]){n.fill(t-r+1,i+1,e-s+1,t+r-1,i+1,e+s-1,3);for(let o of[-9,-5,-1,4,8])n.fill(t+o,i,e-s,t+o+1,i+1,e+s,8);for(let o of[-7,-3,2,6])n.fill(t-r,i,e+o,t+r,i+1,e+o+1,8);for(let o of[-1,1])n.fill(t-r,i+1,e+o*s,t+r,i+1,e+o*s,8),n.fill(t+o*r,i+1,e-s,t+o*r,i+1,e+s,8)}n.fill(t-23,51,e-19,t+23,51,e+19,8),n.fill(t-18,52,e-15,t+18,52,e+15,3);for(let i of[-16,0,16])n.fill(t+i,26,e-22,t+i,34,e-22,9),n.fill(t+i+1,32,e-22,t+i+4,34,e-22,8),n.set(t+i+1,34,e-22,12);n.fill(t-19,25,e-1,t+7,25,e+1,6)}function yd(n){let{x:t,z:e,rx:i,rz:r}=De.arena;for(let[s,o,a]of[[26,.78,3],[27,.82,3],[28,.85,3],[29,.9,3],[30,.94,3],[31,.97,3],[32,1,9],[33,1,11],[34,1,11],[35,1,9],[36,.99,9],[37,.96,9],[38,.9,9],[39,.82,9],[40,.7,9],[41,.53,9],[42,.31,9]]){let l=i*o,f=r*o;for(let c=-Math.floor(l);c<=l;c++)for(let h=-Math.floor(f);h<=f;h++){if((c/l)**2+(h/f)**2>1)continue;let d=(c/(l-1.7))**2+(h/(f-1.7))**2;(s>=39||d>1)&&n.set(t+c,s,e+h,a)}}for(let s=-16;s<=16;s++)for(let o=-12;o<=12;o++){let a=Math.hypot(s/16,o/12);if(a>1)continue;n.set(t+s,25,e+o,6);let l=Math.abs(s)<=2&&o>0;if(a<.56||l||o<-6&&Math.abs(s)<=8)continue;let f=Math.min(5,Math.floor((a-.56)*13));f&&n.fill(t+s,26,e+o,t+s,25+f,e+o,Math.abs(o)<=1?9:7)}n.fill(t-2,26,e+7,t+2,29,e+15,0),n.fill(t-2,25,e+8,t+2,25,e+17,9),n.fill(t-7,26,e-8,t+7,27,e-4,3),n.fill(t-6,28,e-8,t+6,32,e-8,11),n.fill(t-5,30,e-7,t+5,31,e-7,12),n.fill(t-2,35,e-2,t+2,37,e+2,3);for(let s of[-1,1])n.fill(t-1,36,e+2*s,t+1,36,e+2*s,12),n.fill(t+2*s,36,e-1,t+2*s,36,e+1,12)}function _d(n){for(let t=314;t<=351;t++)n.fill(Jt(t)+10,25,t,308,25,t,9);n.fill(302,25,314,310,25,351,9);for(let t of[319,345])for(let e=0;e<4;e++){let i=1+e,r=26+e*2;for(let s of[-1,1])n.fill(309-i,r,t+s*i,309+i,r+1,t+s*i,11),n.fill(309+s*i,r,t-i,309+s*i,r+1,t+i,11)}for(let t of[316,322])n.fill(t,26,351,t,28,352,9);n.fill(316,29,351,322,29,352,11),n.fill(315,25,348,323,25,355,9);for(let[t,e]of[[305,333],[314,355]]){n.fill(t-2,25,e-2,t+2,25,e+2,9);for(let i of[-2,2])for(let r of[-2,2])n.fill(t+i,26,e+r,t+i,28,e+r,3);n.fill(t-2,29,e-2,t+2,29,e+2,9)}}function Md(n){for(let[t,e,i,r]of[[371,325,6,4],[368,345,7,4]]){n.fill(t,25,e,t+i,25,e+r,9),n.fill(t,29,e,t+i,29,e+r,9),n.fill(t+1,30,e+1,t+i-1,30,e+r-1,3);for(let s of[0,i])n.fill(t+s,26,e,t+s,28,e+r,9);n.fill(t,26,e,t+i,28,e,11)}for(let[t,e]of[[304,327],[304,341],[372,319],[375,338]])n.fill(t,26,e,t,29,e,4),n.fill(t-1,29,e-1,t+1,30,e+1,5),n.set(t,31,e,5)}var vd=[[330,234,6,4,15],[345,234,5,4,18],[377,233,7,4,13],[333,259,7,5,12],[350,260,4,4,16],[378,258,7,5,11],[352,283,5,4,12],[380,282,8,5,8],[327,220,5,3,10],[345,220,5,3,12],[375,217,6,4,10],[322,241,4,3,8],[347,244,4,2,7],[370,243,5,3,11],[324,265,4,3,7],[371,265,4,2,8],[289,233,6,4,11],[299,256,5,5,12],[307,286,5,3,8],[380,319,6,3,10],[387,330,5,4,13],[385,348,6,4,9]],bd=[[331,-114,6,4,11],[354,-106,7,5,14],[369,-89,5,4,17],[394,-63,4,5,13],[337,-39,6,4,14],[352,-43,5,5,19],[370,-22,5,4,11],[395,-21,3,5,16],[331,12,5,5,15],[350,16,7,5,14],[373,20,6,4,17],[391,23,5,5,12],[340,34,6,3,10],[369,34,5,4,11],[391,56,4,5,15],[392,87,4,5,12],[391,113,4,5,17],[335,143,6,5,16],[354,142,7,4,12],[377,143,6,4,15],[391,153,4,4,11],[329,166,5,4,16],[345,168,6,5,18],[371,171,7,5,13],[389,182,5,5,14],[329,192,5,4,12],[354,198,5,4,14],[373,198,6,5,12]];function Sd(n,t,e,i,r,s,o,a){let l=25+o,f=a===1,c=f?8:9;for(let h=e-r-1;h<=e+r+1;h++)for(let u=i-s-1;u<=i+s+1;u++)if(t(h,u)&&!ca(h,u,2)||!n.get(h,25,u)||n.get(h,26,u)||n.get(h,28,u)||Math.abs(h-e)<=r&&Math.abs(u-i)<=s&&n.get(h,25,u)===3)return;n.fill(e-r,25,i-s,e+r,25,i+s,9),n.fill(e-r,26,i-s,e+r,l,i+s,c),n.fill(e-r+1,l+1,i-s+1,e+r-1,l+1,i+s-1,a===2?9:3);for(let h=28;h<l-1;h+=3)for(let u of[-1,1]){for(let d=1-r;d<r-1;d+=3)n.fill(e+d,h,i+u*s,e+d+1,h+1,i+u*s,11),a===0&&h>29&&d%2===0&&n.fill(e+d,h-1,i+u*(s+1),e+d+1,h-1,i+u*(s+1),9);for(let d=1-s;d<s;d+=3)n.set(e+u*r,h,i+d,11);f&&n.fill(e-r,h-1,i+u*s,e+r,h-1,i+u*s,9)}if(a===2){n.fill(e-r,26,i+s,e+r,28,i+s,11);for(let h of[-r,0,r])n.fill(e+h,26,i+s,e+h,29,i+s,3);n.fill(e-r,29,i+s,e+r,29,i+s+1,9)}if(f)for(let h=1-s;h<s;h++){let u=l+s-Math.abs(h);n.fill(e-r+1,l+1,i+h,e+r-1,u,i+h,8)}}function Ed(n,t){let e=It.bounds;n.fill(e.minX-3,25,e.minZ-3,e.maxX+3,25,e.minZ-2,3),n.fill(e.minX-3,25,e.maxZ+2,e.maxX+3,25,e.maxZ+3,3),n.fill(e.minX-3,25,e.minZ-2,e.minX-2,25,e.maxZ+2,3),n.fill(e.maxX+2,25,e.minZ-2,e.maxX+3,25,e.maxZ+2,3);for(let[s,o]of[...vd,...bd].entries())Sd(n,t,...o,s%3);let i=276,r=239;n.fill(i-5,25,r-6,i+5,25,r+6,9);for(let s of[-4,0,4])n.fill(i-3,26,r+s-1,i+3,34,r+s+1,3),n.fill(i-4,34,r+s-1,i+4,35,r+s+1,9);n.fill(i-4,30,r-6,i-4,32,r+6,11),n.fill(i-5,33,r-6,i-3,33,r+6,9),n.fill(i+3,36,r-5,i+3,39,r-4,8)}function ll(n,t){gd(n),n.fill(298,25,311,325,25,318,9),n.fill(310,25,317,316,25,348,9),n.fill(325,25,305,332,25,318,9),n.fill(310,25,346,320,25,360,9),xd(n),yd(n),_d(n),Md(n),Ed(n,t);for(let e=311;e<=315;e++){let i=Jt(e)+5;n.set(i,25,e,8)}}var cl=[{left:-261,right:-247,back:5,front:7,doors:[-258,-250],accent:9},{left:-244,right:-229,back:1,front:7,doors:[-241,-232],accent:3},{left:-226,right:-215,back:1,front:7,doors:[-222],accent:9}],fl={bounds:{minX:-276,maxX:-215,minZ:1,maxZ:48},exhibition:{minX:-276,maxX:-246,minZ:20,maxZ:48},spire:{x:-268+.5,y:59.95,z:36+.5},arrival:{x:-268+.5,y:26,z:22.5,name:"\u4E0A\u6D77\u5C55\u89C8\u4E2D\u5FC3",viewTarget:{x:-268+.5,y:39,z:36+.5}},signs:[[-268+.5,33.5,29-2.15,"\u4E0A\u6D77\u5C55\u89C8\u4E2D\u5FC3"],[-237.5,30.65,8.85,"\u6052\u9686\u5E7F\u573A"]]};function Td(n){n.fill(-276,25,20,-262,25,32,9),n.fill(-270,25,20,-266,25,35,6);for(let a of[-1,1]){let l=-268+a*5;n.fill(l-1,25,22,l+1,25,25,1),n.set(l,26,23,5),n.set(l,26,24,5)}n.fill(-275,26,32,-262,35,41,9),n.fill(-273,26,32,-264,31,39,0),n.fill(-270,25,32,-266,25,39,6),n.fill(-274,32,28,-262,33,32,9),n.fill(-275,34,27,-262,34,41,9),n.fill(-274,35,29,-263,35,40,6);for(let a of[-274,-272,-264,-262])n.fill(a,26,29,a,31,29,9),n.set(a,26,28,6),n.set(a,31,28,6);for(let a of[-274,-272,-264,-262])n.fill(a,28,32,a,30,32,3);n.fill(-271,36,30,-265,36,33,9),n.fill(-270,37,31,-266,37,33,6);let i=-276,r=-246,s=35,o=48;n.fill(i,25,s,r,25,o,9),n.fill(i,26,42,r,31,o,9),n.fill(-261,26,s,r,31,41,9),n.fill(i,32,42,r,32,o,6),n.fill(-261,32,s,r,32,41,6);for(let a=-260;a<r;a+=3)n.fill(a,27,s,a,29,s,3);for(let a=i+2;a<r;a+=3)n.fill(a,27,o,a,29,o,3);for(let a of[i+2,r-2])n.fill(a-1,32,44,a+1,34,46,9),n.fill(a-1,35,44,a+1,35,46,7),n.set(a,36,45,7);n.fill(-271,36,33,-265,40,39,9),n.fill(-270,41,34,-266,45,38,9);for(let a of[34,38])for(let l of[-269,-267])n.fill(l,42,a,l,44,a,3);n.fill(-271,45,33,-265,45,39,6),n.fill(-270,46,34,-266,47,38,7),n.fill(-269,48,35,-267,49,37,7),n.fill(-268,50,36,-268,58,36,7)}function Ad(n,{left:t,right:e,back:i,front:r,doors:s,accent:o}){n.fill(t,25,i,e,25,r+1,9),n.fill(t,26,i,e,30,r,9),n.fill(t+1,26,i+1,e-1,29,r-1,0),n.fill(t,31,i,e,31,r-1,o);for(let a=t+1;a<e;a++){if(s.includes(a)){n.fill(a-1,26,r-1,a,28,r,0);continue}s.includes(a+1)||(a-t)%4===0&&!s.includes(a-1)||n.fill(a,27,r,a,29,r,11)}for(let a of s)n.fill(a-2,29,r+1,a+1,29,r+1,o)}function hl(n){Td(n);for(let t of cl)Ad(n,t)}var x2=cl.flatMap(({doors:n,front:t})=>n.map(e=>[e,t+2]));var wd=[{wall:8,stone:6,roof:3,awning:7},{wall:9,stone:6,roof:3,awning:8},{wall:6,stone:9,roof:8,awning:4}];function Rd(n,t,e,i,r,s,o){let{wall:a,stone:l,awning:f}=o;for(let c=t;c<=e;c++){let h=c-t,u=c===e||h%4===0;if(n.fill(c,26,i,c,r,i,u?l:a),!u){h%4===2&&c<=e-2?(n.fill(c,26,i,c,28,i,4),n.set(c,29,i,9)):n.fill(c,27,i,c,29,i,11);for(let d=32;d+2<r;d+=4)n.set(c,d,i,l),h%4!==3&&n.fill(c,d+1,i,c,d+2,i,11)}}n.fill(t,30,i+s,e,30,i+s,l),n.fill(t,r,i+s,e,r,i+s,l);for(let c=t+1;c+2<e;c+=8)n.fill(c,29,i+s,c+2,29,i+s,f),n.set(c+1,29,i+s,l)}function In(n,[t,e,i,r,s,o]){let a=wd[o],l=Math.sign(r-i),f=Math.min(i,r),c=Math.max(i,r);n.fill(t,25,f,e,25,c,9),n.fill(t,26,f,e,s,c,a.wall);for(let h=27;h<s-2;h+=4)for(let u of[t,e])for(let d=f+2;d<=c-2;d+=3)n.fill(u,h,d,u,h+1,d,11);for(let h=t+2;h<=e-2;h+=3)n.fill(h,28,i,h,29,i,11);Rd(n,t,e,r,s,l,a),n.fill(t,s,f,e,s,c,a.stone),n.fill(t+1,s+1,f+1,e-1,s+1,c-1,a.roof),o!==1&&c-f>=5&&n.fill(t+2,s+2,f+2,e-2,s+2,c-2,a.roof),o===1&&n.fill(t+2,s+2,f+1,t+3,s+2,f+1,3)}function Li([n,t,e,i]){let r=Math.sign(i-e),s=(t-n+1)/2;return{x:n+s,y:28.65,z:i+(r>0?1.42:-.42),radiusSq:s**2+12,strength:.94}}var ul=[[-193,-183,3,7,35,0],[-182,-173,0,7,36,1],[-167,-159,3,7,37,2],[-158,-148,3,6,34,0],[-147,-132,3,7,36,1],[-126,-116,3,7,35,0],[-115,-103,3,6,37,2],[-102,-91,3,7,36,1],[-85,-75,3,7,34,0],[-74,-63,1,7,36,2],[-57,-46,3,7,37,1],[-45,-37,1,7,35,0],[-36,-31,3,7,34,2],[-198,-186,29,21,36,1],[-174,-163,29,21,35,0],[-157,-145,28,21,37,2],[-144,-132,29,22,36,1],[-131,-115,29,21,35,0],[-108,-96,28,21,36,1],[-85,-74,29,21,37,2],[-73,-68,29,21,34,0],[-51,-38,24,21,35,1]],zd={minX:-202,maxX:-31,minZ:-22,maxZ:40,minY:25,maxY:39},Id=[-196,-170,-129,-88,-60],Pd=[-160,-110,-88,-54],Ld=n=>Math.ceil(Pt(n)+Lt(n))+2;function Dd(n,t,e){n.fill(t,25,e-1,t,25,e+1,1),n.fill(t,26,e,t,29,e,4),n.disc(t,29,e,1,5),n.disc(t,30,e,2,5),n.disc(t,31,e,1,5)}function dl(n,t){for(let e=-201;e<=-31;e++)for(let i of[8,9,10,18,19,20]){let r=n.get(e,25,i);r&&r!==3&&!t(e,i)&&!n.get(e,26,i)&&n.set(e,25,i,9)}for(let e of ul)In(n,e);for(let e of Id)for(let i=e-1;i<=e+1;i++)n.fill(i,25,Ld(i),i,25,8,9);for(let e of Pd)n.fill(e-1,25,19,e+1,25,39,9);for(let[e,i]of[[-200,6],[-93,22],[-57,21]])Dd(n,e,i)}var S2=ul.map(Li),E2={...zd,minZ:5,maxZ:24,maxY:31};var gl=[[-156,-152,86,93,34,0],[-140,-135,86,93,36,1],[-117,-110,86,93,35,2],[-91,-83,86,93,34,1],[-26,-22,87,93,33,0],[-180,-175,112,106,34,0],[-160,-152,113,105,35,1],[-137,-129,112,105,33,2],[-117,-112,112,105,34,0],[-94,-91,111,106,33,2],[-86,-83,111,105,33,0],[-21,-15,111,105,36,1],[-117,-112,116,120,34,0],[-108,-100,117,121,35,2],[-99,-91,116,120,34,1],[-86,-78,116,120,36,0],[-77,-72,117,121,33,2],[-67,-61,116,120,35,1],[-60,-54,116,120,33,0],[-49,-38,116,121,36,2],[-33,-20,116,120,34,0],[-116,-112,137,132,34,1],[-108,-100,137,132,35,0],[-99,-91,137,133,34,2],[-86,-78,137,132,33,0],[-77,-72,137,132,35,1],[-67,-60,137,133,34,2],[-59,-56,137,132,33,0],[-52,-44,137,132,35,1],[-40,-33,137,133,34,0],[-29,-20,137,132,36,2]],xl=[[-116,-112,156,160,34,0],[-94,-90,156,160,34,2],[-67,-56,155,160,35,0],[-52,-44,156,160,34,2],[-40,-33,156,160,33,0],[-16,-7,156,160,35,2],[-3,6,156,160,34,0],[9,16,156,160,33,2],[-116,-112,173,168,33,2],[-94,-90,173,168,34,0],[-67,-56,173,168,34,2],[-52,-44,173,168,35,0],[-40,-33,173,168,33,0],[-29,-19,173,168,34,2],[-16,-7,173,168,34,0],[-3,6,173,168,35,2],[9,16,173,168,34,0]];var pl={minX:-116,maxX:48},Nd={minX:-180,maxX:48,minZ:86,maxZ:173,minY:25,maxY:40},Ud=[-110,-88,-69,-51,-35],ml=[-110,-88,-69,-54,-42,-31];function Od(n,t,e,i,r,s){let o=Math.sign(r-i),a=Math.floor((t+e)/2);n.fill(t,31,r,e,s,r,9);for(let l=t+1;l<e;l+=3)n.fill(l,32,r,l,s-1,r,11),n.set(l,s-1,r,6);for(let l of[t,e])n.fill(l,26,r,l,s,r,6),n.fill(l,30,r+o,l,s,r+o,9);n.fill(a,26,r,a,29,r,3),n.fill(a-1,30,r+o,a+1,31,r+o,6),n.fill(t,s,r+o,e,s,r+o,6),n.fill(t,s+1,r,e,s+1,r,9)}function Fd(n,t,e,i,r,s){let o=Math.sign(r-i),a=Math.floor((t+e)/2);n.fill(t,30,r,e,s,r,8);for(let h=t+1;h<e-1;h+=4)n.fill(h,32,r,h+1,s-1,r,11),n.fill(h,31,r+o,h+1,31,r+o,6);n.fill(t,s,r+o,e,s,r+o,8);let l=Math.min(3,Math.floor((e-t)/2)),f=Math.min(r,r-o),c=Math.max(r,r-o);n.fill(a-l,s+1,f,a+l,s+1,c,8),n.fill(a-l+1,s+2,f,a+l-1,s+2,c,8),n.set(a,s+3,r,6)}function Bd(n,[t,e,i,r,s,o]){let a=Math.sign(r-i),l=Math.floor((t+e)/2),f=o===0?4:8;n.fill(t+1,27,r,e-1,29,r,11),n.fill(l,26,r,l,29,r,4),n.fill(t,30,r+a,e,30,r+a,f),n.fill(t,30,r,e,30,r,7),n.fill(t+1,s+1,r,e-1,s+1,r,3)}function kd(n){n.fill(-137,35,105,-129,35,105,9),n.fill(-135,36,105,-131,37,106,9),n.fill(-134,38,105,-132,38,106,6),n.fill(-136,30,105,-135,34,105,9),n.fill(-131,30,105,-130,34,105,9),n.fill(-85,37,119,-79,37,120,8),n.fill(-84,38,119,-80,38,120,8),n.fill(-83,39,119,-81,39,120,8),n.fill(-82,40,119,-82,40,120,9),n.fill(-85,32,120,-79,32,120,6)}function fs(n,t,e,i,r=9){let s=n.get(t,25,e);s&&s!==3&&!i(t,e)&&!n.get(t,26,e)&&n.set(t,25,e,r)}function yl(n,t){for(let e of gl){In(n,e);let[i,r,s,o,a]=e;(o<110?Od:Fd)(n,i,r,s,o,a)}kd(n);for(let[e,i,r,s,o,a]of xl){let l=[e,i,r,s,o-2,a];In(n,l),Bd(n,l)}for(let e=pl.minX;e<=pl.maxX;e++)for(let i=161;i<=167;i++)fs(n,e,i,t,i===164?6:9);for(let[e,i,r]of[[Ud,104,122],[ml,131,137]])for(let s of e)for(let o=s-1;o<=s+1;o++)for(let a=i;a<=r;a++)fs(n,o,a,t);for(let e of ml)for(let i=e-1;i<=e+1;i++)for(let r=138;r<=160;r++)fs(n,i,r,t)}var R2=[...gl,...xl].map(Li),C2={...Nd,minZ:88,maxZ:173,maxY:31};var Kt={west:-226,east:-211,north:-79,south:-49,top:47},en={west:-246,east:-227,north:-73,south:-55},G={x:-201,north:-42,south:-17,half:2},Hd=[{z:-63,y:42,cells:[[0,0],[1,0],[0,1],[1,1],[2,1],[0,2],[1,2],[1,-1]]},{z:-55,y:39,cells:[[0,0],[1,0],[0,1],[1,1],[1,-1],[2,1]]},{z:-65,y:33,cells:[[0,0],[1,0],[1,1]]},{z:-75,y:37,cells:[[0,0],[0,1]]},{z:-70,y:41,cells:[[0,0]]},{z:-58,y:34,cells:[[0,0]]}],_l={bounds:{minX:en.west,maxX:G.x+G.half,minZ:Kt.north,maxZ:G.south},warehouse:Kt,bridge:G,arrival:{x:-241.5,y:26,z:-65.5,mapX:-219,mapZ:-63,name:"\u56DB\u884C\u4ED3\u5E93 \xB7 \u664B\u5143\u7EAA\u5FF5\u5E7F\u573A",viewTarget:{x:-225.9,y:35,z:-63}},signs:[[-216.5,29,-44.5,"\u5149\u590D\u8DEF \xB7 \u56DB\u884C\u4ED3\u5E93\u5357\u5165\u53E3"]]};function Ml(n,t,e){return n>=Kt.west&&n<=Kt.east&&e>=Kt.north&&e<=Kt.south&&t>=25&&t<=Kt.top+2||Math.abs(n-G.x)<=G.half&&e>=G.north&&e<=G.south&&t>=25&&t<=27}function Gd(n){let{west:t,east:e,north:i,south:r,top:s}=Kt;n.fill(t,25,i,e,s,r,9),n.fill(t+1,26,i+1,e-1,31,r-1,0),n.fill(t+1,25,i+1,e-1,25,r-1,3);for(let o of[27,32,36,40,44]){for(let a of[-224,-221,-218,-215])for(let l of[i,r])n.fill(a,o,l,a+1,o+1,l,11),n.fill(a,o+2,l,a+1,o+2,l,6);if(o>30)for(let a of[-76,-72,-68,-64,-60,-56,-52])n.fill(e,o,a,e,o+1,a+1,11)}for(let o of[-225,-222,-219,-216,-213])n.fill(o,26,r,o,45,r,6);n.fill(-220,26,r,-218,29,r,0),n.fill(-222,30,r,-216,31,r,6),n.fill(t,46,r,e,46,r,6),n.fill(t,s+1,i,e,s+1,i,3),n.fill(t,s+1,r,e,s+1,r,3);for(let o of[t,e])n.fill(o,s+1,i,o,s+1,r,3);n.fill(-223,46,i+3,-215,s+2,r-3,9),n.fill(t+1,47,i,t+1,47,r,6);for(let{z:o,y:a,cells:l}of Hd)for(let[f,c]of l)n.set(t,a+c,o+f,0),n.set(t+1,a+c,o+f,8);n.fill(t,26,-67,t,29,-65,0),n.fill(-225,26,-77,-222,26,-77,7),n.fill(-217,26,-77,-214,26,-77,7)}function vl(n){Gd(n);for(let t=en.west;t<=G.x+2;t++){let e=Math.ceil(Pt(t)-Lt(t))-1,i=t<=en.east?en.south:e,r=t<=en.east?en.north:Kt.south+1;for(let s=r;s<=Math.min(e,i);s++)n.get(t,25,s)&&!n.get(t,26,s)&&n.set(t,25,s,s===-66?6:9)}n.fill(-241,26,-72,-236,27,-71,3),n.fill(G.x-G.half,25,G.north,G.x+G.half,25,G.south,9);for(let t of[-1,1]){let e=G.x+t*G.half;n.fill(e,26,G.north+1,e,26,G.south-1,3)}n.fill(G.x,20,-32,G.x,24,-31,3)}var Vd={west:118,east:136,north:334,south:346,floor:25};function bl(n){let{west:t,east:e,north:i,south:r,floor:s}=Vd,o=t+9;n.fill(t,s,i,e,s,r,1);for(let a=t;a<=e;a++)n.set(a,s+1,r,(a-t)%3===0?4:7),Math.abs(a-o)>1&&n.set(a,s+1,i,(a-t)%3===0?4:7);for(let a=i+1;a<r;a++)for(let l of[t,e])n.set(l,s+1,a,(a-i)%3===0?4:7);for(let a of[o-2,o+2])n.fill(a,s+1,i,a,s+2,i,4)}var Ne=rt.min,rn=rt.max,nn=rt.minZ,Pn=rn-Ne,hs=rn-nn,us=144;var me=16,Di=22.25;function ds(n,t,e,i,r,s=!1){n==="harbor"&&(i=i.map(([a,l,...f])=>[a+an.dx,l+an.dz,...f])),n==="cliff"&&(i=i.map(([a,l,...f])=>[a+157,l,...f])),n==="forest"&&(i=i.map(([a,l,...f])=>[a+157+lt.forest.dx,l+91+lt.forest.dz,...f]));let o=i.map(([a,l,f=0,c=1],h)=>({x:a+.5,y:r+f,z:l+.5,radius:c,stage:Math.floor(h/5)+1}));return{id:n,name:t,description:e,platforms:o,start:o[0],fallY:r-1.5,sprint:s,bounds:{x1:Math.min(...i.map(a=>a[0]))-2,x2:Math.max(...i.map(a=>a[0]))+2,z1:Math.min(...i.map(a=>a[1]))-2,z2:Math.max(...i.map(a=>a[1]))+2}}}var Ln=[ds("harbor","\u6D77\u6E2F\u6298\u7EBF","12 \u5173 \xB7 \u5BBD\u5E73\u53F0\u3001\u77ED\u957F\u95F4\u9694\u4E0E\u8F6C\u5F2F\uFF0C\u9002\u5408\u70ED\u8EAB\u3002",[[69,70],[72,70],[76,71,1],[79,74,1],[81,77,2],[85,78,2],[89,77,2],[91,73,1],[95,71,1],[98,73,2],[101,77,2],[105,79,3]],26),ds("forest","\u6797\u95F4\u8E0F\u53F6","24 \u5173 \xB7 \u5C0F\u5E73\u53F0\u3001\u4FA7\u8DF3\u548C\u9AD8\u4F4E\u843D\u5DEE\uFF0C\u6CBF\u6797\u51A0\u7ED5\u884C\u3002",[[158,161,0],[161,163,1],[165,164,1],[169,167,0],[171,171,1,0],[174,174,2],[178,175,2],[181,172,1,0],[184,169,2],[188,170,2],[191,174,3],[193,178,3,0],[190,182,2],[186,184,3],[183,188,4],[187,191,4],[191,194,4],[195,192,5],[198,188,5],[202,190,4],[205,194,5],[202,198,5],[198,202,6],[194,204,6]],45),ds("cliff","\u4E91\u7AEF\u75BE\u8DD1","30 \u5173 \xB7 \u7A84\u53F0\u3001\u8FDC\u8DF3\u548C\u6298\u8FD4\uFF1B\u8FDC\u8DF3\u9700\u8981\u6309\u4F4F Shift\u3002",[[185,49,0],[190,49,0,0],[194,50,1],[199,51,1],[203,54,1,0],[206,58,2],[210,61,2],[215,61,2],[219,64,3],[222,68,3],[219,72,3,0],[214,73,2],[209,74,2],[205,78,3],[201,81,3],[197,83,4],[193,86,4],[189,89,4],[185,92,4],[181,95,5],[177,98,5],[174,102,4],[178,105,4],[182,108,5],[187,109,5],[192,108,6],[196,112,6],[200,115,5],[204,119,6],[209,120,7]],52,!0)],ps=Ln[0].platforms;var Ut={yuyuan:Ke.arrival,waibaidu:{x:pt.x+5.2,y:26,z:pt.south-1,name:"\u5916\u767D\u6E21\u6865 \xB7 \u82CF\u5DDE\u6CB3\u53E3"},village:{x:75,y:26,z:329,name:"\u5976\u9F99\u6751"},gallery:{x:92,y:26,z:329,name:"\u6D82\u9E26\u8857"},tower:{x:126,y:26,z:54,name:"\u4E1C\u65B9\u660E\u73E0"},deck:{...qi.arrival,name:"\u4E1C\u65B9\u660E\u73E0 \xB7 \u73BB\u7483\u89C2\u666F\u5C42"},race:{...Ln[0].start,name:"\u6D77\u6E2F\u8DD1\u9177"},spring:{x:95,y:26,z:339,name:"\u5F39\u8DF3\u5E7F\u573A"},dock:{x:260.5,y:23,z:228.5,name:"\u6F5C\u6C34\u8865\u7ED9\u7AD9"},reef:{x:284,y:9,z:287,name:"\u73CA\u745A\u82B1\u56ED"},temple:{x:273.5,y:9,z:301.5,name:"\u6D77\u5E95\u795E\u6BBF"},forest:lt.forest.arrival,mountain:lt.mountain.arrival,outer:lt.outer.arrival,desert:{x:65,y:29,z:230,name:"\u91D1\u6C99\u5C9B"},shanghai:{x:E.shanghai.x,y:26,z:E.shanghai.z-3,name:"\u4E0A\u6D77\u4E2D\u5FC3\u5927\u53A6"},towerOffice:{x:E.shanghai.x,y:46,z:E.shanghai.z-3,name:"\u4E0A\u6D77\u4E2D\u5FC3 \xB7 \u529E\u516C\u5C42"},duoyun:{x:E.shanghai.x,y:66,z:E.shanghai.z-3,name:"52F \xB7 \u6735\u4E91\u4E66\u9662"},skyGarden:{x:E.shanghai.x,y:86,z:E.shanghai.z+4,name:"\u4E0A\u6D77\u4E2D\u5FC3 \xB7 \u7A7A\u4E2D\u82B1\u56ED"},skyDeck:{x:E.shanghai.x,y:136,z:E.shanghai.z,name:"\u4E0A\u6D77\u4E2D\u5FC3 \xB7 \u5DC5\u5CF0\u89C2\u666F\u53F0"},jinmao:{x:E.jinmao.x,y:26,z:E.jinmao.z+9,name:"\u91D1\u8302\u5927\u53A6"},jinmaoDeck:{x:E.jinmao.x,y:91,z:E.jinmao.z,name:"\u91D1\u8302 \xB7 \u89C2\u666F\u53F0"},swfc:{x:E.swfc.x+11,y:26,z:E.swfc.z,name:"\u73AF\u7403\u91D1\u878D\u4E2D\u5FC3"},swfcDeck:{x:E.swfc.x,y:104,z:E.swfc.z,name:"\u73AF\u7403 \xB7 \u4E91\u7AEF\u5929\u6865"},magnolia:{x:W.x+10.5,y:26,z:W.z+.5,name:"\u767D\u7389\u5170\u5E7F\u573A"},helipad:{x:W.x+4.5,y:83,z:W.z+4.5,name:"\u767D\u7389\u5170 \xB7 \u76F4\u5347\u673A\u5E73\u53F0"},northBund:{x:145.5,y:26,z:-130.5,name:"\u5317\u5916\u6EE9\u89C2\u666F\u70B9"},bund:{x:gi(84)-10.5,y:26,z:84.5,name:"\u5916\u6EE9\u89C2\u666F\u6B65\u9053"},nanpu:{x:236.5,y:31,z:206.5,name:"\u5357\u6D66\u98CE\u683C\u659C\u62C9\u6865"},bankStreet:{x:29.5,y:26,z:94.5,name:"\u5916\u6EE9\u4E07\u56FD\u5EFA\u7B51\u8857"},southPark:{x:195.5,y:26,z:48.5,name:"\u9646\u5BB6\u5634\u4E2D\u5FC3\u7EFF\u5730"},survivalCamp:{x:130.5,y:26,z:309.5,name:"\u751F\u5B58\u8425\u5730"}},ag={...E.shanghai,base:26};Ut.expo=De.arrival;Ut.expoRiver=De.river;Ut.centuryPark=It.arrival;Ut.xintiandi=Mn.arrival;Ut.wukang=dt.arrival;Ut.puxiResidences=On.arrival;Ut.fuxingPark=ki.arrival;Ut.jingan=Hn.arrival;Ut.exhibition=fl.arrival;Ut.sihang=_l.arrival;function ms(n,t){let e=Math.max(0,Math.min(1,(n-26)/110)),i=9*(1-.43*e),r=e*Math.PI*2/3;return i*(.87+.13*Math.cos((t-r)*3))}var lg=[{id:"village",name:"\u51FA\u53D1\u4E4B\u5149",x:78.5,y:27.5,z:327.5},{id:"gallery",name:"\u6D82\u9E26\u4E4B\u5149",x:93,y:27.5,z:329,requires:"paint"},{id:"forest",name:"\u68EE\u6797\u4E4B\u5149",x:63.5,y:30.5,z:339.5},{id:"deck",name:"\u4E91\u7AEF\u4E4B\u5149",...qi.crystal},{id:"race",name:"\u8DC3\u52A8\u4E4B\u5149",x:ps.at(-1).x,y:ps.at(-1).y+1.5,z:ps.at(-1).z}],Wd=[[65,230,27,28,0],...Object.values(lt).map(n=>[n.x,n.z,n.radius,n.peak,n.noiseOffset])],Ni=class{constructor({data:t,surface:e,generate:i=!0}={}){this.data=t??new Uint8Array(Pn*hs*us),this.surface=e??new Uint16Array(Pn*hs),i&&this.generate()}index(t,e,i){return(e*hs+i-nn)*Pn+t-Ne}valid(t,e,i){return t>=Ne&&i>=nn&&e>=0&&t<rn&&i<rn&&e<us}get(t,e,i){return this.valid(t,e,i)?this.data[this.index(t,e,i)]:0}set(t,e,i,r){return this.valid(t,e,i)?(this.data[this.index(t,e,i)]=r,!0):!1}ground(t,e){for(let i=us-1;i>=0;i--)if(this.get(t,i,e))return i+1;return 0}protected(t,e,i){return e===0||Ml(t,e,i)||al(t,e,i)||Gs(t,e,i)||e>=25&&(fi(t,i)||Fn(t,i))||Ns(t,e,i)||el(t,e,i)||Ka(t,e,i)||wa(t,e,i)||Js(t,e,i)||t>=113&&t<=139&&i>=29&&i<=56&&e>=25||t>=86&&t<=98&&i>=323&&i<=328&&e>=25||Ln.some(r=>t>=r.bounds.x1&&t<=r.bounds.x2&&i>=r.bounds.z1&&i<=r.bounds.z2&&e>=r.fallY-2)||t>=61&&t<=66&&i>=337&&i<=342&&e>=25||t>=94&&t<=97&&i>=338&&i<=341&&e>=25||t>=257&&t<=263&&i>=214&&i<=230&&e>=21||t>=262&&t<=278&&i>=292&&i<=308&&e>=6}surfaceAt(t,e){return this.valid(Math.floor(t),0,Math.floor(e))&&this.surface[(Math.floor(e)-nn)*Pn+Math.floor(t)-Ne]||1}fill(t,e,i,r,s,o,a){for(let l=t;l<=r;l++)for(let f=e;f<=s;f++)for(let c=i;c<=o;c++)this.set(l,f,c,a)}disc(t,e,i,r,s){for(let o=Math.ceil(t-r);o<=t+r;o++)for(let a=Math.ceil(i-r);a<=i+r;a++)Math.hypot(o-t,a-i)<=r&&this.set(o,e,a,s)}orb(t,e,i,r){for(let s=Math.floor(t-r);s<=Math.ceil(t+r);s++)for(let o=Math.floor(e-r);o<=Math.ceil(e+r);o++)for(let a=Math.floor(i-r);a<=Math.ceil(i+r);a++){let l=Math.hypot(s-t,o-e,a-i);l<=r&&l>r-1.3&&this.set(s,o,a,Math.abs(o-e)<=1?11:10)}}generate(){for(let c=Ne;c<rn;c++)for(let h=nn;h<rn;h++){let u=6+Math.floor(Math.sin(c*.14)+Math.cos(h*.17));for(let[m,g,x,M,w]of Wd){let S=Math.hypot(c-m,h-g);S<x&&(u=Math.max(u,Math.floor(M-Math.max(0,S-x*.53)*.8+Math.sin((c-w)*.2)*1.4)))}(c>=69&&c<=82&&h>=312&&h<=334||c>=82&&c<=139&&h>=315&&h<=358)&&(u=25),u=qs(c,h,u);let d=ol[h-cs];d!==void 0&&c>=d&&!(c>=254&&c<=266&&h>=219&&h<=236)&&(u=25),c>=It.bounds.minX&&c<=It.bounds.maxX&&h>=It.bounds.minZ&&h<=It.bounds.maxZ&&(u=nl(c,h,u)),h<-147&&(u=Zs(c,h,u)),this.surface[(h-nn)*Pn+c-Ne]=u+1;let p=Math.hypot(c-65,h-230)<28;for(let m=0;m<=u;m++)this.set(c,m,h,m===u?u<Di||p?6:1:m<u-3?3:2)}let t=this,e=(c,h)=>({set:(u,d,p,m)=>t.set(u+c,d+me,p+h,m),get:(u,d,p)=>t.get(u+c,d+me,p+h),ground:(u,d)=>t.ground(u+c,d+h)-me,fill:(u,d,p,m,g,x,M)=>t.fill(u+c,d+me,p+h,m+c,g+me,x+h,M),disc:(u,d,p,m,g)=>t.disc(u+c,d+me,p+h,m,g),orb:(u,d,p,m)=>t.orb(u+c,d+me,p+h,m)}),i=e(an.dx,an.dz),r=1729,s=()=>(r=Math.imul(r,1664525)+1013904223>>>0,r/4294967296);for(let c=0;c<160;c++){let h=5+Math.floor(s()*115),u=5+Math.floor(s()*105),d=i.ground(h,u);if(d<9||d>15||h>31&&h<107&&u>27&&u<82||h>=24&&h<=34&&u>=55&&u<=65||i.get(h,d-1,u)!==1)continue;let p=4+Math.floor(s()*2);for(let m=0;m<p;m++)i.set(h,d+m,u,4);for(let m=-2;m<=2;m++)for(let g=-2;g<=2;g++)for(let x=-1;x<=1;x++)Math.abs(m)+Math.abs(g)+Math.abs(x)<5&&!i.get(h+m,d+p+x,u+g)&&i.set(h+m,d+p+x,u+g,5);i.set(h,d+p+2,u,5)}for(let c=36;c<=42;c++)for(let h=33;h<=39;h++)if(i.set(c,10,h,7),c===36||c===42||h===33||h===39)for(let u=11;u<=14;u++)h===39&&(c===39||c===40)&&u<14||(c===36||c===42)&&h===36&&(u===12||u===13)||i.set(c,u,h,(c===36||c===42)&&(h===33||h===39)?4:7);for(let c=35;c<=43;c++)for(let h=32;h<=40;h++)i.set(c,15+Math.min(c-35,43-c),h,8);i.fill(39,9,40,40,9,50,6),i.fill(40,9,49,94,9,51,6),i.fill(59,9,50,61,9,72,6),i.fill(60,9,70,69,9,72,6),i.fill(52,9,44,62,15,45,9),i.fill(52,15,45,62,15,45,10),i.fill(52,9,46,62,9,48,8),i.fill(54,10,39,60,13,40,8),i.fill(53,14,38,61,14,41,7);{let c=e(36,0);c.disc(90,9,42,12,9),c.disc(90,10,42,10,3);for(let h=11;h<=24;h++){let u=Math.round(7*(24-h)/13);for(let d of[0,2.094,4.189]){let p=Math.round(90+Math.cos(d)*u),m=Math.round(42+Math.sin(d)*u);c.fill(p-1,h,m-1,p+1,h,m+1,9)}}c.orb(90,26,42,5),c.fill(89,19,41,91,65,43,9),c.orb(90,54,42,4.5),c.orb(90,67,42,2),c.fill(90,65,42,90,D.top-me,42,9),c.disc(90,27,42,6,9),c.disc(90,53,42,5,9);for(let h=0;h<360;h+=10){let u=h*Math.PI/180;c.set(Math.round(90+Math.cos(u)*4.5),54,Math.round(42+Math.sin(u)*4.5),11)}c.fill(89,9,52,91,9,54,12),c.fill(85,10,52,87,10,52,7),c.fill(94,10,52,96,10,52,7)}Qs(this),i.fill(59,9,58,61,9,60,12),i.fill(26,0,57,31,12,62,3),i.fill(26,13,57,31,20,62,0),i.fill(26,12,57,31,12,62,7);for(let c=0;c<4;c++)i.fill(29,12-c,63+c,30,12-c,63+c,7);for(let c=192;c<258;c+=7)for(let h=327;h<396;h+=9){let u=this.surfaceAt(c,h);if(!(u<=Di+1||Ln.some(d=>c>=d.bounds.x1&&c<=d.bounds.x2&&h>=d.bounds.z1&&h<=d.bounds.z2))){this.fill(c,u,h,c,u+4,h,4);for(let d=-2;d<=2;d++)for(let p=-2;p<=2;p++)for(let m=3;m<=5;m++)Math.abs(d)+Math.abs(p)<4&&this.set(c+d,u+m,h+p,5)}}for(let c of Ln){let h=c.bounds;this.fill(h.x1,Math.floor(c.fallY)-1,h.z1,h.x2,65,h.z2,0);for(let[u,d]of c.platforms.entries()){let p=Math.floor(d.x),m=Math.floor(d.z),g=d.radius;this.fill(p-g,d.y-1,m-g,p+g,d.y-1,m+g,u%5===0?12:c.id==="forest"?5:c.id==="cliff"?10:11),this.set(p,d.y-1,m,12)}}let o=E.shanghai.x-136.5,a=E.shanghai.z-38.5,l={fill:(c,h,u,d,p,m,g)=>this.fill(c+o,h,u+a,d+o,p,m+a,g),set:(c,h,u,d)=>this.set(c+o,h,u+a,d),disc:(c,h,u,d,p)=>this.disc(c+o,h,u+a,d,p)};l.fill(125,20,25,147,25,51,3),l.fill(125,25,25,147,25,51,9);for(let c=26;c<136;c++)for(let h=126;h<=146;h++)for(let u=28;u<=48;u++){let d=h+.5-136.5,p=u+.5-38.5,m=Math.hypot(d,p),g=Math.atan2(p,d),x=ms(c,g);m<=x&&m>=x-1.05&&l.set(h,c,u,c%10===5?9:11)}for(let c of[25,45,65,85,105,125,135]){let h=c>=135?5:Math.floor(ms(c,0));l.disc(136,c,38,h,9),c<135&&(l.fill(135,c+1,37,137,c+5,39,0),l.fill(132,c+1,36,140,c+3,43,0))}l.fill(134,26,42,138,31,49,0),l.fill(135,25,46,137,25,49,12),l.fill(133,85,35,139,85,44,9),l.fill(133,86,35,139,89,44,0),l.fill(135,85,41,137,85,43,12);for(let c of[131,141])l.set(c,85,38,7),l.fill(c,86,38,c,88,38,5),l.set(c,89,38,12);l.disc(136,135,38,5,9),l.fill(134,136,36,138,140,40,0),l.fill(134,135,37,138,135,39,12);for(let c=136;c<=141;c++){let h=5-(c-136)*.65;for(let u=0;u<Math.PI*2;u+=.2)l.set(Math.round(136+Math.cos(u)*h),c,Math.round(38+Math.sin(u)*h),11)}l.fill(135,136,37,137,141,39,0),l.fill(135,136,41,137,139,44,0);let f={fill:(c,h,u,d,p,m,g)=>this.fill(c+140,h,u+155,d+140,p,m+155,g),set:(c,h,u,d)=>this.set(c+140,h,u+155,d),surfaceAt:(c,h)=>this.surfaceAt(c+140,h+155)};f.fill(122,6,137,138,7,153,9),f.fill(125,8,140,135,8,150,12);for(let c of[123,137])for(let h of[138,152])f.fill(c,8,h,c,15,h,9);f.fill(122,16,137,138,16,153,11),f.fill(128,9,141,132,10,149,9);for(let c=0;c<32;c++){let h=140+c*7%23,u=119+c*11%29,d=f.surfaceAt(h,u);d>Di-5||(f.set(h,d,u,c%2?10:12),f.set(h,d+1,u,c%2?10:11),c%3===0&&(f.set(h-1,d+1,u,10),f.set(h+1,d+1,u,10)))}f.fill(98,6,119,107,6,124,7),f.fill(99,7,119,106,8,119,7),f.fill(99,7,124,106,8,124,7),f.fill(103,7,122,103,13,122,4);for(let c=0;c<55;c++){let h=115+c*13%60,u=103+c*19%55,d=f.surfaceAt(h,u);if(d<Di-7)for(let p=0;p<2+c%4;p++)f.set(h,d+p,u,5)}this.fill(283,8,286,285,8,288,6),this.fill(283,9,286,285,12,288,0),Ks(this),Ra(this),ll(this,Wt),il(this),ia(this),Rs(this),Ps(this),Xs(this,Wt),hl(this),js(this,(c,h)=>Wt(c,h)||sl(c,h)),Us(this,Nt,Ne),Ys(this,Wt),Ca(this),Jo(this),Rn(this),Na(this,Rn,$t),tl(this),to(this,ms),dl(this,Wt),yl(this,Wt),qa(this,Rn),ja(this),vl(this),bl(this)}};function Xd(n,t){if(!(n?.ends instanceof Uint32Array)||!(n.values instanceof Uint8Array)||n.ends.length!==n.values.length)return!1;if(!t)return n.ends.length===0;if(!n.ends.length||n.ends.at(-1)!==t)return!1;let e=0;for(let i of n.ends){if(i<=e||i>t)return!1;e=i}return!0}function Sl(n,t){if(!(n instanceof Uint8Array))throw new TypeError("Expected voxel bytes");let e=n.length,i=Xd(t,e),r=i?t.ends.length:e?1:0;if(!i)for(let l=1;l<e;l++)n[l]!==n[l-1]&&r++;if(!i&&r*5>=e){let l=n.slice();return{byteLength:l.byteLength,kind:"raw",get:f=>l[f],restore(f){if(!(f instanceof Uint8Array)||f.length!==e)throw new RangeError("Baseline size mismatch");f.set(l)}}}let s=i?t.ends:new Uint32Array(r),o=i?t.values:new Uint8Array(r),a=0;if(!i)for(let l=1;l<=e;l++)(l===e||n[l]!==n[l-1])&&(s[a]=l,o[a++]=n[l-1]);return{runs:{ends:s,values:o},byteLength:s.byteLength+o.byteLength,kind:"rle",get(l){if(!Number.isInteger(l)||l<0||l>=e)return;let f=0,c=r-1;for(;f<c;){let h=f+c>>>1;s[h]<=l?f=h+1:c=h}return o[f]},restore(l){if(!(l instanceof Uint8Array)||l.length!==e)throw new RangeError("Baseline size mismatch");let f=0;for(let c=0;c<r;c++)l.fill(o[c],f,s[c]),f=s[c]}}}var ge=(n,t)=>Number.isSafeInteger(n)&&n>0&&n<=t,El=n=>typeof n=="string"&&/^[0-9a-f]{64}$/.test(n);function Tl(n){if(!n||n.format!==1||typeof n.revision!="string"||!n.revision.length||n.revision.length>128||!Number.isSafeInteger(n.maxBlockId)||n.maxBlockId<0||n.maxBlockId>255||!ge(n.size,1024)||!ge(n.height,512)||!ge(n.voxelLength,67108864)||!ge(n.surfaceLength,1048576)||!ge(n.depth??n.size,1024)||n.surfaceLength!==n.size*(n.depth??n.size)||n.voxelLength!==n.surfaceLength*n.height||!ge(n.runCount,n.voxelLength)||!ge(n.packedByteLength,16777216)||!ge(n.compressedByteLength,8388608)||!El(n.packedSha256)||!El(n.compressedSha256))throw new Error("Invalid world snapshot manifest");return n}function Yd(n,t){let e=Tl(t),i=n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):null;if(!i||i.byteLength!==e.packedByteLength||i.byteLength<32)throw new Error("Invalid world snapshot length");let r=new DataView(i.buffer,i.byteOffset,i.byteLength),s=r.getUint32(28,!0);if(r.getUint32(0,!0)!==1398229314||r.getUint16(4,!0)!==1||r.getUint16(6,!0)!==32||r.getUint32(8,!0)!==e.size||r.getUint32(12,!0)!==e.height||r.getUint32(16,!0)!==e.voxelLength||r.getUint32(20,!0)!==e.surfaceLength||r.getUint32(24,!0)!==e.runCount||s<e.runCount*2||s>e.runCount*6||32+s+e.surfaceLength*2!==i.byteLength)throw new Error("Invalid world snapshot header");let o=new Uint8Array(e.voxelLength),a=new Uint32Array(e.runCount),l=new Uint8Array(e.runCount),f=new Uint16Array(e.surfaceLength),c=32+s,h=32,u=0,d=-1;for(let p=0;p<e.runCount;p++){if(h>=c)throw new Error("Truncated world snapshot run");let m=i[h++];if(m>e.maxBlockId||m===d)throw new Error("Invalid world snapshot voxel");let g=0,x=1,M=0,w=0;do{if(h>=c||w++>=4)throw new Error("Invalid world snapshot run length");M=i[h++],g+=(M&127)*x,x*=128}while(M&128);if(g===0||w>1&&(M&127)===0||g>e.voxelLength-u)throw new Error("Invalid world snapshot run range");let S=u+g;o.fill(m,u,S),a[p]=S,l[p]=m,u=S,d=m}if(u!==e.voxelLength||h!==c)throw new Error("Incomplete world snapshot");for(let p=0;p<f.length;p++){let m=r.getUint16(c+p*2,!0);if(m>e.height)throw new Error("Invalid world snapshot surface");f[p]=m}return{data:o,surface:f,baseline:{ends:a,values:l}}}async function Al(n,t){let e=n.getReader(),i=[],r=0;try{for(;;){let{value:a,done:l}=await e.read();if(l)break;if(r+=a.byteLength,r>t)throw new Error("World snapshot exceeds expected size");i.push(a)}let s=new Uint8Array(r),o=0;for(let a of i)s.set(a,o),o+=a.byteLength;return s}catch(s){throw await e.cancel().catch(()=>{}),s}finally{e.releaseLock()}}async function Zd(n,t){if(typeof DecompressionStream!="function")throw new Error("World snapshot decompression unavailable");return Al(new Blob([n]).stream().pipeThrough(new DecompressionStream("gzip")),t)}async function wl(n,t,{fetch:e=globalThis.fetch,decompress:i=Zd,crypto:r=globalThis.crypto,timeoutMilliseconds:s=8e3,expectedRevision:o=t?.revision}={}){let a=Tl(t);if(a.revision!==o)throw new Error("World snapshot revision mismatch");if(typeof e!="function"||!r?.subtle?.digest)throw new Error("World snapshot APIs unavailable");let l=new AbortController,f=setTimeout(()=>l.abort(),s),c=async h=>Array.from(new Uint8Array(await r.subtle.digest("SHA-256",h)),u=>u.toString(16).padStart(2,"0")).join("");try{let h=await e(n,{cache:"force-cache",signal:l.signal});if(!h.ok)throw new Error("World snapshot fetch failed");if(!h.body?.getReader)throw new Error("World snapshot streaming unavailable");let u=Math.max(a.compressedByteLength,a.packedByteLength),d=await Al(h.body,u),p=d.byteLength===a.packedByteLength&&d.byteLength>=32&&new DataView(d.buffer,d.byteOffset,d.byteLength).getUint32(0,!0)===1398229314,m=d;if(!p){if(d.byteLength!==a.compressedByteLength||await c(d)!==a.compressedSha256)throw new Error("World snapshot compressed hash mismatch");m=await i(d,a.packedByteLength)}if(!(m instanceof Uint8Array)||m.byteLength!==a.packedByteLength||await c(m)!==a.packedSha256)throw new Error("World snapshot hash mismatch");return Yd(m,a)}finally{clearTimeout(f)}}var gs={file:"world-snapshot-cf77346e84ae.bin.gz",format:1,revision:"sihang-and-paddock-v109",maxBlockId:12,size:736,depth:624,height:144,voxelLength:66134016,surfaceLength:459264,runCount:649191,packedByteLength:2266304,compressedByteLength:277850,packedSha256:"985b2343e28c71b5494c5b713ec59c5face613c62b725666da5a2f48d8c18686",compressedSha256:"cf77346e84aee5d4054ec7ac677894eeda7714e407e35e24e023c163b37d72ce",voxelSha256:"4b75f8e5a657f9382ee6cc29e24e0defe00434b95e1c32ff1e356da7d52db7e3",surfaceSha256:"a36d3bd0f47bbf442007c2bfe810fbbf984e3160b2b842a3e819fe264d44bc5b"};self.onmessage=async({data:n}={})=>{try{let t,e="generated";if(gs&&n?.snapshot!==!1)try{t=await wl(new URL("./"+gs.file,import.meta.url),gs,{timeoutMilliseconds:15e3}),e="snapshot"}catch{}t||(t=new Ni,t.baseline=Sl(t.data).runs);let i=[t.data.buffer,t.surface.buffer];t.baseline&&i.push(t.baseline.ends.buffer,t.baseline.values.buffer),self.postMessage({data:t.data,surface:t.surface,baseline:t.baseline,source:e},i)}catch(t){self.postMessage({error:String(t?.message??t)})}};
