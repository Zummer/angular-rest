// Основной модуль программы CrudApp
var app = angular.module('CrudApp', [
    'ngResource',
    'ngRoute',
    'angularUtils.directives.dirPagination',
    'ngAutocomplete',
    'ngStorage',
    'appConfig'
]);
app
    .config(function ($routeProvider, $httpProvider, $locationProvider) {

        $locationProvider.html5Mode(true);
        //$httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.post = {};

        var defaultPath = 'modules/default/views/';

        $routeProvider
            .when('/page/:page', {
                templateUrl: defaultPath + 'list.html'
            })
            .when('/page/:page/limit/:limit', {
                templateUrl: defaultPath + 'list.html'
            })
            .when('/edit/:id', {
                templateUrl: defaultPath + 'edit.html',
                controller: 'editCtrl',
                resolve: {
                    currentView: function () {
                        return 'edit';
                    }
                }
            })
            .when('/view/:id', {
                templateUrl: defaultPath + 'edit.html',
                controller: 'editCtrl',
                resolve: {
                    currentView: function () {
                        return 'view';
                    }
                }
            })
            .when('/add', {
                templateUrl: defaultPath + 'edit.html',
                controller: 'editCtrl',
                resolve: {
                    currentView: function () {
                        return 'add';
                    }
                }
            })
            .otherwise({redirectTo: '/page/1/limit/10'});
    });

app.run(function ($templateCache, $templateRequest) {
    $templateRequest("modules/default/templates/dirMainTable.html").then(function (html) {
        $templateCache.put("dirMainTable", html);
    });
});

