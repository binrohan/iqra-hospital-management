(function (that, none) {
    LazyLoading.LoadCss([IqraConfig.Url.Css.DropDown]);
    var model, iniqueBar = {}, self = {};
    function setAxis(model) {
        var template = '<div class="row" style="text-align: right; margin-bottom: 5px;">';
        for (var i = 1; i < 7; i++) {
            template += '<div class="col-md-2">' + parseInt(model.Max * i / 6) + '</div>';
        }
        template += '</div>';
        return template;
    };
    function create(options,data, barheight) {
        model = {
            Template: $('<div class="progress-bar-container" style="border: medium none; margin: 0px ! important; padding-right: 0px ! important; padding: 5px 0 0 !important; padding-left: 0px ! important;">'),
            Data: {}
        };
        var t = '', textStyle = barheight ? ' style="height: ' + (barheight + 10) + 'px; max-height: ' + (barheight + 10) + 'px;"' : ' style="font-size: inherit; line-height: inherit; padding: 10px 0;"';
        data.Data.each(function () {
            this.Template = $('<div class="progress" style="height: 100%;width:calc(2% - 1px); border-radius:0; margin-right: 1px; float:left; position: relative;">' +
                '<div class="prograss_template" style="width:100%; height: ' + this.Progress + '%;  bottom: 0px; position: absolute;">' +
                    '<div style="background-color:green; height:100%;width:100%;" aria-valuemax="100" aria-valuemin="0" aria-valuenow="60" role="progressbar" class="progress-bar">' +
                    '</div>' +
                '</div>' +
            '</div>');
            //t += '<div' + textStyle + '>' + this.text + '</div>';
            model.Template.append(this.Template);
            model.Data[this.Name] = this;
        });
        $('#bar_chart').empty().append($('<div class="row">').append('<div class="col-md-2 bar_chart_label_container">' + t +
            '</div>').append($('<div class="col-md-10">').append(model.Template).append(setAxis(data))));
    };
    function getMaxValue(data) {
        var maxValue = 0;
        data.each(function () {
            if (maxValue < this.Progress) {
                maxValue = this.Progress;
            }
        });
        return maxValue;
    };
    function fomateData(data) {
        var model = {}, newData = [];
        for (var key in data) {
            for (k in data[key]) {
                if (!model[k]) {
                    model[k] = { Progress: 0, text: k };
                    newData.push(model[k]);
                }
                model[k].Progress += data[key][k];
            }
        }
        var maxValue = getMaxValue(newData);
        newData.each(function () {
            this.Progress = this.Progress / maxValue * 100;
        });
        return { Data: newData, Max: maxValue };
    };
    function loadData() {
        Global.CallServer('/ThemeDetails/GetBarChartData/', function (response) {
            var max = 0;
            response.Data.each(function () {
                this.text = this.ComponnentName;
                max = max < this.Value ? this.Value : max;
            });
            response.Data.each(function () {
                this.Progress = parseInt(this.Value * 100 / max);
            });
            response.Max = max;
            create(response, 6);
            free($('#bar_chart'));
        }, function (response) {
        }, filterModel, 'POST');
    };
    this.Type = [
        function (data) {
            load(Theme.Performance[filterModel.IndicatorId].BarChart, function (response) {
                var max = 0;
                response.Data.each(function () {
                    this.text = this.Name;
                    max = max < this.Value ? this.Value : max;
                });
                response.Data.each(function () {
                    this.Progress = parseInt(this.Value * 100 / max);
                });
                response.Max = max;
                create(response, 6);
            });
        },
        function (data) {
            var model = fomateData(data);
            model.Data = [
            { Progress: getRandomInt(10, 100), text: 'Finacial Service' },
            { Progress: getRandomInt(10, 100), text: 'Public Works' },
            { Progress: getRandomInt(10, 100), text: 'Direct Support' }
            ];
            create(model);
        },
    function (data) {
        var model = fomateData(data);
        model.Data = [
            { Progress: getRandomInt(10, 95), text: 'Finacial Service' },
            { Progress: getRandomInt(10, 95), text: 'Public Works' },
            { Progress: getRandomInt(10, 95), text: 'Direct Support' }
        ];
        create(model);
    },
    function (data) {
        var model = fomateData(data);
        model.Data = [
            { Progress: getRandomInt(10, 100), text: 'Finacial Service' },
            { Progress: getRandomInt(10, 100), text: 'Public Works' },
            { Progress: getRandomInt(10, 100), text: 'Direct Support' }
        ];
        create(model);
    },
    function (data) {
        var model = fomateData(data);
        model.Data = [
            { Progress: getRandomInt(10, 100), text: 'Finacial Service' },
            { Progress: getRandomInt(10, 100), text: 'Public Works' },
            { Progress: getRandomInt(10, 100), text: 'Direct Support' }
        ];
        create(model);
    }, function (data) {
        var model = fomateData(data);
        model.Data = [
            { Progress: getRandomInt(10, 100), text: 'Finacial Service' },
            { Progress: getRandomInt(10, 100), text: 'Public Works' },
            { Progress: getRandomInt(10, 100), text: 'Direct Support' }
        ];
        create(model);
    }, function (data) {
        var model = fomateData(data);
        model.Data = [
            { Progress: getRandomInt(10, 100), text: 'Finacial Service' },
            { Progress: getRandomInt(10, 100), text: 'Public Works' },
            { Progress: getRandomInt(10, 100), text: 'Direct Support' }
        ];
        create(model);
    }, function (data) {
        var model = fomateData(data);
        model.Data = [
            { Progress: getRandomInt(10, 100), text: 'Finacial Service' },
            { Progress: getRandomInt(10, 100), text: 'Public Works' },
            { Progress: getRandomInt(10, 100), text: 'Direct Support' }
        ];
        create(model);
    }, function (data) {
        var model = fomateData(data);
        model.Data = [
            { Progress: getRandomInt(10, 100), text: 'Finacial Service' },
            { Progress: getRandomInt(10, 100), text: 'Public Works' },
            { Progress: getRandomInt(10, 100), text: 'Direct Support' }
        ];
        create(model);
    },
    ];
    function getCalculatedMax(max) {
        console.log(max)
        var exMax = parseInt(max + max * 0.1), mm = 10, q = parseInt(exMax * 0.20), qml = (q + '').length-1;
        if (q < 4) {
            mm = 2;
        } else if (q < 20) {
            mm = 5;
        } else {
            mm = 1;
            for (var i = 0; i < qml; i++) {
                mm *= 10;
            }
        }
        max = 0;
        for (var i = 0; max <= exMax; i++) {
            max += mm;
        }
        console.log([max,q,qml,mm]);
        return max||1;
    };
    function refresh(options) {
        var response = { Data: [] }, max = 0, data;
        for (var key in options.iniquebar) {
            data = options.iniquebar[key];
            max = max < data[options.valuefield] ? data[options.valuefield] : max;
            response.Data.push(data);
        }
        console.log(response.Data);
        options.MaxValue = max;
        options.CalculatedMaxValue = getCalculatedMax(max);

        response.Data.each(function () {
            this.Progress = parseInt(this[options.valuefield] * 100 / options.CalculatedMaxValue);
        });
        response.Max = options.CalculatedMaxValue;
        create(options,response, 9);
    };
    (function(){
        /// <reference path="../../Content/Js/WarningController.js" />
        var uri = 'ws://' + 'localhost:2405/api/EventHandler?appId=saleReport&from=1';
    websocket = new WebSocket(uri);

    websocket.onopen = function () {
        setTimeout(function () { console.log('Opened') }, 0);
    };
    websocket.onerror = function (event) {
        setTimeout(function () { console.log('Error') }, 0);
    };
    websocket.onmessage = function (event) {
        console.log(event.data);
    };
    })();
    (function (service) {
        function getDefaultValue(options,dataModel) {
            var model = {};
            model[options.valuefield] = dataModel[options.valuefield];
            model[options.textfield] = dataModel[options.textfield];
            return model;
        };
        service.Bind = function (options) {
            for (var key in options) { options[key.toLowerCase()] = options[key]; }
            options.iniquebar = {};
            options.textfield = options.textfield || IqraConfig.DropDown.TextField;
            options.valuefield = options.valuefield || IqraConfig.DropDown.ValuField;
            options.data.each(function () {
                options.iniquebar[this[options.textfield]] = options.iniquebar[this[options.textfield]] || getDefaultValue(options,this);
                options.iniquebar[this[options.textfield]][options.valuefield] += this[options.valuefield];
            });
            refresh(options);
        };
    })(that.Service = {});
})(Global.BarChart = {});