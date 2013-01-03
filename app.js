require(['jquery', 'shims', 'filters'], function($, shims, filters){


//
var $canvas = $('#Stream');


//
navigator.getUserMedia({ video: true, audio: false }, function(stream){
  $('button, input').removeAttr('disabled');
  renderStream(stream);
});


// 
$('button').click(function(){
  new Audio('camera_snap1.wav').play();
  takePhoto($canvas[0]);
});


// 
var takePhoto = function(source){
  // Thumbnail
  var thumbWidth = Math.round($canvas.width() / 4);
  var thumbHeight = Math.round($canvas.height() / 4);
  $thumbnail = createSnapshot(source, thumbWidth, thumbHeight);
  // Link auf die große Version des Fotos
  var $snapshot = createSnapshot(source, $canvas.width(), $canvas.height());
  var snapshotUrl = $snapshot[0].toDataURL();
  var $snapshotLink = $('<a />').attr('href', snapshotUrl);
  $snapshotLink.append($thumbnail);
  $snapshotLink.appendTo('#Shots');
};


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
var renderStream = function(stream){
  // Canvas-Context und Video-Element als Stream-Empfänger
  var ctx = $canvas[0].getContext('2d');
  var $video = $('<video />').attr({
    src: window.URL.createObjectURL(stream)
  });
  var video = $video[0];
  // Im Falle von Webcam-Streams sind die Maße erst beim `canplay`-Event bekannt
  video.addEventListener('canplay', function(){
    // Canvas und Video auf die Maße des Webcam-Feeds anpassen
    $([$canvas[0], video]).attr({
      width: video.videoWidth,
      height: video.videoHeight
    });
    // Für jedes Frame ein mal die Canvas neu mit dem Video bemalen
    requestAnimationFrame(function renderFrame(){
      $filtered = applyFilters($video);
      ctx.drawImage($filtered[0], 0, 0);
      requestAnimationFrame(renderFrame);
    });
    video.play();
  }, false);
};


//
var applyFilters = (function(){
  //
  var $filterCanvas = $('<canvas />');
  var filterCtx = $filterCanvas[0].getContext('2d');
  var initialized = false;
  var width, height;
  // 
  return function($sourceElement, callback){
    //
    if(!initialized){
      width = $sourceElement.attr('width');
      height = $sourceElement.attr('height');
      $filterCanvas.attr({ width: width, height: height });
      initialized = true;
    }
    //
    filterCtx.drawImage($sourceElement[0], 0, 0);
    //
    var rgba = filterCtx.getImageData(0, 0, width, height);
    filters.contrast($('#Contrast').val(), rgba.data);
    filters.brightness($('#Brightness').val(), rgba.data);
    filters.saturation($('#Saturation').val(), rgba.data);
    //
    filterCtx.putImageData(rgba, 0, 0);
    return $filterCanvas;
  };
})();


});