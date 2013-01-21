/*global module:false*/
module.exports = function(grunt) {
  "use strict";
  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'app.js', 'js/app.js']
    },
    concat: {
      main: {
        src: [
          "js/vendor/jquery-1.9.0.js",
          "js/vendor/sammy.js",
          "js/app.js"
        ],
        dest: 'js/main.js'
      }
    },
    min: {
      dist: {
        src: ['<config:concat.main.dest>'],
        dest: 'js/main.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint concat'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        node: true,
        strict: false
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint concat min');

};
