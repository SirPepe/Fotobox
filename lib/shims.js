define(function(){


  // Shim für Cross-Browser requestAnimationFrame()
  window.requestAnimationFrame = window.requestAnimationFrame || (function(){
    return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback){
        window.setTimeout(callback, 1000 / 60);
      };
  })();


  // Shim für Cross-Browser getUserMedia()
  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;


  // Shim für `canvas.toBlob()`
  if(typeof window.HTMLCanvasElement.prototype.toBlob == 'undefined'){
    window.HTMLCanvasElement.prototype.toBlob = function(callback, type){
      var parts = this.toDataURL(type).split(';base64,');
      var contentType = parts[0].split(':')[1];
      var raw = window.atob(parts[1]);
      var uInt8Array = new Uint8Array(raw.length);
      for(var i = 0; i < raw.length; ++i){
        uInt8Array[i] = raw.charCodeAt(i);
      }
      callback(new Blob([uInt8Array], {type: contentType}));
    };
  }


});