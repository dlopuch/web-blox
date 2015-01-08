/**
 * Require.js config file.
 *
 * As you add new libraries via Bower (BOWER_JS_LIBS), create path refs for them for easy includes.
 */
require.config({

  baseUrl: "/",

  paths: {
    "jquery"    : "/lib/jquery",
    "bootstrap" : "/lib/bootstrap",
    "lodash"    : "/lib/lodash",
    "underscore": "/lib/lodash",
  },

  shim: {
    bootstrap: {
      deps: ['jquery']
    }
  }
});


requirejs(['app/main']);
