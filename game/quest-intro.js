// One short hint per page visit while chapter one is unfinished. Its clock only
// advances in playable frames; no timers, save schema change or layout polling.
export function createQuestIntro(tracker,document){
 let elapsed=0,finished=!tracker,displayed=false,lastTouch;
 const hint=tracker?document.createElement('div'):null;
 if(hint){hint.className='quest-intro-note';hint.hidden=true;hint.setAttribute('role','status');hint.innerHTML='<svg viewBox="0 0 72 48" aria-hidden="true"><path d="M65 43C30 45 16 32 18 7M7 17 18 6 28 18"/></svg><strong>你的上海旅程，从这里开始</strong><span>跟随黄色目标 · 点任务标题查看详情</span>';tracker.appendChild(hint);}
 function hide(){if(!displayed)return;displayed=false;document.body?.classList.remove('quest-intro-active');tracker?.classList.remove('quest-intro-highlight');if(hint)hint.hidden=true;}
 return {get finished(){return finished;},pause:hide,tick(dt,{eligible=false,playing=false,touch=false}={}){if(!hint||finished)return;if(!eligible){finished=true;hide();return;}if(!playing){hide();return;}elapsed+=Math.max(0,dt);if(elapsed>=12){finished=true;hide();return;}if(lastTouch!==touch){lastTouch=touch;hint.querySelector('span').textContent=touch?'跟随黄色目标 · 点任务标题查看详情':'跟随黄色目标 · 按 I 查看任务详情';}if(displayed)return;displayed=true;hint.hidden=false;document.body?.classList.add('quest-intro-active');tracker.classList.add('quest-intro-highlight');},dismiss(){finished=true;hide();},dispose(){hide();hint?.remove();}};
}
