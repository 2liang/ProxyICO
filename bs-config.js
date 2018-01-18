module.exports = {
  "port": 8000,
  "files": ["./app/**/*.{html,css,js}"],
  "server": {
    "baseDir": "./app",
    "routes": {
      "/static/jquery.min.js": "node_modules/jquery/dist/jquery.min.js",
      "/static/bootstrap/": "node_modules/bootstrap/dist/"
    }
  },
  middleware: {
      // Config the proxy
      // https://github.com/chimurai/http-proxy-middleware
      proxyMiddleware('/api', {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      })
    }
}
