// Основной модуль программы CrudApp
var app = angular.module('CrudApp', [
    'ngResource',
    'ngRoute',
    'angularUtils.directives.dirPagination',
    'ngAutocomplete',
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
                templateUrl: defaultPath + 'edit.html'
            })
            .when('/add', {
                templateUrl: defaultPath + 'edit.html'
            })
            .otherwise({redirectTo: '/page/1/limit/10'});
    });