
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions,computerId;
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
        computerId = model.ComputerId;
        console.log(model);
        if (windowModel) {
            windowModel.Show();
            service.SalsItems.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ItemSalesArea/Templates/CashCounterReportDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.SalsItems.Bind();
                setTabEvent();
            }, noop);
        }
    };
    (function () {
        var gridModel;
        function bind() {
            reset();
            windowModel.View.find('#sales_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[0]).addClass('active');
        };
        function onDetails(model) {
            Global.Add({
                name: 'SaleInfo',
                url: '/Content/IqraPharmacy/ItemSalesArea/Content/SaleDetails.js',
                SaleInfoId: model.Id
            });
        };
        function rowBound(elm) {
            
        };
        function onComputerDetails(model) {
            Global.Add({
                ComputerId: model.ComputerId,
                name: 'ComputerDetails',
                url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
            });
        };
        function onDataBinding(response) {

        };
        function getOptions() {
            var opts = {
                Name: 'CashCounterReturns',
                elm: windowModel.View.find('#salse_info_grid'),
                columns: [
                        { field: 'VoucherNo', title: 'Voucher', filter: true, click: onDetails },
                        { field: 'ItemCount', title: 'Item Count' },
                        { field: 'SalePrice', title: 'Sale Price' },
                        { field: 'TradePrice', title: 'Trade Price' },
                        { field: 'TotalDiscount', title: 'Discount' },
                        { field: 'CreatedAt', title: 'Created At', dateFormat: 'dd/MM/yyyy hh:mm' }
                ],
                url: function () {
                    return '/ItemSalesArea/ItemSales/GetCashCounterSales';
                },
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} SaleInfo ', filter: callerOptions.filter },
                dataBinding: onDataBinding,
                OnRequest: function (model) {
                    model.ComputerId = computerId;
                },
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                }
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (gridModel) {
                gridModel.page.filter = callerOptions.filter;
                gridModel.Reload()
            }
            else {
                Global.Grid.Bind(getOptions());
            }
        }
    }).call(service.SalsItems = {});
    (function () {
        var gridModel;
        function bind() {
            reset();
            windowModel.View.find('#returns_info').addClass('in active');
            $(windowModel.View.find('ul.nav.nav-tabs li')[1]).addClass('active');
        };
        function onSaleDetails(model) {
            Global.Add({
                name: 'SaleInfo',
                url: '/Content/IqraPharmacy/ItemSalesArea/Content/SaleDetails.js',
                SaleInfoId: model.ItemSaleInfoId
            });
        };
        function onReturnDetails(model) {
            Global.Add({
                VoucherNo: model.Id,
                name: 'ReturnDetails',
                url: '/Content/IqraPharmacy/ProductReturnArea/Content/Details.js',
            });
        };
        function rowBound(elm) {
            
        };
        function onDataBinding(response) {

        };
        function getOptions() {
            var opts = {
                Name: 'CashCounterReturns',
                elm: windowModel.View.find('#returns_info_grid'),
                columns: [
                        { field: 'SaleVoucher', title: 'Sale Voucher', filter: true, click: onSaleDetails },
                        { field: 'ReturnVoucher', title: 'Return Voucher', filter: true, click: onReturnDetails },
                        { field: 'ItemCount', title: 'Item Count' },
                        { field: 'SalePrice', title: 'Sale Price' },
                        //{ field: 'TradePrice', title: 'Trade Price' },
                        { field: 'ReturnAmount', title: 'Return Amount' },
                        { field: 'SaleAt', title: 'Sale At', dateFormat: 'dd/MM/yyyy hh:mm' },
                        { field: 'CreatedAt', title: 'Return At', dateFormat: 'dd/MM/yyyy hh:mm' }
                ],
                url: function () {
                    return '/ItemSalesArea/ItemSales/GetCashCounterReturns?ComputerId=' + computerId;
                },
                page: { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} Returns ', filter: callerOptions.filter },
                dataBinding: onDataBinding,
                rowBound: rowBound,
                onComplete: function (model) {
                    gridModel = model;
                }
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (gridModel) {
                gridModel.page.filter = callerOptions.filter;
                gridModel.Reload()
            }
            else {
                Global.Grid.Bind(getOptions());
            }
        }
    }).call(service.Returns = {});
};