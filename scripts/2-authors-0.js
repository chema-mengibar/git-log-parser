/**
 * git shortlog -s
 */

const exec = require('child_process').exec;
const fs = require('fs');

var args = process.argv.slice(2);

if( args.length == 0 ){
  console.log( 'ERROR: No repository defined' )
  return false;
}

let selectedRepo = args[0];

let repoGitFile =  __dirname + '\\..\\repository\\' + selectedRepo + '\\.git';
let outputFileFullPath = './data/stage/' + selectedRepo +'-authors.csv';

let cmd = 'git shortlog -sne' + ' < CON ' //(Issue)
 //+ ' > ' + outputFileFullPaths

exec( cmd, { cwd : repoGitFile }, function(error, stdout, stderr) {
  let text = stdout;
  //console.log( text )
  fs.writeFile( outputFileFullPath, text, ( err )=>{ 
    if( err ) return err;
    writeHeaders()
  } );
});

function writeHeaders(){
  var csvHeaders = 'num_commits|author|email';
  var data = fs.readFileSync( outputFileFullPath ).toString().split('\n');
  var dataMod = [ csvHeaders ];


  var regexp =new RegExp('\t| <', 'g');

  for( var row of data ){
    rowMod = row.replace(regexp,'|').replace('>','').trim()
    dataMod.push( rowMod )
  }
  var text = dataMod.join('\n');
  
  console.log( dataMod )
  fs.writeFile( outputFileFullPath, text, ( err )=>{ if( err ) return err; } );
}


/* 
#Usage

for arguments  -sne in git shortlog define the "email" column in csvHeaders
 -sn  >>>  csvHeaders = 'num_commits|author';
 -sne >>>  csvHeaders = 'num_commits|author|email';


# Issues

- https://stackoverflow.com/questions/51966053/what-is-wrong-with-invoking-git-shortlog-from-go-exec
- https://stackoverflow.com/questions/15564185/exec-not-returning-anything-when-trying-to-run-git-shortlog-with-nodejs/35268816

*/