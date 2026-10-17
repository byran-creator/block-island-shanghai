import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile('game/index.html','utf8');
const css=await readFile('game/style.css','utf8');
const js=await readFile('game/game.js','utf8');

// 1. Orientation tip and fullscreen elements
assert(html.includes('id="orientation-tip"'),'index.html should have #orientation-tip');
assert(html.includes('id="tip-fullscreen-btn"'),'index.html should have #tip-fullscreen-btn');
assert(html.includes('id="tip-dismiss-btn"'),'index.html should have #tip-dismiss-btn');
assert(html.includes('id="mobile-fullscreen"'),'index.html should have #mobile-fullscreen');
assert(html.includes('id="mobile-menu-fullscreen"'),'index.html should have #mobile-menu-fullscreen');

// 2. WASD D-pad controls
assert(html.includes('class="dpad-box"'),'index.html should have .dpad-box');
assert(html.includes('data-key="KeyW"'),'index.html should have KeyW');
assert(html.includes('data-key="KeyA"'),'index.html should have KeyA');
assert(html.includes('data-key="KeyS"'),'index.html should have KeyS');
assert(html.includes('data-key="KeyD"'),'index.html should have KeyD');
assert(html.includes('<b>W</b>'),'KeyW button should show letter W');
assert(html.includes('<b>A</b>'),'KeyA button should show letter A');
assert(html.includes('<b>S</b>'),'KeyS button should show letter S');
assert(html.includes('<b>D</b>'),'KeyD button should show letter D');

// 3. Touch action buttons
assert(html.includes('id="touch-mine"'),'index.html should have #touch-mine');
assert(html.includes('id="touch-place"'),'index.html should have #touch-place');
assert(html.includes('id="touch-use"'),'index.html should have #touch-use');
assert(html.includes('data-key="Space"'),'index.html should have jump Space key');

// 4. CSS orientation and responsive layout
assert(css.includes('@media(orientation: portrait)'),'style.css should have portrait media query');
assert(css.includes('@media(orientation: landscape)'),'style.css should have landscape media query');
assert(css.includes('.orientation-tip'),'style.css should have .orientation-tip style');
assert(css.includes('data-active="true"'),'style.css should have data-active visual feedback style');

// 5. Game JS orientation and fullscreen handlers
assert(js.includes('toggleLandscapeFullscreen'),'game.js should define toggleLandscapeFullscreen');
assert(js.includes('updateOrientationUI'),'game.js should define updateOrientationUI');
assert(js.includes("window.addEventListener('orientationchange'"),'game.js should listen to orientationchange');
assert(js.includes('btn.dataset.active='),'game.js should set dataset.active on pointerdown');

// 6. Mobile task relocation away from WASD controls
assert(css.includes('body.touch .quest-launcher'),'style.css should relocate quest launcher on touch');
assert(css.includes('body.force-landscape'),'style.css should define force-landscape rotation');
assert(html.includes('name="x5-orientation" content="landscape"'),'index.html should declare x5-orientation landscape');

console.log('PASS: mobile orientation tip, landscape fullscreen toggle, and WASD D-pad controls fully verified.');
