(function() {
  'use strict';

  angular
    .module('pb.ds.prospects')
    .controller('FilterDBController', function(
      $log,
      $uibModalInstance,
      itemResolve
    ) {
      var _this = this;

      _this.item = itemResolve;

      _this.close = function() {
        $uibModalInstance.dismiss();
      };

      $log.debug(_this.item);

      _this.filterList = {
        sicFilter: [
          {
            name: 'Administration',
            isSelected: false
          },
          {
            name: 'Education',
            isSelected: false
          },
          {
            name: 'Finance & Real Estate',
            isSelected: false
          },
          {
            name: 'Health Services',
            isSelected: false
          },
          {
            name: 'Legal',
            isSelected: false
          },
          {
            name: 'Manufacturing',
            isSelected: false
          },
          {
            name: 'Professional Services',
            isSelected: false
          },
          {
            name: 'Retail',
            isSelected: false
          },
          {
            name: 'Others',
            isSelected: false
          }
        ]
      };

      if (itemResolve !== undefined) {
        _this.filterList = itemResolve;
      }

      _this.apply = function() {
        $uibModalInstance.close(_this.filterList);
      };
    });
})();
