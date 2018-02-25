(function () {

  'use strict';

  angular.module('app').factory('MockDataFactory', function ($resource) {

    return $resource('core/data/:filename.json', {
      filename: '@filename'
    });

  });

})();
