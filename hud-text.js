export function updateHudText(element,text){
 if(element&&element.textContent!==text)element.textContent=text;
}

export function updateHudHidden(element,hidden){
 if(element&&element.hidden!==hidden)element.hidden=hidden;
}
