(function () {
  'use strict';

  angular
    .module('pb.ds.start')
    .controller('StartPageController', function ($log,
                                                 $state) {

      var _this = this;

      _this.change = function (stateName) {
        $state.go(stateName);
      };

    });
})();
