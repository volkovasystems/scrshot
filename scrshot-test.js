
const assert = require( "assert" );
const path = require( "path" );
const scrshot = require( "./scrshot.js" );

let result = scrshot( "./sample.html", {
	"browserWidth": 1024,
	"browserHeight": 768,
	"mode": DATA_URI
}, true );

assert.equal( typeof result, "string", "should be string" );

assert.equal( /^data\:image\/png\;base64/.test( result ), true, "should be true" );

result = scrshot( "./sample.html", {
	"browserWidth": 1024,
	"browserHeight": 768,
	"mode": FILE
}, true );

assert.equal( result, path.resolve( "./screenshot-1024x768.png" ), "should be equal" );

result = scrshot( "./sample.html", {
	"browserWidth": 1024,
	"browserHeight": 768,
	"mode": BUFFER
}, true );

assert.equal( result instanceof Buffer, true, "should be equal" );

console.log( "ok" );
