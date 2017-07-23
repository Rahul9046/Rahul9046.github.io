(function(){
    var pallete1=["#9F0F18","#00A64B","#CDA609","#094A8E"],
        pallete2=["#ff3333","#00FF7F","#ffff66","#7B68EE"],
        sequence=[],checking=[],buttons=[],audios=[],button_flash_timeouts=[],count_text_timeout=[],game_tout,current_flash,game_state=0,count=1;

    function Button(element,number){
    this.element=element;
    this.initial_fill=pallete1[number];
    this.click_fill=pallete2[number];
    }
    Button.prototype.click=function(){
        if(this.dataset.clickable==="true"){ 
            if(this.dataset.number==checking.shift()){
            audios[this.dataset.number].play();
            this.style["background-color"]=buttons[this.dataset.number].click_fill;
            (function(that){
            setTimeout(function(){
            that.style["background-color"]=buttons[that.dataset.number].initial_fill;
            },300);
            })(this);    
            clearTimeout(game_tout);
            if(checking.length!==0){//sequence is still left.
                game_tout=setTimeout(function(){
                audios[4].play();
                start_again();  
                },5000);
            }
            else{ // sequence completed
                if(document.getElementById("count_disp").value===" 20"){//user wins when completed level 20.
                stopGame();
                setTimeout(function(){
                alert("Congo!!! You Have Won....Press Start to play again");
                game_state=0;
                },600);
                }
                else{
                buttons.forEach(function(button){
                    button.element.dataset.clickable=false; //setting the clickable attribute of the buttons to false during the next sequence.
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
    }

    for(var i=0;i<4;i++){
    audios[i]=document.getElementById("audio"+i);
    buttons[i]=new Button(document.getElementById("button"+i),i);
    buttons[i].element.addEventListener("click",buttons[i].click);
    }
    audios[4]=document.getElementById("audio4");

    function start_again(){ //called when the user does any error or when the timeout finishes
            buttons.forEach(function(button){
                            button.element.dataset.clickable=false; //user cannot click the buttons when the sequence is flashing
                            });
            clearTimeout(game_tout);
            count--;
            document.getElementById("count_disp").value=" ! !";
            setTimeout(function(){
            document.getElementById("count_disp").style.color="brown";
            },100);
            setTimeout(function(){
            document.getElementById("count_disp").style.color="red";
            },400);
            setTimeout(function(){
            document.getElementById("count_disp").style.color="brown";
            },700);
            setTimeout(function(){
            document.getElementById("count_disp").style.color="red";
            },1000);
            if(document.getElementById("strict").dataset.mode=="1"){//when in strict mode,reset the initial sequence and the timeout 
                setTimeout(function(){
                stopGame();
                document.getElementById("strict_indicator").style["background-color"]="red";
                document.getElementById("strict").dataset.mode=1; 
                },1200);
                document.getElementById("count_disp").style.color="red";
                setTimeout(function(){
                document.getElementById("count_disp").style.color="brown";
                },1300);
                setTimeout(function(){
                document.getElementById("count_disp").style.color="red";
                },1700);
                setTimeout(function(){
                document.getElementById("count_disp").style.color="brown";
                },2100);
                setTimeout(function(){
                document.getElementById("count_disp").style.color="red";
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
    }

    function startGame(){ // gets executed for every new sequence
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
            if(document.getElementById("toggle_btn").dataset.mode==1){ 
            audios[j].play();
            document.getElementById("count_disp").value=count>9?" "+count:" 0"+count;
            if(k===(count-1)){
                var index=0;
                buttons.forEach(function(button){//setting clickable attribute of the button to true after the flashes.
                button.element.dataset.clickable=true; 
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
            buttons[j].element.style["background-color"]=buttons[j].click_fill;
            setTimeout(function(){
            buttons[j].element.style["background-color"]=buttons[j].initial_fill;
            },600);
            }
            },1400+1500*k);//1200ms for the count display flash,200ms wait time after the buttons start flashing,   
                        //1500*k is the wait time for button in the sequence after which it flashes for 600ms(k=0 to 3).
        })(r_btn_num,i,button_flash_timeouts);
        }
    }

    function stopGame(){  //called when the game finishes or the user stops the game from the stop button
        document.getElementById("count_disp").value=" - -";
        document.getElementById("count_disp").style.color="brown"; 
        sequence=[];
        checking=[];
        count=1;
        clearTimeout(game_tout);
        buttons.forEach(function(button){
                        button.element.dataset.clickable=false; 
                    });
        button_flash_timeouts.forEach(function(timeout){
        clearTimeout(timeout);
        });
        document.getElementById("strict_indicator").style["background-color"]="black";
        document.getElementById("strict").dataset.mode=0; 
    }
    
    document.getElementById("toggle_bg").addEventListener("click",function(){ //toggles ON/OFF button
            if(document.getElementById("toggle_btn").dataset.mode==="0"){
                document.getElementById("toggle_btn").style.float="right";
                document.getElementById("toggle_btn").dataset.mode=1;
                document.getElementById("count_disp").style.color="red";
            }
            else{
                document.getElementById("toggle_btn").style.float="left";   
                document.getElementById("toggle_btn").dataset.mode=0;
                stopGame();
            }    
    }); 

    document.getElementById("start").addEventListener("click",function(){ //executed when the user clicks the start button and the game starts. 
        if(!game_state){//checks if the start button is clicked between gameplay 
            game_state=1;
            button_flash_timeouts.forEach(function(item){
                clearTimeout(item);
            });
            if(document.getElementById("toggle_btn").dataset.mode==1){ //execute only if the button start button is set to ON.
                document.getElementById("count_disp").style.color="red";
                setTimeout(function(){
                document.getElementById("count_disp").style.color="brown";
                },100);
                setTimeout(function(){
                document.getElementById("count_disp").style.color="red";
                },400);
                setTimeout(function(){
                document.getElementById("count_disp").style.color="brown";
                },700);
                setTimeout(function(){
                document.getElementById("count_disp").style.color="red";
                },1000);
                setTimeout(function(){
                startGame();
                },1200);
            }
        }
        else{  // start button is pressed one or more times between game play  
            if(document.getElementById("toggle_btn").dataset.mode==1){ 
                button_flash_timeouts.forEach(function(item){ //clears initial timeouts of the button flashes
                clearTimeout(item);
                });
                count_text_timeout.forEach(function(item){  //clears initial timeouts of the count text flashes
                clearTimeout(item);
                });
                
                stopGame();
                count_text_timeout[0]=setTimeout(function(){
                document.getElementById("count_disp").style.color="brown";
                },100);
                count_text_timeout[1]=setTimeout(function(){
                document.getElementById("count_disp").style.color="red";
                },400);
                count_text_timeout[2]=setTimeout(function(){
                document.getElementById("count_disp").style.color="brown";
                },700);
                count_text_timeout[3]=setTimeout(function(){
                document.getElementById("count_disp").style.color="red";
                },1000);
                count_text_timeout[4]=setTimeout(function(){
                startGame();
                },1200);
            }
        }
    });

    document.getElementById("strict").addEventListener("click",function(){ //toggles the strict mode.
        if(document.getElementById("toggle_btn").dataset.mode==1){
            if(document.getElementById("strict").dataset.mode==="0"){
                document.getElementById("strict_indicator").style["background-color"]="red";
                document.getElementById("strict").dataset.mode=1;  
            }
            else{
                document.getElementById("strict_indicator").style["background-color"]="black";
                document.getElementById("strict").dataset.mode=0;
            }
        }
        });
})();