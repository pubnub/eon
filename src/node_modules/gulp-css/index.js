//one css plugin for gulp

var through = require("through2");
var CleanCss = require("clean-css");

const PLUGIN_NAME = 'gulp-css';

module.exports = function (opt) {
  opt = opt || {};

  var minflyCss = function (file, enc, callback) {
    if (file.isNull()) {
      throw PluginError(PLUGIN_NAME, "file is null!");
    }

    if (file.isBuffer()) {
      var newContents = new CleanCss(opt).minify(String(file.contents));
      file.contents = new Buffer(newContents);
    }

    return callback(null, file);
  }

  return through.obj(minflyCss);
};
