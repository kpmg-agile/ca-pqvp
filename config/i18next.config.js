import config from './app.config';

module.exports = {
    debug: config.environment !== 'production',
    whitelist: [
        config.defaultLangCode,
        'qps' // pseudoloc
    ],
    defaultNS: 'translation',
    fallbackLng: config.defaultLangCode,
    initImmediate: true
};
