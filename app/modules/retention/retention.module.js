(function() {
  'use strict';

  angular
    .module('pb.ds.retention', [
      'ui.router',
      'ngSanitize',
      'duScroll',
      'pb.ds.components',
      'chart.js',
      'ngCsv'
    ])
    .value('duScrollDuration', 1000)
    .value('duScrollOffset', 30);
})();
