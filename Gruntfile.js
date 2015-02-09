module.exports = function(grunt) {

  // Add Bower javascript dependencies here.  Get copied into dist/lib loaded by require.js
  // (When adding, remember to update requirejs config in main.js)
  var BOWER_JS_LIBS = [
    './bower_components/requirejs/require.js',
    './bower_components/jquery/dist/jquery.js',
    './bower_components/bootstrap/dist/js/bootstrap.js',
    './bower_components/lodash/dist/lodash.js',
    './bower_components/tinycolor/tinycolor.js'
  ];

  var DEV_HTTP_PORT = 8000;

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),

    clean: ['build', 'dist'],

    // less -- css preparser, builds Bootstrap (brought in via Bower and style.less)
    // less:development just compiles less, less:production minifies it
    less: {
      development: {
        files: {
          "./dist/css/style.css": ["./src/css/main.less"]
        }
      },
      production: {
        options: {
          cleancss: true, //minifies the result
          modifyVars: {
            // eg:
            //imgPath: '"http://mycdn.com/path/to/images"',
            //bgColor: 'red'
          }
        },
        files: {
          "./dist/css/style.min.css": ["./src/css/main.less"]
        }
      }
    },

    // dev-dependency: Lint all JavaScript
    jshint: {
      options: {
        jshintrc: '.jshintrc',

        // TODO: Ignore bower libs, see copy:bower_libs TODO
        ignores: ['src/public/app/lib/**/*.js']
      },
      files: [
        'Gruntfile.js',
        'src/**/*.js',
      ]
    },

    copy: {
      // includes files within path and its sub-directories
      public: {
        expand: true,
        cwd: 'src/public/',
        src: ['**'],
        dest: 'dist/',
        filter: function(filepath) {
          // skip src/public/app -- that gets browserify'd
          return !filepath.match(/^src\/public\/app/g);
        }
      },

      bower_libs: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        src: BOWER_JS_LIBS,

        // TODO: Put bower files into app folder so can be browserify'd.  Can't figure out how to get aliases to work.
        //       Note that jshint also ignores these files.
        dest: 'src/public/app/lib'
      },

      bootstrap: {expand: true, cwd: 'bower_components/bootstrap/dist/fonts', src: ['**'], dest: 'dist/fonts'},
    },

    browserify: {
      app: {
        src: 'src/public/app/main.js',
        dest: 'dist/app.js',
        browserifyOptions: {
          basedir: 'src/public/app',

          // Makes it so you can require any lib defined in BOWER_JS_LIBS by just doing:
          //   var _ = require('lodash')
          // (passed from browserify to https://www.npmjs.com/package/module-deps)
          //paths: 'build/bower_libs',
          // TODO: This should be working but it's not.  Not sure what's going on.

          // Adds source maps.  TODO: Not yet working
          debug: true
        }
      },
    },

    // concatenate all javascript together
    concat: {
      css_libs: {
        src: ['bower_components/bootstrap/dist/css/bootstrap.min.css',
              'bower_components/bootstrap/dist/css/bootstrap-theme.min.css'],
        dest: './dist/css/bootstrap.min.css'
      }
    },

    uglify: {
      options: {
        mangle: false  // Use if you want the names of your functions and variables unchanged
      },
      // js_libs: {
        // src:  './build/bower-libs.js',
        // dest: './dist/lib/bower-libs.min.js'
      // }
    },


    // dev-dependency: serve pages locally (uses grunt-watch's livereload to reload js inline)
    express: {
      dev: {
        options: {
          port: DEV_HTTP_PORT,
          bases: ['dist/'],
          livereload: true
        }
      }
    },


    // dev-dependency: grunt-watch looks for changes to files and automatically causes an appropriate re-assemble,
    //                 which is then automatically re-served using grunt-express.
    watch: {
      css: {
        files: [
          'src/css/**/*.css',
          'src/css/**/*.less'
        ],
        tasks: ['less:development'],
        options: { livereload: true }
      },
      js: {
        files: ['src/public/**'],
        tasks: ['build_js'],
        options: { livereload: true }
      },
    },

    // dev-dependency: conveniently opens a browser to the live-reloaded site
    // TODO: not quite working with `grunt start`?
    open: {
      all: {
        path: 'http://localhost:' + DEV_HTTP_PORT
      }
    }
  });

  /* load every plugin in package.json */
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-open');

  /* grunt tasks */
  grunt.registerTask('start', ['default', 'open']);
  grunt.registerTask('build_libs', [
    // CSS, etc
    'concat:css_libs',
    'copy:bootstrap'
  ]);

  grunt.registerTask('build_js', ['jshint', 'copy:bower_libs', 'browserify:app']);

  grunt.registerTask('build', [
    'clean',
    'build_libs',
    'build_js',
    'copy:public',
    'less:development',
    'express',
    'watch'
  ]);

  grunt.registerTask('default', ['build']);
};