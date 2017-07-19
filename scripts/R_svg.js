var R_svg=(function(){
    /*Creates an svg canvas of given height and width.Everything that will be
     rendered will be added/appended to this svg canvas*/
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
    var svgNS = svg.namespaceURI;
    svg.setAttribute('width',arguments[1]);
    svg.setAttribute('height',arguments[2]);
    var counter_for_textpath=0,counter_for_linearGradient=0,counter_for_radialGradient=0,counter_for_blurFilter=0,counter_for_castShadow=0,counter_for_offset=0,counter_for_clipPath=0;
    var defs=document.createElementNS(svgNS,'defs');
    svg.appendChild(defs);
    this.canvas=svg;
    String.prototype.contains=function(char){  
        var split_str=this.split("");
        for(var i=0;i<split_str.length;i++){
            if(split_str[i]===char){
                return true;
             }
        }
        return false;
      };
      String.prototype.extract=function(char1,char2){
          var str="",flag=0;
          var split_str=this.split("");
          for(var i=0;i<split_str.length;i++){
              
              if(split_str[i]===char1){
                  flag=1;
              }
              else if(split_str[i]===char2){
                  flag=0;
                  break;
               }
              else if(flag){
                  str+=split_str[i];
              }
         }
         if(!flag && str.length>0){
             return str;
         }
         else{
             return this;
         }
      };
      var attachEvents=(function(){
          var events="click mouseover mouseout mousedown mouseup mousemove keydown keyup dragstart dragend drag".split(" ");
          for(var i=0;i<events.length;i++){
           var attach=(function(eventName){
              Object.prototype[eventName]=function(){
              this.addEventListener(eventName,arguments[0],false);
              }; 
              Object.prototype["un"+eventName]=function(){
              this.removeEventListener(eventName,arguments[0]);
              };  
            })(events[i]);
           }
      })();
      this.animateIt=function(){ 
            this.appendChild(arguments[0]); 
      };
        Object.prototype.castShadow=function(f){
             this.setAttribute("castShadow",f);
             if(this.getAttribute("castShadow")=="true"){
                var filter=document.createElementNS(svgNS,'filter');
                var offset=document.createElementNS(svgNS,'feOffset');
                var gaussianBlur=document.createElementNS(svgNS,'feGaussianBlur');
                var blend=document.createElementNS(svgNS,'feBlend');
                filter.setAttribute("id","castShadow"+counter_for_castShadow);
                offset.setAttribute("in","SourceAlpha");
                if(arguments[1]){
                  if(arguments[2]){
                    offset.setAttribute("dx",arguments[1]);
                    offset.setAttribute("dy",arguments[2]);
                  }  
                  else{
                    offset.setAttribute("dx",arguments[1]);
                    offset.setAttribute("dy",arguments[1]);
                  }
                }
                else{
                  offset.setAttribute("dx",6);
                  offset.setAttribute("dy",6);
                }
                offset.setAttribute("result","offset"+counter_for_offset);
                gaussianBlur.setAttribute("in","offset"+counter_for_offset);
                gaussianBlur.setAttribute("stdDeviation",4);
                gaussianBlur.setAttribute("result","blur"+counter_for_blurFilter);
                blend.setAttribute("in","SourceGraphic");
                blend.setAttribute("in2","blur"+counter_for_blurFilter);
                filter.appendChild(offset);
                filter.appendChild(gaussianBlur);
                filter.appendChild(blend);
                defs.appendChild(filter);
                if(this.hasAttribute("filter")){
                    var filterGroup=document.createElementNS(svgNS,'g');
                    filterGroup.setAttribute("filter","url(#castShadow"+counter_for_castShadow+")");
                    filterGroup.appendChild(this);
                    this.appendChild(filterGroup);
                 }
                 else{
                    this.setAttribute("filter","url(#castShadow"+counter_for_castShadow+")");
                 }
                counter_for_castShadow++;
                counter_for_offset++;
                counter_for_blurFilter++;
             }
             else if(this.getAttribute("castShadow")=="false"){
                 var patt=/castShadow/;
                 if(patt.test(this.parentNode.getAttribute("filter"))){
                     var groupFilter=this.parentNode;
                     this.removeChild(groupFilter);
                     this.appendChild(this);
                     this.removeAttribute("castShadow");
                 }
                 else if(patt.test(this.getAttribute("filter"))){
                     this.removeAttribute("filter");
                     this.removeAttribute("castShadow");
                 }
             }
             
         }
        Object.prototype.draggable=function(f){
          this.setAttribute("draggable",f);
          var currentX,currentY,clickX,clickY;
          
             function mouseMove(e){
             e.preventDefault(); 
             if(this.getAttribute("click")=="true"){
                currentX+=e.clientX-clickX;
                currentY+=e.clientY-clickY;
                clickX+=e.clientX-clickX;
                clickY+=e.clientY-clickY;
                if(this.hasAttribute("cx")){
                 this.setAttribute("cx",currentX);
                 this.setAttribute("cy",currentY);   
                }
                else{
                 this.setAttribute("x",currentX);
                 this.setAttribute("y",currentY);
                }
                
                 }
             };
            function mouseDown(e){
                e.preventDefault();
                if(this.getAttribute("draggable")=="false"){
                  this.unmousedown(mouseDown);
                  this.unmouseup(mouseUp);
                  this.unmousemove(mouseMove);
                  this.removeAttribute("click");
                }
                else{
                this.setAttribute("click","true");
                clickX=e.clientX;
                clickY=e.clientY;
                 }
             };
           function mouseUp(){
                this.setAttribute("click","false");
            };
            if(this.getAttribute("draggable")=="true"){
             if(this.hasAttribute("cx")){
                 currentX=Number(this.getAttribute("cx"));
                 currentY=Number(this.getAttribute("cy"));
                 this.mousedown(mouseDown);
                 this.mouseup(mouseUp);
                 this.mousemove(mouseMove);  
             }      
             else{
                 currentX=Number(this.getAttribute("x"));
                 currentY=Number(this.getAttribute("y"));
                 this.mousedown(mouseDown);
                 this.mouseup(mouseUp);
                 this.mousemove(mouseMove); 
                 
             }
          }
      };
      
      
    function generateRadialGradient(gradient){
        var radialGradient=document.createElementNS(svgNS,'radialGradient');
        radialGradient.setAttribute("id","rad_grad"+counter_for_radialGradient);
        radialGradient.setAttribute("cx","50%");
        radialGradient.setAttribute("cy","50%");
        radialGradient.setAttribute("r","50%");
        var colors=[],
            no_of_colors=gradient.split("-").length,
            offset=0,
            offset_gap=100/(no_of_colors-1),
            flag=0;
       if(gradient.contains("(")){
           var co_ordinates=gradient.extract("(",")").split(",");
           co_ordinates[0]=Number(co_ordinates[0])*100;
           co_ordinates[1]=Number(co_ordinates[1])*100;
           radialGradient.setAttribute("fx",co_ordinates[0]+"%");
           radialGradient.setAttribute("fy",co_ordinates[1]+"%");
           flag=1;
       }
       else{
           radialGradient.setAttribute("fx","50%");
           radialGradient.setAttribute("fy","50%");
       }
       if(flag){
           for(var i=0;i<no_of_colors;i++){
             var stop=document.createElementNS(svgNS,'stop');
             if(i==0){
                colors[i]=gradient.split("-")[i].split(")")[1]; 
                }
             else{
                 colors[i]=gradient.split("-")[i];
             }
             if(colors[i].contains(":")){
                 stop.setAttribute("offset",colors[i].split(":")[1]+"%");
                 offset_gap=(100-Number(colors[i].split(":")[1]))/((no_of_colors-1)-i);
                 offset=Number(colors[i].split(":")[1])+offset_gap;
                 stop.setAttribute("style","stop-color:"+colors[i].split(":")[0]+";stop-opacity:1");
             }
             else{
                 stop.setAttribute("offset",offset);
                 offset+=offset_gap;
                 stop.setAttribute("style","stop-color:"+colors[i]+";stop-opacity:1");
             }
             radialGradient.appendChild(stop);
           }
       }
       else{
           for(var i=0;i<no_of_colors;i++){
              var stop=document.createElementNS(svgNS,'stop');
              if(i==0){
                  colors[i]=gradient.split("-")[i].slice(1);
              }
              else{
                  colors[i]=gradient.split("-")[i];
              }
               if(colors[i].contains(":")){
                 stop.setAttribute("offset",colors[i].split(":")[1]+"%");
                 offset_gap=(100-Number(colors[i].split(":")[1]))/((no_of_colors-1)-i);
                 offset=Number(colors[i].split(":")[1])+offset_gap;
                 stop.setAttribute("style","stop-color:"+colors[i].split(":")[0]+";stop-opacity:1");
                }
             else{
                 stop.setAttribute("offset",offset);
                 offset+=offset_gap;
                 stop.setAttribute("style","stop-color:"+colors[i]+";stop-opacity:1");
             }
              radialGradient.appendChild(stop);
           }
       }
       defs.appendChild(radialGradient);
    }
    function generateLinearGradient(gradient){
        var angle=Number(gradient.split("-")[0]),x1,y1,x2,y2;
        //var linearGradientDef=document.createElementNS(svgNS,'defs');
        var linearGradient=document.createElementNS(svgNS,'linearGradient');
        linearGradient.setAttribute("id","lin_grad"+counter_for_linearGradient);
        if(angle>=0&&angle<=45){
            x1="0%";
            y1=(0+(100/45)*(angle-0))+"%";
            x2="100%";
            y2="0%";
        }
        else if(angle>45&&angle<=90){
            x1="0%";
            y1="100%";
            x2=(100-(100/45)*(angle-45))+"%";
            y2="0%";
        }
        else if(angle>90&&angle<=135){
            x1=(0+(100/45)*(angle-90))+"%";
            y1="100%";
            x2="0%";
            y2="0%";
        }
        else if(angle>135&&angle<=180){
            x1="100%";
            y1=(100-(100/45)*(angle-135))+"%";
            x2="0%";
            y2="0%";
        }
        else if(angle>180&&angle<=225){
            x1="100%";
            y1="0%";
            x2="0%";
            y2=(0+(100/45)*(angle-180))+"%";
        }
        else if(angle>225&&angle<=270){
            x1=(100-(100/45)*(angle-225))+"%";
            y1="0%";
            x2="0%";
            y2="100%";
        }
        else if(angle>270&&angle<=315){
            x1="0%";
            y1="0%";
            x2=(0+(100/45)*(angle-270))+"%";
            y2="100%";
        }
        else if(angle>315&&angle<=360){
            x1="0%";
            y1="0%";
            x2="100%";
            y2=(100-(100/45)*(angle-315))+"%";
        }
       linearGradient.setAttribute("x1",x1); 
       linearGradient.setAttribute("y1",y1);
       linearGradient.setAttribute("x2",x2);
       linearGradient.setAttribute("y2",y2); 
       var no_of_colors=gradient.split("-").length-1;
       var colors=[];
       for(var i=1;i<=no_of_colors;i++){
           colors[i-1]=gradient.split("-")[i];
       }
       var offset=0,offset_gap=100/(no_of_colors-1);
       for(var i=0;i<no_of_colors;i++){
           var stop=document.createElementNS(svgNS,'stop');
           if(colors[i].contains(":")){
               stop.setAttribute("offset",colors[i].split(":")[1]+"%");
               stop.setAttribute("style","stop-color:"+colors[i].split(":")[0]+";stop-opacity:1");
               offset_gap=(100-Number(colors[i].split(":")[1]))/((no_of_colors-1)-i);
               offset=Number(colors[i].split(":")[1])+offset_gap;
           }
           else{
               stop.setAttribute("offset",offset+"%");
               stop.setAttribute("style","stop-color:"+colors[i]+";stop-opacity:1");
               offset+=offset_gap;
           }
           linearGradient.appendChild(stop);

       }
       defs.appendChild(linearGradient);
       
    }
    function defineProperties(){   //prototype for the 'attr' function which will be binded to each svg object
           if(arguments[0].hasOwnProperty("fill")){//checks if the object in the parameter of the attr function has any property named 'fill'.
               //the fill property is an array which takes one/two values.(fill color is compulsory,opacity value is optional)
               // the syntax for the fill array is:[<fill color(string)>,<opacity-value(numeric)>]
               if(arguments[0]["fill"][0]){//checks if any fill(color) value is given.if not then it would just return the object without making any "fill" changes.
               if(!isNaN(Number(arguments[0]["fill"][0].charAt(0)))){//checks if any linear gradient fill is given.
                   generateLinearGradient(arguments[0]["fill"][0]);
                   this.setAttribute("fill","url(#lin_grad"+counter_for_linearGradient+")");
                   counter_for_linearGradient++;
               }
               else if(arguments[0]["fill"][0].charAt(0)==="r"&&arguments[0]["fill"][0].contains("-")){//checks if any radial gradient fill is given
                    generateRadialGradient(arguments[0]["fill"][0]);
                   this.setAttribute("fill","url(#rad_grad"+counter_for_radialGradient+")");
                   counter_for_radialGradient++;
               }
               else{
                this.setAttribute("fill",arguments[0]["fill"][0]);//fill normally with the color value given.
                }
               }
               else{
                   return this;
               }
               if(arguments[0]["fill"][1]){//checks if any opacity value is given.
               this.setAttribute("opacity",arguments[0]["fill"][1]);
               }
               else{
               this.setAttribute("opacity",1);
               }
           }
           if(arguments[0].hasOwnProperty("blur")){//checks if the object in the parameter of the attr function has any property named 'blur'.
              if(arguments[0]["blur"]!=null){//checks if any standard-deviation value is given.if not then it would just return the object without making any blur changes.
              var filter=document.createElementNS(svgNS,'filter');
              var gaussianBlur=document.createElementNS(svgNS,'feGaussianBlur');
              filter.setAttribute("id","blurFilter"+counter_for_blurFilter);//sets the id for the filter
              gaussianBlur.setAttribute("in","SourceGraphic");
              gaussianBlur.setAttribute("stdDeviation",arguments[0]["blur"]);//gets the stdDeviation value and sets it.
              filter.appendChild(gaussianBlur);
              defs.appendChild(filter);
              this.setAttribute("filter","url(#blurFilter"+counter_for_blurFilter+")");//applies the filter
              counter_for_blurFilter++;//increments the counter.
              }
             else{
                 return this;
             }
          }
           if(arguments[0].hasOwnProperty("stroke")){//checks if the object in the parameter of the attr function has any property named 'stroke'.
               //the stroke property is an array which takes one/two values.(stroke color is compulsory,stroke-width value is optional)
               // the syntax for the fill array is:[<stroke color(string)>,<stroke-width value(numeric)>,<stroke-dasharray(string)>,<stroke-linejoin(string)>]
               if(arguments[0]["stroke"][0]){//checks if any stroke(color) value is given.if not then it would just return the object without making any "stroke" changes.
               this.setAttribute("stroke",arguments[0]["stroke"][0]);
               }
               else{
                   return this;
               }
               if(arguments[0]["stroke"][1]){//checks if any stroke-width value is given.
               this.setAttribute("stroke-width",arguments[0]["stroke"][1]);
               }
               else{
                  this.setAttribute("stroke-width",1); 
               }
               if(arguments[0]["stroke"][2]){//checks if any stroke-dasharray value is given.
               this.setAttribute("stroke-dasharray",arguments[0]["stroke"][2]);
               }
               if(arguments[0]["stroke"][3]){//checks if any stroke-linejoin value is given.
               this.setAttribute("stroke-linejoin",arguments[0]["stroke"][3]);
               }
           }
           
           if(arguments[0].hasOwnProperty("translate")){//checks if the object in the parameter of the attr function has any property named 'translate'.
               //the translate property is an array which takes one/two values.(x axis translate value is compulsory,y axis translate value is optional)
               // the syntax for the translate array is:[<x axis translate>,<y axis translate>]
               if(arguments[0]["translate"][0]){//checks if any x axis translate value is given.if not then it would just return the object without making any "translate" changes.
               if(arguments[0]["translate"][1]!=null){//checks if any y axis translate value is given.
               this.setAttribute("transform","translate("+arguments[0]["translate"][0]+","+arguments[0]["translate"][1]+")");
               }
               else{
                 this.setAttribute("transform","translate("+arguments[0]["translate"][0]+",0)");  
               }
               }
               else{
                   return this;
               }
               }
           if(arguments[0].hasOwnProperty("scale")){//checks if the object in the parameter of the attr function has any property named 'scale'.
               //the scale property is an array which takes one/two values.(x axis scale value is compulsory,y axis scale value is optional)
               // the syntax for the scale array is:[<x axis scale>,<y axis scale>]
               if(arguments[0]["scale"][0]){//checks if any x axis scale value is given.if not then it would just return the object without making any "scale" changes.
               if(arguments[0]["scale"][1]!=null){//checks if any y axis scale value is given.
               this.setAttribute("transform","scale("+arguments[0]["scale"][0]+","+arguments[0]["scale"][1]+")");
               }
               else{
                 this.setAttribute("transform","scale("+arguments[0]["scale"][0]+","+arguments[0]["scale"][0]+")");  
               }
               }
               else{
                   return this;
               }
               }
           if(arguments[0].hasOwnProperty("rotateZ")){//checks if the object in the parameter of the attr function has any property named 'rotateZ'.
              if(arguments[0]["rotateZ"][0]!=null){//checks if any roation value(in deg) is given.if not then it would just return the object without making any "rotation" changes.
              if(arguments[0]["rotateZ"][1]!=null&&arguments[0]["rotateZ"][2]){//checks if any rotaion point is given.if not then the current origin is taken as the rotation point.
              this.setAttribute("transform","rotate("+arguments[0].rotateZ[0]+" "+arguments[0].rotateZ[1]+" "+arguments[0].rotateZ[2]+")");
              }
              else{
              this.setAttribute("transform","rotate("+arguments[0].rotateZ[0]+")");
              }
              }
             else{
                 return this;
             }
          }
           if(arguments[0].hasOwnProperty("rotateY")){//checks if the object in the parameter of the attr function has any property named 'rotateY'.
              if(arguments[0]["rotateY"][0]!=null){//checks if any roation value(in deg) is given.if not then it would just return the object without making any "rotation" changes.
              if(arguments[0]["rotateY"][1]!=null&&arguments[0]["rotateY"][2]){//checks if any rotaion point is given.if not then the current origin is taken as the rotation point.
              this.style["-webkit-transform"] = "perspective( 600px ) rotateY("+arguments[0].rotateY[0]+"deg)";
              this.style.transformOrigin = arguments[0]["rotateY"][1]+"px "+arguments[0]["rotateY"][2]+"px";
              }
              else{
              this.style["-webkit-transform"]= "rotateY("+arguments[0]["rotateY"][0]+"deg)";
              }
              }
             else{
                 return this;
             }
          }
          if(arguments[0].hasOwnProperty("rotateX")){//checks if the object in the parameter of the attr function has any property named 'rotateX'.
              if(arguments[0]["rotateX"][0]!=null){//checks if any roation value(in deg) is given.if not then it would just return the object without making any "rotation" changes.
              if(arguments[0]["rotateX"][1]!=null&&arguments[0]["rotateX"][2]){//checks if any rotaion point is given.if not then the current origin is taken as the rotation point.
              this.style["-webkit-transform"] = "perspective( 600px ) rotateX("+arguments[0].rotateX[0]+"deg)";
              this.style.transformOrigin = arguments[0]["rotateX"][1]+"px "+arguments[0]["rotateX"][2]+"px";
              }
              else{
              this.style["-webkit-transform"]= "rotateX("+arguments[0]["rotateX"][0]+"deg)";
              }
              }
             else{
                 return this;
             }
          }
          if(arguments[0].hasOwnProperty("clip")){//checks if the object in the parameter of the attr function has any property named 'clip'.
              if(arguments[0]["clip"]!=null){//checks if any clip value is given.if not then it would just return the object without making any "clip" changes.
                 var clipPath=document.createElementNS(svgNS,'clipPath');
                 clipPath.setAttribute("id","clipPath"+counter_for_clipPath);
                 switch(arguments[0]["clip"][0]){
                     case "rect":
                                 var rect=document.createElementNS(svgNS,'rect');
                                 rect.setAttribute("x",arguments[0]["clip"][1]);
                                 rect.setAttribute("y",arguments[0]["clip"][2]);
                                 rect.setAttribute("width",arguments[0]["clip"][3]);
                                 rect.setAttribute("height",arguments[0]["clip"][4]);
                                 clipPath.appendChild(rect);
                                 break;
                     case "circle":
                                  var circle=document.createElementNS(svgNS,'circle');  
                                  circle.setAttribute("cx",arguments[0]["clip"][1]);
                                  circle.setAttribute("cy",arguments[0]["clip"][2]);
                                  circle.setAttribute("r",arguments[0]["clip"][3]);
                                  clipPath.appendChild(circle);
                                  break;
                    case "ellipse":
                                  var ellipse=document.createElementNS(svgNS,'ellipse');  
                                  ellipse.setAttribute("cx",arguments[0]["clip"][1]);
                                  ellipse.setAttribute("cy",arguments[0]["clip"][2]);
                                  ellipse.setAttribute("rx",arguments[0]["clip"][3]);
                                  ellipse.setAttribute("ry",arguments[0]["clip"][4]);
                                  clipPath.appendChild(ellipse);
                                  break;
                    case "polygon":
                                  var polygon=document.createElementNS(svgNS,'polygon');  
                                  polygon.setAttribute("points",arguments[0]["clip"][1]);
                                  clipPath.appendChild(polygon);
                                  break;
                 }
                 defs.appendChild(clipPath);
                 this.setAttribute("clip-path","url(#clipPath"+counter_for_clipPath+")");
                 counter_for_clipPath++;
              }
             else{
                 return this;
             }
          }
           if(arguments[0].hasOwnProperty("font-weight")){//checks if the object in the parameter of the attr function has any property named 'font-weight'.
              if(arguments[0]["font-weight"]!=null){//checks if any font-weight value is given.if not then it would just return the object without making any changes.             
              this.setAttribute("font-weight",arguments[0]["font-weight"]);
              }
             else{
                 return this;
             }
          }
          if(arguments[0].hasOwnProperty("font-style")){//checks if the object in the parameter of the attr function has any property named 'font-style'.
              if(arguments[0]["font-style"]!=null){//checks if any font-style value is given.if not then it would just return the object without making any changes.
              
              this.setAttribute("font-style",arguments[0]["font-style"]);
              
              }
             else{
                 return this;
             }
          }
          if(arguments[0].hasOwnProperty("font-size")){//checks if the object in the parameter of the attr function has any property named 'font-size'.
              if(arguments[0]["font-size"]!=null){//checks if any font-size value is given.if not then it would just return the object without making any changes.
              
              this.setAttribute("font-size",arguments[0]["font-size"]);
              
              }
             else{
                 return this;
             }
          }
          if(arguments[0].hasOwnProperty("text-anchor")){//checks if the object in the parameter of the attr function has any property named 'text-anchor'.
              if(arguments[0]["text-anchor"]!=null){//checks if any text-anchor value is given.if not then it would just return the object without making any changes.
              
              this.setAttribute("text-anchor",arguments[0]["text-anchor"]);
              
              }
             else{
                 return this;
             }
          }
           if(arguments[0].hasOwnProperty("font-family")){//checks if the object in the parameter of the attr function has any property named 'font-family'.
              if(arguments[0]["font-family"]!=null){//checks if any font-family value is given.if not then it would just return the object without making any changes.
              
              this.setAttribute("font-family",arguments[0]["font-family"]);
              
              }
             else{
                 return this;
             }
          }
          
          return this;
       }
       function fadeOut(){ //prototype for the fadeOut animation which will be binded to each svg object.the animation duration will be in secs.
           var fadeOut = document.createElementNS(svgNS,'animate');
           this.setAttribute("opac",this.getAttribute("opacity"));//creates a custom attribute and assigns it to the current opacity value.
           fadeOut.setAttribute("attributeType","XML");
           fadeOut.setAttribute("id","fadeout-animation");
           fadeOut.setAttribute("attributeName","opacity");
           fadeOut.setAttribute("from",this.getAttribute("opacity"));
           fadeOut.setAttribute("to",0);
           fadeOut.setAttribute("dur",arguments[0]+"s");
           fadeOut.setAttribute("repeatCount",1);
           this.appendChild(fadeOut);
           let j=this;
           setTimeout(function(){j.setAttribute("opacity",fadeOut.getAttribute("to"));},arguments[0]*1000);//sets the opacity value of the object to its new value after the animation stops.
       }
       function fadeIn(){//prototype for the fadeIn animation which will be binded to each svg object.the animation duration will be in secs.
          var childNode=this.getElementsByTagName("animate");//gets all the animation elements of the object.
          for(var a in childNode){
              if(childNode[a].getAttribute("id")=="fadeout-animation"){//gets the animation element which was used for fadeOut.
                  var fadeOutNode=childNode[a];
                  break;
              }
          }
          var begin=fadeOutNode.getAttribute("dur").split("s")[0];//gets the duration(in sec) of the fadeOut animation.this will be the begining time for the fadeIn animation.
          let j=this,k=arguments[0]; 
          setTimeout(function(){
               var fadeIn = document.createElementNS(svgNS,'animate');
               fadeIn.setAttribute("attributeType","XML");
               fadeIn.setAttribute("attributeName","opacity");
               fadeIn.setAttribute("from",j.getAttribute("opacity"));
               fadeIn.setAttribute("to",j.getAttribute("opac"));
               fadeIn.setAttribute("begin",begin+"s");
               fadeIn.setAttribute("dur",k+"s");
               fadeIn.setAttribute("repeatCount",1);      
               j.appendChild(fadeIn);
               setTimeout(function(){j.setAttribute("opacity",fadeIn.getAttribute("to"));},k*1000); },Number(begin)*1000);//sets the opacity value of the object to the value before when fadeOut effect was applied.      
       }
    this.rect=(function(){  // creates an svg rectangle.
    var rect = document.createElementNS(svgNS,'rect');
    rect.setAttribute("x",arguments[0]);
    rect.setAttribute("y",arguments[1]);
    rect.setAttribute("width",arguments[2]);
    rect.setAttribute("height",arguments[3]);
    if(typeof arguments[4]==="number"){// checks if any corner radius is given.
        rect.setAttribute("rx",arguments[4]);
        rect.setAttribute("ry",arguments[4]);
    }
    rect.attr=defineProperties.bind(rect);// binds the defineProperties function.
    rect.fadeOut=fadeOut.bind(rect);// binds the fadeOut function.
    rect.fadeIn=fadeIn.bind(rect);// binds the fadeIn function.
    this.canvas.appendChild(rect);
    if(typeof arguments[arguments.length-1]==="string"){// checks if any set id is given and appends the object to that respective set.
        var set=document.getElementById(arguments[arguments.length-1]);
        set.appendChild(rect);
    }
    else{
        rect.setAttribute("fill","none");
        rect.setAttribute("stroke","black");
    }
    return rect; // returns created the SVG rectangle object.
    });
    this.path=(function(){
        var path=document.createElementNS(svgNS,'path');
        if(arguments[0]){
        path.setAttribute("d",arguments[0]);
        }
        else{
            return path;
        }
        path.attr=defineProperties.bind(path);// binds the defineProperties function.
        path.fadeOut=fadeOut.bind(path);// binds the fadeOut function.
        path.fadeIn=fadeIn.bind(path);// binds the fadeIn function.
        this.canvas.appendChild(path);
        if(arguments[1]){// checks if any set id is given and appends the object to that respective set.
        var set=document.getElementById(arguments[1]);
        set.appendChild(path);
        }
       else{
        path.setAttribute("fill","none");
        path.setAttribute("stroke","black");
       }
        return path;
    });
    this.polygon=(function(){  // craetes an svg polygon.
    var polygon = document.createElementNS(svgNS,'polygon');
    polygon.setAttribute("points",arguments[0]);
    polygon.attr=defineProperties.bind(polygon);// binds the defineProperties function.
    polygon.fadeOut=fadeOut.bind(polygon);// binds the fadeOut function.
    polygon.fadeIn=fadeIn.bind(polygon);// binds the fadeIn function.
    this.canvas.appendChild(polygon);
    if(arguments[1]){// checks if any set id is given and appends the object to that respective set.
        var set=document.getElementById(arguments[1]);
        set.appendChild(polygon);
    }
    else{
        polygon.setAttribute("fill","none");
        polygon.setAttribute("stroke","black");
    }
    return polygon;
    });
    this.polyline=(function(){  // craetes an svg polyline.
    var polyline = document.createElementNS(svgNS,'polyline');
    polyline.setAttribute("points",arguments[0]);
    polyline.attr=defineProperties.bind(polyline);// binds the defineProperties function.
    polyline.fadeOut=fadeOut.bind(polyline);// binds the fadeOut function.
    polyline.fadeIn=fadeIn.bind(polyline);// binds the fadeIn function.
    this.canvas.appendChild(polyline);
    if(arguments[1]){// checks if any set id is given and appends the object to that respective set.
        var set=document.getElementById(arguments[1]);
        set.appendChild(polyline);
    }
    else{
        polyline.setAttribute("fill","none");
        polyline.setAttribute("stroke","black");
    }
    return polyline;
    });
    this.text=(function(){  // craetes an svg text.
    var text = document.createElementNS(svgNS,'text');
    text.setAttribute("x",arguments[0]);
    text.setAttribute("y",arguments[1]);
    text.innerHTML=arguments[2];
    text.attr=defineProperties.bind(text);// binds the defineProperties function.
    text.fadeOut=fadeOut.bind(text);// binds the fadeOut function.
    text.fadeIn=fadeIn.bind(text);// binds the fadeIn function.
    this.canvas.appendChild(text);
    if(arguments[3]){// checks if any set id is given and appends the object to that respective set.
        var set=document.getElementById(arguments[3]);
        set.appendChild(text);
    }
    else{
        text.setAttribute("fill","black");
     }
    return text;
    });
    this.textPath=(function(){  // craetes an svg textPath.
    var text = document.createElementNS(svgNS,'text');
    var text_def = document.createElementNS(svgNS,'defs');//the def that will contain the path.
    var path = document.createElementNS(svgNS,'path');//the path along which the text would be aligned.
    path.setAttribute("id","text_path"+counter_for_textpath);//setting the id of the path.
    path.setAttribute("d",arguments[1]);
    var path_length=path.getTotalLength();
    text.setAttribute("textLength",path_length);//setting the text length so the text follows the entire path.
    text.setAttribute("lengthAdjust","spacingAndGlyphs");//wrapping the text.
    text_def.appendChild(path);
    var text_path = document.createElementNS(svgNS,'textPath');//the textPath
    text_path.innerHTML=arguments[0];
    text_path.setAttribute("href","#text_path"+counter_for_textpath);//linking the textPath with the path.
    counter_for_textpath++;//incrementing the counter of the textpath.
    text.appendChild(text_path);
    this.canvas.appendChild(text_def);
    this.canvas.appendChild(text);
    text.attr=defineProperties.bind(text);// binds the defineProperties function.
    text.fadeOut=fadeOut.bind(text);// binds the fadeOut function.
    text.fadeIn=fadeIn.bind(text);// binds the fadeIn function.
    if(arguments[2]){// checks if any set id is given and appends the object to that respective set.
        var set=document.getElementById(arguments[2]);
        set.appendChild(text);
    }
    else{
        text.setAttribute("fill","black");
     }
    return text;
    });
    this.circle=(function(){
    var circle = document.createElementNS(svgNS,'circle');
    circle.setAttribute("cx",arguments[0]);
    circle.setAttribute("cy",arguments[1]);
    circle.setAttribute("r",arguments[2]);
    circle.attr=defineProperties.bind(circle);
    circle.fadeOut=fadeOut.bind(circle);
    circle.fadeIn=fadeIn.bind(circle);
    this.canvas.appendChild(circle);
     if(arguments[3]){
        var set=document.getElementById(arguments[4]);
        set.appendChild(circle);
    }
    else{
      circle.setAttribute("fill","none");
      circle.setAttribute("stroke","black");
    }
    return circle;
    });
    this.ellipse=(function(){
        var ellipse = document.createElementNS(svgNS,'ellipse');
        ellipse.setAttribute("cx",arguments[0]);
        ellipse.setAttribute("cy",arguments[1]);
        ellipse.setAttribute("rx",arguments[2]);
        ellipse.setAttribute("ry",arguments[3]);
        ellipse.attr=defineProperties.bind(ellipse);
        ellipse.fadeOut=fadeOut.bind(ellipse);
        ellipse.fadeIn=fadeIn.bind(ellipse);
        this.canvas.appendChild(ellipse);
        if(arguments[4]){
        var set=document.getElementById(arguments[4]);
        set.appendChild(ellipse);
        }
        else{
        ellipse.setAttribute("fill","none");
        ellipse.setAttribute("stroke","black");
        }
        return ellipse;
    });
    this.img=(function(){
        var image = document.createElementNS(svgNS,'image');
        image.setAttribute("x",arguments[0]);
        image.setAttribute("y",arguments[1]);
        image.setAttribute("width",arguments[2]);
        image.setAttribute("height",arguments[3]);
        image.setAttribute("href",arguments[4]);
        image.attr=defineProperties.bind(image);
        image.fadeOut=fadeOut.bind(image);
        image.fadeIn=fadeIn.bind(image);
        this.canvas.appendChild(image);
        if(arguments[5]){
        var set=document.getElementById(arguments[5]);
        set.appendChild(image);
        }
        return image;
    });
    this.animation=(function(){
        var animation = document.createElementNS(svgNS,'animate'),
             attrName=Object.keys(arguments[0])[0];
        animation.setAttribute("attributeType","XML");
        if(attrName=="path"){
            attrName="d";
        }
        animation.setAttribute("attributeName",attrName);
        animation.setAttribute("to",arguments[0][Object.keys(arguments[0])[0]]);
        animation.setAttribute("dur",arguments[1]+"ms");
        animation.setAttribute("fill","freeze");
         if(arguments[2]){
            animation.setAttribute("repeatCount",arguments[2]);
        }
        else{
            animation.setAttribute("repeatCount",1);
          }
       if(arguments[3]){
           animation.setAttribute("begin",arguments[3]); 
        }
        else{
            animation.setAttribute("begin","500ms");
        }
        return animation;
    });
    this.animateTransform=(function(){
        var animation = document.createElementNS(svgNS,'animateTransform');
        animation.setAttribute("attributeName","transform");
        animation.setAttribute("type",Object.keys(arguments[0])[0]);
        animation.setAttribute("fill","freeze");
        animation.setAttribute("from",arguments[0][Object.keys(arguments[0])[0]][0]);
        animation.setAttribute("to",arguments[0][Object.keys(arguments[0])[0]][1]);
        animation.setAttribute("dur",arguments[1]+"ms");
        if(arguments[2]){
          animation.setAttribute("repeatCount",arguments[2]);  
        }
        else{
        animation.setAttribute("repeatCount",1);
        }
        if(arguments[3]){
           animation.setAttribute("begin",arguments[3]); 
        }
        else{
            animation.setAttribute("begin","500ms");
        }
        return animation;
    });
    this.animateMotion=(function(){
        var animation = document.createElementNS(svgNS,'animateMotion');
        animation.setAttribute("fill","freeze");
        animation.setAttribute("path",arguments[0][Object.keys(arguments[0])[0]]);
        animation.setAttribute("dur",arguments[1]+"ms");
        if(arguments[2]){
          animation.setAttribute("repeatCount",arguments[2]);  
        }
        else{
        animation.setAttribute("repeatCount",1);
        }
        if(arguments[3]){
           animation.setAttribute("begin",arguments[3]); 
        }
        else{
            animation.setAttribute("begin","500ms");
        }
        return animation;
    });
    this.set=(function(){
       var set= document.createElementNS(svgNS,'g');// creates an svg set.
       try{
       set.setAttribute("id",arguments[0]);// checks if any id is provided in the parameter of the called function.if not then default id value is given to the created set.
        }
        catch(e){
            set.setAttribute("id","not-defined");
        }
        set.setAttribute("fill","none");
        set.setAttribute("stroke","black");
        set.attr=defineProperties.bind(set);
        set.fadeOut=fadeOut.bind(set);
        set.fadeIn=fadeIn.bind(set);
        this.canvas.appendChild(set);
        return set;  //returns the created SVG set object.
    });
    document.getElementById(arguments[0]).appendChild(svg);// appends the SVG canvas to the container whose id is specified in the first argument of the Logan function.
   // return svg; //returns the created SVG canvas object.
});
