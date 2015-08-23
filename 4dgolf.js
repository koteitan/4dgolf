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
var holeinput;//cource[c]
var fairways=7;
var fairway=new Array(fairways); //fairway[f][d]=location of fairway box in dimension d.
//fields for graphic ------------------------
var isRequestedDraw = false;
var campos=[-fairways,-fairways,-fairways];
var campos=
//initialize game----------------------------
var initGame=function(){
  //make hole
  holeinput=parseInt(form1.holeinput.value);
  XorShift.setSeed(holeinput)
  fairway=new Array(fairways);
  fairway[0]=[0,0,0];
  for(var f=0;f<fairways;f++){
    fairway[f]=new Array(3);
    dir[f]=new Array(3);
    do{
      for(var d=0;d<3;d++){
        dir[d]=Math.floor(XorShift.getRand()*3-1);
        fairway[f][d]=fairway[f-1][d]+dir[d];
      }
      //check unique
      var same=false;
      for(var f2=0;f2<f;f2++){
        if(fairway[f].isEqual(fairway[f2])) same=true;
      }
    }while(same);
  }
  procDraw();
  turn=0;
};
var putOut=function(str){
  document.getElementById("console").innerHTML += str;
}
var putDebug=function(str){
  document.getElementById("debugout").innerHTML += str;
}
var procDraw=function(){
  var wx = canvas[0].width;
  var wy = canvas[0].height;
  
}







