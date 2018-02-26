(function () {

  'use strict';

  angular.module('pb.ds.start').config(function ($stateProvider) {
    $stateProvider.state('start', {
      url: '/start',
      data: {
        pageTitle: 'Start',
        access: 'private',
        bodyClass: 'Start'
      },
      views: {
        'header': {
          controller: 'HeaderController as header',
          templateUrl: 'modules/main/templates/header.html'
        },
        'content': {
          controller: 'StartPageController as start',
          templateUrl: 'modules/startPage/template/start.html'
        },
        'footer': {
          controller: 'FooterController as footer',
          templateUrl: 'modules/main/templates/footer.html'
        }
      }
    });
  });

})();
