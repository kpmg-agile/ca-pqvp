const inquirer = require('inquirer');
const _ = require('lodash');
const path = require('path');

/**
 * Creates a new ES6 class export file and accompanying
 * spece file.
 *
 * @param {*} config The configuration object
 * @returns {Promise} Resolves when done
 */
module.exports = function (config) {
    return inquirer.prompt([
        {
            type: 'string',
            name: 'name',
            message: 'What is the name of this new Class?',
            filter: value => _.upperFirst(_.camelCase(value)),
            validate: value => !!value
        },
        {
            type: 'string',
            name: 'path',
            message: 'Where do you want to put this Class?',
            default: 'client',
            filter: value => path.resolve(__dirname, '../../../', value)
        }
    ]).then(answers => {
        const assemble = require('assemble')();
        const rename = require('gulp-rename');
        assemble
            .src(path.join(__dirname, 'templates/**/*'))
            .pipe(assemble.renderFile({
                engine: 'hbs',
                camelCase: _.camelCase,
                answers: answers
            }))
            .pipe(rename(path => {
                path.basename = path.basename.replace('Class', answers.name);
                path.extname = config.extensions.scripts;
            }))
            .pipe(assemble.dest(answers.path));
    });
};
