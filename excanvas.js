/* ctx.setBitmapFont(url, poslist, sizelist) 
    set url to the bitmap font sheet of ctx with bound box infomation bblist.
   url = "http://xxxxx.xx.xx/xxx/xxx.png" or "xxx.png";
   poslist [i][0] = start position in x of i th charactor
   poslist [i][1] = start position in y of i th charactor
   sizelist[i][0] = width  of i th charactor
   sizelist[i][1] = height of i th charactor
*/
CanvasRenderingContext2D.prototype.setBitmapFont = function(url, poslist, sizelist, letterlist){
  this.bmfont={};
  this.bmfont.fontsheet = new Image();
  this.bmfont.fontsheet.src = url + "?" + new Date().getTime();
  this.bmfont.poslist  = poslist ;
  this.bmfont.sizelist = sizelist;
  this.bmfont.letterlist = letterlist;
  this.bmfont.maxheight = 0;
  for(i=0;i<sizelist.length;i++){
    if(sizelist[i][1] > this.bmfont.maxheight) this.bmfont.maxheight = sizelist[i][1];
  }
};
/* ctx.fillTextBitmap(text,x,y) draw text with the bitmap font set by the setBitmapFont().
    same as fillText(text,x,y) 
    x,y = 
    */
CanvasRenderingContext2D.prototype.fillTextBitmap = function(text, x, y){
  var px=x;
  var py=y;
  var poslist=this.bmfont.poslist;
  var sizelist=this.bmfont.sizelist;
  var letterlist=this.bmfont.letterlist;
  var fontsheet=this.bmfont.fontsheet;
  for(i=0;i<text.length;i++){
    if(text[i]=='\n'){
      py=py+this.bmfont.maxheight;
      px=x;
    }else{
      var j=letterlist.indexOf(text[i]); // from "A"
      this.drawImage(fontsheet,
        poslist [j][0], poslist [j][1],
        sizelist[j][0], sizelist[j][1],
        px            , py            ,
        sizelist[j][0], sizelist[j][1]
      );
      px+=sizelist[j][0];
    }
  }
};

