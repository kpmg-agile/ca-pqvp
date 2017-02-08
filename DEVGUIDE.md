# Overview

This is the 3rd generation of webstart, a project starter for web development that orchestrates several 
open-source tools together into a cohesive workflow. This iteration concentrates on reducing complexity, 
abstractions and dependencies of the previous versions making this version easier to maintain.

## Whats under the hood?

* [Webpack](https://webpack.github.io/) - The module bundler for client-side code, configuration files can be found in 
`config/webpack.config*.js`.
* [Babel](https://babeljs.io/) - Transpiles ES6+ standards back to ES5 compliant code to run in all browsers, 
configuration files can be found in `.babelrc`.
* [Express](https://expressjs.com/) - The framework for the server-side code used for hosting the client-side code and
also optionally for server-side API and/or rendering.
* [RAML](http://raml.org/) - API design and modeling with code and documentation generation. Hooks are already provided 
in both the client and server code of this project to handle this.
* [Karma](https://karma-runner.github.io) - The runner for unit testing the application in a browser, configuration files can be found in
`config/karma*.config.js`.
* [Protractor](http://www.protractortest.org) - The runner for end-to-end testing the application in a browser, configuration files can be found in 
`config/protractor.config.js`.
* [Istanbul](https://istanbul.js.org/) - The code coverage tool used to test coverage of both Karma and Protractor.
* [Jasmine](http://jasmine.github.io/) - The default expectation framework used for both Karma and Protractor.
* [ESLint](http://eslint.org/) - The linter for ES code, configuration files can be found in `.eslintrc`.
* [ESDoc](https://esdoc.org/) - The documenter for ES code, configuration files can be found in `config/esdoc.config.js`.
* [i18next](http://i18next.com/) - The localization framework, configuration files can be found in `config/i18next.config.js`.

## Setup

Preferably, install [NVM](https://github.com/creationix/nvm) or alternatively install the correct version
of NodeJS specified in `.nvmrc`. Once nvm is installed:

```
nvm install && nvm use
```

This will install and link the correct version of NodeJS locally for 
the project. You should always ensure you are running the correct 
version when working on the project.

# Running for development

```
npm install
npm start
```

This will start the express server that will watch for changes and rebuild
as necessary. This has sever some core features:

* Host statically compiled from "dist" directory (see `Prebuild statically compiled files`)
* Host dynamically compiled files on-demand from webpack (disabled if only running `npm install --production`)
* Host RAML NodeJS validation + mock server with user defined API hooks
* Watch client source files with webpack hot module support and force reload fallback
* Watch server source files with server restart via nodemon

# Running for production

## Prebuild statically compiled files

```
npm install
npm run build
```

This will compile all files to the `dist` directory optimized for production. You could now deploy 
the contents of this application to run on a remote server, or use the commands below to 
use the built-in express server to host your production application.

## Run the application

```
npm install --production
node server
```

This will install the minimal number of dependencies to run the 
express app and start the server. This means that webstart can act as a fully functional
stand-alone web server for your application, using the same server you use for 
development purposes but its now targeting precompiled client assets optimized 
for production use.

All watch and dynamic on-demand compilation features are disabled in this mode, but all
other functionality remains just like running for development.

# Testing the App

```
npm install
npm test
```

This will ensure the dependencies are clean and up-to-date, then run 
the tests including Karma, Istanbul, ESLint and Protractor. All reports are output
to the `reports` directory.

Alternatively you can watch for
changes and re-run all tests when changes occur and open up the results
in a browser:

```
npm run test-watch
```

# Run the project Scaffolding

```
npm run scaffold
```

This will make sure the scaffolding dependencies are installed and prompt 
you as to which scaffold you would like to run. This simply reads
the names of the scaffold directories under `scaffold/scaffolds`, you can
feel free to modify the existing scaffold templates or create new scaffolds 
using another scaffold as a basis. 

The scaffolding makes use of two basic dependencies: [Inquirer](https://github.com/sboudrias/Inquirer.js) 
for question prompting and [Assemble](https://github.com/assemble/assemble) for assembling and
copying template files.

# Documenting the Project

```
npm install
npm run docs
```

This task will generate all documentation to the `docs` directory. All
the source script files will be parsed via ESDoc and all RAML files 
in `raml/*.raml` will create API docs.
