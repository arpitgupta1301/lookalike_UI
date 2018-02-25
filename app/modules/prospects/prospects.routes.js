(function () {

  'use strict';

  angular.module('pb.ds.prospects').config(function ($stateProvider) {
    $stateProvider.state('prospects', {
      url: '/prospects',
      resolve: {
        MockData: function (MockDataFactory) {
          return MockDataFactory.query({ filename: 'data' });
        }
      },
      data: {
        pageTitle: 'Prospects',
        access: 'private',
        bodyClass: 'prospects'
      },
      views: {
        'header': {
          controller: 'HeaderController as header',
          templateUrl: 'modules/main/templates/header.html'
        },
        'content': {
          controller: 'ProspectsController as prospects',
          templateUrl: 'modules/prospects/templates/prospects.html'
        },
        'footer': {
          controller: 'FooterController as footer',
          templateUrl: 'modules/main/templates/footer.html'
        }
      }
    });
  });

})();
