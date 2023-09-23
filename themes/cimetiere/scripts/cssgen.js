hexo.on('generateBefore',
    () => {
        require('child_process').execSync('npm run cssgen', { cwd: __dirname })
    }
)
