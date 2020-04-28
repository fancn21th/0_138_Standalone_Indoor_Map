module.exports = {
  sourcePath: "./src",
  buildPath: "./build",
  filesToWatch: [
    "./src/vendor/css/**/*.css",
    "./src/vendor/js/**/*.js",
    "./src/app/css/**/*.css",
    "./src/app/js/**/*.js",
    "./src/index.html",
  ],
  filesToInject: [
    "./src/vendor/css/**/*.css",
    "./src/vendor/js/**/*.js",
    "./src/app/css/**/*.css",
  ],
};
