// Static homepage notices work before the city module is downloaded.
export function createWelcomeNotice({document,storage}){
 const button=document.getElementById('welcome-updates'),dialog=document.getElementById('update-dialog');if(!button||!dialog)return;
 const bindings=[],key=dialog.dataset.noticeKey;
 function listen(node,type,fn){if(!node)return;node.addEventListener(type,fn);bindings.push([node,type,fn]);}
 function refresh(){let seen=false;try{seen=storage?.getItem(key)==='true';}catch{}button.dataset.unread=String(!seen);}
 function open(){try{dialog.showModal();}catch{}}
 function close(event){event?.preventDefault();try{storage?.setItem(key,'true');}catch{}refresh();try{dialog.close();}catch{}}
 function dispose(){for(const [node,type,fn]of bindings)node.removeEventListener(type,fn);bindings.length=0;}
 listen(button,'click',open);listen(document.getElementById('update-close'),'click',close);listen(document.getElementById('update-start-btn'),'click',close);listen(dialog,'cancel',close);listen(document,'block-island-ready',dispose);refresh();
 return {dispose};
}
