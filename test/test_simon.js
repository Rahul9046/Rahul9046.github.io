describe("Game",function(){
     beforeAll(function(){
        var temp='<audio id="audio0">'+
                 '<source src="sounds/red.ogg" type="audio/ogg">'+
                 '<source src="sounds/red.mp3" type="audio/mpeg">'+
                 '</audio>'+ 
                 '<audio id="audio1">'+
                 '<source src="sounds/green.ogg" type="audio/ogg">'+
                 '<source src="sounds/green.mp3" type="audio/mpeg">'+
                 '</audio>'+ 
                 '<audio id="audio2">'+
                 '<source src="sounds/yellow.ogg" type="audio/ogg">'+
                 '<source src="sounds/yellow.mp3" type="audio/mpeg">'+
                 '</audio>'+
                 '<audio id="audio3">'+
                 '<source src="sounds/blue.ogg" type="audio/ogg">'+
                 '<source src="sounds/blue.mp3" type="audio/mpeg">'+
                 '</audio>'+
                 '<audio id="audio4">'+
                 '<source src="sounds/error.ogg" type="audio/ogg">'+
                 '<source src="sounds/error.mp3" type="audio/mpeg">'+
                 '</audio>'+
                 '<div id="container">'+
                 '<div id="button-parent">'+
                 '<div id="button1" data-clickable="false" data-number="1"></div>'+
                 '<div id="button0" data-clickable="false" data-number="0"></div></br>'+
                 '<div id="button2" data-clickable="false" data-number="2"></div>'+
                 '<div id="button3" data-clickable="false" data-number="3"></div>'+
                 '<div id="display">'+
                 '<p id="simon_text">Simon<span id="reg_trademark">&reg;</span></p>'+
                 '<input id="count_disp" type="text" value=" - -" disabled/>'+
                  '<p id="count_text">COUNT</p>'+
                    '<div id="start"></div>'+
                    '<div id="strict" data-mode="0"></div>'+
                    '<div id="strict_indicator"></div>'+
                    '<p id="start_text">START</p>'+
                    '<p id="strict_text">STRICT</p>'+
                    '<span id="off_text">OFF</span>'+
                    '<div id="toggle_bg">'+
                        '<div id="toggle_btn" data-mode="0"></div>'+
                    '</div>'+
                    '<span id="on_text">ON</span>'+
                '</div>'+
            '</div>'+
        '</div>';   
          document.body.innerHTML=temp;
           
    });
   
   describe("testing for startGame",function(){
        it("sequence is not null",function(){
            var test=startGame().sequence;
            expect(test).toBeDefined();
        });
        it("on/off toggle button is off at the start of the game",function(){
        var test=startGame().toggle_btn_mode; 
            expect(test).toBe("0");
        });   
        it("audios are present when the game starts",function(){
        var test=startGame().audios; 
            expect(test).toBeDefined;
        });
        it("count(no of buttons that will blink in each sequence) is 1 when the game starts",function(){
        var test=startGame().count; 
            expect(test).toBe(1);
        });
       it("audio plays",function(){
           var buttons=[],audios=[];
            for(var i=0;i<4;i++){
            buttons[i]=new Button(document.getElementById("button"+i),i);
            }
            for(var i=0;i<5;i++){
              audios[i]=document.getElementById("audio"+i);
             }
            jasmine.clock().install();
            var test=startGame(audios,buttons,1).audio_plays;
            jasmine.clock().tick(1401);
            jasmine.clock().tick(600);
            jasmine.clock().tick(5000);
            jasmine.clock().uninstall();
        });
    
    });

    describe("testing for stopGame",function(){ 

     it("display shows -- when the game stops",function(){
         var buttons=[];
         for(var i=0;i<4;i++){
           buttons[i]=new Button(document.getElementById("button"+i),i);
        }
        var test=stopGame(buttons).display; 
            expect(test).toBe(" - -");
        });
      it("display-text color changes to brown when the game stops",function(){
         var buttons=[];
         for(var i=0;i<4;i++){
           buttons[i]=new Button(document.getElementById("button"+i),i);
        }
        var test=stopGame(buttons).color; 
            expect(test).toBe("brown");
        });   
      it("counter resets to 1 when the game stops",function(){
         var buttons=[];
         for(var i=0;i<4;i++){
           buttons[i]=new Button(document.getElementById("button"+i),i);
        }
        var test=stopGame(buttons).count; 
            expect(test).toBe(1);
        }); 

   });

   describe("testing for startAgain",function(){ 
     it("buttons are made non-clickable when the game restarts before the flashes",function(){
        var buttons=[];
         for(var i=0;i<4;i++){
           buttons[i]=new Button(document.getElementById("button"+i),i);
        }
        var test=startAgain(buttons).clickable;
        expect(test).toBe(true);
     });  
     it("display text changes to !! when the game restarts",function(){
        var buttons=[];
         for(var i=0;i<4;i++){
           buttons[i]=new Button(document.getElementById("button"+i),i);
        }
        var test=startAgain(buttons).display;
        expect(test).toBe(" ! !");
     }); 
      
     it("display flashes are correct when restarting in strict mode",function(){
        var buttons=[];
         for(var i=0;i<4;i++){
           buttons[i]=new Button(document.getElementById("button"+i),i);
        }
        jasmine.clock().install();
        var test=startAgain(buttons,1)["display-color"];
        jasmine.clock().tick(2701);
        expect(test).toBe("red");
        jasmine.clock().uninstall();
     });
   });

describe("click events working properly",function(){
     it("handlers for toggle btn",function(){
      eventForToggleBtn();  
      document.getElementById("toggle_btn").dataset.mode=1;
      eventForToggleBtn();
   });
   it("handlers for start btn",function(){
      document.getElementById("toggle_btn").dataset.mode=1;
      eventForStartBtn(1); 
      jasmine.clock().install();
      eventForStartBtn(1);
      jasmine.clock().tick(1201);
      eventForStartBtn(0); 
      jasmine.clock().uninstall();
      jasmine.clock().install();
      eventForStartBtn(0);
      jasmine.clock().tick(1201);
      jasmine.clock().uninstall();
   });
   it("handlers for strict btn",function(){
      eventForStrictBtn();
      document.getElementById("toggle_btn").dataset.mode=1;
      eventForStrictBtn();
   });
   it("handlers for button clicks",function(){
    var buttons=[];
         for(var i=0;i<4;i++){
           buttons[i]=new Button(document.getElementById("button"+i),i);
           buttons[i].element.dataset.clickable=true;
         }  
         for(var i=0;i<5;i++){
           audios[i]=document.getElementById("audio"+i);
         } 
      var check1=btnClick.bind(buttons[0].element,audios,1);
      check1();
      for(var i=0;i<4;i++){
           buttons[i].element.dataset.clickable=true;
         } 
      document.getElementById("count_disp").value=" 20";
      check1();
      for(var i=0;i<4;i++){
           buttons[i].element.dataset.clickable=true;
         } 
      var check2=btnClick.bind(buttons[0].element,audios);
      check2();
      
   });

   it("attach all events",function(){
      attachUIEvents();
   });
});
}); 

   