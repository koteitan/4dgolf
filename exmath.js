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

var XorShift={
  x: 123456789,
  y: 362436069,
  z: 521288629,
  w: 88675123
};

XorShift.seed = function(s) {
  XorShift.w = s;
}
XorShift.rand = function() {
  var t = XorShift.x ^ (XorShift.x << 11);
  XorShift.x = XorShift.y;
  XorShift.y = XorShift.z;
  XorShift.z = XorShift.w;
  return XorShift.w = (XorShift.w^(XorShift.w>>>19))^(t^(t>>>8));
}
