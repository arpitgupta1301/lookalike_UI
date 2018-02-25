(function () {

  'use strict';

  angular.module('pb.ds.product').config(function ($stateProvider) {
    $stateProvider.state('product', {
      url: '/product',
      resolve: {
        MockData: function (MockDataFactory) {
          return MockDataFactory.query({ filename: 'data' });
        }
      },
      data: {
        pageTitle: 'Product',
        access: 'private',
        bodyClass: 'product'
      },
      views: {
        'header': {
          controller: 'HeaderController as header',
          templateUrl: 'modules/main/templates/header.html'
        },
        'content': {
          controller: 'ProductController as product',
          templateUrl: 'modules/product/templates/product.html'
        },
        'footer': {
          controller: 'FooterController as footer',
          templateUrl: 'modules/main/templates/footer.html'
        }
      }
    });
  });

})();
