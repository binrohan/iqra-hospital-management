
var Controller = new function () {
    var service = {}, windowModel, dataSource = {}, selected = {}, callerOptions,
        filter = { "field": "SaleInfoId", "value": "", Operation: 0 },
        page = { 'PageNumber': 1, 'PageSize': 10, showingInfo: ' {0}-{1} of {2} SaleInfo ', filter: [filter] };
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
        filter.value = model.SaleInfoId;
        page.filter.splice(0, page.filter.length);
        page.filter.push(filter);
        console.log(model);
        if (windowModel) {
            windowModel.Show();
            service.BasicInfo.Bind();
        } else {
            Global.LoadTemplate('/Content/IqraPharmacy/ItemSalesArea/Templates/SaleDetails.html', function (response) {
                windowModel = Global.Window.Bind(response, { width: '90%' });
                windowModel.View.find('.btn_cancel').click(close);
                windowModel.Show();
                service.BasicInfo.Bind();
                setTabEvent();
            }, noop);
        }
    };
    (function () {
        var isBind, formModel = {}, dataSource = {}, saleInfoId;
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
            Global.CallServer('/ItemSalesArea/ItemSales/Details?Id=' + callerOptions.SaleInfoId, function (response) {
                if (!response.IsError) {
                    dataSource[callerOptions.SaleInfoId] = response.Data;
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
            if (saleInfoId === callerOptions.SaleInfoId) {
                return;
            }
            if (dataSource[callerOptions.SaleInfoId]) {
                populate(dataSource[callerOptions.SaleInfoId]);
            } else {
                load();
            }
            saleInfoId = callerOptions.SaleInfoId;
        };
    }).call(service.BasicInfo = {});
    (function () {
        var gridModel, saleInfoId;
        function bind() {
            if (!gridModel) {
                isBind = true;
                saleInfoId = filter.value;
                Global.Grid.Bind(getOptions());
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
        function onDetails(model) {
            Global.Add({
                ItemId: model.ItemId,
                name: 'ProductDetails',
                url: '/Content/IqraPharmacy/ProductArea/Content/ProductDetails.js',
            });
        };
        function rowBound(elm) {
            if (this.NetTaka <= this.TradePrice) {
                elm.css({ color: 'red' });
            }
        };
        function onComputerDetails(model) {
            Global.Add({
                ComputerId: model.ComputerId,
                name: 'ComputerDetails',
                url: '/Content/IqraPharmacy/CommonArea/Content/Js/Computer/ComputerDetails.js',
            });
        };
        function onDataBinding(response) {
            response.Data.Total = response.Data.Total.Total;
        };
        function getOptions() {
            var opts = {
                elm: windowModel.View.find('#salse_info_grid'),
                columns: [
                    { field: 'Name', title: 'Trade Name', filter: true, click: onDetails },
                    { field: 'Category', filter: true },
                    { field: 'Strength', filter: true },
                    { field: 'Suplier', filter: true },
                    { field: 'UnitQuentity', title: 'Qnty', type: 2 },
                    { field: 'UnitTradePrice', title: 'Unit TP', type: 2 },
                    { field: 'UnitSalePrice', title: 'Unit MRP', type: 2 },
                    { field: 'Discount', type: 2 },
                    { field: 'TradePrice', title: 'Total TP', type: 2 },
                    { field: 'NetTaka', title: 'Payable MRP', type: 2 }
                ],
                url: '/ItemSales/GetByItem',
                page: page,
                dataBinding: onDataBinding,
                rowBound: rowBound,
                Printable: {
                    Container: function () {
                        return windowModel.View.find('#print_container');
                    }
                },
                onComplete: function (model) {
                    gridModel = model;
                },
            };
            return opts;
        };
        this.Bind = function () {
            bind();
            if (filter.value != saleInfoId) {
                gridModel.Reload();
            }
            saleInfoId = filter.value;
        }
    }).call(service.SalsItems = {});
};