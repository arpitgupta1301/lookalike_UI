(function () {

  'use strict';

  angular.module('pb.ds.sales').config(function ($stateProvider) {
    $stateProvider.state('sales', {
      url: '/sales',
      resolve: {
        MockData: function (MockDataFactory) {
          return MockDataFactory.query({ filename: 'data' });
        }
      },
      data: {
        pageTitle: 'Sales',
        access: 'private',
        bodyClass: 'sales'
      },
      views: {
        'header': {
          controller: 'HeaderController as header',
          templateUrl: 'modules/main/templates/header.html'
        },
        'content': {
          controller: 'SalesController as sales',
          templateUrl: 'modules/sales/templates/sales.html'
        },
        'footer': {
          controller: 'FooterController as footer',
          templateUrl: 'modules/main/templates/footer.html'
        }
      }
    });
  });

})();
