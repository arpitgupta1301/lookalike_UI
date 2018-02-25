(function () {

  'use strict';

  angular.module('pb.ds.communication').config(function ($stateProvider) {
    $stateProvider.state('communication', {
      url: '/communication',
      resolve: {
        MockData: function (MockDataFactory) {
          return MockDataFactory.query({ filename: 'data' });
        }
      },
      data: {
        pageTitle: 'Communication',
        access: 'private',
        bodyClass: 'communication'
      },
      views: {
        'header': {
          controller: 'HeaderController as header',
          templateUrl: 'modules/main/templates/header.html'
        },
        'content': {
          controller: 'CommunicationController as communication',
          templateUrl: 'modules/communication/templates/communication.html'
        },
        'footer': {
          controller: 'FooterController as footer',
          templateUrl: 'modules/main/templates/footer.html'
        }
      }
    });
  });

})();
