(function () {
  'use strict';

  angular
    .module('pb.ds.retention')
    .controller('RetentionController', function ($log,
                                                 $uibModal,
                                                 $http,
                                                 $scope,
                                                 $interval, $timeout) {
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
        colors: ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'],
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
          },
          scales: {
            xAxes: [{
              barPercentage: 0.4
            }]
          }
        }
      }
      _this.meterType = {
        labels: ['BOL', 'MOL', 'TOL'],
        colors: ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
          'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'],
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
        colors: ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
          'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'],
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
        colors: ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
          'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'],
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
          },
          scales: {
            xAxes: [{
              barPercentage: 0.4
            }]
          }
        }
      };
      _this.activityStatus = {
        labels: ['Active', 'Sleep', 'Na'],
        colors: ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
          'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'],
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
          },
          scales: {
            xAxes: [{
              barPercentage: 0.4
            }]
          }
        }
      }
      _this.digitalIndex = {
        labels: ['High', 'Medium', 'Low'],
        colors: ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
          'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'],
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
          },
          scales: {
            xAxes: [{
              barPercentage: 0.4
            }]
          }
        }
      };


      _this.selectedBarIndex = {
        'lease_expiry': -1,
        'type': -1,
        'status': -1,
        'probability': -1,
        'd_category': -1,
        'c_group': -1
      };

      _this.resetFilters = function () {
        _this.commonFilter = {};
        _this.selectedBarIndex = {
          'lease_expiry': -1,
          'type': -1,
          'status': -1,
          'probability': -1,
          'd_category': -1,
          'c_group': -1
        };
        _this.getDataAsPerCurrentFilters();
      };

      _this.onClick = function (points, elements) {
        if (points.length > 0) {
          var obj = {};
          obj[points[0]._chart.canvas.id] = points[0]._model.label
          angular.extend(_this.commonFilter, obj);
          _this.getDataAsPerCurrentFilters(points[0]._chart.canvas.id, points[0]['$datalabels']._index);
        }
      };

      _this.getFilter = function (id) {
        var filter = {
          current: id,
          commonFilter: angular.extend({}, _this.commonFilter)
        };
        delete filter.commonFilter[id];
        console.log(filter);
        return filter;
      };

      _this.getDataAsPerCurrentFilters = function (id, index) {
        if (id !== 'lease_expiry') {
          $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
            angular.extend({}, _this.getFilter('lease_expiry'), {current: 'lease_expiry'})).then(
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
                _this.monthToExpiry.colors = ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
                  'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'];
                if (_this.selectedBarIndex['lease_expiry'] != -1) {
                  _this.monthToExpiry.colors[_this.selectedBarIndex['lease_expiry']] = "rgba(31,117,254,1)";
                }
              }
            }, function (error) {
            });
        } else if (id === 'lease_expiry' && index > -1) {
          $timeout(function () {
            _this.selectedBarIndex[id] = index;
            _this.monthToExpiry.colors = ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
              'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'];
            _this.monthToExpiry.colors[index] = "rgba(31,117,254,1)";
          });
        }

        if (id !== 'probability') {
          $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
            angular.extend({}, _this.getFilter('probability'), {current: 'probability'})).then(
            function (response) {
              if (response.data) {
                var labels = [];
                var values = [];
                var nonPredict = {};
                for (var key in response.data) {
                  if (key.indexOf('Predicted') > -1) {
                    nonPredict[key] = response.data[key];
                    continue;
                  }
                  labels.push(key);
                  values.push(response.data[key]);
                }
                if (Object.keys(nonPredict).length > 0) {
                  labels.push(Object.keys(nonPredict)[0]);
                  values.push(nonPredict[Object.keys(nonPredict)[0]]);
                }
                _this.cancellation.data = values;
                _this.cancellation.labels = labels;
                _this.cancellation.colors = ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
                  'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'];
                if (_this.selectedBarIndex['probability'] != -1) {
                  _this.cancellation.colors[_this.selectedBarIndex['probability']] = "rgba(31,117,254,1)";
                }
              }
            }, function (error) {
            });
        } else if (id === 'probability' && index > -1) {
          $timeout(function () {
            _this.selectedBarIndex[id] = index;
            _this.cancellation.colors = ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
              'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'];
            _this.cancellation.colors[index] = "rgba(31,117,254,1)";
          });
        }

        if (id !== 'status') {
          $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
            angular.extend({}, _this.getFilter('status'), {current: 'status'})).then(
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
                _this.activityStatus.colors = ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
                  'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'];
                if (_this.selectedBarIndex['status'] != -1) {
                  _this.activityStatus.colors[_this.selectedBarIndex['status']] = "rgba(31,117,254,1)";
                }
              }
            }, function (error) {
            });
        } else if (id === 'status' && index > -1) {
          $timeout(function () {
            _this.selectedBarIndex[id] = index;
            _this.activityStatus.colors = ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
              'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'];
            _this.activityStatus.colors[index] = "rgba(31,117,254,1)";
          });
        }

        if (id !== 'd_category') {

          $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
            angular.extend({}, _this.getFilter('d_category'), {current: 'd_category'})).then(
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
                _this.digitalIndex.colors = ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
                  'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'];
                if (_this.selectedBarIndex['d_category'] != -1) {
                  _this.digitalIndex.colors[_this.selectedBarIndex['d_category']] = "rgba(31,117,254,1)";
                }
              }
            }, function (error) {
            });
        } else if (id === 'd_category' && index > -1) {
          $timeout(function () {
            _this.selectedBarIndex[id] = index;
            _this.digitalIndex.colors = ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
              'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'];
            _this.digitalIndex.colors[index] = "rgba(31,117,254,1)";
          });
        }

        if (id !== 'type') {
          $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
            angular.extend({}, _this.getFilter('type'), {current: 'type'})).then(
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
                _this.meterType.colors = ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
                  'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'];
                if (_this.selectedBarIndex['type'] != -1) {
                  _this.meterType.colors[_this.selectedBarIndex['type']] = "rgba(31,117,254,1)";
                }
              }
            }, function (error) {
            });
        } else if (id === 'type' && index > -1) {
          $timeout(function () {
            _this.selectedBarIndex[id] = index;
            _this.meterType.colors = ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
              'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'];
            _this.meterType.colors[index] = "rgba(31,117,254,1)";
          });
        }

        if (id !== 'c_group') {
          $http.post('https://lookalike-service-temp-dot-datatest-148118.appspot.com/activeLeases',
            angular.extend({}, _this.getFilter('c_group'), {current: 'c_group'})).then(
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
                _this.customeGroup.colors = ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
                  'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'];
                if (_this.selectedBarIndex['c_group'] != -1) {
                  _this.customeGroup.colors[_this.selectedBarIndex['c_group']] = "rgba(31,117,254,1)";
                }
              }
            }, function (error) {
            });
        } else if (id === 'c_group' && index > -1) {
          $timeout(function () {
            _this.selectedBarIndex[id] = index;
            _this.customeGroup.colors = ['rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)',
              'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)', 'rgba(31,117,254,0.5)'];
            _this.customeGroup.colors[index] = "rgba(31,117,254,1)";
          });
        }
      }
      _this.getDataAsPerCurrentFilters();
    });
})();

