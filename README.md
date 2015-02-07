# frontend-js-boilerplate

Boilerplate build system for front-end JS development.  Includes:
- **Browserify** to write code with CommonJS / Node module style
- Dependencies brought in locally through Bower
    - TODO: How well do Bower and Browserify play?  How much clientside lib availability is there in NPM vs. Bower?
- Local webserver to serve it up
- **JSHint** linting
- File watching with **live reload**
- **LESS** compilation
- Starts with common JS libs: jquery, lodash, and **Bootstrap** (including Bootstrap CSS via LESS)

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
- TODO: Add to Browserify build???
- Rebuild: `$ grunt build`

# TODOs
- Automatic bower/requirejs packaging?
- Add tests
