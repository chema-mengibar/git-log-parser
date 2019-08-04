const fs = require('fs');
const path = require('path');
const D3Node = require('d3-node');
const canvasModule = require('canvas');

const fw = require('./lib/Frameworks');

var args = process.argv.slice(2);

if( args.length == 0 ){
  console.log( 'ERROR: No repository defined' )
  return false;
}

let repo = args[0];

//------------------------------------------ D3 init

var CSS = `
  .bg{ fill: white; }
  text{ fill:#adadad; }
  line, path{ stroke:#adadad; }

`;

const d3n = new D3Node( {canvasModule ,styles: CSS });
const d3 = d3n.d3;

//------------------------------------------ Prepare Data

var filePath = 'data/master/' + repo + '-registry.json';
var log = fs.readFileSync( filePath );
var objLog = JSON.parse( log );

var blackListWords = [
  'update'
];

var regexpBlackList = new RegExp( blackListWords.join('|'), 'g' );

var authors = {};
for( var ol of objLog ){
  if( Object.keys(authors).indexOf( ol.author ) > -1 ){
    if(
      // ol.type == '' &&
      ol.comment.toLowerCase().match( regexpBlackList ) == null
    ){
      authors[ ol.author ] += 1;
    }
  }
  else{
    authors[ ol.author ] = 0;
  }
}

// Map Data to Plot 

var arrAuthors = [];
for( var keyAuth of Object.keys(authors) ){
  var item = { 
    author: keyAuth,
    commits: authors[ keyAuth ]
  }

  if( item.commits > 40 ){
    arrAuthors.push( item );
  }
}

//----------------------------------------- Plot

var data = arrAuthors;
// var data = [
//   {author:'A', commits:100},
//   {author:'B', commits:300},
// ]

var w = 1200, h = 500;

var margin = { top:30, right:30, bottom:70, left:60 },
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

var svg = d3n.createSVG( w, h );

svg
  .attr('width', w )
  .attr('height', h )
  .append('rect')
    .classed('bg',true)
    .attr('width','100%')
    .attr('height','100%')

gCanvas = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// X axis
var x = d3.scaleBand()
  .range([0,width])
  .domain( data.map( (d)=> d.author ) )
  .padding(0.2);

gCanvas.append('g')
.attr('transform', 'translate(' + 0 + ',' + height + ')')
.call( d3.axisBottom(x))
.selectAll('text')
  .attr('transform', 'translate(-10,0)rotate(-45)')
  .style('text-anchor','end')

var maxY = 2500 //d3.max( data.map((e)=> e.commits));

// Y axis
var y = d3.scaleLinear()
  .domain([0,maxY])
  .range([height,0])

gCanvas.append('g')
  .call( d3.axisLeft(y))


//Bars
gCanvas.selectAll('bars')
  .data(data)
  .enter()
  .append('rect')
    .attr('x',(d)=> x(d.author))
    .attr('y',(d)=> y(d.commits))
    .attr('width', x.bandwidth())
    .attr('height', (d)=> height - y(d.commits))
    .attr('fill', fw.colors[ repo ])

//---------------------------------------------------------- Export SVG to file
var svgStr = d3n.svgString();

var fileName = path.basename( __filename, '.js' )

// var outputFileName = 'reports/' + fileName + '__' + repo + '__001.svg';
// var text = svgStr;
// fs.writeFile( outputFileName, text, (err)=>{
//   if(err) return err;

// });

var outputImgName = 'reports/' + fileName + '__' + repo + '__001';
fw.createImage( svgStr, w, h, outputImgName, 'png' );

