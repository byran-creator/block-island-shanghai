// A settings modal pauses the same simulation as the other game panels.
export function createSettingsPanel({dialog,isPlaying,pause,resume,onOpen=()=>{}}){
 let resumeAfter=false;
 function open(){if(dialog.open)return;resumeAfter=isPlaying();pause();onOpen();try{dialog.showModal();}catch{const restore=resumeAfter;resumeAfter=false;if(restore)resume();}}
 function close(){if(!dialog.open)return;dialog.close();const restore=resumeAfter;resumeAfter=false;if(restore)resume();}
 dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 return {open,close};
}
