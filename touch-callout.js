// Protect game controls and touch surface against iOS long-press callout and pinch zoom without blocking editable widgets.
const editable='input,textarea,select,[contenteditable]:not([contenteditable="false"])';
const controls='button,summary,[role="button"],#touch-controls,#hotbar,#world,.hud,#menu,canvas';
export function installTouchCalloutGuard(doc,{isTouch=()=>doc.body.classList.contains('touch')}={}){
 const inEditable=target=>Boolean(target?.closest?.(editable));
 const block=e=>{const target=e.target;if(!isTouch()||inEditable(target))return;if(target===doc.body||target===doc.documentElement||target?.closest?.(controls))e.preventDefault();};
 const blockGesture=e=>{if(isTouch())e.preventDefault();};
 const blockPinch=e=>{if(isTouch()&&e.touches&&e.touches.length>1)e.preventDefault();};
 const clearSelection=()=>{if(!isTouch()||inEditable(doc.activeElement))return;const sel=doc.getSelection?.();if(sel&&!sel.isCollapsed)sel.removeAllRanges?.();};
 doc.addEventListener('contextmenu',block);
 doc.addEventListener('selectstart',block);
 doc.addEventListener('dragstart',block);
 doc.addEventListener('dblclick',block);
 doc.addEventListener('gesturestart',blockGesture,{passive:false});
 doc.addEventListener('gesturechange',blockGesture,{passive:false});
 doc.addEventListener('gestureend',blockGesture,{passive:false});
 doc.addEventListener('touchmove',blockPinch,{passive:false});
 doc.addEventListener('selectionchange',clearSelection);
 return ()=>{
  doc.removeEventListener('contextmenu',block);
  doc.removeEventListener('selectstart',block);
  doc.removeEventListener('dragstart',block);
  doc.removeEventListener('dblclick',block);
  doc.removeEventListener('gesturestart',blockGesture);
  doc.removeEventListener('gesturechange',blockGesture);
  doc.removeEventListener('gestureend',blockGesture);
  doc.removeEventListener('touchmove',blockPinch);
  doc.removeEventListener('selectionchange',clearSelection);
 };
}
