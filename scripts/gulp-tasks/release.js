const path = require('path')

const gulp = require('gulp')
const bump = require('gulp-bump')
const shell = require('shelljs')
const runSequence = require('run-sequence')

// Change working dir to come back to the project root
const workingDir = '../../'
process.chdir(workingDir)

const packageFilePath = './package.json'
let newTag

gulp.task('default', ['release:test'])

/**
 * Build Alias Task
 */
gulp.task('build', (done) => {
  shell.exec('yarn pipeline', done)
})

/**
 * Yarn Publish Task
 */
gulp.task('publish', (done) => {
  newTag = require(path.resolve(packageFilePath))
  shell.exec('yarn publish . --new-version ' + newTag, done)
})

/**
 * Git Tag Task
 */
gulp.task('gitTag', (done) => {
  shell.exec('git tag ' + newTag, done)
})

/**
 * Git Push Task
 */
gulp.task('gitPush', (done) => {
  shell.exec('git push --tags origin', done)
})

/**
 * Bump Prerelease Task
 */
gulp.task('bump:prerelease', () => {
  gulp.src(packageFilePath)
  .pipe(bump({type: 'prerelease'}))
  .pipe(gulp.dest('./'))
})

/**
 * Bump Patch Task
 */
gulp.task('bump:patch', () => {
  gulp.src(packageFilePath)
  .pipe(bump({type: 'patch'}))
  .pipe(gulp.dest('./'))
})

/**
 * Bump Minor Task
 */
gulp.task('bump:minor', () => {
  gulp.src(packageFilePath)
  .pipe(bump({type: 'minor'}))
  .pipe(gulp.dest('./'))
})

/**
 * Bump Major Task
 */
gulp.task('bump:major', () => {
  gulp.src(packageFilePath)
  .pipe(bump({type: 'major'}))
  .pipe(gulp.dest('./'))
})

/**
 * Release Prerelease Task
 */
gulp.task('release:prerelease', done => {
  runSequence('build', 'bump:prerelease', 'gitTag', 'gitPush', 'publish', done)
})

/**
 * Release Path Task
 */
gulp.task('release:patch', done => {
  runSequence('build', 'bump:patch', 'gitTag', 'gitPush', 'publish', done)
})

/**
 * Release Minor Task
 */
gulp.task('release:minor', done => {
  runSequence('build', 'bump:minor', 'gitTag', 'gitPush', 'publish', done)
})

/**
 * Release Major Task
 */
gulp.task('release:major', done => {
  runSequence('build', 'bump:major', 'gitTag', 'gitPush', 'publish', done)
})
