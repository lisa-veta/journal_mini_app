const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://185.104.249.229:3000', // Замените на адрес вашего сервера
            changeOrigin: true,
            secure: false, // Разрешает проксирование HTTP
            pathRewrite: {
                '^/api': '', // Убирает "/api" из пути
            },
        })
    );
};
console.log('Proxy setup loaded');


