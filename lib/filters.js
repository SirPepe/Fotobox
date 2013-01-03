define(function(){

  return {

    contrast: function(amount, rgba){
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
    },

    brightness: function(amount, rgba){
      amount *= 2.5;
      var i = 0;
      while(i < rgba.length){
        rgba[i++] += amount;
        rgba[i++] += amount;
        rgba[i++] += amount;
        i++;
      }
    },

    saturation: function(amount, rgba){
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
    }

};

});