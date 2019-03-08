const webpack = require('webpack'),
    path = require('path');

function resolve(dir = '') {
    return path.join(__dirname, dir);
}

module.exports = {
    css: { loaderOptions: { stylus: { import: ['var', 'color'].map(v => resolve(`src/assets/css/${v}.styl`)) } } },
    chainWebpack: config => {
        config.resolve.alias.set('#', resolve());
        config.resolve.alias.set('~', resolve('src/components'));
        config.resolve.alias.set('_font', resolve('src/assets/font'));
        config.resolve.alias.set('_css', resolve('src/assets/css'));
        config.resolve.alias.set('_js', resolve('src/assets/js'));
        config.resolve.alias.set('_img', resolve('src/assets/img'));
        config.plugin('provide').use(webpack.ProvidePlugin, [{ R: 'ramda' }]);
    },
};
