(function () {

  'use strict';

  angular.module('pb.ds.retention').config(function ($stateProvider) {
    $stateProvider.state('retention', {
      url: '/retention',
      data: {
        pageTitle: 'Retention',
        access: 'private',
        bodyClass: 'Retention'
      },
      views: {
        'header': {
          controller: 'HeaderController as header',
          templateUrl: 'modules/main/templates/header.html'
        },
        'content': {
          controller: 'RetentionController as retention',
          templateUrl: 'modules/retention/templates/retention.html'
        },
        'footer': {
          controller: 'FooterController as footer',
          templateUrl: 'modules/main/templates/footer.html'
        }
      }
    });
  });

})();
