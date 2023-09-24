hexo.extend.generator.register('about', (locals) => {
    return {
        path: 'about.html',
        data: locals.theme,
        layout: ['about']
    }
})

hexo.extend.generator.register(
    'menu',
    (locals) => {
        return {
            path: 'menu.html',
            data: locals.theme,
            layout: ['menu']
        }
    }
)

hexo.extend.generator.register(
    'portfolio',
    (locals) => {
        return {
            path: 'portfolio.html',
            data: locals.theme,
            layout: ['portfolio']
        }
    }
)

hexo.extend.generator.register(
    'publication',
    (locals) => {
        return {
            path: 'publication.html',
            data: locals.theme,
            layout: ['publication']
        }
    }
)
