// Protect game controls without blocking selection, paste or native form widgets.
const editable='input,textarea,select,[contenteditable]:not([contenteditable="false"])';
const controls='button,summary,[role="button"],#touch-controls,#hotbar,#world';
export function installTouchCalloutGuard(doc,{isTouch=()=>doc.body.classList.contains('touch')}={}){
 const block=e=>{const target=e.target;if(isTouch()&&target?.closest&&!target.closest(editable)&&target.closest(controls))e.preventDefault();};
 doc.addEventListener('contextmenu',block);doc.addEventListener('selectstart',block);
 return ()=>{doc.removeEventListener('contextmenu',block);doc.removeEventListener('selectstart',block);};
}
