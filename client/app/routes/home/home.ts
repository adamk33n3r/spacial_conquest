'use strict';

import angular = require('angular');

angular.module('spacial_conquest')
.config(function ($stateProvider: angular.ui.IStateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'app/routes/home/home.html',
        controller: 'HomeController as home'
    });
});
