window.onload=function(){ //entry point
  window.onresize();
  initGame();
};
window.onresize = function(){
  var agent = navigator.userAgent;
  if( agent.search(/iPhone/) != -1 || agent.search(/iPod/) != -1 || agent.search(/iPad/) != -1){
    document.getElementById("canvas0").width  = 512;
    document.getElementById("canvas0").height = 512;
  }else{
    var newWidth  = [document.documentElement.clientWidth-300, 320].max();
    var newHeight = [(document.documentElement.clientHeight-160)*0.9, 180].max();
    var newSize = [newWidth, newHeight].min();
    document.getElementById("canvas0").width  = newSize;
    document.getElementById("canvas0").height = newSize;
  }
  isRequestedDraw = true;
};
//fields for game ---------------------------
var debug= false;
var turn = 0;
var turnstr=["black","white"];
var cource;//cource[c]
//fields for graphic ------------------------
var isRequestedDraw = false;
//initialize game----------------------------
var initGame=function(){
  turn=1;
  putDebug(XorShift.test(123)+"<br>");
  putDebug(XorShift.test(456)+"<br>");
  putDebug(XorShift.test(123)+"<br>");
};
//when push send button ---------------------
var receiveCommand=function(str){
  /* str = "d0 l0 d1 l1 d2 l2 ..."
    d = dimension
    l = location
  */
  var a = getIn().split(" ");
  if(a.length==1){
    if(a[0]=="init"||a[0]=="reset"){
      initGame();
      return "";
    }
  }
  if(!a.length%2!=0){
    putOut("error.");
    return "";
  }
  var dims = a.length;
  
  //new stone
  var newstone=new Array(dims); // newstone[d]=location of the new stone
  for(var d=0;d<dims;d++){
    if(!isFinite(a[d])){
      putOut("\""+a[d]+"\""+"is not a number.<br>");
      putOut(turnstr[turn]+(stonelist[turn].length+1)+"> ");
      return form1.command.value;
    }
    newstone[d]=parseInt(a[d]);
    if(isNaN(newstone[d])){
      putOut("\""+a[d]+"\""+"is not a number.<br>");
      putOut(turnstr[turn]+(stonelist[turn].length+1)+"> ");
      return form1.command.value;
    }
  }// for dt

  //check onto
  if(getStone(newstone)!=-1){
    putOut("[error] already put.<br>");
    putOut(turnstr[turn]+(stonelist[turn].length+1)+"> ");
    return form1.command.value;
  }
  
  //put
  stonelist[turn].push(newstone);
  if(maxdims<newstone.length) maxdims=newstone.length;
  
  //out
  putOut("(");
  for(var d=0;d<maxdims;d++){
    var l=0;
    if(d<newstone.length) l=newstone[d];
    putOut(l);
    if(d!=maxdims-1) putOut(",");
  }
  putOut(")<br>");
  //judge win

  //init checked direction
  var dir=new Array(maxdims);
  for(var d=0;d<maxdims;d++) dir[d]=-1;
  
  //check for any direction
  while(true){
    //dir all zero check
    var allzero=true;
    for(var d=0;d<maxdims;d++){
      if(dir[d]!=0){
        allzero=false;
        break;
      }
    }
    if(allzero){
      dir[0]++;
      continue; // ignore all zero
    }
    
    //count number of series
    var c=1;
    c+=countSeries(newstone,dir,+1);
    c+=countSeries(newstone,dir,-1);
    if(turn==0 && c>5){
      alert(turnstr[1]+" won! (too long for black)<br>");
      initgame();
      return;
    }
    if(turn==0 && c==5){
      alert(turnstr[0]+" won!");
      initgame();
      return;
    }
    if(turn==1 && c>=5){
      alert(turnstr[1]+" won!");
      initgame();
      return;
    }
    //inclement dir
    var islast=true;
    for(var d=0;d<maxdims;d++){
      if(dir[d]<+1){
        dir[d]+=1;
        islast=false;
        break;
      }else{
        dir[d]=0;
      }
    }
    if(islast) break;
  }//while
  
  //next turn
  turn=(turn+1) % 2;
  putOut(turnstr[turn]+(stonelist[turn].length+1)+"> ");
  
  //debugout
  document.getElementById("debugout").innerHTML="";
  if(debug){
    putDebug("stonelist="+stonelist.toString()+"<br>");
  }
  return form1.command.value;
};
var putOut=function(str){
  document.getElementById("console").innerHTML += str;
}
var putDebug=function(str){
  document.getElementById("debugout").innerHTML += str;
}
var getIn=function(){
  return form1.command.value;
}
/* getStone(place) returns the stone in the place.
  place[d]=location of target place in dimenstion d
  getStone(place)= 0:black
  getStone(place)= 1:white
  getStone(place)=-1:blank
*/
var getStone=function(place){
  var maxdims2 = maxdims; //max number of dimensions including place
  if(maxdims2<place.length) maxdims2=place.length; 
  
  for(var p=0;p<2;p++){
    for(var s=0;s<stonelist[p].length;s++){
      var isfound=true;
      for(var d=0;d<maxdims2;d++){
        var pl=0;
        var sl=0;
        if(d<place          .length) pl=place[d];
        if(d<stonelist[p][s].length) sl=stonelist[p][s][d];
        if(pl!=sl){
          isfound=false;
          break;
        }
      }
      if(isfound) return p;
    }
  }// for p
  return -1;
}
var countSeries=function(newstone,dir,sign){
  var turn = getStone(newstone);
  var c=0;
  for(var x=1;x<5;x++){
    var checked=new Array(maxdims);
    for(var d=0;d<maxdims;d++){
      var nsl=0;
      if(d<newstone.length) nsl=newstone[d];
      checked[d]=nsl+dir[d]*sign*x;
    }
    if(getStone(checked)!=turn){
      return c;
    }else{
      c++;
    }
  }
  return c;
}









