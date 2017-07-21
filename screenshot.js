/*;
	@submodule-license:
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
	@end-submodule-license

	@submodule-configuration:
		{
			"package": "scrshot",
			"path": "scrshot/screenshot.js",
			"file": "screenshot.js",
			"module": "scrshot",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/scrshot.git",
			"test": "scrshot-test.js",
			"global": true
		}
	@end-submodule-configuration

	@submodule-documentation:
		Internal screenshot engine.
	@end-submodule-documentation

	@include:
		{
			"celene": "celene",
			"depher": "depher",
			"detr": "detr",
			"falzy": "falzy",
			"flur": "flur",
			"fs": "fs",
			"harden": "harden",
			"path": "path",
			"raze": "raze",
			"shft": "shft",
			"shot": "wdio-screenshot",
			"webdriver": "webdriverio",
			"zelf": "zelf"
		}
	@end-include
*/

const celene = require( "celene" );
const depher = require( "depher" );
const detr = require( "detr" );
const falzy = require( "falzy" );
const flur = require( "flur" );
const fs = require( "fs" );
const harden = require( "harden" );
const path = require( "path" );
const raze = require( "raze" );
const shft = require( "shft" );
const shot = require( "wdio-screenshot" );
const webdriver = require( "webdriverio" );
const zelf = require( "zelf" );

harden( "CHROME", "chrome" );

harden( "BUFFER", "buffer" );
harden( "DATA_URI", "data-uri" );
harden( "FILE", "file" );
harden( "STATUS", "status" );

const DEFAULT_BROWSER = CHROME;
const DEFAULT_BROWSER_WIDTH = 800;
const DEFAULT_BROWSER_HEIGHT = 600;
const DEFAULT_CHROME_OPTION = { "args": [ "disable-gpu", "headless" ] };
const DEFAULT_DIRECTORY = process.cwd( );
const DEFAULT_OUTPUT = "screenshot";
const DEFAULT_PAUSE = 1000;
const DEFAULT_MODE = FILE;

const screenshot = function screenshot( html, synchronous, option ){
	/*;
		@meta-configuration:
			{
				"html:required": "string",
				"synchronous": "boolean",
				"option": "object"
			}
		@end-meta-configuration
	*/

	if( falzy( html ) || typeof html != "string" ){
		throw new Error( "invalid html path" );
	}

	let parameter = shft( arguments );

	synchronous = depher( parameter, BOOLEAN, false );

	option = detr( parameter, {
		"directory": DEFAULT_DIRECTORY,
		"browser": DEFAULT_BROWSER,
		"chromeOption": DEFAULT_CHROME_OPTION,
		"browserWidth": DEFAULT_BROWSER_WIDTH,
		"browserHeight": DEFAULT_BROWSER_HEIGHT,
		"output": DEFAULT_OUTPUT,
		"pause": DEFAULT_PAUSE,
		"mode": DEFAULT_MODE
	} );

	let mode = depher( option.mode, [ BUFFER, DATA_URI, FILE, STATUS ], STATUS );

	let { output, browserWidth, browserHeight } = option;
	if(
		browserWidth != DEFAULT_BROWSER_WIDTH ||
		browserHeight != DEFAULT_BROWSER_HEIGHT
	){
		output = `${ output }-${ browserWidth }x${ browserHeight }`;
	}

	let directory = option.directory;
	output = path.resolve( directory, `${ output }.png` );

	let chromeOption = option.chromeOption;
	chromeOption.args = raze( chromeOption.args ).concat( `window-size=${ browserWidth },${ browserHeight }` );

	html = path.resolve( directory, html );

	if( synchronous ){
		try{
			html = flur( html, true );

		}catch( error ){
			throw new Error( `cannot resolve html file path, ${ error.stack }` );
		}

		if( !celene( true ) ){
			throw new Error( "cannot ensure selenium server" );
		}

		let client = webdriver.remote( {
			"desiredCapabilities": {
				"browserName": option.browser,
				"chromeOptions": chromeOption
			}
		} );

		shot.init( client );

		/*;
			@note:
				Do not change this construct, the promise returned does not properly
					work if it is not transferred to a variable.
			@end-note
		*/
		let image = client.init( ).url( html )
			.pause( option.pause )
			.saveViewportScreenshot( ( mode != DATA_URI )? output : undefined )
			.then( function done( result ){
				if( mode == DATA_URI ){
					process.stdout.write( `data:image/png;base64,${ result.toString( ) }` );
				}
			}, function issue( error ){
				if( mode != FILE || mode != BUFFER ){
					process.emitWarning( new Error( `cannot take screenshot, ${ error.stack }` ) );

					process.stdout.write( "false" );
				}
			} );

		if( mode == FILE || mode == BUFFER ){
			return output;
		}

		return true;

	}else{
		let catcher = flur.bind( zelf( this ) )( html )
			.then( function done( error, html ){
				if( error instanceof Error ){
					return catcher.stop( new Error( `cannot resolve html file path, ${ error.stack }` ), "" );
				}

				return catcher.pass( null, html )
			} )
			.then( function ensureSelenium( error, html ){
				return celene( )( function done( error, result ){
					if( error instanceof Error ){
						return catcher.stop( new Error( `cannot ensure selenium server, ${ error.stack }` ), "" );
					}

					if( !result ){
						return catcher.stop( new Error( "cannot ensure selenium server" ), "" );
					}

					return catcher.pass( null, html );
				} );
			} )
			.then( function takeScreenshot( error, html ){
				let client = webdriver.remote( {
					"desiredCapabilities": {
						"browserName": option.browser,
						"chromeOptions": chromeOption
					}
				} );

				shot.init( client );

				client.init( ).url( html )
					.pause( option.pause )
					.saveViewportScreenshot( ( mode !== DATA_URI )? output : undefined )
					.then( function done( result ){
						if( mode == BUFFER ){
							return catcher.through( "read-screenshot" );
						}

						if( mode == FILE ){
							return catcher.pass( null, output );
						}

						if( mode == DATA_URI ){
							catcher.pass( null, `data:image/png;base64,${ result.toString( ) }` );
						}

						return catcher.pass( null, true );

					}, function issue( error ){
						catcher.pass( new Error( `cannot take screenshot, ${ error.stack }` ), "" );
					} );

				return catcher;
			} )
			.flow( "read-screenshot", function readScreenshot( ){
				fs.readFile( output, function done( error, buffer ){
					if( error instanceof Error ){
						return catcher.pass( new Error( `cannot read screenshot, ${ error.stack }` ), "" );
					}

					return catcher.pass( null, buffer );
				} );
			} );

		return catcher;
	}
};

/*;
	@note:
		So that we can prevent polluting the global context.
	@end-note
*/
if( process.env.GLOBAL_SCREENSHOT ){
	harden( "screenshot", screenshot );
}

module.exports = screenshot;
