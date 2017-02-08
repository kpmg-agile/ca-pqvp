const inquirer = require('inquirer');
const _ = require('lodash');
const path = require('path');

/**
 * Creates a new Angular module with stubs for directives, pipes, providers and routes. Registers
 * the new module to the main app module.
 *
 * @param {*} config The configuration object
 * @returns {Promise} Resolves when done
 */
module.exports = function (config) {
    return inquirer.prompt([
        {
            type: 'string',
            name: 'name',
            message: 'What is the name of this new Angular Module?',
            filter: value => _.kebabCase(value).toLowerCase(),
            validate: value => !!value
        }
    ]).then(answers => {
        const assemble = require('assemble')();
        const rename = require('gulp-rename');
        const fs = require('fs');
        const outputPath = path.resolve(config.directories.modules, answers.name);
        const className = _.upperFirst(_.camelCase(answers.name));

        let file = path.resolve(__dirname, '../../../client/app/imports.js'),
            contents = fs.readFileSync(file).toString('utf8');

        contents += `\nimport {${className}Module} from '${path.relative(path.dirname(file), outputPath).split('\\').join('/')}';`;
        contents += `\nAPP_IMPORTS.push(${className}Module);`;
        fs.writeFileSync(file, contents, 'utf8');

        assemble
            .src(path.join(__dirname, 'templates/**/*'))
            .pipe(assemble.renderFile({
                engine: 'hbs',
                leftBrace: '{',
                rightBrace: '}',
                pascelCase: str => _.upperFirst(_.camelCase(str)),
                snakeCase: str => _.snakeCase(str).toUpperCase(),
                answers: answers
            }))
            .pipe(rename(path => {
                if (path.extname === '.js') {
                    path.extname = config.extensions.scripts;
                }
            }))
            .pipe(assemble.dest(outputPath));
    });
};
