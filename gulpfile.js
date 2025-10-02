const { src, dest } = require("gulp");
const dartSass = require("sass");
const gulpSass = require("gulp-sass")(dartSass);
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");

function build() {
    return src("src/scss/main.scss")
        .pipe(gulpSass.sync().on("error", gulpSass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS({ level: 2 }))
        .pipe(dest("public/css"));
}

exports.build = build;
