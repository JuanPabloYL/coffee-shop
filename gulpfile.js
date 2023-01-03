const { src, dest, watch, series } = require("gulp");

// CSS and SASS
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

// Images
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {
  // compile sass
  src("src/scss/app.scss")
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest("build/css"));
  done();
}

function images(done) {
  src("src/img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));

  done();
}

function versionWebp(done) {
  src("src/img/**/*.{png,jpg}").pipe(webp()).pipe(dest("build/img"));
  done();
}

function versionAvif(done) {
  const options = {
    quality: 50,
  };
  src("src/img/**/*.{png,jpg}").pipe(avif(options)).pipe(dest("build/img"));
  done();
}

function dev() {
  watch("src/scss/**/*.scss", css);
  watch("src/img/**/*", images);
}

exports.css = css;
exports.dev = dev;
exports.images = images;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(images, versionWebp, versionAvif, css, dev);
