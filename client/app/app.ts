///<reference path='../typings/browser.d.ts' />
'use strict';
declare var require: any;
import angular = require('angular');
angular.module('spacial_conquest', [
    require('angular-ui-router')
])
.config(function (
    $urlRouterProvider: angular.ui.IUrlRouterProvider,
    $locationProvider: angular.ILocationProvider
) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
});
