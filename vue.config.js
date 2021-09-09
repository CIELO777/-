
const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    // publicPath: '/wx-crm/',
    publicPath: process.env.VUE_APP_ROUTE,
    outputDir: process.env.outputDir,
    // assetsSubDirectory: 'static',
    // assetsPublicPath: '/',
    devServer: {
        proxy: {
            '/api': {
                target: 'https://wxa.jiain.net/',
                changeOrigin: true,
                // 路径重写： 下面的意思是重写访问路径中的  '/api' 为 '' ，如果没有重写, /api 代表 http://127.0.0.1:8090/api
                pathRewrite: {
                    '^/api': '/api'//base_api是自定义用来代替http://www.baidu.com/的
                }
            },
            '/wx-crm-server': {
                target: 'https://wxa.jiain.net/',
                // target: 'http://192.168.3.78:8088/',
                // target: 'https://wxa.jiain.net/',
                changeOrigin: true,
                // 路径重写： 下面的意思是重写访问路径中的  '/api' 为 '' ，如果没有重写, /api 代表 http://127.0.0.1:8090/api
                pathRewrite: {
                    '^/wx-crm-server': '/wx-crm-server'//base_api是自定义用来代替http://www.baidu.com/的
                }
            },
            '/work': {
                target: 'https://wxa.jiain.net/',
                // target: 'http://192.168.3.78:8088/',
                // target: 'https://wxa.jiain.net/',
                changeOrigin: true,
                // 路径重写： 下面的意思是重写访问路径中的  '/api' 为 '' ，如果没有重写, /api 代表 http://127.0.0.1:8090/api
                pathRewrite: {
                    '^/work': '/work'//base_api是自定义用来代替http://www.baidu.com/的
                }
            },
            '/aliyun': {
                target: 'https://api.jiain.net/',
                // target: 'http://122.51.207.208:8088/',
                changeOrigin: true,
                // 路径重写： 下面的意思是重写访问路径中的  '/api' 为 '' ，如果没有重写, /api 代表 http://127.0.0.1:8090/api
                pathRewrite: {
                    '^/aliyun': '/aliyun'//base_api是自定义用来代替http://www.baidu.com/的
                }
            },
            '/itver': {
                target: 'https://wxa.jiain.net/',
                // target: 'http://122.51.207.208:8088/',
                changeOrigin: true,
                // 路径重写： 下面的意思是重写访问路径中的  '/api' 为 '' ，如果没有重写, /api 代表 http://127.0.0.1:8090/api
                pathRewrite: {
                    '^/itver': '/itver'//base_api是自定义用来代替http://www.baidu.com/的
                }
            },
            '/view': {
                target: 'https://wxa.jiain.net/',
                // target: 'http://122.51.207.208:8088/',
                changeOrigin: true,
                // 路径重写： 下面的意思是重写访问路径中的  '/api' 为 '' ，如果没有重写, /api 代表 http://127.0.0.1:8090/api
                pathRewrite: {
                    '^/view': '/view'//base_api是自定义用来代替http://www.baidu.com/的
                }
            },
            '^/upload': {
                target: 'https://a.looyu.com/',
                // target: 'http://122.51.207.208:8088/',
                changeOrigin: true,
                // 路径重写： 下面的意思是重写访问路径中的  '/api' 为 '' ，如果没有重写, /api 代表 http://127.0.0.1:8090/api
                pathRewrite: {
                    '^/upload': '/upload'//base_api是自定义用来代替http://www.baidu.com/的
                }
            },
            '^/session': {
                target: 'https://wxa.jiain.net/',
                // target: 'http://122.51.207.208:8088/',
                changeOrigin: true,
                // 路径重写： 下面的意思是重写访问路径中的  '/api' 为 '' ，如果没有重写, /api 代表 http://127.0.0.1:8090/api
                pathRewrite: {
                    '^/session': '/aliyun/session'
                }
            },
        }
    },
    chainWebpack: (config) => {
        //修改文件引入自定义路径
        config.resolve.alias
            .set('@', resolve('src'))
        // 修改当前项目默认svg 配置，排除icons目录
        config.module.rule('svg')
            .exclude.add(resolve('./src/icons'))
        // 新增一个 rule：添加icons 里面svg
        config.module.rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('./src/icons')).end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({ symbolId: 'icon-[name]' })
    }
};