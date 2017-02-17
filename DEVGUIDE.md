# Overview

This is the 3rd generation of webstart, a project starter for web development that orchestrates several 
open-source tools together into a cohesive workflow. This iteration concentrates on reducing complexity, 
abstractions and dependencies of the previous versions making this version easier to maintain.

## Whats under the hood?

* [Webpack](https://webpack.github.io/) - The module bundler for client-side code, configuration files can be found in 
`config/webpack.config*.js`.  [Initial v1 was released February 2014](https://github.com/webpack/webpack/releases/tag/v1.0.0)
* [Babel](https://babeljs.io/) - Transpiles ES6+ standards back to ES5 compliant code to run in all browsers, 
configuration files can be found in `.babelrc`. [Based on 6to5 released March 2014](https://babeljs.io/blog/2016/12/07/the-state-of-babel#some-history)
* [Express](https://expressjs.com/) - The framework for the server-side code used for hosting the client-side code and
also optionally for server-side API and/or rendering. [Initial v1 was released November 2010](https://github.com/expressjs/express/blob/master/History.md?#100--2010-11-16)
* [RAML](http://raml.org/) - API design and modeling with code and documentation generation. Hooks are already provided 
in both the client and server code of this project to handle this. [v1 spec was finalized May 2016](http://raml.org/blogs/announcing-raml-10-ga)
* [Karma](https://karma-runner.github.io) - The runner for unit testing the application in a browser, configuration files can be found in
`config/karma*.config.js`. [v1 was released June 2016](https://github.com/karma-runner/karma/blob/master/CHANGELOG.md#100-2016-06-23)
* [Protractor](http://www.protractortest.org) - The runner for end-to-end testing the application in a browser, configuration files can be found in 
`config/protractor.config.js`. [v1 was released July 2014](https://github.com/angular/protractor/releases/tag/1.0.0)
* [Istanbul](https://istanbul.js.org/) - The code coverage tool used to test coverage of both Karma and Protractor. [v0.1.26 was the first release on GitHub in January 2013](https://github.com/gotwarlost/istanbul/releases/tag/v0.1.26)
* [Jasmine](http://jasmine.github.io/) - The default expectation framework used for both Karma and Protractor. [v1 was released September 2010](https://github.com/jasmine/jasmine/releases/tag/1.0.0-release)
* [ESLint](http://eslint.org/) - The linter for ES code, configuration files can be found in `.eslintrc`. [v1 was released July 2015](https://github.com/eslint/eslint/blob/master/CHANGELOG.md)
* [ESDoc](https://esdoc.org/) - The documenter for ES code, configuration files can be found in `config/esdoc.config.js`. [v0.0.1 was released April 2015](https://github.com/esdoc/esdoc/releases/tag/v0.0.1)
* [i18next](http://i18next.com/) - The localization framework, configuration files can be found in `config/i18next.config.js`. (TODO: having trouble tracking down the v1 release date for this)

## Setup

### NodeJS
Preferably, install [NVM](https://github.com/creationix/nvm) or alternatively install the correct version
of NodeJS specified in `.nvmrc`. Once nvm is installed:

```
nvm install && nvm use
```

This will install and link the correct version of NodeJS locally for 
the project. You should always ensure you are running the correct 
version when working on the project.

### Docker
The production stack is hosted entirely within docker containers.
Although not essential for development, it's preferable to launch the database server using the included docker image.
With this approach, it is not necessary to install the [neo4j](https://neo4j.com/) graph database on the host machine.

Install [Docker](https://www.docker.com/products/docker) for your platform. 
Once docker is installed, run a one-time command to initialize a [swarm](https://docs.docker.com/engine/swarm/):

```
docker swarm init
```

This will prepare docker for subsequent stack deployment. 
For development and testing, the database docker image needs to be running. It can be started (deployed to a stack) and stopped (stack removed) with npm scripts:

```
npm run docker-dev-start
npm run docker-dev-stop
```

The image does not need to be restarted for each build.

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

When having trouble with unit tests, you can attach a debugger to karma.
Start the karma server directly:

```
npm run karma-watch
```

Then, navigate to http://localhost:9876/debug.html, open browser
dev tools, and set breakpoints.  The browser refresh button will cause tests
to re-run and breakpoints to trigger.

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

# Generating Swagger

```
npm run raml2swagger
```

This task will process the /raml/api.v1.raml and convert it to /swagger/api.v1.yaml.

This task should be run whenever RAML files are modified.

Read more about this in [/swagger/README.md](swagger/README.md)
