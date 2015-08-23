window.onload=function(){ //entry point
  window.onresize();
  initGame();
  initDraw();
  initEvent();
  setInterval(procAll, 1000/frameRate);
};
var procAll=function(){ //main loop
  if(isRequestedDraw){
    procDraw();
    isRequestedDraw = false;
  }
  procEvent();
}
window.onresize = function(){
  var agent = navigator.userAgent;
  if( agent.search(/iPhone/) != -1 || agent.search(/iPod/) != -1 || agent.search(/iPad/) != -1){
    wx = 512;
    wy = 512;
  }else{
    var newWidth  = [document.documentElement.clientWidth-300, 320].max();
    var newHeight = [(document.documentElement.clientHeight-160)*0.9, 180].max();
    var newSize = [newWidth, newHeight].min();
    wx = newSize;
    wy = newSize;
  }
  document.getElementById("canvas0").width = wx;
  document.getElementById("canvas0").height= wy;
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
var frameRate = 60; // [fps]
var canvas = new Array(2);
var ctx    = new Array(2);
var isRequestedDraw = true;
var isRequestedDraw = false;
var cam; //camera object
var gP;//physic coordinate
var gS;//screen coordinate
var wx, wy; // screen size
var startpos; //startpos[d]
var goalpos;  //goalpos[d]
var nowpos;   //nowpos[d]
var Rstartpos=0.05;
var Rgoalpos =0.05;
var Rnowpos  =0.1;
//field for event--------------------
var isKeyTyping;
var mdposC; // position at mousedown in CameraView coordinate
var mmposC; // position at mousemove in CameraView coordinate
var mdcam;  // Camera object of mousedown
var Rdrag = fairways; // radius to drag
//init event---------------------
var initEvent = function(){
  eventQueue = new Array(0);
  canvas[0].ontouchstart = addTouchEvent;
  canvas[0].ontouchmove  = addTouchEvent;
  canvas[0].ontouchend   = addTouchEvent;
  canvas[0].onmousedown  = addEvent;
  canvas[0].onmousemove  = addEvent;
  canvas[0].onmouseup    = addEvent;
  canvas[0].onmouseout   = addEvent;
  canvas[0].onmousewheel = addEvent;
//  window.onkeydown       = addEvent;
};
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
  //make tee & goal
  startpos=[0,0,0];
  goalpos=new Array(3);
  for(var d=0;d<3;d++) goalpos[d]=(holerand.getNext()+0.5)*0.9+fairway[fairway.length-1][d];
  nowpos=startpos.clone();
  var a = mulkv(sqrt1p2(), normalize(sub(goalpos,nowpos))); // 45 degree +w
  shotImpactAngle   = [a[0],a[1],a[2],sqrt1p2];             // 45 degree +w
  turn=0;
};
var resetGame=function(){
  initGame();
  initDraw();
  procDraw();
  initEvent();
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
  gP  = new Geom(3,[[-1,-1,-1],[+1,+1,+1]]);
  gS  = new Geom(3,[[0,wy,0],[wx,0,wx] ]);
  cam = new Camera();
  cam0= new Camera();
  cam.pos=mulkv(fairways*0.5,[-1,-1,-1]);
  cam.dirmz =normalize(sub([0,0,0],cam.pos));
  cam.dirx  =mul(getRotate(cam0.dirmz, cam0.dirx, cam.dirmz, cam.dirx),cam0.dirx);
};
var procDraw=function(){
    //clear ---------
  ctx[0].clearRect(0, 0, wx-1, wy-1);
  //draw cource ------
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
      if(fc2d[0][2]>=0 && fc2d[1][2]>=0){
        ctx[0].beginPath();
        ctx[0].moveTo(fc2d[0][0],fc2d[0][1]);
        ctx[0].lineTo(fc2d[1][0],fc2d[1][1]);
        ctx[0].stroke();
      }
    }//i
  }//f
  //draw tee
  var p=transCam(startpos, cam, cam0, gP, gS);
  if(p[2]>=0){
    ctx[0].fillStyle = 'rgb(0,0,255)'; //blue
    ctx[0].beginPath();
    ctx[0].arc(p[0], p[1], p[2]*Rstartpos, 0, Math.PI*2, false);
    ctx[0].fill();
  }
  //draw tee and goal
  ctx[0].fillStyle = 'rgb(255,255,0)'; //yellow
  var p=transCam(goalpos, cam, cam0, gP, gS);
  if(p[2]>=0){
    ctx[0].beginPath();
    ctx[0].arc(p[0], p[1], p[2]*Rgoalpos, 0, Math.PI*2, false);
    ctx[0].fill();
  }
  //draw tee and goal
  ctx[0].fillStyle = 'rgb(255,255,255)'; //white
  var p=transCam(nowpos, cam, cam0, gP, gS);
  if(p[2]>=0){
    ctx[0].beginPath();
    ctx[0].arc(p[0], p[1], p[2]*Rnowpos, 0, Math.PI*2, false);
    ctx[0].fill();
  }
}
//event handlers after queue ------------
var handleMouseDown = function(){
  mdposC = transPos([mouseDownPos[0], mouseDownPos[1] ,cam.screenDistance],gS,gP);
  mmposC = mdposC.clone();
  mdcam  = cam.clone();
  isRequestedDraw = true;
}
var handleMouseDragging = function(){
  mmposC = transPos([mousePos[0],mousePos[1],cam.screenDistance],gS,gP);
  var invcamr = getRotate(cam0.dirmz, cam0.dirx, cam.dirmz, cam.dirx);
  var mdposP = mul(invcamr, mdposC);
  var mmposP = mul(invcamr, mmposC);
  var r = getRotate(mdposP, mmposP);
  //ÉJÉÅÉâà íuâÒì]
  cam.pos   = mul(r, mdcam.pos);
  cam.dirmz = mul(r, mdcam.dirmz);
  cam.dirx  = mul(r, mdcam.dirx);
  isRequestedDraw = true;
  clsDebug();
  if(false){
    printDebug("mdposP[0]="+mdposP[0]+"<br>");
    printDebug("mdposP[1]="+mdposP[1]+"<br>");
    printDebug("mdposP[2]="+mdposP[2]+"<br>");
    printDebug("mmposP[0]="+mmposP[0]+"<br>");
    printDebug("mmposP[1]="+mmposP[1]+"<br>");
    printDebug("mmposP[2]="+mmposP[2]+"<br>");
  }
  if(false){
    printDebug("mdposP[0]="+mdposP[0]+"<br>");
    printDebug("mdposP[1]="+mdposP[1]+"<br>");
    printDebug("mdposP[2]="+mdposP[2]+"<br>");
    printDebug("mmposP[0]="+mmposP[0]+"<br>");
    printDebug("mmposP[1]="+mmposP[1]+"<br>");
    printDebug("mmposP[2]="+mmposP[2]+"<br>");
  }
}
var handleMouseUp = function(){
}
var handleMouseMoving = function(){
//
}
var handleMouseWheel = function(){
  var dz = mouseWheel[1]*0.01;
  cam.pos=add(cam.pos, mulkv(dz, cam.dirmz));
  isRequestedDraw = true;
}
var handleKeyDown = function(e){
//    var c = String.fromCharCode(e.keyCode);
//    var motion = "AW__DX__".indexOf(c);
}
var printDebug=function(str){
  document.getElementById("debugout").innerHTML += str;
}
var clsDebug=function(str){
  document.getElementById("debugout").innerHTML = "";
}

