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


});