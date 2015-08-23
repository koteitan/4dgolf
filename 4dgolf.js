window.onload=function(){ //entry point
  window.onresize();
  initGame();
  initDraw();
  procDraw();
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
var holerand;
//fields for graphic ------------------------
var canvas = new Array(2);
var ctx    = new Array(2);
var isRequestedDraw = true;
var isRequestedDraw = false;
var cam; //camera object
var gP;//physic coordinate
var gS;//screen coordinate
//initialize game----------------------------
var initGame=function(){
  //make hole
  holeinput=parseInt(form1.holeinput.value);
  holerand =new XorShift(holeinput);
  fairway=new Array(fairways);
  fairway[0]=[0,0,0];
  for(var f=1;f<fairways;f++){
    fairway[f]=new Array(3);
    var dir=new Array(3);
    do{
      for(var d=0;d<3;d++){
        dir[d]=Math.floor(holerand.getNext()*3-1);
        fairway[f][d]=fairway[f-1][d]+dir[d];
      }
      //check unique
      var same=false;
      for(var f2=0;f2<f;f2++){
        if(fairway[f].isEqual(fairway[f2])) same=true;
      }
    }while(same);
  }
  turn=0;
};
var resetGame=function(){
  initGame();
  initDraw();
  procDraw();
}
var wirecube=[
 [ [-0.5,-0.5,-0.5],[+0.5,-0.5,-0.5]],
 [ [-0.5,+0.5,-0.5],[+0.5,+0.5,-0.5]],
 [ [-0.5,-0.5,-0.5],[-0.5,+0.5,-0.5]],
 [ [+0.5,-0.5,-0.5],[+0.5,+0.5,-0.5]],
 [ [-0.5,-0.5,+0.5],[+0.5,-0.5,+0.5]],
 [ [-0.5,+0.5,+0.5],[+0.5,+0.5,+0.5]],
 [ [-0.5,-0.5,+0.5],[-0.5,+0.5,+0.5]],
 [ [+0.5,-0.5,+0.5],[+0.5,+0.5,+0.5]],
 [ [-0.5,-0.5,-0.5],[-0.5,-0.5,+0.5]],
 [ [-0.5,+0.5,-0.5],[-0.5,+0.5,+0.5]],
 [ [+0.5,-0.5,-0.5],[+0.5,-0.5,+0.5]],
 [ [+0.5,+0.5,-0.5],[+0.5,+0.5,+0.5]]
 ];
var initDraw=function(){
  //renderer
  for(var i=0;i<1;i++){
    canvas[i] = document.getElementById("canvas"+i);
    if(!canvas[i]||!canvas[i].getContext) return false;
    ctx[i] = canvas[i].getContext('2d');
  }

  //set coordinate
  var gP = new Geom(3,[[-1,-1,-1],[+1,+1,+1]]);
  var wx = canvas[0].width;
  var wy = canvas[0].height;
  var gS = new Geom(3,[[0,1,0],[1,0,1] ]);
  cam=new Camera();
  cam0=new Camera();
  cam.pos=mulkv(fairways/2,[-1,-1,-1]);
  cam.dirmz =normalize(sub([0,0,0],cam.pos));
  cam.dirx  =mul(getRotate(cam0.dirmz, cam0.dirx, cam.dirmz, cam.dirx),cam0.dirx);
  //clear ---------
  ctx[0].clearRect(0, 0, wx-1, wy-1);
  
  //draw hole ------
  ctx[0].strokeWeight='1';
  ctx[0].lineWidth='1';
  for(var f=0;f<fairways;f++){
    if(f==0||f==fairways-1){
      ctx[0].strokeStyle='rgb(128,255,128)';
    }else{
      ctx[0].strokeStyle='rgb(0,128,0)';
    }
    var fc=wirecube.clone();
    for(var l=0;l<fc.length;l++){
      fc[l][0] = add(fc[l][0], fairway[f]);
      fc[l][1] = add(fc[l][1], fairway[f]);
      var fc2d = [transCam(fc[l][0], cam, cam0, gP, gS), 
                  transCam(fc[l][1], cam, cam0, gP, gS)];
      ctx[0].beginPath();
      ctx[0].moveTo(fc2d[0][0]*wx,fc2d[0][1]*wy);
      ctx[0].lineTo(fc2d[1][0]*wx,fc2d[1][1]*wy);
      ctx[0].stroke();
    }
  }
};
var putOut=function(str){
  document.getElementById("console").innerHTML += str;
}
var putDebug=function(str){
  document.getElementById("debugout").innerHTML += str;
}
var procDraw=function(){
}
