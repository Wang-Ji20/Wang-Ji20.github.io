hexo.extend.generator.register(
    'css',
    locals => {
        return {
            path: 'css/style.css',
            data: require('sass').compile(require('path').resolve(__dirname, '../source') + '/scss/style.scss').css,
        }
    }
)
