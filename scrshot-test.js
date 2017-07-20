
const assert = require( "assert" );
const scrshot = require( "./scrshot.js" );

let result = scrshot( "./sample.html", {
	"browserWidth": 1024,
	"browserHeight": 768
}, true );

assert.equal( typeof result, "string", "should be string" );

assert.equal( /^data\:image\/png\;base64/.test( result ), true, "should be true" );

console.log( "ok" );
