(function () {
  'use strict';

  angular
    .module('pb.ds.prospects')
    .controller('ProspectsController', function ($log,
                                                 $uibModal,
                                                 $http,
                                                 $scope,
                                                 $interval) {
      var _this = this;

      _this.colors = [
        '#3e53a4',
        '#cf0989',
        '#009bdf',
        '#ef8200',
        '#edb700',
        '#a03f9b',
        '#00b140',
        '#0072b8'
      ];
      _this.mono = [
        '#00436E',
        '#005A93',
        '#0072B8',
        '#66AAD4',
        '#CCE3F1',
        '#E5F1F8'
      ];

      // EC Functions

      _this.numberOfOpportunitiesEC = 0;
      _this.ecBarGraphLabels = [];
      _this.ecBarGraphCount = [];

      _this.getECBarGraphData = function (param) {
        $http
          .post(
            'https://lookalike-service-dot-datatest-148118.appspot.com/getCSD/',
            param
          )
          .then(
            function (response, status, headers, config) {
              var data = response.data;
              _this.numberOfOpportunitiesEC = 0;
              _this.ecBarGraphLabels = [];
              _this.ecBarGraphCount = [];
              for (var i = 0; i < data.length; i++) {
                _this.numberOfOpportunitiesEC =
                  _this.numberOfOpportunitiesEC + parseInt(data[i].total_count);
                if (data[i].slot === 'High') {
                  _this.ecBarGraphLabels.splice(2, 0, data[i].slot);
                  _this.ecBarGraphCount.splice(
                    2,
                    0,
                    parseInt(data[i].total_count)
                  );
                }
                if (data[i].slot === 'Med') {
                  _this.ecBarGraphLabels.splice(1, 0, 'Medium');
                  _this.ecBarGraphCount.splice(
                    1,
                    0,
                    parseInt(data[i].total_count)
                  );
                }
                if (data[i].slot === 'Low') {
                  _this.ecBarGraphLabels.splice(0, 0, data[i].slot);
                  _this.ecBarGraphCount.splice(
                    0,
                    0,
                    parseInt(data[i].total_count)
                  );
                }
                // _this.ecBarGraphLabels.push(data[i].slot);
                // _this.ecBarGraphCount.push(parseInt(data[i].total_count));
              }
              _this.getECBarGraph();
            },
            function (data, status, headers, config) {
              // alert('error');
            }
          );
      };

      _this.getECBarGraph = function () {
        _this.ecBarGraph = {
          labels: _this.ecBarGraphLabels,
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            scaleShowGridLines: false,
            scales: {
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString:
                    'Look-a-Likes (' + _this.numberOfOpportunitiesEC + ')'
                  },
                  gridLines: {
                    display: false
                  }
                }
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Conversion probability'
                  },
                  gridLines: {
                    display: false
                  }
                }
              ]
            }
          },
          data: [_this.ecBarGraphCount],
          colors: _this.colors,
          click: function (points, evt) {
            //
          }
        };
      };

      _this.filterECParams = {};

      _this.filterEC = function (item) {
        $uibModal
          .open({
            templateUrl: 'modules/prospects/templates/filterEC.html',
            controller: 'FilterECController as filter',
            size: 'md',
            resolve: {
              itemResolve: function () {
                return item;
              }
            }
          })
          .result.then(
          function (response) {
            _this.filterECParams = {};
            _this.filterECList = response;
            var sampleEC = [];
            for (var i = 0; i < _this.filterECList.sicFilter.length; i++) {
              if (_this.filterECList.sicFilter[i].isSelected) {
                if (_this.filterECList.sicFilter[i].name === 'Others') {
                  sampleEC.push('Others');
                } else {
                  sampleEC.push(_this.filterECList.sicFilter[i].name + '\\r');
                }
              }
            }
            if (sampleEC.length > 0) {
              _this.filterECParams.sicFilter = [];
              _this.filterECParams.sicFilter = angular.copy(sampleEC);
            }
            for (var i = 0; i < _this.filterECList.otherFilter.length; i++) {
              if (_this.filterECList.otherFilter[i].isSelected) {
                if (
                  _this.filterECList.otherFilter[i].name === 'Label Printer'
                ) {
                  _this.filterECParams.label_printer;
                  _this.filterECParams.label_printer = 'Yes';
                }
                if (
                  _this.filterECList.otherFilter[i].name ===
                  'Multicarrier Subscription'
                ) {
                  _this.filterECParams.multicarrier_subscription;
                  _this.filterECParams.multicarrier_subscription = 'Yes';
                }
              }
            }
            _this.getECBarGraphData(_this.filterECParams);
          },
          function (error) {
            // console.log(error);
          }
        );
      };

      _this.getECBarGraphData(_this.filterECParams);

      // EO Functions

      _this.numberOfOpportunitiesEO = 0;
      _this.eoBarGraphLabels = [];
      _this.eoBarGraphCount = [];

      _this.getEOBarGraphData = function (param) {
        $http
          .post(
            'https://lookalike-service-dot-datatest-148118.appspot.com/getOpportunity/',
            param
          )
          .then(
            function (response, status, headers, config) {
              var data = response.data;
              _this.numberOfOpportunitiesEO = 0;
              _this.eoBarGraphLabels = [];
              _this.eoBarGraphCount = [];
              for (var i = 0; i < data.length; i++) {
                _this.numberOfOpportunitiesEO =
                  _this.numberOfOpportunitiesEO + parseInt(data[i].total_count);
                // _this.eoBarGraphLabels.push(data[i].slot);
                // _this.eoBarGraphCount.push(parseInt(data[i].total_count));
                if (data[i].slot === 'High') {
                  _this.eoBarGraphLabels.splice(2, 0, data[i].slot);
                  _this.eoBarGraphCount.splice(
                    2,
                    0,
                    parseInt(data[i].total_count)
                  );
                }
                if (data[i].slot === 'Med') {
                  _this.eoBarGraphLabels.splice(1, 0, 'Medium');
                  _this.eoBarGraphCount.splice(
                    1,
                    0,
                    parseInt(data[i].total_count)
                  );
                }
                if (data[i].slot === 'Low') {
                  _this.eoBarGraphLabels.splice(0, 0, data[i].slot);
                  _this.eoBarGraphCount.splice(
                    0,
                    0,
                    parseInt(data[i].total_count)
                  );
                }
              }
              _this.getEOBarGraph();
            },
            function (data, status, headers, config) {
              // alert('error');
            }
          );
      };

      _this.getEOBarGraph = function () {
        _this.eoBarGraph = {
          labels: _this.eoBarGraphLabels,
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            scaleShowGridLines: false,
            scales: {
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString:
                    'Look-a-Likes (' + _this.numberOfOpportunitiesEO + ')'
                  },
                  gridLines: {
                    display: false
                  }
                }
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Conversion probability'
                  },
                  gridLines: {
                    display: false
                  }
                }
              ]
            }
          },
          data: [_this.eoBarGraphCount],
          colors: _this.colors,
          click: function (points, evt) {
            //
          }
        };
      };

      _this.filterEOParams = {};

      _this.filterEO = function (item) {
        $uibModal
          .open({
            templateUrl: 'modules/prospects/templates/filterEO.html',
            controller: 'FilterEOController as filter',
            size: 'md',
            resolve: {
              itemResolve: function () {
                return item;
              }
            }
          })
          .result.then(
          function (response) {
            _this.filterEOParams = {};
            _this.filterEOList = response;
            var sampleEO = [];
            for (var i = 0; i < _this.filterEOList.sicFilter.length; i++) {
              if (_this.filterEOList.sicFilter[i].isSelected) {
                if (_this.filterEOList.sicFilter[i].name === 'Others') {
                  sampleEO.push('Others');
                } else {
                  sampleEO.push(_this.filterEOList.sicFilter[i].name);
                }
              }
            }
            if (sampleEO.length > 0) {
              _this.filterEOParams.sicFilter = [];
              _this.filterEOParams.sicFilter = angular.copy(sampleEO);
            }
            for (var i = 0; i < _this.filterEOList.otherFilter.length; i++) {
              if (_this.filterEOList.otherFilter[i].isSelected) {
                if (
                  _this.filterEOList.otherFilter[i].name ===
                  'Existing Customers'
                ) {
                  _this.filterEOParams.existing_customer;
                  _this.filterEOParams.existing_customer = 'Yes';
                }
                if (
                  _this.filterEOList.otherFilter[i].name ===
                  'Non Existing Customers'
                ) {
                  _this.filterEOParams.non_existing_customer;
                  _this.filterEOParams.non_existing_customer = 'Yes';
                }
              }
            }
            _this.getEOBarGraphData(_this.filterEOParams);
          },
          function (error) {
            // console.log(error);
          }
        );
      };

      _this.getEOBarGraphData(_this.filterEOParams);

      // DB Functions

      _this.numberOfOpportunitiesDB = 0;
      _this.dbBarGraphLabels = [];
      _this.dbBarGraphCount = [];

      _this.getDBBarGraphData = function (param) {
        $http
          .post(
            'https://lookalike-service-dot-datatest-148118.appspot.com/getDNB/',
            param
          )
          .then(
            function (response, status, headers, config) {
              var data = response.data;
              _this.numberOfOpportunitiesDB = 0;
              _this.dbBarGraphLabels = [];
              _this.dbBarGraphCount = [];
              for (var i = 0; i < data.length; i++) {
                _this.numberOfOpportunitiesDB =
                  _this.numberOfOpportunitiesDB + parseInt(data[i].total_count);
                // _this.dbBarGraphLabels.push(data[i].slot);
                // _this.dbBarGraphCount.push(parseInt(data[i].total_count));
                if (data[i].slot === 'High') {
                  _this.dbBarGraphLabels.splice(2, 0, data[i].slot);
                  _this.dbBarGraphCount.splice(
                    2,
                    0,
                    parseInt(data[i].total_count)
                  );
                }
                if (data[i].slot === 'Med') {
                  _this.dbBarGraphLabels.splice(1, 0, 'Medium');
                  _this.dbBarGraphCount.splice(
                    1,
                    0,
                    parseInt(data[i].total_count)
                  );
                }
                if (data[i].slot === 'Low') {
                  _this.dbBarGraphLabels.splice(0, 0, data[i].slot);
                  _this.dbBarGraphCount.splice(
                    0,
                    0,
                    parseInt(data[i].total_count)
                  );
                }
              }
              _this.getDBBarGraph();
            },
            function (data, status, headers, config) {
              // alert('error');
            }
          );
      };

      _this.getDBBarGraph = function () {
        _this.dbBarGraph = {
          labels: _this.dbBarGraphLabels,
          options: {
            plugins: {
              datalabels: {
                display: false
              }
            },
            scaleShowGridLines: false,
            scales: {
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString:
                    'Look-a-Likes (' + _this.numberOfOpportunitiesDB + ')'
                  },
                  gridLines: {
                    display: false
                  }
                }
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Conversion probability'
                  },
                  gridLines: {
                    display: false
                  }
                }
              ]
            }
          },
          data: [_this.dbBarGraphCount],
          colors: _this.colors,
          click: function (points, evt) {
            //
          }
        };
      };

      _this.filterDBParams = {};

      _this.filterDB = function (item) {
        $uibModal
          .open({
            templateUrl: 'modules/prospects/templates/filterDB.html',
            controller: 'FilterDBController as filter',
            size: 'md',
            resolve: {
              itemResolve: function () {
                return item;
              }
            }
          })
          .result.then(
          function (response) {
            _this.filterDBParams = {};
            _this.filterDBList = response;
            var sampleDB = [];
            for (var i = 0; i < _this.filterDBList.sicFilter.length; i++) {
              if (_this.filterDBList.sicFilter[i].isSelected) {
                if (_this.filterDBList.sicFilter[i].name === 'Others') {
                  sampleDB.push('Others');
                } else {
                  sampleDB.push(_this.filterDBList.sicFilter[i].name + '\\r');
                }
              }
            }
            if (sampleDB.length > 0) {
              _this.filterDBParams.sicFilter = [];
              _this.filterDBParams.sicFilter = angular.copy(sampleDB);
            }
            _this.getDBBarGraphData(_this.filterDBParams);
          },
          function (error) {
            // console.log(error);
          }
        );
      };

      _this.getDBBarGraphData(_this.filterDBParams);

      // DownloadCSV
      _this.downloadCSV = function (type, filters) {
        var name = type === 'existingCSeriesCustomers'
          ? 'csd'
          : type === 'currentCSeriesOpportunitiesInSFDC' ? 'opp' : 'dnb';
        var url = 'https://lookalike-service-dot-datatest-148118.appspot.com/getCSV/' + name;
        $http.post(url, filters).then(
          function (response, status, headers, config) {
            var anchor = angular.element('<a/>');
            anchor
              .attr({
                href:
                'data:attachment/csv;charset=utf-8,' +
                encodeURI(response.data),
                target: '_blank',
                download: type + '.csv'
              })[0]
              .click();
          },
          function (data, status, headers, config) {
            // alert('error');
          }
        );
      };
    });
})();
