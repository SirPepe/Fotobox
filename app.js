var getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);
if(getUserMedia){
  getUserMedia = getUserMedia.bind(navigator);
}
var createObjectURL = (window.URL || window.webkitURL).createObjectURL;


var $video = $('video');
var video = $video[0];


var createSnapshot = function(source, width, height){
  var $canvas = $('<canvas />').attr({
    width: width,
    height: height
  });
  var ctx = $canvas[0].getContext('2d');
  ctx.drawImage(source, 0, 0, width, height);
  return $canvas;
};


var createThumbnail = function(source){
  var width = Math.round($video.width() / 4);
  var height = Math.round($video.height() / 4);
  return createSnapshot(source, width, height);
};


var snap = function(source){
  var url = createSnapshot(source, $video.width(), $video.height())[0].toDataURL();
  var $thumbLink = $('<a />').attr('href', url);
  var $thumb = createThumbnail(source);
  $thumbLink.append($thumb).appendTo('#Shots');
};


if(getUserMedia && createObjectURL){
  getUserMedia({ video: true, audio: false }, function(stream){
    video.src = createObjectURL(stream);
    video.play();
    $('button, input').removeAttr('disabled');
  });
}


$('button').click(function(){
  new Audio('camera_snap1.wav').play();
  snap(video);
});