/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "scrshot",
			"path": "scrshot/scrshot.js",
			"file": "scrshot.js",
			"module": "scrshot",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/scrshot.git",
			"test": "scrshot-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Screenshot HTML.

		For synchronous mode, this will return a data URI screenshot or empty string.
	@end-module-documentation

	@include:
		{
			"child": "child_process",
			"comex": "comex",
			"depher": "depher",
			"path": "path",
			"pyp": "pyp",
			"shft": "shft",
			"zelf": "zelf"
		}
	@end-include
*/

const child = require( "child_process" );
const comex = require( "comex" );
const depher = require( "depher" );
const path = require( "path" );
const pyp = require( "pyp" );
const shft = require( "shft" );
const zelf = require( "zelf" );

const screenshotPath = pa	th.resolve( __dirname, "screenshot.js" );
const screenshot = require( screenshotPath );

const scrshot = function scrshot( html, synchronous, option ){
	/*;
		@meta-configuration:
			{
				"html:required": "string",
				"synchronous": "boolean",
				"option": "object"
			}
		@end-meta-configuration
	*/

	let parameter = shft( arguments );

	synchronous = depher( parameter, BOOLEAN, false );

	option = pyp( parameter, OBJECT );

	if( synchronous ){
		try{
			return comex( "node" )
				.join( "--require", screenshotPath )
				.join( "--eval", `'screenshot( "${ html }", true, ${ JSON.stringify( option ) } );'` )
				.execute( true );

		}catch( error ){
			throw new Error( `cannot take screenshot, ${ error.stack }` );
		}

	}else{
		return screenshot.bind( zelf( this ) )( html, option );
	}
};

module.exports = scrshot;
