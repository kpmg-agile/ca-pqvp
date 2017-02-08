const inquirer = require('inquirer');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

/**
 * Creates a new Angular directive with specs. Registers
 * the new directive to the given module.
 *
 * @param {*} config The configuration object
 * @returns {Promise} Resolves when done
 */
module.exports = function (config) {
    return inquirer.prompt([
        {
            type: 'string',
            name: 'name',
            message: 'What is the name of this new Angular Directive?',
            filter: value => _.upperFirst(_.camelCase(value)),
            validate: value => !!value
        },
        {
            type: 'list',
            name: 'module',
            message: 'Which module will this be added to?',
            choices: fs.readdirSync(config.directories.modules)
                .map(f => {
                    return {
                        name: f,
                        value: path.join(config.directories.modules, f)
                    };
                })
                .filter(f => fs.statSync(f.value).isDirectory())
        }
    ]).then(answers => {
        const assemble = require('assemble')();
        const rename = require('gulp-rename');
        const dirname = _.kebabCase(answers.name).toLowerCase();

        let file = path.resolve(answers.module, 'directives/index.js'),
            contents = fs.readFileSync(file).toString('utf8');

        contents += `\nimport ${answers.name} from './${dirname}';`;
        contents += `\nexport {${answers.name} as ${answers.name}};`;
        contents += `\n${_.snakeCase(path.basename(answers.module)).toUpperCase()}_DIRECTIVES.push(${answers.name});`;

        fs.writeFileSync(file, contents, 'utf8');

        assemble
            .src(path.join(__dirname, 'templates/**/*'))
            .pipe(assemble.renderFile({
                engine: 'hbs',
                leftBrace: '{',
                rightBrace: '}',
                camelCase: _.camelCase,
                hyphenCase: str => _.kebabCase(str).toLowerCase(),
                answers: answers,
                config: config
            }))
            .pipe(rename(path => {
                path.basename = path.basename.replace('Directive', answers.name);
                if (path.extname === '.js') {
                    path.extname = config.extensions.scripts;
                }
            }))
            .pipe(assemble.dest(path.resolve(answers.module, 'directives', dirname)));
    });
};
