const exec = require('child_process').exec;
const fs = require('fs');

var args = process.argv.slice(2);

if( args.length == 0 ){
  console.log( 'ERROR: No repository defined' )
  return false;
}

let selectedRepo = args[0];

let repoGitFile =  __dirname + '\\..\\repository\\' + selectedRepo + '\\.git';
let outputFileFullPath = './data/stage/' + selectedRepo +  '-log.csv';
let cmd = 'git --git-dir=' + repoGitFile + ' log --pretty=format:"%h|%an|%ad|%s"  --until=2019-07-06' + ' >' + outputFileFullPath;  //--since=2019-01-01

exec( cmd, ( error, stdout, stderr )=>{
  //console.log( '>>>>', stdout )
  writeHeaders();
})

function writeHeaders(){
  var csvHeaders = 'hash|author|date|comment';
  var data = fs.readFileSync( outputFileFullPath ).toString().split('\n');
  data.splice( 0, 0, csvHeaders );
  var text = data.join('\n');

  fs.writeFile( outputFileFullPath, text, ( err )=>{ if( err ) return err; } );
}


