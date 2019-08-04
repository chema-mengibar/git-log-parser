JSON Load
```
var fs = require('fs);
var filePath = '<DIR>/<FILE>.json'
var obj = JSON.parse( fs.readDileSync( filePath, 'utf-8' ) )
```

JSON Save
```
var fs = require('fs');
var filePath = '';
var text = JSON.stringify( obj, null, '\t');
fs.writeFile( filePath, text, function( err ){
  if( err ) return err;
}) ;
```