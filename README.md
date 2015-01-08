# frontend-js-boilerplate

Boilerplate build system for front-end JS development.  Includes:
- Dependencies brought in locally through Bower
- Local webserver to serve it up
- Linting with JSHint
- File watching with live reload
- LESS compilation
- Starts with common JS libs: jquery, lodash, and Bootstrap (including Bootstrap CSS)
- RequireJS to dynamically load modules and dependencies

# To Make Something Neat

Checkout this project, then:
- `$ npm install`
- `$ bower install`
- `$ grunt build`
- Open up a browser against localhost:8000
  - (Enjoy the livereload as you make changes!)

Open up `src/public/index.html` and start from there.

Gruntfile builds everything and puts it into `dist/`, which is what the webserver points against.

- Bower files get copied over into `dist/lib`
- LESS gets compiled into `dist/css/style.css`
- Everything in `src/public` gets copied over as-is (eg `src/public/index.js` --> `dist/index.js`)


## To Add a Bower Dependency
- `$ bower install somePackage --save`
- Open up `Gruntfile.js` and add the dist file to be copied over into `BOWER_JS_LIBS`
- Open up `src/public/main.js` and configure requireJS to recognize the file
- Rebuild: `$ grunt build`

# TODOs
- Distribution packaging: concatenation and minifying via RequireJS packer
- Automatic bower/requirejs packaging?
- Add tests
