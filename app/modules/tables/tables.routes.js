(function () {

  'use strict';

  angular.module('pb.ds.tables').config(function ($stateProvider) {
    $stateProvider.state('tables', {
      url: '/tables',
      data: {
        pageTitle: 'Tables',
        access: 'private',
        bodyClass: 'tables'
      },
      views: {
        'header': {
          controller: 'HeaderController as header',
          templateUrl: 'modules/main/templates/header.html'
        },
        'content': {
          controller: 'TablesController as tables',
          templateUrl: 'modules/tables/tables.html'
        },
        'footer': {
          controller: 'FooterController as footer',
          templateUrl: 'modules/main/templates/footer.html'
        }
      }
    });
  });

})();
