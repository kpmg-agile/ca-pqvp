const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const config = {
    extensions: {
        scripts: '.js',
        styles: '.css'
    },
    directories: {
        scaffolds: path.resolve(__dirname, 'scaffolds'),
        raml: path.resolve(__dirname, '../raml')
    }
};

inquirer.prompt([
    {
        type: 'list',
        name: 'scaffold',
        message: 'What would you like to create?',
        choices: fs.readdirSync(config.directories.scaffolds)
            .map(f => {
                return {
                    name: f,
                    value: path.join(config.directories.scaffolds, f, 'scaffold.js')
                };
            })
            .filter(f => fs.existsSync(f.value))
    }
]).then(answers => {
    try {
        //allow a config file to be passed in and merged into our default config
        if (process.argv[1]) {
            const _ = require('lodash');
            _.merge(config, require(path.resolve(process.argv[2])));
        }
        //the scaffold should export a function that takes a config and returns a promise
        require(answers.scaffold)(config).then(
            () => console.log('Done!'),
            (e) => console.error(e)
        );
    }
    catch (e) {
        console.error(e);
    }
});
