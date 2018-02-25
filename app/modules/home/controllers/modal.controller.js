(function () {

  'use strict';

  angular.module('pb.ds.home').controller('ModalController', function ($log, $uibModalInstance, itemResolve) {

    var _this = this;

    _this.item = itemResolve;

    _this.close = function () {
      $uibModalInstance.close();
    };

    $log.debug(_this.item);

  });

})();
