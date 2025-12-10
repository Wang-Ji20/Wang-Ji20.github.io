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

hexo.extend.generator.register(
    'research',
    (locals) => {
        return {
            path: 'research.html',
            data: locals.theme,
            layout: ['research']
        }
    }
)

hexo.extend.generator.register(
    'story',
    (locals) => {
        return {
            path: 'story.html',
            data: locals.theme,
            layout: ['story']
        }
    }
)

hexo.extend.generator.register(
    'essay',
    (locals) => {
        return {
            path: 'essay.html',
            data: locals.theme,
            layout: ['essay']
        }
    }
)

hexo.extend.generator.register(
    'gallery',
    (locals) => {
        return {
            path: 'gallery.html',
            data: locals.theme,
            layout: ['gallery']
        }
    }
)

hexo.extend.generator.register(
    'archive',
    (locals) => {
        return {
            path: 'archive.html',
            data: locals.theme,
            layout: ['archive']
        }
    }
)

hexo.extend.generator.register(
    'search',
    (locals) => {
        return {
            path: 'search.html',
            data: locals.theme,
            layout: ['search']
        }
    }
)
