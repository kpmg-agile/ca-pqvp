const html5HistoryMode = !!process.env.APP_HTML5_HISTORY_MODE;
/**
 * @typedef {object} app.config
 */
const CONFIG = {
    /**
     * The target environment that the app is running in, usually either development or production.
     * This can be set by environment variable NODE_ENV, default is 'development'.
     * @type {string}
     */
    environment: (process.env.NODE_ENV || 'development').toLowerCase(),

    /**
     * The port that the server will be used on
     * This can be set by environment variable PORT default is 8080.
     * @type {string|number}
     */
    hostPort: process.env.PORT || '8080',

    /**
     * The server location to resolve the API for if its not being hosted locally. This setting can be
     * used several different ways including:
     *
     * * Client-side as a hard-coded compile time configuration reference to the remove server with CORS
     * * Server-side as a run time configuration reference to proxy the local request to the remote server without CORS
     * * Server-side as a run time configuration reference to redirect the local request to the remote server with CORS
     *
     * This can be set by environment variable APP_API_SERVER default is ''.
     * @type {string}
     */
    apiServer: process.env.APP_API_SERVER || '',

    /**
     * This is the baseUrl that the application runs from. This sets the base[href] value on the index.html page so
     * when using html5HistoryMode, the application knows where the root of the URL should actually start. This requires
     * a value if you do not intend on running your app on the root of a domain and instead run it in a sub directory.
     *
     * This can be set by environment variable APP_BASE_URL default is '/' when html5HistoryMode is true, otherwise
     * './' when html5HistoryMode is false.
     * @type {string}
     */
    baseUrl: process.env.APP_BASE_URL || (html5HistoryMode ? '/' : './'),

    /**
     * Determines if html5HistoryMode should be enabled or not. When enabled, this will setup the express server to
     * redirect what would typically be 404 Not Found requests for text/html content back to the main index.html page
     * and let the client application handle the route. When disabled, you would typically use Hash based location
     * strategies in your client application for routing.
     *
     * This can be set by environment variable APP_HTML5_HISTORY_MODE default is false since it requires both client-side
     * and server-side configuration support. Server-side support is built-in the included express server, but if you
     * choose to roll your own deployment server, you would need to configure this yourself.
     *
     * @type {boolean}
     */
    html5HistoryMode: html5HistoryMode,

    /**
     * The default language for the application. The app will preload the default language for i18next resource
     * bundle in with the app so there isn't a separate load required.
     *
     * This can be set by environment variable DEFAULT_LANG_CODE, default is 'en'.
     *
     * @type {string}
     */
    defaultLangCode: process.env.DEFAULT_LANG_CODE = 'en',

    /**
     * Building information, such as the source branch and commit
     *
     * This can be set by environment variable BUILD_INFO, default is 'local'.
     *
     * @type {string}
     */
    buildInfo: process.env.BUILD_INFO || 'local'
};

const ENV_CONFIGS = {
    production: {

    },
    development: {

    }
};

const TARGET_CONFIG = {
    production: {
        apiServer: 'prod.domain.com'
    },
    development: {
        apiServer: 'dev.domain.com'
    },
    qa: {
        apiServer: 'qa.domain.com'
    },
    uat: {
        apiServer: 'uat.domain.com'
    },
    mock: {

    }
};

//assign overrides based on environment
Object.assign(CONFIG, ENV_CONFIGS[CONFIG.environment]);

//assign overrides based on command line targets (ie --mock)
process.argv.forEach(arg => {
    arg = arg.replace('--', '');
    if (TARGET_CONFIG.hasOwnProperty(arg)) {
        Object.assign(CONFIG, TARGET_CONFIG[arg]);
    }
});

console.log(JSON.stringify(CONFIG, null, 2));

module.exports = CONFIG;
