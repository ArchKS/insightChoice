const CracoLessPlugin = require('craco-less');
const { loaderByName } = require('@craco/craco');

module.exports = function (webpackEnv) {
    const lessModuleRegex = /\.module\.less$/;
    return {
        plugins: [
            {
                plugin: CracoLessPlugin,
                options: {
                    lessLoaderOptions: {
                        lessOptions: {
                            javascriptEnabled: true,
                        },
                    },
                    modifyLessRule(lessRule) {
                        lessRule.exclude = lessModuleRegex;
                        return lessRule;
                    },
                    modifyLessModuleRule(lessModuleRule) {
                        lessModuleRule.test = lessModuleRegex;
                        const cssLoader = lessModuleRule.use.find(loaderByName('css-loader'));
                        cssLoader.options.modules = {
                            localIdentName: '[local]_[hash:base64:5]',
                        };
                        return lessModuleRule;
                    },
                },
            },
        ],
    };
};
