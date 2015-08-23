var log10 = function(x){
  return Math.LOG10E + Math.log(x);
}
var log2 = function(x){
  return Math.LOG2E + Math.log(x);
}
var ln = function(x){
  return Math.log(x);
}

var chisqr_1_0p05 = function(){
  -3.841
}

//xorshift random object
var XorShift={
  x: 123456789,
  y: 362436069,
  z: 521288629,
  w: 88675123
};
// random float value 0.0<=x<+1.0
XorShift.getNext = function() {
  var t = XorShift.x ^ (XorShift.x << 11);
  XorShift.x = XorShift.y;
  XorShift.y = XorShift.z;
  XorShift.z = XorShift.w;
  XorShift.w = (XorShift.w^(XorShift.w>>>19))^(t^(t>>>8));
  return XorShift.w/(1<<31)/2+1/2;
}
// reset the seed
XorShift.setSeed = function(s) {
  XorShift.x = 123456789;
  XorShift.y = 362436069;
  XorShift.z = 521288629;
  XorShift.w = s;
}
//test randomness
XorShift.test = function(seed){
  var str="";
  XorShift.setSeed(seed);
  var sumx=0;
  var maxx=-Infinity;
  var minx=+Infinity;
  var N=100000;
  for(var i=0;i<N;i++){
    var x=XorShift.getNext();
    sumx+=x;
    if(x>maxx)maxx=x;
    if(x<minx)minx=x;
  }
  str+="avg="+sumx/N+0.5;
  str+=" max="+maxx;
  str+=" min="+minx;
  return str;
}
