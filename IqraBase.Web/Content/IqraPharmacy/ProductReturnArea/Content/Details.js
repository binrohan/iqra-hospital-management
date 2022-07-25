
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions,
        filter = { "field": "ProductReturnId", "value": "", Operation: 0 },
        saleFilter = { "field": "returnId", "value": "", Operation: 0 },
        page = { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Return Items ', filter: [filter] };
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
        filter.value = model.VoucherNo;
        saleFilter.value = model.VoucherNo;
        page.filter = [filter];
        if (windowModel) {
            windowModel.Show();
            service.BasicInfo.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductReturnArea/Templates/ReturnDetails.html', function (response) {
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
                Global.Grid.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#return_items').addClass('in active');
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
        function onComputerDetails(model) {
            Global.Add({
                ComputerId: model.ComputerId,
                name: 'ComputerDetails',
                url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
            });
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.TotalTradePrice = this.TotalTradePrice.toMoney();
            });
        };
        function getOptions() {
            var opts = {
                elm:windowModel.View.find('#return_items_grid'),
                columns: [
                    { field: 'Name', filter: true },
                    { field: 'Strength', filter: true },
                    { field: 'Category', filter: true },
                    { field: 'UnitQuentity', title: 'Unit Qnty' },
                    { field: 'TotalSalePrice', title: 'Sale Price' },
                    { field: 'TotalTradePrice', title: 'Trade Price' },
                    { field: 'ReturnAmount', title: 'Return Amount' },
                    { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                ],
                url: '/ProductReturnArea/ProductReturn/GetItemList',
                page: page,
                dataBinding: onDataBinding,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: {
                    Container: function () {
                        console.log(windowModel.View.find('#return_items #print_container'));
                        return windowModel.View.find('#return_items #print_container');
                    }
                }
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
    }).call(service.ReturnItems = {});
    (function () {
        var gridModel, userId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.Grid.Bind(getOptions());
            }
            reset();
            windowModel.View.find('#sales_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[2]).addClass('active');
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
        function onComputerDetails(model) {
            Global.Add({
                ComputerId: model.ComputerId,
                name: 'ComputerDetails',
                url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
            });
        };
        function onDataBinding(response) {
            response.Data.Data.each(function () {
                this.TradePrice = (this.UnitQuentity*this.UnitTradePrice).toMoney();
                this.SalePrice = (this.UnitQuentity * this.UnitSalePrice).toMoney();
            });
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#salse_info_grid'),
                columns: [
                    { field: 'Name', title: 'Item', filter: true },
                    { field: 'Strength', filter: true },
                    { field: 'Category', filter: true },
                    { field: 'Suplier', filter: true },
                    { field: 'UnitQuentity', title: 'Unit Qnty' },
                    { field: 'TradePrice', title: 'TP Price' },
                    { field: 'SalePrice', title: 'MRP Price' },
                    { field: 'DiscountP', title: 'Discount(%)' },
                    { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                ],
                url: '/ProductReturnArea/ProductReturn/Sales',
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} SaleInfo ', filter: [saleFilter] },
                dataBinding: onDataBinding,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#sales_info #print_container');
                    }
                },
                onComplete: function (model) {
                    gridModel = model;
                }
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
    }).call(service.SalsItems = {});
};