(function () {

  'use strict';

  angular.module('pb.ds.tables').controller('TablesController',
    function ($log) {

      var _this = this;

      _this.model = {
        checkbox1: false,
        checkbox2: false
      };

      _this.rowdata = [
        {
          date: '04/15/2016',
          recipient: 'Sara Shiner',
          carrier: 'USPS',
          shipping: 'Priority Mail',
          tracking: '1890K81923J',
          status: 'Shipped',
          amount: '$10.45'
        },
        {
          date: '04/15/2016',
          recipient: 'Andrew Backmand',
          carrier: 'FedEx',
          shipping: 'Priority Ground',
          tracking: 'JJHSK980802K',
          status: 'In transit',
          amount: '$18.90'
        }, {
          date: '04/15/2016',
          recipient: 'Rich Drew',
          carrier: 'UPS',
          shipping: 'Overnight',
          tracking: 'JJHSK980802K',
          status: 'Delivered',
          amount: '$38.90'
        }
      ];


    });

})();
