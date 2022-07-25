
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions,
        filter = { "field": "PurchaseByReturnId", "value": "", Operation: 0 },
        saleFilter = { "field": "Id", "value": "", Operation: 0 },
        page = { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Return Items ', filter: [filter] };
    function save() {

    }
    function close() {
        windowModel && windowModel.Hide();
    };
    function onDetails(model) {
        Global.Add({
            ItemId: model.ItemId,
            name: 'ProductDetails',
            url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
        });
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
        filter.value = model.model.Id;
        saleFilter.value = model.model.Id;
        model.tab = model.tab || 'BasicInfo';
        page.filter = [filter];
        if (windowModel) {
            windowModel.Show();
            service[model.tab].Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ProductReturnArea/Templates/PurchaseByReturnDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service[model.tab].Bind();
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
            formModel.CreatedAt = model.CreatedAt.getDate().format('dd/MM/yyyy hh:mm');

        };
        function load() {
            Global.CallServer('/ProductReturnArea/PurchaseByReturn/Detail?Id=' + callerOptions.model.Id, function (response) {
                if (!response.IsError) {
                    dataSource[callerOptions.model.Id] = response.Data;
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
            if (userId === callerOptions.model.Id) {
                return;
            }
            if (dataSource[callerOptions.model.Id]) {
                populate(dataSource[callerOptions.model.Id]);
            } else {
                load();
            }
            userId = callerOptions.model.Id;
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
                this.PayableTradePrice = this.UnitTradePrice.mlt(this.ReturnQnt);
                this.PurchasePrice = this.UnitPurchasePrice.mlt(this.ReturnQnt);
                this.PurchaseVAT = this.UnitPurchaseVAT.mlt(this.ReturnQnt);
                this.PurchaseDiscount = this.UnitPurchaseDiscount.mlt(this.ReturnQnt);
            });
        };
        function getOptions() {
            var opts = {
                elm:windowModel.View.find('#return_items_grid'),
                columns: [
                    { field: 'Name', filter: true, click: onDetails },
                    { field: 'Strength', filter: true },
                    { field: 'Category', filter: true },
                    { field: 'ReturnQnt', title: 'Unit Qnty',type:2 },
                    { field: 'SoldPrice', title: 'Sold Price', type: 2 },
                    { field: 'Discount', title: 'Sold Discount(P)', type: 2, selected: false },
                    { field: 'TotalDiscount', title: 'Payable Discount(T)', type: 2, selected: false },
                    { field: 'PayableTradePrice', title: 'Payable TP', type: 2 },
                    { field: 'PurchasePrice', title: 'TP', type: 2,selected:false },
                    { field: 'PurchaseVAT', title: 'Purchase VAT', type: 2, selected: false },
                    { field: 'PurchaseDiscount', title: 'Purchase Discount', type: 2, selected: false },
                    { field: 'ReturnAmount', title: 'Return Amount', type: 2 },
                    { field: 'TotalReturnDiscount', title: 'Return Discount(T)', type: 2 },
                    { field: 'ReturnDiscount', title: 'Return Discount(P)', type: 2, selected: false },
                    { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                    
                ],
                url: '/ProductReturnArea/PurchaseByReturn/GetItems',
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
                this.TotalPayableTradePrice = (this.UnitQuentity * this.UnitTradePrice).toMoney();
                this.TotalPayableSalePrice = (this.UnitQuentity * this.UnitSalePrice).toMoney();
            });
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#salse_info_grid'),
                columns: [
                    { field: 'Name', title: 'Item', filter: true,click:onDetails },
                    { field: 'Strength', filter: true },
                    { field: 'Category', filter: true },
                    { field: 'Suplier', filter: true },
                    { field: 'UnitQuentity', title: 'Unit Qnty' },
                    { field: 'TotalPayableTradePrice', title: 'TP Price' },
                    { field: 'TotalPayableSalePrice', title: 'MRP Price' },
                    { field: 'DiscountP', title: 'Discount(%)' },
                    { field: 'CreatedAt', dateFormat: 'dd/MM/yyyy hh:mm' }
                ],
                url: '/ProductReturnArea/PurchaseByReturn/Sales',
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