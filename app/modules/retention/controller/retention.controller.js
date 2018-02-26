(function () {
  'use strict';

  angular
    .module('pb.ds.retention')
    .controller('RetentionController', function ($log,
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

      _this.commonFilter = {};

      _this.monthToExpiry = {
        labels: ['3M', '6M', '12M', '18M'],
        colors: ['#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE'],
        data: [
          []
        ],
        options: {
          plugins: {
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold'
              },
              anchor: 'end',
              align: 'start',
              offset: 10
            }
          }
          /*
                    tooltips: {
                      callbacks: {
                        labelTextColor: function (tooltipItem, chart) {
                          return '#543453';
                        },
                        title: function (tooltipItem) {
                          return 'Lease Expires in Months Distribution: ' + tooltipItem[0].xLabel + '\n' +
                            'Count of Ship To Customer: ' + tooltipItem[0].yLabel;
                        }
                      }
                    }
          */
        }
      }
      _this.meterType = {
        labels: ['BOL', 'MOL', 'TOL'],
        colors: ['#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE'],
        data: [[]],
        options: {
          plugins: {
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold'
              },
              anchor: 'end',
              align: 'start',
              offset: 10
            }
          }
        }
      };
      _this.customeGroup = {
        labels: ['Commercial', 'Government', 'Strategic'],
        colors: ['#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE'],
        data: [[]],
        options: {
          plugins: {
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold'
              },
              anchor: 'end',
              align: 'start',
              offset: 10
            }
          }
        }
      };
      _this.cancellation = {
        labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81+%', 'Unscored'],
        colors: ['#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE'],
        data: [[]],
        options: {
          plugins: {
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold'
              },
              anchor: 'end',
              align: 'start',
              offset: 10
            }
          }
        }
      };

      _this.activityStatus = {
        labels: ['Active', 'Sleep', 'Na'],
        colors: ['#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE'],
        data: [[]],
        options: {
          plugins: {
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold'
              },
              anchor: 'end',
              align: 'start',
              offset: 10
            }
          }
        }
      }
      _this.digitalIndex = {
        labels: ['High', 'Medium', 'Low'],
        colors: ['#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE', '#1F75FE'],
        data: [[]],
        options: {
          plugins: {
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold'
              },
              anchor: 'end',
              align: 'start',
              offset: 10
            }
          }
        }
      };

      _this.resetFilters = function () {
        _this.commonFilter = {};
        _this.getDataAsPerCurrentFilters();
      }

      _this.onClick = function (points, evt) {
        var obj = {};
        obj[points[0]._chart.canvas.id] = points[0]._model.label
        angular.extend(_this.commonFilter, obj);
        _this.getDataAsPerCurrentFilters();
      };

      _this.getDataAsPerCurrentFilters = function () {
        var filter = {
          current: 'd_category',
          commonFilter: _this.commonFilter
        };

        $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
          angular.extend({}, filter, {current: 'lease_expiry'})).then(
          function (response) {
            if (response.data) {
              var labels = [];
              var values = [];
              for (var key in response.data) {
                labels.push(key);
                values.push(response.data[key]);
              }
              _this.monthToExpiry.data = values;
              _this.monthToExpiry.labels = labels;
            }
          }, function (error) {
          });

        $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
          angular.extend({}, filter, {current: 'probability'})).then(
          function (response) {
            if (response.data) {
              var labels = [];
              var values = [];
              for (var key in response.data) {
                labels.push(key);
                values.push(response.data[key]);
              }
              _this.cancellation.data = values;
              _this.cancellation.labels = labels;
            }
          }, function (error) {
          });

        $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
          angular.extend({}, filter, {current: 'status'})).then(
          function (response) {
            if (response.data) {
              var labels = [];
              var values = [];
              for (var key in response.data) {
                labels.push(key);
                values.push(response.data[key]);
              }
              _this.activityStatus.data = values;
              _this.activityStatus.labels = labels;
            }
          }, function (error) {
          });

        $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
          angular.extend({}, filter, {current: 'd_category'})).then(
          function (response) {
            if (response.data) {
              var labels = [];
              var values = [];
              for (var key in response.data) {
                labels.push(key);
                values.push(response.data[key]);
              }
              _this.digitalIndex.data = values;
              _this.digitalIndex.labels = labels;
            }
          }, function (error) {
          });

        $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
          angular.extend({}, filter, {current: 'type'})).then(
          function (response) {
            if (response.data) {
              var labels = [];
              var values = [];
              for (var key in response.data) {
                labels.push(key);
                values.push(response.data[key]);
              }
              _this.meterType.data = values;
              _this.meterType.labels = labels;
            }
          }, function (error) {
          });

        $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
          angular.extend({}, filter, {current: 'c_group'})).then(
          function (response) {
            if (response.data) {
              var labels = [];
              var values = [];
              for (var key in response.data) {
                labels.push(key);
                values.push(response.data[key]);
              }
              _this.customeGroup.data = values;
              _this.customeGroup.labels = labels;
            }
          }, function (error) {
          });
      }
      _this.getDataAsPerCurrentFilters();
    });
})();
