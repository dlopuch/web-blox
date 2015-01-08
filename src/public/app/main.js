define(['lodash', 'jquery'], function(_, $) {
  $('.container').append(
    '<div>&nbsp;</div>' +
    '<div>...and this final div has been inserted through a successful require.js load</div>'
  );
});
