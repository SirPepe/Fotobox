require(['jquery', 'shims', 'filters'], function($, shims, filters){


// Das Element, auf das der Stream gerendert wird
var $canvas = $('#Stream');


// User-Webcamfeed anfragen. Im Erfolgsfall den Stream rendern.
navigator.getUserMedia({ video: true, audio: false }, function(stream){
  $('button, input').removeAttr('disabled');
  renderStream(stream);
});


// Sound abspielen und Foto schießen
$('button').click(function(){
  new Audio('camera_snap1.wav').play();
  takePhoto($canvas[0]);
});


// Foto machen und Thumbnail erzeugen
var takePhoto = function(source){
  // Thumbnail
  var thumbWidth = Math.round($canvas.width() / 4);
  var thumbHeight = Math.round($canvas.height() / 4);
  $thumbnail = createSnapshot(source, thumbWidth, thumbHeight);
  // Link auf die große Version des Fotos
  var $snapshot = createSnapshot(source, $canvas.width(), $canvas.height());
  $snapshot[0].toBlob(function(blob){
    var snapshotUrl = window.URL.createObjectURL(blob);
    var $snapshotLink = $('<a />').attr('href', snapshotUrl);
    $snapshotLink.append($thumbnail);
    $snapshotLink.appendTo('#Shots');
  });
};


// Bild aus dem Stream abgreifen, als Canvas mit `width` und `height` zurückgeben.
var createSnapshot = function(source, width, height){
  var $canvas = $('<canvas />').attr({
    width: width,
    height: height
  });
  $canvas[0].getContext('2d').drawImage(source, 0, 0, width, height);
  return $canvas;
};


// Stream durch die Filter jagen und auf die Ziel-Canvas rendern
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


// Filter auf `$sourceElement` anwenden und das Ergebnis als Canvas-Element zurückgeben.
var applyFilters = (function(){
  var $filterCanvas = $('<canvas />');
  var filterCtx = $filterCanvas[0].getContext('2d');
  var initialized = false;
  var width, height;
  // Filter-Funktion
  return function($sourceElement, callback){
    // Initialisierungs-Block; nur beim ersten Aufruf der Funktion ausführen.
    if(!initialized){
      width = $sourceElement.attr('width');
      height = $sourceElement.attr('height');
      $filterCanvas.attr({ width: width, height: height });
      initialized = true;
    }
    // Quellelement auf die Filter-Canvas rendern
    filterCtx.drawImage($sourceElement[0], 0, 0);
    // RGBA-Block extrahieren, Filter anwenden
    var rgba = filterCtx.getImageData(0, 0, width, height);
    filters.contrast($('#Contrast').val(), rgba.data);
    filters.brightness($('#Brightness').val(), rgba.data);
    filters.saturation($('#Saturation').val(), rgba.data);
    // Modifizierte RGBA-Blöcke auf die Filter-Canvas zurückrendern, Ergebnis zurückgeben.
    filterCtx.putImageData(rgba, 0, 0);
    return $filterCanvas;
  };
})();


});