const _ = require('lodash');
const fs = require('fs');
const files = fs.readdirSync(__dirname).filter(f => f.match( /\.svg$/));

/**
 * Uses the fontgen-loader with webpack to dynamically generate a webfont
 * for the *.svg files in this directory. Once this file is imported into
 * the application, the generated CSS and Fonts are injected into the
 * document and you can use class selectors to implement the icon.
 *
 * For consistency, all files are renamed to kebab-case, so a
 * file named "Foo Bar.svg" or "FooBar.svg" or "foo_bar.svg" will
 * be kebab-cased with a given class prefix (ie "icons-"), thus
 * becoming "icons-foo-bar".
 *
 * You can copy this file as many times as you like in other directories
 * to create additional font icon libraries if you wish. The default
 * webpack.config.js file has been mapped to use the fontgen loader
 * on any file named font.js.
 *
 * Note that all SVG elements in this directory should be bound to
 * the same stage size, having SVG's of varying size may make it
 * difficult to implement common font sizes.
 *
 * @see https://github.com/DragonsInn/fontgen-loader
 *
 * @example Foo_Bar.svg
 * <i class="icons icons-foo-bar"></i>
 *
 * @type {{files: *, fontName: string, classPrefix: string, baseClass: string, fixedWidth: boolean, types: string[], rename: module.exports.rename}}
 */
module.exports = {
    files: files,
    fontName: 'WebstartIcons',
    classPrefix: 'icons-',
    baseClass: 'icons',
    fixedWidth: true,
    types: ['eot', 'woff', 'ttf', 'svg'],
    rename: f => _.kebabCase(f.replace(__dirname, '').replace('.svg', ''))
};
