import io from 'socket.io-client';
import { backendUrl } from './env';
let editor = document.querySelector("[contentEditable]");
let s = io.connect(backendUrl);
let backspaceEvent = new KeyboardEvent('KeyboardEvent', {
    keyCode: 8,
    key: 'backspace'
})

// s.on('w', w => {

//     if(w.keyCode === 13) {
//         editor.innerHTML += ('<br>');
//     }
//     else if(w.keyCode === 8 || w.keyCode === 46) {
//         console.log(backspaceEvent)
//         editor.dispatchEvent(backspaceEvent)
//     }
//     else {
//         editor.innerHTML += (w.key);
//     }
// })
s.on('docUpdated', d => {
    editor.innerHTML = d;
})
editor.addEventListener("input", e => {
    s.emit('docUpdate', e.target.innerHTML);
})
// editor.addEventListener("keypress", e => {
//     s.emit('typeEvent', {
//         keyCode: e.keyCode,
//         key: e.key
//     });
// })
// editor.addEventListener("keydown", e => {
//     if(e.keyCode === 9) e.preventDefault();
//     if (
//         e.keyCode === 8 || //backspace
//         e.keyCode === 91 || //Command
//         e.keyCode === 17 || //Ctrl
//         e.keyCode === 18   //Alt
//         ) {
//             s.emit('typeEvent', {
//                 keyCode: e.keyCode,
//                 key: e.key
//             }); 

//         }
//         else {
//             return;
//         }
// })