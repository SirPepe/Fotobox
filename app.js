//
var requestAnimationFrame = (function(){
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();

//
var getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);
if(getUserMedia) getUserMedia = getUserMedia.bind(navigator);

//
var createObjectURL = (window.URL || window.webkitURL).createObjectURL;


//
var adjustContrast = function(amount, rgba){
  amount = Math.pow((parseInt(amount, 10) + 100) / 100, 2);
  var i = 0;
  while(i < rgba.length){
    for(var j = 0; j < 3; j++){
      var color = rgba[i];
      color /= 255;
      color -= 0.5;
      color *= amount;
      color += 0.5;
      color *= 255;
      rgba[i++] = color;
    }
    i++;
  }
};
var adjustBrightness = function(amount, rgba){
  amount *= 2.5;
  var i = 0;
  while(i < rgba.length){
    rgba[i++] += amount;
    rgba[i++] += amount;
    rgba[i++] += amount;
    i++;
  }
};
var adjustSaturation = function(amount, rgba){
  amount *= -0.01;
  var i = 0;
  while(i < rgba.length){
    var r = i++,  g = i++, b = i++;
    var max = Math.max(rgba[r], rgba[g], rgba[b]);
    if(rgba.r != max){ rgba[r] += (max - rgba[r]) * amount; }
    if(rgba.g != max){ rgba[g] += (max - rgba[g]) * amount; }
    if(rgba.b != max){ rgba[b] += (max - rgba[b]) * amount; }
    i++;
  }
};


//
var $canvas = $('#Stream');
var canvas = $canvas[0];
var ctx = canvas.getContext('2d');


//
var renderStream = function(stream){
  // 
  var video = document.createElement('video');
  video.src = createObjectURL(stream);
  // Im Falle von Webcam-Streams sind die Maße erst beim `canplay`-Event bekannt
  video.addEventListener('canplay', function(){
    // 
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    video.width = video.videoWidth;
    video.height = video.videoHeight;
    // Für jedes Frame ein mal die Canvas neu mit dem Video bemalen
    requestAnimationFrame(function renderFrame(){
      applyFilters(video, function(filtered){
        ctx.drawImage(filtered, 0, 0);
        requestAnimationFrame(renderFrame);
      });

    });
    // 
    video.play();
  }, false);
};


//
var applyFilters = (function(){
  //
  var filterCanvas = document.createElement('canvas');
  var filterCtx = filterCanvas.getContext('2d');
  var initialized = false;
  // 
  return function(sourceElement, callback){
    //
    if(!initialized){
      filterCanvas.width = sourceElement.width;
      filterCanvas.height = sourceElement.height;
      initialized = true;
    }
    //
    filterCtx.drawImage(sourceElement, 0, 0);
    var rgba = filterCtx.getImageData(0, 0, filterCanvas.width, filterCanvas.height);
    adjustContrast($('#Contrast').val(), rgba.data);
    adjustBrightness($('#Brightness').val(), rgba.data);
    adjustSaturation($('#Saturation').val(), rgba.data);
    filterCtx.putImageData(rgba, 0, 0);
    callback(filterCanvas);
  };
})();


// 
var createSnapshot = function(source, width, height){
  var $canvas = $('<canvas />').attr({
    width: width,
    height: height
  });
  $canvas[0].getContext('2d').drawImage(source, 0, 0, width, height);
  return $canvas;
};


// 
var createThumbnail = function(source){
  var width = Math.round($canvas.width() / 4);
  var height = Math.round($canvas.height() / 4);
  return createSnapshot(source, width, height);
};


// 
var snap = function(source){
  var url = createSnapshot(source, $canvas.width(), $canvas.height())[0].toDataURL();
  var $thumbLink = $('<a />').attr('href', url);
  var $thumb = createThumbnail(source);
  $thumbLink.append($thumb).appendTo('#Shots');
};


//
if(getUserMedia && createObjectURL){
  getUserMedia({ video: true, audio: false }, function(stream){
    $('button, input').removeAttr('disabled');
    renderStream(stream);
  });
}


// 
$('button').click(function(){
  new Audio('camera_snap1.wav').play();
  snap($canvas[0]);
});