///<reference path='../../../typings/browser.d.ts' />
'use strict';

import angular = require('angular');
angular.module('spacial_conquest')
.config(function ($stateProvider: angular.ui.IStateProvider) {
    $stateProvider.state('about', {
        url: '/about',
        templateUrl: 'app/routes/about/about.html',
        controller: 'AboutController as about'
    });
});
