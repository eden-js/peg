// Require dependencies
const gulp   = require('gulp');
const pegjs  = require('gulp-pegjs');
const rename = require('gulp-rename');
const Path   = require('path');

/**
 * Create PEG.JS Task class
 *
 * @task peg
 */
class PegTask {
  /**
   * Construct PEG.JS Task class
   *
   * @param {Loader} runner
   */
  constructor(runner) {
    // Set private variables
    this._runner = runner;

    // Bind public methods
    this.run = this.run.bind(this);
    this.watch = this.watch.bind(this);
  }

  /**
   * Run assets task
   *
   * @param   {array} files
   */
  async run(files) {
    let job = gulp.src(files)
      .pipe(pegjs());

    job = job.pipe(rename((path) => {
      // Change @module/bundles/bundle/peg/parser.pegjs to bundle/parser.pegjs
      path.dirname = path.dirname.split(Path.sep).slice(-2, -1).join(Path.sep);
    }));

    job = job.pipe(gulp.dest(`${global.appRoot}/data/parsers`));

    // Restart server on end
    job.on('end', () => {
      this._runner.restart();
    });

    // Wait for job to end
    await new Promise((resolve, reject) => {
      job.once('end', resolve);
      job.once('error', reject);
    });
  }

  /**
   * Watch task
   *
   * @return {string[]}
   */
  watch() {
    // Return files
    return [
      'peg/**/*.pegjs',
    ];
  }
}

/**
 * Export PEG.JS Task class
 *
 * @type {PegTask}
 */
module.exports = PegTask;
