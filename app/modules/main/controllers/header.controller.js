(function () {

  'use strict';

  angular.module('app').controller('HeaderController', function ($log, $state) {
    this.pages = {
      home: false,
      prospect: false,
      retention: false
    };

    this.headerObj = {
      mainTitle: '',
      navMenus: false
    };

    if ($state.current.name === 'start') {
      this.headerObj.mainTitle = "SMB Shipping Prospects and Retention Dashboard";
      this.headerObj.navMenus = false;
    } else if ($state.current.name === 'prospects') {
      this.headerObj.mainTitle = "Shipping Prospects Portal";
      this.headerObj.navMenus = true;
    } else if ($state.current.name === 'retention') {
      this.headerObj.mainTitle = "Retention Dashboard";
      this.headerObj.navMenus = false;
    }
  });

})();
