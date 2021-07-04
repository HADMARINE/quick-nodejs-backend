const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build_pre', (done) => {
  if (fs.existsSync(tsProject.options.outDir)) {
    fs.rmdirSync(tsProject.options.outDir, { recursive: true });
  }
  done();
});

gulp.task('build_main', () => {
  const tsResult = tsProject
    .src()
    .pipe(babel())
    .pipe(gulp.dest(tsProject.options.outDir));

  return tsResult;
});

gulp.task('build_post', (done) => {
  // FOR Plug_N_Play

  const indexFileRoot = path.join(tsProject.options.outDir, '/index.js');

  const indexFile = fs.readFileSync(indexFileRoot).toString();

  let newIndexFile = '';

  const splitResult = indexFile.split(';', 1);
  splitResult.push(indexFile.substring(splitResult[0].length));

  newIndexFile += splitResult[0];
  newIndexFile += ";\n\nrequire('../.pnp.js').setup()";
  newIndexFile += splitResult[1];

  fs.writeFileSync(indexFileRoot, newIndexFile);

  fs.rmdir(path.join(tsProject.options.outDir, '/__tests__'), {
    recursive: true,
  });

  done();
});

gulp.task('build', gulp.series(['build_pre', 'build_main', 'build_post']));
