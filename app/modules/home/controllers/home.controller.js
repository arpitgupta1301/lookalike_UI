(function () {

  'use strict';

  angular.module('pb.ds.home').controller('HomeController',
    function ($log, MockData, $uibModal) {

      var _this = this;
      _this.data = MockData;

      _this.open = function (item) {
        $uibModal.open({
          templateUrl: 'modules/home/templates/modal.html',
          controller: 'ModalController as modal',
          size: 'md',
          resolve: {
            itemResolve: function () {
              return item;
            }
          }
        });
      };

    });

})();
