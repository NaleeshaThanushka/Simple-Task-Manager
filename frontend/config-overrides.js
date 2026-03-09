// frontend/config-overrides.js
const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url"),
        "util": require.resolve("util/"),
        "zlib": require.resolve("browserify-zlib"),
        "path": require.resolve("path-browserify")
    });
    config.resolve.fallback = fallback;
    
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ]);
    
    return config;
};

//CRA won't let you edit webpack. config-overrides.js breaks that lock. 🔓