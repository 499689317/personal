const gulp = require('gulp')
const rsync = require('gulp-rsync')
gulp.task('testing', () => {
    return gulp
        .src('./')
        .pipe(
            rsync({
                root: './',
                username: 'root',
                hostname: '39.106.4.25',
                port: 9800,
                // progress: true,
                recursive: true,
                destination: '/home/web/web-server/',
                exclude: ['node_modules', '.git', '.gitignore', '.DS_Store', 'package-lock.json'],
            })
        )
        .on('error', err => {
            console.log(err)
        })
});