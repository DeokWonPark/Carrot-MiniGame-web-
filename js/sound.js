'use strict';
const bg_sound=new Audio('../sound/bg.mp3');
const bug_sound=new Audio('../sound/bug_pull.mp3');
const carrot_sound=new Audio('../sound/carrot_pull.mp3');
const win_sound=new Audio('../sound/game_win.mp3');

export function BackgroundSound(){
    play_sound(bg_sound);
}
export function CarrotSound(){
    play_sound(carrot_sound);
}
export function BugSound(){
    play_sound(bug_sound);
}
export function WinSound(){
    play_sound(win_sound);
}

export function Background_stop(){
    bg_sound.pause();
}

function play_sound(sound){
    sound.currentTime=0;
    sound.play();
}