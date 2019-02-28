const webpack = require('webpack');

module.exports = {
    chainWebpack: config => {
        config.plugin('provide').use(webpack.ProvidePlugin, [{ R: 'ramda' }]);
    },
};
