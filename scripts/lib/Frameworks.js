const btoa = require('btoa')
const {  Image, createCanvas, createImageData } = require('canvas');
const fs = require('fs');

var Fw = {
  colors:{
    vue:'#42b983',
    angular:'#b80d29',
    react:'#61dafb',
  },

  createImage: function( svgString, width, height, outputImgName, ext ) {
  
    var image = new Image( width, height )
    image.src ='data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) )
    
    var canvas = createCanvas( image.width, image.height)
    var ctx = canvas.getContext('2d')
    //ctx.patternQuality = 'best'
    //ctx.quality = 'best'
    //ctx.textDrawingMode = 'path'
    //ctx.font = "12px 'Arial'";
    //ctx.textBaseline = "top";
    ctx.drawImage( image, 0, 0 )

    if( ext == 'png'){
      var stream = canvas.createPNGStream({
        compressionLevel: 0,
        resolution: 200
      })
      var out = fs.createWriteStream( outputImgName + '.png' )
      stream.pipe(out)
      out.on('finish', () =>  console.log('The PNG file was created.'))
    }
    else{
      var stream = canvas.createJPEGStream({
        quality: 1,
        chromaSubsampling: false,
        progressive: false,
        resolution: 200
      })
      var out = fs.createWriteStream( outputImgName + '.jpeg' )
      stream.pipe(out)
      out.on('finish', () =>  console.log('The JPEG file was created.'))
    }


  }

}


module.exports = Fw;