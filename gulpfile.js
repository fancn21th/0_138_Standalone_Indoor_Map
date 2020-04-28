const { parallel, series, src, dest, watch } = require("gulp");
const inject = require("gulp-inject");
const del = require("del");
const browserSync = require("browser-sync").create();
const {
  sourcePath,
  buildPath,
  filesToWatch,
  filesToInject,
} = require("./gulpfile.config");

const appPath = `${sourcePath}/**/app`;
const appJsPath = `${appPath}/**/*.js`;
const appCssPath = `${appPath}/**/*.css`;
const appImgPath = `${appPath}/**/*.{png,gif,jpg,svg}`;
const vendorPath = `${sourcePath}/**/vendor`;
const vendorJsPath = `${vendorPath}/**/*.js`;
const vendorCssPath = `${vendorPath}/**/*.css`;

/**
 *  HTML 注入
 */
function index(cb) {
  const target = src("./src/index.html");
  const sources = src(filesToInject, {
    read: false,
  });
  return target
    .pipe(inject(sources, { ignorePath: "src" }))
    .pipe(dest(buildPath));
}

/**
 *  文件清理
 */
function clean(cb) {
  return del([buildPath], { force: true });
}

/**
 *  文件拷贝
 */
function copyVendorCss(cb) {
  return src("./src/vendor/**/*.css").pipe(dest(buildPath));
}

function copyVendorJs(cb) {
  return src("./src/vendor/**/*.js").pipe(dest(buildPath));
}

function copyAppCss(cb) {
  return src(appCssPath).pipe(dest(buildPath));
}

function copyAppJs(cb) {
  return src(appJsPath).pipe(dest(buildPath));
}

function copyAppImg(cb) {
  return src(appImgPath).pipe(dest(buildPath));
}

/**
 *  项目重加载
 */
function sync(cb) {
  browserSync.reload();
  cb();
}

/**
 *  项目编译
 */
// 开发编译
const devbuild = series(
  clean,
  parallel(copyVendorCss, copyVendorJs, copyAppCss, copyAppJs, copyAppImg),
  index
);
// 生产编译
const build = devbuild;

/**
 *  browserSync 伺服
 */
function serve(cb) {
  // Serve files from the root of this project
  browserSync.init({
    server: {
      baseDir: buildPath,
    },
  });

  watch(filesToWatch, { delay: 500 }, series(devbuild, sync));
}

exports.build = build;
exports.default = series(devbuild, serve);
