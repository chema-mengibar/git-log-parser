const fs = require('fs');
const dateFormat = require('dateformat'); // https://www.npmjs.com/package/dateformat

/**
 * Datsets:
 * - Issues
 * - Teams/Authors
 * - Commits Log
 */


//################################################################################## Load Datsets

var args = process.argv.slice(2);

if( args.length == 0 ){
  console.log( 'ERROR: No repository defined' )
  return false;
}

let repo = args[0];

// Issues
//...


// Authors
var filePath_authors = 'data/stage/' + repo + '-authors.csv';
var rawAuthors = fs.readFileSync( filePath_authors ).toString().split('\n');
var authorsHeader = rawAuthors.shift();
var authors = {};
for( var authorRow of rawAuthors ){
  var rowItem = authorRow.split('|');
  var name = rowItem[1];
  authors[name] = {
    commits: rowItem[0]
  }
}
//console.log( JSON.stringify( authors ) )


//Commits-log
var filePath_log = 'data/stage/' + repo + '-log.csv';
var rawLog = fs.readFileSync( filePath_log ).toString().split('\n');
var logHeader = rawLog.shift();
//console.log( rawLog )

//################################################################################## Map functions

var formatDate = ( dateStr ) => {
  return dateFormat( dateStr, 'yyyy-mm-dd' );
}

var formatHour = ( dateStr ) => {
  return dateFormat( dateStr, 'HH:MM' );
}

var formatDayWeek = ( dateStr ) => {
  return dateFormat( dateStr, 'ddd' );
}

var mapCommentType = ( commentStr ) => {

  var type = '';
  var comment = commentStr.toLowerCase();

  // if( commentStr.match(/revert/g) !== null ){
  //   type =  'revert';
  // }
  // if( commentStr.match(/fix/g) !== null ){
  //   type =  'fix';
  // }

  var regExp_revert = new RegExp( 'revert[^a-z]*(.*):','g');
  var rex = regExp_revert.exec(comment);
  if( rex && rex.length ){
    type = rex[1];
  }else{
    var parts = comment.split(':');
    type = ( parts.length > 1 )? parts[0].replace(':','') : '';
  }

  return type;
}

var mapCommentIssue = ( commentStr ) =>{
  var issue = '';
  var regExp_issue = new RegExp( '#([0-9]*)','gm');
  var results = commentStr.match( regExp_issue );
  if( results && results.length ){
    issue = results.pop();
  }
  return issue;
}

//################################################################################## Map Log Rows

var log = [];

for( var row of rawLog ){
  var rowItems = row.split('|');
  var logItem = {
    'hash': rowItems[0],
    'author': rowItems[1],
    'date': formatDate( rowItems[2] ),
    'hour': formatHour( rowItems[2] ),
    'dayWeek': formatDayWeek( rowItems[2] ),
    'comment': rowItems[3],
    'type': mapCommentType( rowItems[3] ),
    'issue': mapCommentIssue( rowItems[3] ),

  }
  log.push( logItem );
}

// Output file
var filePathOutput = 'data/master/' + repo + '-registry.json';
var text = JSON.stringify( log, null, '\t');
fs.writeFile( filePathOutput, text, function( err ){
  if( err ) return err;
}) ;