module.exports = {
    publicPath: '/wx-crmTest/',
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
                // target: 'http://122.51.207.208:8088/',
                changeOrigin: true,
                // 路径重写： 下面的意思是重写访问路径中的  '/api' 为 '' ，如果没有重写, /api 代表 http://127.0.0.1:8090/api
                pathRewrite: {
                    '^/wx-crm-server': '/wx-crm-server'//base_api是自定义用来代替http://www.baidu.com/的
                }
            },
            '/aliyun': {
                target: 'https://wxa.jiain.net/',
                // target: 'http://122.51.207.208:8088/',
                changeOrigin: true,
                // 路径重写： 下面的意思是重写访问路径中的  '/api' 为 '' ，如果没有重写, /api 代表 http://127.0.0.1:8090/api
                pathRewrite: {
                    '^/aliyun': '/aliyun'//base_api是自定义用来代替http://www.baidu.com/的
                }
            },
        }
    }
};