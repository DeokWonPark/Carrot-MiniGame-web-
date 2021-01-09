'use strict'
const $play=document.querySelector('.play');
const $play_i=document.querySelector('.play i');
const $timer=document.querySelector('.timer');
const $remain=document.querySelector('.remain');
const $content=document.querySelector('.content');
let time=6;
let carrot=7;
let bug=6;

let stop_event;
let $stopBtn;

$play.addEventListener('click', (event)=>{
    if(event.target.dataset.value!=="play"){
        return;
    }
    $play.setAttribute("class","stop Btn");
    $play.firstElementChild.setAttribute("class","fas fa-stop");
    $play.setAttribute("data-value","stop");
    $play_i.setAttribute("data-value","stop");
    //logic
    Game();
});


function Game(){
    time=6;
    carrot=7;
    bug=6;

    $timer.textContent=`00:${time--}`;
    let timer=setInterval(() => {
        $timer.textContent=`00:${time--}`;
    }, 1000);
    $remain.textContent=`${carrot}`;

    Create_game();
    let global_timer=setTimeout(function(){
        reset(timer);
    },6000);
    stop(timer,global_timer);
    /* Game End */
}

function reset(timer){
    clearInterval(timer);
    $timer.textContent=`00:00`;

    const $stop=document.querySelector('.stop');
    const $stop_i=document.querySelector('.stop i');
    $stop.setAttribute("class","play Btn");
    $stop.firstElementChild.setAttribute("class","fas fa-play");
    $stop.setAttribute("data-value","play");
    $stop_i.setAttribute("data-value","play");

    $stopBtn.removeEventListener('click',stop_event);

    $remain.textContent=`0`;

    const item=$content.firstChild;
    $content.removeChild(item);
}

function Create_game(){

    let $item=document.createElement("div");
    const size=$content.getBoundingClientRect();
    let width=size.width;
    let height=size.height;

    /* !! refectoring */
    //carrot
    for(let i=0;i<carrot;i++){
        let $div=document.createElement("div");
        let $carrot=document.createElement("img");
        $carrot.setAttribute("src","./img/carrot.png");

        let x,y;
        x=getRandomInt(0,height-80);
        y=getRandomInt(0,width-80);
        $div.setAttribute("class","carrot");
        $div.appendChild($carrot);
        $div.style.top=`${x}px`;
        $div.style.left=`${y}px`;
        $div.style.zIndex=i;
        $item.appendChild($div);
    }
    //bug
    for(let i=carrot;i<carrot+bug;i++){
        let $div=document.createElement("div");
        let $bug=document.createElement("img");
        $bug.setAttribute("src","./img/bug.png");

        let x,y;
        x=getRandomInt(0,height-80);
        y=getRandomInt(0,width-80);
        $div.setAttribute("class","bug");
        $div.appendChild($bug);
        $div.style.top=`${x}px`;
        $div.style.left=`${y}px`;
        $div.style.zIndex=i;
        $item.appendChild($div);
    }
    $content.appendChild($item);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function stop(timer,global_timer){
    $stopBtn=document.querySelector('.stop');
    $stopBtn.addEventListener('click',stop_event=(event)=>{
        if(event.target.dataset.value!=="stop"){
            return;
        }
        const $replay=document.createElement("div");
        $replay.classList.add("replay");
        $replay.innerHTML=
            `
            <div><button class="replay-btn Btn"><i class="fas fa-undo-alt"></i></button>
            <button class="play-continue Btn"><i class="fas fa-play"></i></button></div>
            <span>Replay ?</span>
            `
        $content.appendChild($replay);
        clearInterval(timer);
        clearTimeout(global_timer);

        /* 중지 -> 계속 버튼*/
        const $continue_btn=document.querySelector('.play-continue');
        $continue_btn.addEventListener('click',()=>{
            $replay.remove();
            time++;
            global_timer=setTimeout(function(){
                reset(timer);
            },time*1000);
            timer=setInterval(() => {
                $timer.textContent=`00:${--time}`;
            }, 1000);
            $stopBtn.addEventListener('click',stop_event);
        })
        /* 중지 -> 리플레이 버튼*/
        const $replay_btn=document.querySelector('.replay-btn');
        $replay_btn.addEventListener('click',()=>{
            $replay.remove();
            reset(timer);
            $play.dispatchEvent(new Event('click'));
        })

    },{once:true});
}