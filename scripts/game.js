

(function(){
    //creation of UI elements and variables which will be used throughout the program.
    /* 
      game states{
        0:"new game session,user clicked start button for the 1st time in the new session"
        1:"game running,user clicked the start button for one or more times"
      }
    */
    var paper=new R_svg("container",window.innerWidth,window.innerHeight),buttons=[],sequence=[],checking=[],button_flash_timeouts=[],count_text_timeout=[],game_tout,count=1,audios=[],game_state=0,
        pallete1=["darkred","forestgreen","goldenrod","indigo"],
        pallete2=["#ff3333","springgreen","#ffff66","mediumslateblue"];
        bg_circle=paper.circle(600,330,230).attr({"fill":["#282828"],"blur":2}),
        buttons[0]=paper.path("M720,330 L810,330 A210,210 0 0,0 600,120"+ 
                            "L600,210 A120,120 0 0,1 720,330").attr({"fill":[pallete1[0]],"stroke":["#282828",15]}),
        buttons[1]=paper.path("M480,330 L390,330 A210,210 0 0,1 600,120"+ 
                            "L600,210 A120,120 0 0,0 480,330").attr({"fill":[pallete1[1]],"stroke":["#282828",15]}),
        buttons[2]=paper.path("M480,330 L390,330 A210,210 0 0,0 600,540"+ 
                            "L600,450 A120,120 0 0,1 480,330").attr({"fill":[pallete1[2]],"stroke":["#282828",15]}),
        buttons[3]=paper.path("M720,330 L810,330 A210,210 0 0,1 600,540"+ 
                            "L600,450 A120,120 0 0,0 720,330").attr({"fill":[pallete1[3]],"stroke":["#282828",15]}),
        
        inner_circle=paper.circle(600,330,120).attr({"fill":["white"]}),
        simon_text=paper.text(505,305,"Simon").attr({"fill":["#282828"],"font-size":48,"font-family":"Ultra"}),
        reg_trademark_text=paper.text(688,280,'\u00ae').attr({"fill":["#282828"],"font-weight":"bold"}),
        count_disp=paper.rect(510,330,60,35,5).attr({"fill":["#4d0019"],"stroke":["#282828",5]}),
        count_value=paper.text(524,360,"- -").attr({"fill":["brown"],"font-size":30,"font-family":"BitmapWide"}),
        start_btn=paper.circle(600,347,13).attr({"fill":["red"],"stroke":["#282828",4]}),
        strict_btn=paper.circle(660,347,13).attr({"fill":["yellow"],"stroke":["#282828",4]}),
        strict_indicator=paper.circle(660,325,5).attr({"fill":["black"]}),
        switch_bg=paper.rect(580,410,40,20,3).attr({"fill":["#282828"]}),
        switch_btn=paper.rect(582,412,15,15).attr({"fill":["skyblue"]}),
        off_text=paper.text(578,425,"OFF").attr({"text-anchor":"end","font-family":"Zamyatin","font-size":15}),
        on_text=paper.text(622,425,"ON").attr({"text-anchor":"start","font-family":"Zamyatin","font-size":15}),
        count_text=paper.text(512,387,"COUNT").attr({"text-anchor":"start","font-family":"Zamyatin","font-size":15}),
        start_text=paper.text(600,387,"START").attr({"text-anchor":"middle","font-family":"Zamyatin","font-size":15}),
        strict_text=paper.text(660,387,"STRICT").attr({"text-anchor":"middle","font-family":"Zamyatin","font-size":15}); 
    
    //audio files
    audios[0]=document.getElementById("soundbuttonRed");
    audios[1]=document.getElementById("soundbuttonGre");    
    audios[2]=document.getElementById("soundbuttonYel");
    audios[3]=document.getElementById("soundbuttonBlu");
    audios[4]=document.getElementById("soundbuttonWrong");
    var start_again=(function(){ //called when the user does any error or when the timeout finishes
        buttons.forEach(function(element){
                        element.dataset.clickable=false; //user cannot click the buttons when the sequence is flashing
                        });
        clearTimeout(game_tout);
        count--;
        count_value.innerHTML="! !";
        setTimeout(function(){
        count_value.attr({"fill":["brown"]});
        },100);
        setTimeout(function(){
        count_value.attr({"fill":["red"]});
        },400);
        setTimeout(function(){
        count_value.attr({"fill":["brown"]});
        },700);
        setTimeout(function(){
        count_value.attr({"fill":["red"]});
        },1000);
        if( strict_btn.dataset.mode=="1"){//when in strict mode,reset the initial sequence and the timeout 
            setTimeout(function(){
            stopGame();
            strict_indicator.attr({"fill":["red"]});
            strict_btn.dataset.mode=1; 
            },1200);
            count_value.attr({"fill":["red"]});
            setTimeout(function(){
            count_value.attr({"fill":["brown"]});
            },1300);
            setTimeout(function(){
            count_value.attr({"fill":["red"]});
            },1700);
            setTimeout(function(){
            count_value.attr({"fill":["brown"]});
            },2100);
            setTimeout(function(){
            count_value.attr({"fill":["red"]});
            },2500);
            setTimeout(function(){
            startGame();
            },2700);
        }
        else{
            setTimeout(function(){
            startGame();//in non-strict mode,carry on the game with the recent sequence
            },1200);
        }
        });
        
    for(var i=0;i<4;i++){
        (function(j){
            buttons[j].setAttribute("data-clickable",false);//setting each button's clickable attribute to false initially 
            buttons[j].setAttribute("data-number",i);//setting each button's identifier(0-4)
            buttons[j].click(function(){   //assining click handler on each button.  
            if(this.dataset.clickable==="true"){ //handler gets executed only if its clickable property is true.
              if(this.dataset.number==checking.shift()){//matching the button clicked with the sequence
                audios[this.dataset.number].play();
                this.attr({"fill":[pallete2[j]]});
                setTimeout(function(){
                buttons[j].attr({"fill":[pallete1[j]]});
                },300);
                clearTimeout(game_tout);
                if(checking.length!==0){//sequence is still left.
                    game_tout=setTimeout(function(){
                    audios[4].play();
                    start_again();  
                    },5000);
                }
                else{ // sequence completed
                    if(count_value.innerHTML==="20"){//user wins when completed level 20.
                    stopGame();
                    setTimeout(function(){
                    alert("Congo!!! You Have Won....Press Start to play again");
                    game_state=0;
                    },600);
                    }
                    else{
                    buttons.forEach(function(element){
                        element.dataset.clickable=false; //setting the clickable attribute of the buttons to false during the next sequence.
                        }); 
                        startGame();//start new level of n buttons with the first (n-1) buttons similar to last sequence.
                    }
                } 
              }  
                else{
                    audios[4].play();
                    start_again(); //shows error and starts again in the same level(non-strict) or 1st level(strict).
                }
            }        
            });   
        })(i);
    }

    var startGame=(function(){ // gets executed for every new sequence
                    var r_btn_num;// stores the random button number generated 
                    for(var i=0;i<count;i++){
                    if(sequence[i]==null){//empty value at that index
                        r_btn_num=Math.floor(Math.random()*4);
                        sequence.push(r_btn_num);
                    }
                    else{ // contains value from the previous sequence
                        r_btn_num=sequence[i];
                    }
                    (function(j,k,timeouts){                    
                      button_flash_timeouts[k]=setTimeout(function(){
                        if(switch_btn.dataset.mode==1){ 
                        audios[j].play();
                        count_value.innerHTML=count>9?count:"0"+count;
                        if(k===(count-1)){
                            var index=0;
                            buttons.forEach(function(element){//setting clickable attribute of the button to true after the flashes.
                            element.dataset.clickable=true; 
                            });
                            count++;
                            sequence.forEach(function(elem){
                            checking[index++]=elem;
                            });
                            game_tout=setTimeout(function(){ //creating timeout for a sequence.gets reseted after each correct click.
                            audios[4].play();
                            start_again();    
                            },5000);
                        }
                        buttons[j].attr({"fill":[pallete2[j]]});
                        setTimeout(function(){
                        buttons[j].attr({"fill":[pallete1[j]]});
                        },600);
                        }
                        },1400+1500*k);//1200ms for the count display flash,200ms wait time after the buttons start flashing,   
                                    //1500*k is the wait time for button in the sequence after which it flashes for 600ms(k=0 to 3).
                    })(r_btn_num,i,button_flash_timeouts);
                    }
                });
    var stopGame=(function(){  //called when the game finishes or the user stops the game from the stop button
        count_value.innerHTML="- -";
        count_value.attr({"fill":["brown"]}); 
        sequence=[];
        checking=[];
        count=1;
        clearTimeout(game_tout);
        buttons.forEach(function(element){
                        element.dataset.clickable=false; 
                        });
        strict_indicator.attr({"fill":["black"]});
        strict_btn.dataset.mode=0; 
        });

    switch_btn.setAttribute("data-mode",0);// modes for switch button:0-off,1-on
    strict_btn.setAttribute("data-mode",0);// modes for strict button:0-non-strict,1-strict

    switch_btn.click(function(){ //toggles ON/OFF button
        if(switch_btn.dataset.mode==="0"){
            switch_btn.setAttribute("x",Number(switch_btn.getAttribute("x"))+20);
            switch_btn.dataset.mode=1;
            count_value.attr({"fill":["red"]});
        }
        else{
            switch_btn.setAttribute("x",Number(switch_btn.getAttribute("x"))-20);   
            switch_btn.dataset.mode=0;
            stopGame();
        }    
    });

    switch_bg.click(function(){ //toggles ON/OFF button
        if(switch_btn.dataset.mode==="0"){
            switch_btn.setAttribute("x",Number(switch_btn.getAttribute("x"))+20);
            switch_btn.dataset.mode=1;
            count_value.attr({"fill":["red"]});
        }
        else{
            switch_btn.setAttribute("x",Number(switch_btn.getAttribute("x"))-20);   
            switch_btn.dataset.mode=0;
            game_state=0;
            stopGame();
        }    
    });

    start_btn.click(function(){ //executed when the user clicks the start button and the game starts. 
        start_btn.setAttribute("r",12);
        setTimeout(function(){
        start_btn.setAttribute("r",13);
        },100);
        if(!game_state){//checks if the start button is clicked between gameplay 
            game_state=1;
            button_flash_timeouts.forEach(function(item){
             clearTimeout(item);
            });
            if(switch_btn.dataset.mode==1){ //execute only if the button start button is set to ON.
                count_value.attr({"fill":["red"]});
                setTimeout(function(){
                count_value.attr({"fill":["brown"]});
                },100);
                setTimeout(function(){
                count_value.attr({"fill":["red"]});
                },400);
                setTimeout(function(){
                count_value.attr({"fill":["brown"]});
                },700);
                setTimeout(function(){
                count_value.attr({"fill":["red"]});
                },1000);
                setTimeout(function(){
                startGame();
                },1200);
            }
        }
        else{  // start button is pressed one or more times between game play  
            if(switch_btn.dataset.mode==1){ 
                button_flash_timeouts.forEach(function(item){ //clears initial timeouts of the button flashes
                clearTimeout(item);
                });
                count_text_timeout.forEach(function(item){  //clears initial timeouts of the count text flashes
                clearTimeout(item);
                });
                
                stopGame();
                count_text_timeout[0]=setTimeout(function(){
                count_value.attr({"fill":["brown"]});
                },100);
                count_text_timeout[1]=setTimeout(function(){
                count_value.attr({"fill":["red"]});
                },400);
                count_text_timeout[2]=setTimeout(function(){
                count_value.attr({"fill":["brown"]});
                },700);
                count_text_timeout[3]=setTimeout(function(){
                count_value.attr({"fill":["red"]});
                },1000);
                count_text_timeout[4]=setTimeout(function(){
                startGame();
                },1200);
           }
        }
    });

    strict_btn.click(function(){ //toggles the strict mode.
        strict_btn.setAttribute("r",12);
        setTimeout(function(){
        strict_btn.setAttribute("r",13);
            },100);
        if(switch_btn.dataset.mode==1){
            if(strict_btn.dataset.mode==="0"){
                strict_indicator.attr({"fill":["red"]});
                strict_btn.dataset.mode=1;  
            }
            else{
                strict_indicator.attr({"fill":["black"]});
                strict_btn.dataset.mode=0;
            }
        }
    });
})();                                                 
