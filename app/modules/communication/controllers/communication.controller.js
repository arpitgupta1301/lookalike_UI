(function () {
  "use strict";

  angular
    .module("pb.ds.communication")
    .controller("CommunicationController", function ($log, $uibModal, $http, $timeout) {
      var _this = this;

      this.byLocationAllowed = true;
      this.byStatusAllowed = true;
      this.byCarrierAllowed = true;
      this.displayNavigator =
        this.byLocationAllowed && this.byStatusAllowed && this.byCarrierAllowed;
      _this.totalEmailsSent = 0;
      _this.opened = 0;
      _this.delivered = 0;
      _this.unsubscribed = 0;
      _this.clicked = 0;
      _this.lowLink = [];
      _this.subscription = [];
      _this.meterError = [];
      _this.chartLabels = [];

      _this.colors = [
        "#3e53a4",
        "#cf0989",
        "#009bdf",
        "#ef8200",
        "#edb700",
        "#a03f9b",
        "#00b140",
        "#0072b8"
      ];

      _this.graphSeries = ['Low Link', 'Subscription', 'meterError'];

      _this.getEmailSentGraph = function () {
        _this.emailSentGraph = {
          labels: _this.chartLabels,
          options: {
            legend: {
              display: true
            },
            tooltips: {
              callbacks: {
                title: function (tooltipItem) {
                  return moment(this._data.labels[tooltipItem[0].index]).format("YYYY-MM-DD");
                }
              }
            },
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  displayFormats: {
                    'millisecond': 'YYYY-MM-DD',
                    'second': 'YYYY-MM-DD',
                    'minute': 'YYYY-MM-DD',
                    'hour': 'YYYY-MM-DD',
                    'day': 'YYYY-MM-DD',
                    'week': 'YYYY-MM-DD',
                    'month': 'YYYY-MM-DD',
                    'quarter': 'YYYY-MM-DD',
                    'year': 'YYYY-MM-DD'
                  }
                }
              }]
            }
          },
          series: _this.graphSeries,
          data: [
            _this.lowLink, _this.subscription, _this.meterError
          ]
        }
      };

      _this.getEmailSentGraphData = function () {
        _this.getEmailSentGraph();
      };


      alasql.fn.timestamp = function (x) {
        if (x) {
          var year = x.substr(0, 4);
          var month = x.substr(4, 2);
          var day = x.substr(6, 2);
          return new Date(year + '/' + month + '/' + day).getTime();
        }
        return '';
      };


      _this.getDataForAllCounts = function () {
        _this.chartLabels = [];
        _this.lowLink = [];
        _this.meterError = [];
        _this.subscription = [];
        _this.csvFileContent = [];
        //fill up labels
        var minDate = new Date(_this.startDate).getTime();
        var maxDate = new Date(_this.endDate).getTime();

        for (var i = minDate; i <= maxDate; i = i + 86400000) {
          _this.chartLabels.push(i);
          _this.lowLink[_this.chartLabels.length - 1] = 0;
          _this.meterError[_this.chartLabels.length - 1] = 0;
          _this.subscription[_this.chartLabels.length - 1] = 0;
        }

        _this.dataName = [];
        $http.get("../modules/communication/communication.csv").then(function (response) {
          Papa.parse(response.data, {
            worker: true,
            delimiter: ',',
            header: true,
            step: function (results) {
              _this.dataName.push(results.data[0]);
            },
            complete: function () {
              alasql('SELECT count(*) as delivered FROM ? WHERE Delivered = "Yes" and template_id LIKE "csd%" and  timestamp(dim_date_key) <'
                + new Date(_this.endDate).getTime()
                + 'and timestamp(dim_date_key) >=' + new Date(_this.startDate).getTime(),
                [_this.dataName], function (res) {
                  _this.delivered = res[0].delivered;
                });

              alasql('SELECT count(*) as totalEmailsSent FROM ? WHERE template_id LIKE "csd%" and  timestamp(dim_date_key) <'
                + new Date(_this.endDate).getTime()
                + 'and timestamp(dim_date_key) >=' + new Date(_this.startDate).getTime(),
                [_this.dataName], function (res) {
                  _this.totalEmailsSent = res[0].totalEmailsSent;
                });

              alasql('SELECT count(*) as unsubscribed FROM ? WHERE Unsubscibed = "Yes" and template_id LIKE "csd%" and  timestamp(dim_date_key) <'
                + new Date(_this.endDate).getTime()
                + 'and timestamp(dim_date_key) >=' + new Date(_this.startDate).getTime(),
                [_this.dataName], function (res) {
                  _this.unsubscribed = res[0].unsubscribed;
                });

              alasql('SELECT count(*) as opened FROM ? WHERE Opened = "Yes" and template_id LIKE "csd%" and  timestamp(dim_date_key) <'
                + new Date(_this.endDate).getTime()
                + 'and timestamp(dim_date_key) >=' + new Date(_this.startDate).getTime(),
                [_this.dataName], function (res) {
                  _this.opened = res[0].opened;
                });

              alasql('SELECT count(*) as clicked FROM ? WHERE Clicked = "Yes" and template_id LIKE "csd%" and  timestamp(dim_date_key) <'
                + new Date(_this.endDate).getTime()
                + 'and timestamp(dim_date_key) >=' + new Date(_this.startDate).getTime(),
                [_this.dataName], function (res) {
                  _this.clicked = res[0].clicked;
                });


              // for graph
              alasql('SELECT dim_date_key, COUNT(*) as total FROM ?  WHERE template_id  LIKE "csd%lowink%" and timestamp(dim_date_key)< ' +
                +new Date(_this.endDate).getTime() + 'and timestamp(dim_date_key) >=' + new Date(_this.startDate).getTime() +
                'group by dim_date_key', [_this.dataName], function (res) {
                for (var i = 0; i < res.length; i++) {
                  if (res[i].dim_date_key) {
                    if (_this.chartLabels.indexOf(alasql.fn.timestamp(res[i].dim_date_key)) !== -1) {
                      _this.lowLink[_this.chartLabels.indexOf(alasql.fn.timestamp(res[i].dim_date_key))] = res[i].total;
                    }
                  }
                }
              });

              alasql('SELECT dim_date_key, COUNT(*) as total FROM ?  WHERE template_id LIKE "csd%metererror%" and timestamp(dim_date_key)< ' +
                +new Date(_this.endDate).getTime() + 'and timestamp(dim_date_key) >=' + new Date(_this.startDate).getTime() +
                'group by dim_date_key', [_this.dataName], function (res) {
                for (var i = 0; i < res.length; i++) {
                  if (res[i].dim_date_key) {
                    if (_this.chartLabels.indexOf(alasql.fn.timestamp(res[i].dim_date_key)) !== -1) {
                      _this.meterError[_this.chartLabels.indexOf(alasql.fn.timestamp(res[i].dim_date_key))] = res[i].total;
                    }
                  }
                }
              });

              alasql('SELECT dim_date_key, COUNT(*) as total FROM ?  WHERE template_id LIKE "csd%subscription%" and timestamp(dim_date_key)< ' +
                +new Date(_this.endDate).getTime() + 'and timestamp(dim_date_key) >=' + new Date(_this.startDate).getTime() +
                'group by dim_date_key', [_this.dataName], function (res) {
                for (var i = 0; i < res.length; i++) {
                  if (_this.chartLabels.indexOf(alasql.fn.timestamp(res[i].dim_date_key)) !== -1) {
                    _this.subscription[_this.chartLabels.indexOf(alasql.fn.timestamp(res[i].dim_date_key))] = res[i].total;
                  }
                }
              });

              /*    alasql('SELECT * FROM ? WHERE timestamp(dim_date_key)< ' +
                    +new Date(_this.endDate).getTime() + 'and timestamp(dim_date_key) >=' + new Date(_this.startDate).getTime(),
                    [_this.dataName], function (res) {
                      for (var i = 0; i < res.length; i++) {
                        if (res[i].dim_date_key) {
                          if (_this.chartLabels.indexOf(alasql.fn.timestamp(res[i].dim_date_key)) !== -1) {
                            _this.lowLink[_this.chartLabels.indexOf(alasql.fn.timestamp(res[i].dim_date_key))] = res[i].total;
                          }
                        }
                      }
                    });*/
            }
          });
        });
      };

      _this.dateRangePicker = {
        date: {
          startDate: moment().subtract(30, 'days'),
          endDate: moment().startOf("day")
        },
        options: {
          singleDatePicker: false,
          format: "MM/DD/YYYY",
          opens: "center",
          ranges: {
            'Today': [moment(), moment()],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(30, 'days'), moment()],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Last Year': [moment().subtract(1, 'year').startOf('month'), moment().startOf('month')]
          },
          eventHandlers: {
            "apply.daterangepicker": function () {
              _this.startDate = moment(_this.dateRangePicker.date.startDate).format("YYYY/MM/DD");
              _this.endDate = moment(_this.dateRangePicker.date.endDate).format("YYYY/MM/DD");
              _this.getDataForAllCounts();
              _this.getEmailSentGraphData();
            }
          }
        },
        displayDate: function (start, end) {
          var startDate = start || _this.dateRangePicker.date.startDate;
          var endDate = end || _this.dateRangePicker.date.endDate;
          var today = moment();

          var dateDiff = endDate.diff(startDate, "days");
          var result = "";

          if (dateDiff === 0) {
            var isDaySame = startDate.isSame(today, "day");
            var isMonthSame = startDate.isSame(today, "month");
            var isYearSame = startDate.isSame(today, "year");

            // if the selected date is the same as today date, display "Today" in the result
            if (isDaySame && isMonthSame && isYearSame) {
              result = "Today " + moment(startDate).format("YYYY/MM/DD");
            } else {
              result = moment(startDate).format("YYYY/MM/DD");
            }
          } else {
            result =
              "From " +
              moment(startDate).format("YYYY/MM/DD") +
              " to " +
              moment(endDate).format("YYYY/MM/DD");
          }
          return result;
        }
      };

      $timeout(function () {
        _this.dateRangePicker.date.startDate = moment().subtract(30, 'days');
        _this.dateRangePicker.date.endDate = moment().startOf("day");
      });


      _this.startDate = moment(_this.dateRangePicker.date.startDate).format("YYYY/MM/DD");
      _this.endDate = moment(_this.dateRangePicker.date.endDate).format("YYYY/MM/DD");
      _this.getDataForAllCounts();
      _this.getEmailSentGraphData();
    });
})();
