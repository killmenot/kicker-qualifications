requirejs.config({
    baseUrl: '/app',
    paths: {
        'jquery': '/bower_components/jquery/dist/jquery.min',
        'underscore': '/bower_components/underscore/underscore-min',
        'handlebars': '/bower_components/handlebars/handlebars.amd.min',
    }
});

requirejs(['./app'], function (app) {
    app.main();
});
