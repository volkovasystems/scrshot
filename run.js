#!/usr/bin/env node

/*;
	@run-module-license:
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
	@end-run-module-license

	@run-module-configuration:
		{
			"package": "scrshot",
			"path": "scrshot/run.js",
			"file": "run.js",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/scrshot.git",
			"shell": "scrshot",
			"command": "take",
			"parameter": [ "html" ]
		}
	@end-run-module-configuration

	@run-module-documentation:
		Run module for the scrshot module.
	@end-run-module-documentation

	@include:
		{
			"path": "path",
			"yargs": "yargs"
		}
	@end-include
*/

const path = require( "path" );
const yargs = require( "yargs" );

const scrshot = require( path.resolve( __dirname, "scrshot" ) );
const package = require( path.resolve( __dirname, "package.json" ) );

const DEFAULT_BROWSER_WIDTH = 800;
const DEFAULT_BROWSER_HEIGHT = 600;
const DEFAULT_DIRECTORY = process.cwd( );
const DEFAULT_OUTPUT = "screenshot";
const DEFAULT_PAUSE = 1000;
const DEFAULT_SILENT = true;
const DEFAULT_PERSIST = true;

const parameter = yargs
	.epilogue( ( package.homepage )?
		`For more information go to, ${ package.homepage }` :
		"Please read usage and examples carefully." )

	.usage( `Usage: ${ package.option.shell } take <html>` )

	.command( "take <html>",
		"Take screenshot of the html." )

	.example( "$0 take test.html",
		"Take screenshot of test.html using default settings." )

	.option( "d", {
		"alias": "directory",
		"default": DEFAULT_DIRECTORY,
		"describe": "Set the directory to save the screenshot image file.",
		"type": "string"
	} )

	.option( "w", {
		"alias": "width",
		"default": DEFAULT_BROWSER_WIDTH,
		"describe": "Set the browser width.",
		"type": "number"
	} )

	.option( "h", {
		"alias": "height",
		"default": DEFAULT_BROWSER_HEIGHT,
		"describe": "Set the browser height.",
		"type": "number"
	} )

	.option( "o", {
		"alias": "output",
		"default": DEFAULT_OUTPUT,
		"describe": "Set the output file name.",
		"type": "string"
	} )

	.option( "p", {
		"alias": "pause",
		"default": DEFAULT_PAUSE,
		"describe": "Set the pause duration.",
		"type": "number"
	} )

	.option( "s", {
		"alias": "silent",
		"default": DEFAULT_SILENT,
		"describe": "Disable silent mode to output the data URI of the image.",
		"type": "boolean"
	} )

	.option( "r", {
		"alias": "persist",
		"default": DEFAULT_PERSIST,
		"describe": "Disable persist mode to prevent file output, this will force disable silent mode.",
		"type": "boolean"
	} )

	.help( "help" )

	.version( function version( ){
		return package.version;
	} )

	.wrap( null )

	.strict( )

	.argv;

process.stdout.write( scrshot( parameter.html, true, {
	"directory": parameter.directory,
	"browserWidth": parameter.width,
	"browserHeight": parameter.height,
	"output": parameter.output,
	"pause": parameter.pause,
	"silent": parameter.silent,
	"persist": parameter.persist
} ) );
