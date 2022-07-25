
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions,
        filter = { "field": "ComputerId", "value": "", Operation: 0 },
        page = { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Computer ', filter: [filter] };
    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function reset() {
        windowModel.View.find('.tab-content .tab-pane').removeClass('in active');
        windowModel.View.find('ul.nav.nav-tabs li').removeClass('active');
    }
    function setTabEvent() {
        windowModel.View.find('ul.nav.nav-tabs li').click(function () {
            service[this.dataset.field].Bind();
        });
    };
    this.Show = function (model) {
        selected = {};
        callerOptions = model;
        filter.value = model.ComputerId;
        page.filter.splice(0, page.filter.length);
        page.filter.push(filter);
        console.log(model);
        if (windowModel) {
            windowModel.Show();
            service.BasicInfo.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/CommonArea/Templates/Computer/ComputerDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.BasicInfo.Bind();
                setTabEvent();
            }, noop);
        }
    };
    (function () {
        var isBind, formModel = {}, dataSource = {}, userId;
        function bind() {
            if (!isBind) {
                isBind = true;
                Global.Form.Bind(formModel, windowModel.View.find('#basic_info'));
            }
            reset();
            windowModel.View.find('#basic_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        }
        function populate(model) {
            for (var key in formModel) {
                if (typeof model[key] != 'undefined') {
                    formModel[key] = model[key];
                }
            }
        };
        function load() {
            Global.CallServer('/Employee/Details?Id=' + callerOptions.UserId, function (response) {
                if (!response.IsError) {
                    dataSource[callerOptions.UserId] = response.Data;
                    populate(response.Data);
                } else {
                    error.Save(response, saveUrl);
                }
            }, function (response) {
                response.Id = -8;
                error.Save(response, saveUrl);
            }, null, 'Get');
        };
        this.Bind = function () {
            bind();
            if (userId === callerOptions.UserId) {
                return;
            }
            if (dataSource[callerOptions.UserId]) {
                populate(dataSource[callerOptions.UserId]);
            } else {
                load();
            }
            userId = callerOptions.UserId;
        };
    }).call(service.BasicInfo = {});
    (function () {
        var gridModel, userId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.List.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#sales_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[1]).addClass('active');
        }
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {
            if (model.Selected) {
                model.Selected = false;
                $(this).removeClass('i-state-selected');
            } else {
                model.Selected = true;
                $(this).addClass('i-state-selected');
            }
            console.log(model);
        }
        function rowBound(elm) {
            //var selector = $();
            //elm.find().html(selector);
            elm.click(function () {

            });
            Global.Click(elm, onSelect, this);
        };
        function onDataBinding(response) {

        };
        function getOptions() {
            var opts = {
                Name: 'Employee',
                Grid: {
                    elm: windowModel.View.find('#salse_info_grid'),
                    columns: [
                        { field: 'VoucherNo', filter: true },
                        { field: 'Customer', filter: true },
                        { field: 'ItemCount' },
                        { field: 'SalePrice' },
                        { field: 'TradePrice' },
                        { field: 'Discount' },
                        { field: 'Vat' },
                        { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' },
                        { field: 'Computer', filter: true }
                    ],
                    url: '/ItemSales/GetByUser',
                    page: page,
                    onDataBinding: onDataBinding,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: false,
                Edit: false,
                remove: false
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != userId) {
                gridModel.Reload();
            }
            userId = filter.value;
        };
    }).call(service.SalseInfo = {});
    (function () {
        var gridModel, userId, txtStatus = ['', 'Login', 'Logout', '', ''];
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.List.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#login_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[2]).addClass('active');
        }
        function onUserDetails(model) {
            Global.Add({
                UserId: model.UserId,
                name: 'UserDetails',
                url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
            });
        };
        function onSubmit(formModel, data) {
            if (data) {
                formModel.Id = data.Id
            }
        };
        function onSelect(model) {
            if (model.Selected) {
                model.Selected = false;
                $(this).removeClass('i-state-selected');
            } else {
                model.Selected = true;
                $(this).addClass('i-state-selected');
            }
            console.log(model);
        }
        function rowBound(elm) {
            //var selector = $();
            //elm.find().html(selector);
            elm.click(function () {

            });
            Global.Click(elm, onSelect, this);
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.Status = txtStatus[this.Type];
            });
        };
        function getOptions() {
            var opts = {
                Name: 'LoginInfo',
                Grid: {
                    elm: windowModel.View.find('#login_info_grid'),
                    columns: [
                        { field: 'User', Click: onUserDetails },
                        { field: 'Computer' },
                        { field: 'CreatedAt', title: 'DateTime', dateFormat: 'dd/MM/yyyy hh:mm' },
                        { field: 'Status', dateFormat: 'dd/MM/yyyy hh:mm' }
                    ],
                    url: '/DailyLoginInfo/Get',
                    page: page,
                    onDataBinding: onDataBinding,
                },
                onComplete: function (model) {
                    gridModel = model;
                },
                Add: false,
                Edit: false,
                remove: false
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != userId) {
                gridModel.Reload();
            }
            userId = filter.value;
        }
    }).call(service.LogInInfo = {});
};