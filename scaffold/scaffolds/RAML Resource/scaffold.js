const inquirer = require('inquirer');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const pluralize = require('pluralize');

/**
 * Creates a new RAML resource and registers it to the associated
 * RAML file.
 *
 * @param {*} config The configuration object
 * @returns {Promise} Resolves when done
 */
module.exports = function (config) {
    return inquirer.prompt([
        {
            type: 'string',
            name: 'name',
            message: 'What is the name of this new RAML Resource?',
            filter: value => pluralize.singular(_.upperFirst(_.camelCase(value))),
            validate: value => !!value
        },
        {
            type: 'list',
            name: 'raml',
            message: 'Which RAML file do you want to add this to?',
            choices: fs.readdirSync(config.directories.raml)
                .map(f => {
                    return {
                        name: f,
                        value: path.join(config.directories.raml, f)
                    };
                })
                .filter(f => f.name.match(/.raml$/))
        }
    ]).then(answers => {
        const assemble = require('assemble')();
        const parser = require('raml-parser');

        return parser.loadFile(answers.raml).then(raml => {

            let pluralKebabName = _.kebabCase(pluralize(answers.name)),
                relativeOutputPath = path.relative('/', raml.baseUri).split('\\').join('/') + '/' + pluralKebabName,
                contents = fs.readFileSync(answers.raml).toString('utf8');

            contents = contents.replace(/schemas:\s*\-/gm, `schemas:\n    -
        ${answers.name}: !include "${relativeOutputPath}/member.schema.json"
        ${answers.name}Collection: !include "${relativeOutputPath}/collection.schema.json"`);

            contents += `\n/${pluralKebabName}: !include "${relativeOutputPath}/resource.raml"`;

            fs.writeFileSync(answers.raml, contents, 'utf8');

            assemble
                .src(path.join(__dirname, 'templates/**/*'))
                .pipe(assemble.renderFile({
                    engine: 'hbs',
                    camelCase: _.camelCase,
                    answers: answers,
                    leftBrace: '{',
                    rightBrace: '}'
                }))
                .pipe(assemble.dest(path.join(config.directories.raml, raml.baseUri, _.kebabCase(pluralize(answers.name)))));
        });
    });
};
