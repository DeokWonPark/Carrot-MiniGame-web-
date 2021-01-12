'use strict';
import * as sound from './sound.js'
//Builder Pattren
export default class gameBuilder{
    Time(time){
        this.time=time;
        return this;
    }
    Carrot(carrot){
        this.carrot=carrot;
        return this;
    }
    Bug(bug){
        this.bug=bug;
        return this;
    }
    build(){
        return new game(this.time,this.carrot,this.bug);
    }
}
class game{
    constructor(time,carrot,bug){

        this.Ori_time=time;
        this.Ori_carrot=carrot;
        this.Ori_bug=bug;

        this.time=time;
        this.carrot=carrot;
        this.bug=bug;

        this.stop_event;
        this.$stopBtn;
        this.$farm;
        this.$farm_event;

        this.$play=document.querySelector('.play');
        this.$play_i=document.querySelector('.play i');
        this.$timer=document.querySelector('.timer');
        this.$remain=document.querySelector('.remain');
        this.$content=document.querySelector('.content');
        this.$play.addEventListener('click',(event)=>{
            this.onClickPlay(event);
        });
    }
    onClickPlay(event){
        if(event.target.dataset.value!=="play"){
            return;
        }
        this.$play.setAttribute("class","stop Btn");
        this.$play.firstElementChild.setAttribute("class","fas fa-stop");
        this.$play.setAttribute("data-value","stop");
        this.$play_i.setAttribute("data-value","stop");
        this.Game();
    }

    Game(){
        this.time=this.Ori_time;
        this.carrot=this.Ori_carrot;
        this.bug=this.Ori_bug;
    
        sound.BackgroundSound();
        this.$timer.textContent=`00:${this.time--}`;
        let timer=setInterval(() => {
            if(this.time<=0){
                this.reset(timer);
                this.GameOver("YOU LOST😭");
                clearInterval(timer);
            }
            this.$timer.textContent=`00:${this.time--}`;
        }, 1000);
        this.$remain.textContent=`${this.carrot}`;
    
        this.Create_game();
        this.Gaming(timer);
        this.stop(timer);
    }

    GameOver(words){
        sound.Background_stop();
        this.$stopBtn.style.visibility="hidden";
        const $over=document.createElement("div");
        $over.classList.add("replay");
        $over.innerHTML=
            `
            <button class="replay-btn Btn"><i class="fas fa-undo-alt"></i></button>
            <span>${words}</span>
            `
        this.$content.appendChild($over);
        const $replay_btn=document.querySelector('.replay-btn');
        $replay_btn.addEventListener('click',()=>{
            this.$stopBtn.style.visibility="visible";
            $over.remove();
            this.$play.dispatchEvent(new Event('click'));
        });
    }

    reset(timer){
        clearInterval(timer);
        this.$timer.textContent=`00:00`;
    
        const $stop=document.querySelector('.stop');
        const $stop_i=document.querySelector('.stop i');
        $stop.setAttribute("class","play Btn");
        $stop.firstElementChild.setAttribute("class","fas fa-play");
        $stop.setAttribute("data-value","play");
        $stop_i.setAttribute("data-value","play");
    
        this.$stopBtn.removeEventListener('click',this.stop_event);
        this.$farm.removeEventListener('click',this.$farm_event);
    
        this.$remain.textContent=`0`;
    
        const item=this.$content.firstChild;
        this.$content.removeChild(item);
    }

    Create_game(){

        let $item=document.createElement("div");
        $item.classList.add("farm");
        const size=this.$content.getBoundingClientRect();
        
        //carrot
        this.Insert(size,"carrot","./img/carrot.png",this.carrot,$item);
        //bug
        this.Insert(size,"bug","./img/bug.png",this.bug,$item);
        this.$content.appendChild($item);
    }

    Insert(size,name,url,count,$item){

        let width=size.width;
        let height=size.height;
    
        for(let i=0;i<count;i++){
            let $div=document.createElement("div");
            let $carrot=document.createElement("img");
            $carrot.setAttribute("src",url);
            $carrot.setAttribute("data-value",name);
    
            let x,y;
            x=getRandomInt(0,height-80);
            y=getRandomInt(0,width-80);
            $div.setAttribute("class",name);
            $div.setAttribute("data-value",name);
            $div.appendChild($carrot);
            $div.style.top=`${x}px`;
            $div.style.left=`${y}px`;
            $item.appendChild($div);
        }
    }

    Gaming(timer){
        this.$farm=document.querySelector('.content');
    
        this.$farm.addEventListener('click',this.$farm_event=(event)=>{
            const value=event.target.dataset.value;
            if(value==null){
                return;
            }
            if(value==="carrot"){
                sound.CarrotSound();
                this.carrot--;
                this.$remain.textContent=this.carrot;
                const target=event.target;
                const parent=target.parentNode;
                if(parent!=null){
                    parent.setAttribute("data-value","none");
                }
                target.remove();
                if(this.carrot===0){
                    sound.WinSound();
                    this.reset(timer);
                    this.GameOver("YOU WON🎊");
                }
            }
            else if(value==="bug"){
                sound.BugSound();
                this.reset(timer);
                this.GameOver("YOU LOST😭");
            }
        });
    }

    stop(timer){
        this.$stopBtn=document.querySelector('.stop');
        this.$stopBtn.addEventListener('click',this.stop_event=(event)=>{
            if(event.target.dataset.value!=="stop"){
                return;
            }
            sound.Background_stop();
            this.$stopBtn.style.visibility="hidden";
            const $replay=document.createElement("div");
            $replay.classList.add("replay");
            $replay.innerHTML=
                `
                <div><button class="replay-btn Btn"><i class="fas fa-undo-alt"></i></button>
                <button class="play-continue Btn"><i class="fas fa-play"></i></button></div>
                <span>Replay ?</span>
                `
            this.$content.appendChild($replay);
            clearInterval(timer);
            //clearTimeout(global_timer);
    
            /* 중지 -> 계속 버튼*/
            const $continue_btn=document.querySelector('.play-continue');
            this.reset=this.reset.bind(this);
            $continue_btn.addEventListener('click',()=>{
                sound.BackgroundSound();
                this.$stopBtn.style.visibility="visible";
                $replay.remove();
                this.time++;

                timer=setInterval(() => {
                    this.$timer.textContent=`00:${--this.time}`;
                    if(this.time<=0){
                        this.reset(timer);
                        this.GameOver("YOU LOST😭");
                        clearInterval(timer);
                    }
                }, 1000);
                this.$stopBtn.addEventListener('click',this.stop_event);
            })
            /* 중지 -> 리플레이 버튼*/
            const $replay_btn=document.querySelector('.replay-btn');
            $replay_btn.addEventListener('click',()=>{
                sound.BackgroundSound();
                this.$stopBtn.style.visibility="visible";
                $replay.remove();
                this.reset(timer);
                this.$play.dispatchEvent(new Event('click'));
            })
    
        },{once:true});
    }

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}