import config from './app.config';

module.exports = {
    debug: config.environment !== 'production',
    whitelist: [
        config.defaultLangCode
    ],
    defaultNS: 'translation',
    fallbackLng: config.defaultLangCode,
    initImmediate: true
};
