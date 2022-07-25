///Content/IqraPharmacy/ProductArea/Content/ProductDetails.js
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions,
        filter = { "field": "ItemId", "value": "", Operation: 0 },
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
        filter.value = model.ItemId;
        page.filter = [filter];
        if (windowModel) {
            windowModel.Show();
            service.BasicInfo.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductArea/Templates/ProductDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.BasicInfo.Bind();
                setTabEvent();
            }, noop);
        }
    };
    (function () {
        var isBind, formModel = {}, dataModel = {}, dataSource = {}, itemId;
        function bind() {
            if (!isBind) {
                isBind = true;
                Global.Form.Bind(formModel, windowModel.View.find('#basic_info'));
                Global.Click(windowModel.View.find('#btn_suplier'), onSuplierDetails);
                Global.Click(windowModel.View.find('#btn_creator'), onCreatorDetails);
                Global.Click(windowModel.View.find('#btn_updator'), onUpdatorDetails);
            }
            reset();
            windowModel.View.find('#basic_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        }
        function onSuplierDetails() {
            Global.Add({
                SuplierId: dataModel.SuplierId,
                name: 'SuplierDetails',
                url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
            });
        };
        function onCreatorDetails() {
            Global.Add({
                UserId: dataModel.CreatedBy,
                name: 'UserDetails',
                url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
            });
        }
        function onUpdatorDetails() {
            Global.Add({
                UserId: dataModel.UpdatedBy,
                name: 'UserDetails',
                url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
            });
        }
        function populate(model) {
            dataModel = model;
            for (var key in formModel) {
                if (typeof model[key] != 'undefined') {
                    formModel[key] = model[key];
                }
            }
        };
        function load() {
            Global.CallServer('/ProductArea/Product/Details?Id=' + callerOptions.ItemId, function (response) {
                if (!response.IsError) {
                    dataSource[callerOptions.ItemId] = response.Data;
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
            if (itemId === callerOptions.ItemId) {
                return;
            }
            if (dataSource[callerOptions.ItemId]) {
                populate(dataSource[callerOptions.ItemId]);
            } else {
                load();
            }
            itemId = callerOptions.ItemId;
        };
    }).call(service.BasicInfo = {});
    (function () {
        var gridModel, userId, formModel = {};
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.Grid.Bind(getOptions(Global.Filters().Bind({
                    container: windowModel.View.find('#sales_info .filter_container'),
                    formModel: formModel,
                    filter: [filter],
                    Type : 'ThisMonth',
                    onchange: function (filter) {
                        if (gridModel) {
                            gridModel.page.filter = filter;
                            gridModel.Reload();
                        }
                    }
                })));
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
        function onComputerDetails(model) {
            Global.Add({
                ComputerId: model.ComputerId,
                name: 'ComputerDetails',
                url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
            });
        };
        function rowBound(elm) {
            //var selector = $();
            //elm.find().html(selector);
            elm.click(function () {

            });
            Global.Click(elm, onSelect, this);
        };
        function onDataBinding(response) {
            formModel.UnitQuentity = (response.Data.Total.UnitQuentity || 0).toMoney(4);
            formModel.NetTaka = (response.Data.Total.NetTaka || 0).toMoney(4);
            formModel.TradePrice = (response.Data.Total.TradePrice || 0).toMoney(4);
            response.Data.Total = response.Data.Total.Total;
            response.Data.Data.each(function () {
                this.NetTaka = (this.NetTaka + this.Discount).toMoney();
                this.Discount = this.Discount.toMoney();
                this.TradePrice = this.TradePrice.toMoney();
            });
        };
        function getOptions(filter) {
            var opts = {
                Name: 'SalesInfo',
                elm: windowModel.View.find('#salse_info_grid'),
                columns: [
                    { field: 'Voucher', filter: true },
                    { field: 'Name', filter: true },
                    { field: 'Strength', filter: true },
                    { field: 'Category', filter: true },
                    { field: 'Suplier', filter: true },
                    { field: 'UnitQuentity', title: 'Qnty' },
                    { field: 'TradePrice', title: 'TP Price',type:2 },
                    { field: 'NetTaka', title: 'MRP Price', type: 2 },
                    { field: 'Discount',type:2 },
                    { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                ],
                url: '/ItemSalesArea/ItemSales/GetByItem',
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Sales ', filter: filter },
                dataBinding: onDataBinding,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: {
                    container: windowModel.View.find('#sales_info .button_container'),
                },
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
    }).call(service.SalseInfo = {});
    (function () {
        var gridModel, userId, formModel = {};
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.Grid.Bind(getOptions(Global.Filters().Bind({
                    container: windowModel.View.find('#order_info .filter_container'),
                    formModel: formModel,
                    filter: [filter],
                    Type: 'ThisMonth',
                    field:'OrderItemCreatedAt',
                    onchange: function (filter) {
                        if (gridModel) {
                            gridModel.page.filter = filter;
                            gridModel.Reload();
                        }
                    }
                })));
            }
            reset();
            windowModel.View.find('#order_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[2]).addClass('active');
        }
        function onProductDetails(model) {
            Global.Add({
                ItemId: model.ItemId,
                name: 'ProductDetails',
                url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
            });
        };
        function onSuplierDetails(model) {
            Global.Add({
                SuplierId: model.SuplierId,
                name: 'SuplierDetails',
                url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
            });
        };
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
            formModel.OrderedQuentity = (response.Data.Total.OrderedQuentity || 0).toMoney(4);
            formModel.TotalTradePrice = (response.Data.Total.TotalTradePrice || 0).toMoney(4);
            response.Data.Total = response.Data.Total.Total;
            response.Data.Data.each(function () {
                this.TotalTradePrice = this.TotalTradePrice.toMoney();
                this.UnitTradePrice = this.UnitTradePrice.toMoney();
                this.UnitSalePrice = this.UnitSalePrice.toMoney();
                this.Vat = this.Vat.toMoney();
            });
        };
        function getOptions(filter) {
            var opts = {
                Name: 'LoginInfo',
                elm: windowModel.View.find('#order_info_grid'),
                columns: [
                    { field: 'TradeName', title: 'Trade Name', Click: onProductDetails },
                    { field: 'Suplier', Click: onSuplierDetails },
                    { field: 'Strength', title: 'Strength', width: 130 },
                    { field: 'TotalStock', title: 'Stock', width: 60 },
                    { field: 'CalculatedDays', title: 'Days', width: 60 },
                    { field: 'CalculatedQuentity', title: 'Sold', width: 60 },
                    { field: 'PurchaseUnitType', title: 'PUnit', width: 70 },
                    { field: 'OrderedQuentity', title: 'Qnty', width: 80 },
                    { field: 'UnitTradePrice', width: 90, title: 'TPPrice' },
                    { field: 'UnitSalePrice', width: 90, title: 'MRPPrice' },
                    { field: 'Vat', title: 'VAT', width: 70 },
                    { field: 'Discount', width: 80 },
                    { field: 'TotalTradePrice', title: 'TotalPrice', width: 90 },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm', width: 100 }
                ],
                url: '/Order/GetListByItem',
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Orders ', filter: filter },
                dataBinding: onDataBinding,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: {
                    container: windowModel.View.find('#order_info .button_container'),
                },
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
    }).call(service.OrderInfo = {});
    (function () {
        var gridModel, userId, formModel = {};
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.Grid.Bind(getOptions(Global.Filters().Bind({
                    container: windowModel.View.find('#purchase_info .filter_container'),
                    formModel: formModel,
                    filter: [filter],
                    Type: 'ThisMonth',
                    onchange: function (filter) {
                        if (gridModel) {
                            gridModel.page.filter = filter;
                            gridModel.Reload();
                        }
                    }
                })));
            }
            reset();
            windowModel.View.find('#purchase_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[3]).addClass('active');
        }
        function onSuplierDetails(model) {
            Global.Add({
                SuplierId: model.SuplierId,
                name: 'SuplierDetails',
                url: '/Content/IqraPharmacy/SuplierArea/Content/Suplier/SuplierDetails.js',
            });
        };
        function onUserDetails(model) {
            Global.Add({
                UserId: model.UserId,
                name: 'UserDetails',
                url: '/Content/IqraPharmacy/EmployeeArea/Content/User/UserDetails.js',
            });
        };
        function onDataBinding(response) {
            formModel.UnitQuentity = (response.Data.Total.UnitQuentity || 0).toMoney(4);
            formModel.TotalTradePrice = (response.Data.Total.TotalTradePrice || 0).toMoney(4);
            formModel.TotalSoldPrice = (response.Data.Total.TotalSoldPrice || 0).toMoney(4);
            response.Data.Total = response.Data.Total.Total;
            response.Data.Data.each(function () {
                this.UnitTradePrice = this.UnitTradePrice.toMoney();
                this.TotalTradePrice = this.TotalTradePrice.toMoney();
                this.UnitSalePrice = this.UnitSalePrice.toMoney();
                this.TotalSoldPrice = this.TotalSoldPrice.toMoney();
                this.Discount = this.Discount.toMoney();
                this.UnitQuentity = this.UnitQuentity.toMoney();
                this.Vat = this.Vat.toMoney();
            });
        };
        function getOptions(filter) {
            var opts = {
                Name: 'LoginInfo',
                elm: windowModel.View.find('#purchase_info_grid'),
                columns: [
                    { field: 'TradeName' },
                    { field: 'Strength' },
                    { field: 'Suplier', Click: onSuplierDetails },
                    { field: 'UnitTradePrice', title: 'Unit TP' },
                    { field: 'TotalTradePrice', title: 'Total TP' },
                    { field: 'UnitSalePrice', title: 'Unit MRP' },
                    { field: 'TotalSoldPrice', title: 'Total MRP' },
                    { field: 'UnitQuentity', title: 'Quentity',width:80 },
                    { field: 'Discount', width: 80 },
                    { field: 'Vat', title: 'VAT', width: 80 },
                    { field: 'CreatedAt', title: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                ],
                url: '/Purchase/Items',
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Purchases ', filter: filter },
                dataBinding: onDataBinding,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: {
                    container: windowModel.View.find('#purchase_info .button_container'),
                },
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
    }).call(service.PurchaseInfo = {});
    (function () {
        var gridModel, formModel = {}, userId, txtType = ['Purchase', 'Sale', 'Return', 'Adjustment', 'Purchase Cancel', 'Purchase By Return', 'Suplier Return'];
        function bind() {
            if (!gridModel) {
                isBind = true;
                userId = filter.value;
                Global.Grid.Bind(getOptions(Global.Filters().Bind({
                    container: windowModel.View.find('#stock_history .filter_container'),
                    formModel: formModel,
                    filter: [filter],
                    Type: 'ThisMonth',
                    onchange: function (filter) {
                        if (gridModel) {
                            gridModel.page.filter = filter;
                            gridModel.Reload();
                        }
                    }
                })));
            }
            reset();
            windowModel.View.find('#stock_history').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[4]).addClass('active');
        };

        function getTypeFileter() {
            return {
                DropDown: {
                    dataSource: [
                        { text: 'Select Type', value: '' },
                        { text: 'Purchase', value: '0' },
                        { text: 'Sale', value: '1' },
                        { text: 'Return', value: '2' },
                        { text: 'Adjustment', value: '3' },
                        { text: 'Purchase Cancel', value: '4' }
                    ]
                }
            };
        };
        function onSelect(model) {
            switch (model.TypeOrg) {
                case 0:
                    break;
            }
        }
        function rowBound(elm) {
            Global.Click(elm, onSelect, this);
        };
        function onDataBinding(response) {
            formModel.StockChanged = (response.Data.Total.StockChanged || 0).toMoney(4);
            response.Data.Total = response.Data.Total.Total;
            response.Data.Data.each(function () {
                this.TypeOrg = this.Type;
                this.ItemType = txtType[this.Type] || this.Type;
            });
        };
        function getOptions(filter) {
            //console.log(filter);
            var opts = {
                Name: 'LoginInfo',
                elm: windowModel.View.find('#stock_history_grid'),
                columns: [
                    { field: 'ItemType', title: 'ChangedType', filter: getTypeFileter() },
                    { field: 'StockChanged', title: 'Qnt Changed' },
                    { field: 'StockAfterChanged', title: 'Stock After Changed' },
                    { field: 'TotalTradePrice', title: 'Stock TP' },
                    { field: 'TotalSalePrice', title: 'Stock MRP' },
                    { field: 'CreatedAt', title: 'ChangedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                    //      ,[TotalTradePrice]
      //, [TotalSalePrice]
                ],
                url: '/ProductArea/Product/StockHistory',
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Items ', filter: filter },
                dataBinding: onDataBinding,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                },
                Printable: {
                    container: windowModel.View.find('#stock_history .button_container'),
                },
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
    }).call(service.StockHistory = {});
};