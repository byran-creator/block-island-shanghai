// Shanghai metro reference: black panels, white bilingual text, green Line 2 badge.
export function paintMetroSign(ctx,lines,{width=1024,height=256,line2=true,arrow='',color='#f4f7f4',bg='#192123'}={}){
 ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);
 const badge=line2?height*.64:0,left=line2?height*.92:height*.16;
 if(line2){ctx.fillStyle='#8fc43e';ctx.fillRect(height*.12,height*.16,badge,badge);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font=`bold ${height*.52}px sans-serif`;ctx.fillText('2',height*.12+badge/2,height*.7);}
 ctx.fillStyle=color;ctx.textAlign='left';const right=arrow?height*.8:height*.16;
 const font=lines.length>2?height*.19:height*.28;
 lines.forEach((line,i)=>{ctx.font=`${i===0?'bold ':''}${i===0?font:font*.63}px "Microsoft YaHei",sans-serif`;ctx.fillText(line,left,height*(lines.length>2?.29+i*.27:.45+i*.34),width-left-right);});
 if(arrow){ctx.textAlign='right';ctx.font=`bold ${height*.48}px sans-serif`;ctx.fillText(arrow,width-height*.12,height*.65);}
}
