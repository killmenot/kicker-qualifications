requirejs.config({
    baseUrl: '/app',
    paths: {
        'jquery': '/bower_components/jquery/dist/jquery.min',
        'underscore': '/bower_components/underscore/underscore-min',
        'handlebars': '/bower_components/handlebars/handlebars.amd.min',
        'moment': '/bower_components/moment/min/moment.min',
        'moment-duration-format': '/bower_components/moment-duration-format/lib/moment-duration-format'
    },
    shim: {
      'moment-duration-format': {
        deps: ['moment']
      }
    }
});

requirejs(['./app'], function (app) {
    app.main();
});
